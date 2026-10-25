import { TextMatch } from '../types';

/**
 * Searches text using regex patterns and returns exact span indices without duplicates.
 */
export function findPatternMatches(text: string, patterns: RegExp[]): TextMatch[] {
  const matches: TextMatch[] = [];

  for (const pattern of patterns) {
    // Ensure pattern is global and case-insensitive
    const flags = new Set(pattern.flags.split(''));
    flags.add('g');
    flags.add('i');
    const globalPattern = new RegExp(pattern.source, Array.from(flags).join(''));

    let match: RegExpExecArray | null;
    while ((match = globalPattern.exec(text)) !== null) {
      if (match[0].length === 0) {
        globalPattern.lastIndex++;
        continue;
      }

      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
      });
    }
  }

  return mergeOverlappingMatches(matches, text);
}

/**
 * Merges overlapping and duplicate matches to produce clean, sequential spans.
 */
export function mergeOverlappingMatches(matches: TextMatch[], originalText?: string): TextMatch[] {
  if (matches.length <= 1) return matches;

  // Sort by start ascending, then length descending
  const sorted = [...matches].sort((a, b) => a.start - b.start || b.end - a.end);
  const result: TextMatch[] = [];

  for (const current of sorted) {
    const last = result[result.length - 1];

    if (!last) {
      result.push({ ...current });
      continue;
    }

    // Check overlap
    if (current.start <= last.end) {
      // Expand last if current extends beyond
      if (current.end > last.end) {
        last.end = current.end;
        if (originalText) {
          last.text = originalText.slice(last.start, last.end);
        } else {
          last.text = current.text.length > last.text.length ? current.text : last.text;
        }
      }
    } else {
      result.push({ ...current });
    }
  }

  return result;
}
