import type { BlessingLine, FinalMessageLine } from '../types/typography';

export const TITLE_LINE_1 = 'Happy Birthday';
export const TITLE_LINE_2 = 'Aima';

export const BLESSING_LINES: BlessingLine[] = [
  { id: 1, text: 'May Allah bless you' },
  { id: 2, text: 'with endless happiness,' },
  { id: 3, text: 'good health,' },
  { id: 4, text: 'success,' },
  { id: 5, text: 'and a beautiful life ahead.' },
  { id: 6, text: 'Ameen.' },
];

export const FINAL_MESSAGE_LINES: FinalMessageLine[] = [
  { id: 1, text: 'Made with lots of prayers,' },
  { id: 2, text: 'effort,' },
  { id: 3, text: 'and heartfelt wishes...' },
  { id: 4, text: 'just for you. \u2764\ufe0f', emphasis: true },
];

export const TITLE_REVEAL_DURATION = 1.6;
export const TITLE_NAME_REVEAL_DURATION = 1.8;
export const BLESSING_LINE_DURATION = 1.1;
export const BLESSING_LINE_STAGGER = 0.9;
export const FINAL_MESSAGE_LINE_DURATION = 1.3;
export const FINAL_MESSAGE_LINE_STAGGER = 1.1;