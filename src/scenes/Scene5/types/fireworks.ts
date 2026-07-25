export type FireworkColor = 'gold' | 'blue' | 'white' | 'amber' | 'rose';

export type FireworkShape = 'burst' | 'willow' | 'peony' | 'palm' | 'ring';

export interface FireworkLaunchEvent {
  readonly id: string;
  readonly delay: number;
  readonly originXPercent: number;
  readonly apexYPercent: number;
  readonly shape: FireworkShape;
  readonly color: FireworkColor;
  readonly scale: number;
  readonly isFinale?: boolean;
}