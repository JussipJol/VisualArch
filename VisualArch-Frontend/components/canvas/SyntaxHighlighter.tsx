"use client";

import { useMemo } from "react";

// ── Language detection from file extension ────────────────────
function detectLang(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    ts: "typescript", tsx: "typescript", js: "javascript", jsx: "javascript",
    py: "python", json: "json", css: "css", scss: "css", html: "html",
    sql: "sql", md: "markdown", yml: "yaml", yaml: "yaml",
    sh: "bash", bash: "bash", dockerfile: "docker", env: "env",
    prisma: "prisma", graphql: "graphql", gql: "graphql",
  };
  return map[ext] || "text";
}

// ── Token patterns per language ───────────────────────────────
const PATTERNS: Record<string, [RegExp, string][]> = {
  typescript: [
    [/\/\/.*$/gm, "comment"],
    [/\/\*[\s\S]*?\*\//gm, "comment"],
    [/(["'`])(?:(?!\1|\\).|\\.)*\1/gm, "string"],
    [/\b(import|export|from|default|const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|typeof|instanceof|class|extends|implements|interface|type|enum|async|await|try|catch|throw|finally|yield|void|null|undefined|true|false|this|super|as|in|of|get|set|static|public|private|protected|readonly|abstract|declare|module|namespace|require)\b/g, "keyword"],
    [/\b(string|number|boolean|any|never|unknown|object|Array|Promise|Record|Partial|Required|Pick|Omit|Map|Set)\b/g, "type"],
    [/\b\d+\.?\d*\b/g, "number"],
    [/[{}()\[\];,.:?!=<>+\-*\/&|^~%@#]/g, "punctuation"],
    [/\b([A-Z][a-zA-Z0-9]*)\b/g, "class"],
  ],
  javascript: [], // Will use typescript patterns
  python: [
    [/#.*$/gm, "comment"],
    [/("""[\s\S]*?"""|'''[\s\S]*?''')/gm, "string"],
    [/(["'])(?:(?!\1|\\).|\\.)*\1/gm, "string"],
    [/\b(import|from|def|class|return|if|elif|else|for|while|try|except|finally|with|as|pass|break|continue|yield|lambda|and|or|not|in|is|True|False|None|raise|del|global|nonlocal|assert|async|await)\b/g, "keyword"],
    [/\b(int|float|str|bool|list|dict|set|tuple|bytes|type|object)\b/g, "type"],
    [/\b\d+\.?\d*\b/g, "number"],
    [/[{}()\[\];,.:=<>+\-*\/&|^~%@#]/g, "punctuation"],
  ],
  json: [
    [/(["'])(?:(?!\1|\\).|\\.)*\1\s*(?=:)/gm, "keyword"],
    [/(["'])(?:(?!\1|\\).|\\.)*\1/gm, "string"],
    [/\b(true|false|null)\b/g, "keyword"],
    [/\b\d+\.?\d*\b/g, "number"],
    [/[{}()\[\],:.]/g, "punctuation"],
  ],
  css: [
    [/\/\*[\s\S]*?\*\//gm, "comment"],
    [/(["'])(?:(?!\1|\\).|\\.)*\1/gm, "string"],
    [/(@[a-z\-]+)/g, "keyword"],
    [/(#[0-9a-fA-F]{3,8})\b/g, "number"],
    [/\b\d+\.?\d*(px|em|rem|%|vh|vw|s|ms|deg|fr)?\b/g, "number"],
    [/[{}();:,>~+\[\]=*]/g, "punctuation"],
  ],
  html: [
    [/<!--[\s\S]*?-->/gm, "comment"],
    [/(["'])(?:(?!\1|\\).|\\.)*\1/gm, "string"],
    [/<\/?[a-zA-Z][a-zA-Z0-9-]*/g, "keyword"],
    [/\/?>/g, "keyword"],
    [/\b[a-z\-]+=(?=")/g, "type"],
  ],
  sql: [
    [/--.*$/gm, "comment"],
    [/(["'])(?:(?!\1|\\).|\\.)*\1/gm, "string"],
    [/\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AND|OR|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|INDEX|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|DEFAULT|UNIQUE|CHECK|CONSTRAINT|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|UNION|ALL|AS|DISTINCT|COUNT|SUM|AVG|MAX|MIN|CASE|WHEN|THEN|ELSE|END|EXISTS|IN|LIKE|BETWEEN|IS)\b/gi, "keyword"],
    [/\b\d+\.?\d*\b/g, "number"],
  ],
  text: [],
};

// JavaScript uses same as TypeScript
PATTERNS.javascript = PATTERNS.typescript;

// ── Tokenize a line of code ──────────────────────────────────
function tokenize(code: string, lang: string): { text: string; type: string }[] {
  const patterns = PATTERNS[lang] || PATTERNS.text;
  if (patterns.length === 0) return [{ text: code, type: "plain" }];

  // Find all matches with their positions
  const matches: { start: number; end: number; text: string; type: string }[] = [];

  for (const [regex, type] of patterns) {
    const re = new RegExp(regex.source, regex.flags);
    let m;
    while ((m = re.exec(code)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], type });
      if (!regex.global) break;
    }
  }

  // Sort by position, then by length (longer first)
  matches.sort((a, b) => a.start - b.start || b.end - a.end);

  // Build non-overlapping token list
  const tokens: { text: string; type: string }[] = [];
  let pos = 0;

  for (const match of matches) {
    if (match.start < pos) continue;
    if (match.start > pos) {
      tokens.push({ text: code.slice(pos, match.start), type: "plain" });
    }
    tokens.push({ text: match.text, type: match.type });
    pos = match.end;
  }

  if (pos < code.length) {
    tokens.push({ text: code.slice(pos), type: "plain" });
  }

  return tokens.length > 0 ? tokens : [{ text: code, type: "plain" }];
}

// ── Color map (VS Code Dark+ inspired) ──────────────────────
const TOKEN_COLORS: Record<string, string> = {
  keyword: "#C586C0",
  string: "#CE9178",
  comment: "#6A9955",
  number: "#B5CEA8",
  type: "#4EC9B0",
  class: "#4EC9B0",
  punctuation: "#808080",
  plain: "#D4D4D4",
};

// ── Component ────────────────────────────────────────────────
interface SyntaxHighlighterProps {
  code: string;
  filePath: string;
  showLineNumbers?: boolean;
  startLine?: number;
}

export default function SyntaxHighlighter({
  code,
  filePath,
  showLineNumbers = true,
  startLine = 1,
}: SyntaxHighlighterProps) {
  const lang = detectLang(filePath);

  const highlighted = useMemo(() => {
    const lines = code.split("\n");
    return lines.map((line, i) => ({
      lineNum: startLine + i,
      tokens: tokenize(line, lang),
    }));
  }, [code, lang, startLine]);

  return (
    <div
      style={{
        background: "#1E1E1E",
        fontFamily: "var(--font-mono), 'Fira Code', 'JetBrains Mono', monospace",
        fontSize: 13,
        lineHeight: 1.6,
        overflow: "auto",
        tabSize: 2,
      }}
    >
      {highlighted.map(({ lineNum, tokens }) => (
        <div
          key={lineNum}
          style={{
            display: "flex",
            minHeight: 21,
            paddingRight: 16,
          }}
        >
          {showLineNumbers && (
            <span
              style={{
                display: "inline-block",
                width: 48,
                textAlign: "right",
                paddingRight: 16,
                color: "rgba(255,255,255,0.2)",
                userSelect: "none",
                flexShrink: 0,
              }}
            >
              {lineNum}
            </span>
          )}
          <span style={{ flex: 1, whiteSpace: "pre" }}>
            {tokens.map((token, j) => (
              <span key={j} style={{ color: TOKEN_COLORS[token.type] || TOKEN_COLORS.plain }}>
                {token.text}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
