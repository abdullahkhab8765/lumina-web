export interface LetterParagraph {
  readonly id: number;
  readonly text: string;
}

export interface LetterContent {
  readonly heading: string;
  readonly paragraphs: LetterParagraph[];
}