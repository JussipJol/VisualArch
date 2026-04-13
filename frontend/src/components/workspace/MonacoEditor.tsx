'use client';

import React from 'react';
import Editor from '@monaco-editor/react';

interface Props {
  content: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

export function MonacoEditor({ content, language = 'typescript', readOnly = false, onChange }: Props) {
  return (
    <div className="h-full w-full overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={language}
        defaultValue={content}
        value={content}
        onChange={(val) => onChange?.(val || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          fontSize: 13,
          fontFamily: "'Fira Code', 'Monaco', 'Courier New', monospace",
          readOnly,
          automaticLayout: true,
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorSmoothCaretAnimation: true,
          lineHeight: 20,
          renderLineHighlight: 'all',
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalSliderSize: 5,
            horizontalSliderSize: 5,
          },
        }}
      />
    </div>
  );
}
