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
  | 'transparent';

export type TransitionVariant =
  | 'clipExpand'
  | 'slideOver'
  | 'scaleBlur'
  | 'verticalSplit';

export interface TemplateMeta {
  id: string;
  category: string;
  inputPosition: InputPosition;
  inputStyle: InputStyle;
  transition: TransitionVariant;
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
}

export interface AccentPalette {
  primary: string;
  secondary: string;
  glow: string;
}
