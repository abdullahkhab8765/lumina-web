export interface Gift {
  readonly id: number;
  readonly message: string;
}

export type GiftStatus = 'locked' | 'active' | 'opened';

export interface GiftBoxRefs {
  box: HTMLDivElement | null;
  lid: HTMLDivElement | null;
  ribbon: HTMLDivElement | null;
  glow: HTMLDivElement | null;
  particles: HTMLDivElement | null;
}