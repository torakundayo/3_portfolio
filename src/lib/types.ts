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

/* ─── Category-specific data types ─── */

export interface I18nText {
  ja?: string;
  en?: string;
}

export interface ProfileData {
  name?: I18nText;
  title?: I18nText;
  location?: I18nText;
  introduction?: I18nText;
  background?: I18nText;
  links?: {
    github?: string;
    linkedin?: string;
  };
}

export interface CareerEntry {
  company?: I18nText;
  period?: string;
  role?: I18nText;
  description?: I18nText;
  highlights?: { ja?: string[]; en?: string[] };
}

export interface CareerData {
  history: CareerEntry[];
}

export interface Skill {
  name: string;
  level: number;
  yearsOfExperience?: number;
  years?: number;
  description?: string;
  details?: I18nText;
}

export interface SkillCategory {
  name?: I18nText;
  skills: Skill[];
}

export interface SkillsData {
  categories: SkillCategory[];
}

export interface Project {
  name: string;
  tagline?: I18nText;
  description?: I18nText;
  stack?: string[];
  url?: string;
  github?: string;
  image?: string;
  year?: number;
  motivation?: I18nText;
  highlights?: { ja?: string[]; en?: string[] };
}

export interface ProjectsData {
  projects: Project[];
}

export interface ValuesData {
  beliefs?: I18nText;
  visionForFutureSaaS?: I18nText;
  workStyle?: I18nText;
}

export interface ContactData {
  email?: string;
  github?: string;
  linkedin?: string;
  message?: I18nText;
}
