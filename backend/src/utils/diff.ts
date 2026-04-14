/**
 * Simple diff utility for AI reconciliation
 * Compares two strings and returns a summary of changes
 */
export function getDiffSummary(oldContent: string, newContent: string): string {
  if (oldContent === newContent) return 'No changes.';

  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  
  // If files are very different or one is empty, return simple summary
  if (oldLines.length === 0 || newLines.length === 0 || Math.abs(oldLines.length - newLines.length) > 500) {
    return `File content significantly changed. New size: ${newLines.length} lines.`;
  }

  const added: string[] = [];
  const removed: string[] = [];

  // Simple line-by-line diff (not as sophisticated as Myers, but efficient for AI context)
  const lineSet = new Set(oldLines);
  
  newLines.forEach((line, i) => {
    if (!lineSet.has(line)) {
      added.push(`+ L${i + 1}: ${line.trim()}`);
    }
  });

  const newLineSet = new Set(newLines);
  oldLines.forEach((line, i) => {
    if (!newLineSet.has(line)) {
      removed.push(`- L${i + 1}: ${line.trim()}`);
    }
  });

  // Limit summary size
  const summary = [
    ...removed.slice(0, 50).map(l => l.substring(0, 100)),
    ...(removed.length > 50 ? [`... and ${removed.length - 50} more removals`] : []),
    ...added.slice(0, 50).map(l => l.substring(0, 100)),
    ...(added.length > 50 ? [`... and ${added.length - 50} more additions`] : []),
  ];

  return summary.length > 0 ? summary.join('\n') : 'Minor internal changes detected.';
}
