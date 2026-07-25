export interface Scene5AudioConfig {
  src: string;
  initialVolume: number;
  targetVolume: number;
  fadeInDuration: number;
  fadeOutDuration: number;
  playbackRate: number;
  loop: boolean;
  preload: 'auto' | 'metadata' | 'none';
}

export const SCENE5_AUDIO_CONFIG: Scene5AudioConfig = {
  src: '/audio/satranga.mp3',
  initialVolume: 0,
  targetVolume: 0.3,
  fadeInDuration: 2500,
  fadeOutDuration: 3000,
  playbackRate: 1,
  loop: true,
  preload: 'auto',
};