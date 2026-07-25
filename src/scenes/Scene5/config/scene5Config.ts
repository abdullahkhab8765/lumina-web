export const SCENE5_FADE_IN_DURATION = 1.8;
export const SCENE5_FADE_OUT_DURATION = 2.4;

// The white/black cover transition to Scene 6. Deliberately its own,
// short duration -- separate from SCENE5_FADE_OUT_DURATION -- so the
// handoff transition itself stays brief instead of inheriting Scene 5's
// (longer) visual fade-out length.
export const SCENE5_TO_SCENE6_TRANSITION_DURATION = 0.6;

export const CAMERA_DRIFT_DURATION = 90;
export const CAMERA_DRIFT_X_PERCENT = 2.2;
export const CAMERA_DRIFT_Y_PERCENT = 1.4;
export const CAMERA_ZOOM_FROM = 1;
export const CAMERA_ZOOM_TO = 1.05;

export const FINALE_AUDIO_SRC = '/audio/satranga.mp3';
export const FINALE_AUDIO_QUIET_VOLUME = 0.22;
export const FINALE_AUDIO_BUILD_VOLUME = 0.55;
export const FINALE_AUDIO_PEAK_VOLUME = 0.85;
export const FINALE_AUDIO_FADE_OUT_DURATION = 3.5;