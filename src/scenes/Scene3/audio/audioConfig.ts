export interface Scene3AudioConfig {
  initialVolume: number;
  maxVolume: number;
  fadeInDuration: number;
  fadeOutDuration: number;
  startDelay: number;
  loop: boolean;
}

export const SCENE3_AUDIO_CONFIG: Scene3AudioConfig = {
  initialVolume: 0.2,
  maxVolume: 0.35,
  fadeInDuration: 2000,
  fadeOutDuration: 3000,
  startDelay: 2000,
  loop: false,
};