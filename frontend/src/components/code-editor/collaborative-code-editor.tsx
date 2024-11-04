import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MonacoBinding } from 'y-monaco';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

interface CollaborativeEditorProps {
  initialValue?: string;
  language?: string;
  theme?: string;
  roomName: string;
  websocketUrl: string;
  onChange?: (value: string | undefined) => void;
  userName: string;
}

interface EditorCursorWidget extends monaco.editor.IContentWidget {
  allowEditorOverflow?: boolean;
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  initialValue = '// some comment',
  language = 'typescript',
  theme = 'vs-light',
  roomName,
  websocketUrl,
  onChange,
  userName,
}) => {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [_binding, setBinding] = useState<MonacoBinding | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const cursorUserLabelWidgetRef = useRef<EditorCursorWidget | null>(null);

  // this effect manages the lifetime of the Yjs document and the provider
  useEffect(() => {
    const provider = new WebsocketProvider(websocketUrl, roomName, ydoc);
    const awareness = provider.awareness;
    setProvider(provider);
    return () => {
      awareness.setLocalState(null);
      provider?.destroy();
      awareness.destroy();
      ydoc.destroy();
    };
  }, [ydoc, roomName, websocketUrl]);

  // this effect manages the lifetime of the editor binding
  useEffect(() => {
    if (provider == null || editor == null) {
      return;
    }
    console.log('reached', provider);
    const awareness = provider.awareness;

    const binding = new MonacoBinding(
      ydoc.getText(),
      editor.getModel()!,
      new Set([editor]),
      awareness
    );
    setBinding(binding);

    // Set the current user to awareness
    awareness.setLocalStateField('user', {
      name: userName,
    });

    // Send cursor and selection state to awareness
    const disposable1 = editor.onDidChangeCursorPosition((e) => {
      awareness.setLocalStateField('cursor', {
        column: e.position.column,
        lineNumber: e.position.lineNumber,
      });
    });
    const disposable2 = editor.onDidChangeCursorSelection((e) => {
      awareness.setLocalStateField('selection', {
        startColumn: e.selection.startColumn,
        startLineNumber: e.selection.startLineNumber,
        endColumn: e.selection.endColumn,
        endLineNumber: e.selection.endLineNumber,
      });
    });

    // Cursor widget is used to manage the manage the user label
    // that follows the cursor widget
    // Monaco editor will use any object that implements EditorCursorWidget interface
    // and manage the position and lifecycle of the widget
    const creatCursorUserLabelWidget = (
      name: string = 'Anonymous'
    ): EditorCursorWidget => ({
      getId: () => 'cursor-widget',
      getDomNode: () => {
        const element = document.createElement('div');
        element.className =
          'px-2 py-1 text-xs text-white rounded-md whitespace-nowrap bg-primary/80 -ml-2 pointer-events-none';
        element.style.position = 'absolute';
        element.style.zIndex = '100';
        element.textContent = name;
        return element;
      },
      getPosition: () => null,
      allowEditorOverflow: true,
    });

    // Listen to changes in awareness state
    awareness.on(
      'change',
      ({ added, updated }: { added: number[]; updated: number[] }) => {
        const combinedClientIds = Array.from(new Set([...added, ...updated]));

        // We only need to update the decorations for the remote clients
        const otherClientIds = combinedClientIds.filter(
          (id) => id !== provider.awareness.clientID
        );

        if (otherClientIds.length === 0) {
          return;
        }

        const decorations: monaco.editor.IModelDeltaDecoration[] = [];
        otherClientIds.forEach((clientId) => {
          const state = awareness.getStates().get(clientId);
          if (!state) {
            return;
          }

          const isCursorState =
            clientId !== provider.awareness.clientID && state.cursor;

          // Update the cursor state
          if (isCursorState) {
            decorations.push({
              range: new monaco.Range(
                state.cursor.lineNumber,
                state.cursor.column,
                state.cursor.lineNumber,
                state.cursor.column + 1
              ),
              options: {
                zIndex: 100,
                stickiness:
                  monaco.editor.TrackedRangeStickiness
                    .NeverGrowsWhenTypingAtEdges,
                beforeContentClassName: 'cursor-decoration',
                hoverMessage: {
                  value: state?.user?.name ?? 'Anonymous',
                },
              },
            });

            // Update the selection state
            const isSelectionState =
              clientId !== provider.awareness.clientID && state.selection;
            if (isSelectionState) {
              decorations.push({
                range: new monaco.Range(
                  state.selection.startLineNumber,
                  state.selection.startColumn,
                  state.selection.endLineNumber,
                  state.selection.endColumn
                ),
                options: {
                  className: 'selection-decoration',
                  stickiness:
                    monaco.editor.TrackedRangeStickiness
                      .NeverGrowsWhenTypingAtEdges,
                },
              });
            }

            if (!state.cursor) {
              return;
            }

            // Update the user label cursor widget
            const position = {
              lineNumber: state.cursor.lineNumber,
              column: state.cursor.column,
            };
            const isCursorWidgetCreated = !!cursorUserLabelWidgetRef.current;
            if (!isCursorWidgetCreated) {
              const cursorWidget = creatCursorUserLabelWidget(
                state?.user?.name ?? 'Anonymous'
              );
              editor.addContentWidget(cursorWidget);
              cursorUserLabelWidgetRef.current = cursorWidget;
            }

            if (cursorUserLabelWidgetRef.current) {
              cursorUserLabelWidgetRef.current.getPosition = () => ({
                position,
                preference: [
                  monaco.editor.ContentWidgetPositionPreference.BELOW,
                ],
              });
              editor.layoutContentWidget(cursorUserLabelWidgetRef.current);
            }
          }
        });

        if (decorationsRef.current.length === 0 && decorations.length === 0) {
          return;
        }

        decorationsRef.current = editor.deltaDecorations(
          decorationsRef.current,
          decorations
        );
      }
    );

    return () => {
      binding.destroy();
      disposable1.dispose();
      disposable2.dispose();
      if (cursorUserLabelWidgetRef.current) {
        editor.removeContentWidget(cursorUserLabelWidgetRef.current);
      }
    };
  }, [ydoc, provider, editor, userName]);

  return (
    <div className=''>
      {/* It's not possible to pass in tailwind classes to the beforeContentClassname
      so we need to use inline styles to style the cursor. */}
      <style>
        {`
          .cursor-decoration {
            content: '';
            display: inline-block;
            width: 2px;
            height: 1.4em;
            background: hsl(221.2, 83.2%, 53.3%);
            position: relative;
            left: 0;
            border-radius: 0.375rem;
          }
          .selection-decoration {
            background: rgba(173, 214, 255, 0.3);
          }
        `}
      </style>
      <Editor
        height='90vh'
        defaultValue={initialValue}
        defaultLanguage={language}
        theme={theme}
        onMount={(editor) => {
          setEditor(editor);
        }}
        onChange={onChange}
      />
    </div>
  );
};

export default CollaborativeEditor;
