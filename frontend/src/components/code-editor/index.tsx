import Editor from '@monaco-editor/react';

const CodeEditor = ({
  initialValue,
  onChange,
}: {
  initialValue: string;
  onChange: (value: string) => void;
}) => {
  return (
      <Editor
        defaultLanguage='javascript'
        defaultValue={initialValue}
        onChange={(value: string | undefined) => {
          if (value) onChange(value);
        }}
      />
  );
};

export default CodeEditor;
