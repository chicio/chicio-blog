import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import ts from 'react-syntax-highlighter/dist/cjs/languages/hljs/typescript';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

SyntaxHighlighter.registerLanguage('typescript', ts);

export default function TypeScriptSnippet({code, language}) {
  return <SyntaxHighlighter language={language} style={docco}>{code}</SyntaxHighlighter>;
}
