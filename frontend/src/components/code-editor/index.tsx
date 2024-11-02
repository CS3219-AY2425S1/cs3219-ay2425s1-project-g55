import Editor from '@monaco-editor/react';

const CodeEditor = ({
  initialValue = '// Write your code here\n',
  value,
  onChange,
}: {
  initialValue?: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <Editor
      defaultLanguage="javascript"
      defaultValue={initialValue}
      value={value}
      onChange={(value: string | undefined) => {
        if (value) onChange(value);
      }}
    />
  );
};

export default CodeEditor;
