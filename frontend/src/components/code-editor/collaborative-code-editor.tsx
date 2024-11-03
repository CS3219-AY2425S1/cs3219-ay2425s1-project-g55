import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import React from 'react';
import { MonacoBinding } from 'y-monaco';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

import { useEffect, useMemo, useState } from 'react';

interface CollaborativeEditorProps {
  initialValue?: string;
  language?: string;
  theme?: string;
  roomName: string;
  websocketUrl: string;
  onChange?: (value: string | undefined) => void;
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  initialValue = '// some comment',
  language = 'typescript',
  theme = 'vs-light',
  roomName,
  websocketUrl,
  onChange,
}) => {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [binding, setBinding] = useState<MonacoBinding | null>(null);

  // this effect manages the lifetime of the Yjs document and the provider
  useEffect(() => {
    const provider = new WebsocketProvider(websocketUrl, roomName, ydoc);
    setProvider(provider);
    return () => {
      provider?.destroy();
      ydoc.destroy();
    };
  }, [ydoc, roomName, websocketUrl]);

  // this effect manages the lifetime of the editor binding
  useEffect(() => {
    if (provider == null || editor == null) {
      return;
    }
    console.log('reached', provider);
    const binding = new MonacoBinding(
      ydoc.getText(),
      editor.getModel()!,
      new Set([editor]),
      provider?.awareness
    );
    setBinding(binding);
    return () => {
      binding.destroy();
    };
  }, [ydoc, provider, editor]);

  return (
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
  );
};

export default CollaborativeEditor;
