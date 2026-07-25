export function splitIntoWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}