export interface Scene4ParagraphVolumes {
  paragraph1: number;
  paragraph2: number;
  paragraph3: number;
  paragraph4: number;
}

export interface Scene4AudioConfig {
  src: string;
  initialVolume: number;
  fadeInTargetVolume: number;
  paragraphVolumes: Scene4ParagraphVolumes;
  fadeInDuration: number;
  fadeOutDuration: number;
  paragraphTransitionDuration: number;
  loop: boolean;
  preload: 'auto' | 'metadata' | 'none';
}

export const SCENE4_AUDIO_CONFIG: Scene4AudioConfig = {
  src: '/audio/iraaday.mp3',
  initialVolume: 0,
  fadeInTargetVolume: 0.15,
  paragraphVolumes: {
    paragraph1: 0.18,
    paragraph2: 0.22,
    paragraph3: 0.25,
    paragraph4: 0.2,
  },
  fadeInDuration: 2000,
  fadeOutDuration: 2500,
  paragraphTransitionDuration: 900,
  loop: true,
  preload: 'auto',
};