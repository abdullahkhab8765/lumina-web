export interface BlessingLine {
  readonly id: number;
  readonly text: string;
}

export interface FinalMessageLine {
  readonly id: number;
  readonly text: string;
  readonly emphasis?: boolean;
}