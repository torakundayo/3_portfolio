export type InputPosition =
  | 'center'
  | 'bottom-center'
  | 'bottom-right'
  | 'top-center'
  | 'integrated';

export type InputStyle =
  | 'minimal'
  | 'glass'
  | 'dark-glass'
  | 'transparent'
  | 'ghost';

export type TransitionVariant =
  | 'clipExpand'
  | 'slideOver'
  | 'scaleBlur'
  | 'verticalSplit';

export type InformationDensity = 'high' | 'medium' | 'low';

export interface TemplateMeta {
  id: string;
  category: string;
  inputPosition: InputPosition;
  inputStyle: InputStyle;
  transition: TransitionVariant;
  density: InformationDensity;
}

export interface VisualSeed {
  colorOffset: number;
  layoutVariant: number;
  animationDelay: number;
  accentIndex: number;
  mirrorLayout: boolean;
}

export interface TemplateProps {
  data: unknown;
  commentary: string;
  visualSeed: VisualSeed;
  /** Proactive AI whisper that fades into the environment */
  ambientMessage?: string;
}

export interface AccentPalette {
  primary: string;
  secondary: string;
  glow: string;
}
