import type { ComponentType } from 'react';
import type { TemplateMeta, TemplateProps } from '@/lib/types';
import { WelcomeMinimalInput } from './welcome/MinimalInput';
import { TextCenteredProse } from './text/CenteredProse';
import { Placeholder } from './Placeholder';
import { ProfileHeroSplit } from './profile/HeroSplit';
import { ProfileCenteredBio } from './profile/CenteredBio';
import { ProfileCardStack } from './profile/CardStack';
import { ProfileMinimalIntro } from './profile/MinimalIntro';
import { ProfileFullPortrait } from './profile/FullPortrait';
import { ProfileSpatialHero } from './profile/SpatialHero';
import { ProjectsHorizontalSlider } from './projects/HorizontalSlider';
import { ProjectsGridGallery } from './projects/GridGallery';
import { ProjectsSpotlight } from './projects/Spotlight';
import { ProjectsTimeline } from './projects/Timeline';
import { ProjectsShowcaseStack } from './projects/ShowcaseStack';
import { SkillsBarChart } from './skills/BarChart';
import { SkillsRadarChart } from './skills/RadarChart';
import { SkillsTagCloud } from './skills/TagCloud';
import { SkillsCategoryCards } from './skills/CategoryCards';
import { SkillsMatrix } from './skills/Matrix';
import { SkillsConstellation } from './skills/Constellation';
import { CareerVerticalTimeline } from './career/VerticalTimeline';
import { CareerHorizontalTimeline } from './career/HorizontalTimeline';
import { CareerCompanyCards } from './career/CompanyCards';
import { CareerJourney } from './career/Journey';
import { ValuesQuoteCard } from './values/QuoteCard';
import { ValuesManifesto } from './values/Manifesto';
import { ValuesStoryFormat } from './values/StoryFormat';
import { ContactCard } from './contact/ContactCard';
import { ContactMinimalLinks } from './contact/MinimalLinks';
import { ContactFullscreenCta } from './contact/FullscreenCta';
import { TextMagazineLayout } from './text/MagazineLayout';
import { TextLetterFormat } from './text/LetterFormat';
import { TextHighlightBox } from './text/HighlightBox';
import { TextQaFormat } from './text/QAFormat';

interface TemplateEntry {
  component: ComponentType<TemplateProps>;
  meta: TemplateMeta;
}

export const templateRegistry: Record<string, TemplateEntry> = {
  // ─── Welcome ───
  'welcome': {
    component: WelcomeMinimalInput,
    meta: { id: 'welcome', category: 'welcome', inputPosition: 'center', inputStyle: 'ghost', transition: 'clipExpand', density: 'low' },
  },

  // ─── Profile (6) — medium density ───
  'profile-hero-split': {
    component: ProfileHeroSplit,
    meta: { id: 'profile-hero-split', category: 'profile', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'medium' },
  },
  'profile-centered-bio': {
    component: ProfileCenteredBio,
    meta: { id: 'profile-centered-bio', category: 'profile', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'medium' },
  },
  'profile-card-stack': {
    component: ProfileCardStack,
    meta: { id: 'profile-card-stack', category: 'profile', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'medium' },
  },
  'profile-minimal-intro': {
    component: ProfileMinimalIntro,
    meta: { id: 'profile-minimal-intro', category: 'profile', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'low' },
  },
  'profile-full-portrait': {
    component: ProfileFullPortrait,
    meta: { id: 'profile-full-portrait', category: 'profile', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'medium' },
  },
  'profile-spatial-hero': {
    component: ProfileSpatialHero,
    meta: { id: 'profile-spatial-hero', category: 'profile', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'medium' },
  },

  // ─── Projects (5) — medium density ───
  'projects-horizontal-slider': {
    component: ProjectsHorizontalSlider,
    meta: { id: 'projects-horizontal-slider', category: 'projects', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'medium' },
  },
  'projects-grid-gallery': {
    component: ProjectsGridGallery,
    meta: { id: 'projects-grid-gallery', category: 'projects', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'high' },
  },
  'projects-spotlight': {
    component: ProjectsSpotlight,
    meta: { id: 'projects-spotlight', category: 'projects', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'medium' },
  },
  'projects-timeline': {
    component: ProjectsTimeline,
    meta: { id: 'projects-timeline', category: 'projects', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'medium' },
  },
  'projects-showcase-stack': {
    component: ProjectsShowcaseStack,
    meta: { id: 'projects-showcase-stack', category: 'projects', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'medium' },
  },

  // ─── Skills (6) — high density ───
  'skills-bar-chart': {
    component: SkillsBarChart,
    meta: { id: 'skills-bar-chart', category: 'skills', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'high' },
  },
  'skills-radar-chart': {
    component: SkillsRadarChart,
    meta: { id: 'skills-radar-chart', category: 'skills', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'high' },
  },
  'skills-tag-cloud': {
    component: SkillsTagCloud,
    meta: { id: 'skills-tag-cloud', category: 'skills', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'high' },
  },
  'skills-category-cards': {
    component: SkillsCategoryCards,
    meta: { id: 'skills-category-cards', category: 'skills', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'high' },
  },
  'skills-matrix': {
    component: SkillsMatrix,
    meta: { id: 'skills-matrix', category: 'skills', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'high' },
  },
  'skills-constellation': {
    component: SkillsConstellation,
    meta: { id: 'skills-constellation', category: 'skills', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'high' },
  },

  // ─── Career (4) — medium density ───
  'career-vertical-timeline': {
    component: CareerVerticalTimeline,
    meta: { id: 'career-vertical-timeline', category: 'career', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'medium' },
  },
  'career-horizontal-timeline': {
    component: CareerHorizontalTimeline,
    meta: { id: 'career-horizontal-timeline', category: 'career', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'medium' },
  },
  'career-company-cards': {
    component: CareerCompanyCards,
    meta: { id: 'career-company-cards', category: 'career', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'medium' },
  },
  'career-journey': {
    component: CareerJourney,
    meta: { id: 'career-journey', category: 'career', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'medium' },
  },

  // ─── Values (3) — low density ───
  'values-quote-card': {
    component: ValuesQuoteCard,
    meta: { id: 'values-quote-card', category: 'values', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'low' },
  },
  'values-manifesto': {
    component: ValuesManifesto,
    meta: { id: 'values-manifesto', category: 'values', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'low' },
  },
  'values-story-format': {
    component: ValuesStoryFormat,
    meta: { id: 'values-story-format', category: 'values', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'low' },
  },

  // ─── Contact (3) — low density ───
  'contact-card': {
    component: ContactCard,
    meta: { id: 'contact-card', category: 'contact', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'low' },
  },
  'contact-minimal-links': {
    component: ContactMinimalLinks,
    meta: { id: 'contact-minimal-links', category: 'contact', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'low' },
  },
  'contact-fullscreen-cta': {
    component: ContactFullscreenCta,
    meta: { id: 'contact-fullscreen-cta', category: 'contact', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'low' },
  },

  // ─── Text (5) — medium density ───
  'text-centered-prose': {
    component: TextCenteredProse,
    meta: { id: 'text-centered-prose', category: 'text', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'medium' },
  },
  'text-magazine-layout': {
    component: TextMagazineLayout,
    meta: { id: 'text-magazine-layout', category: 'text', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'medium' },
  },
  'text-letter-format': {
    component: TextLetterFormat,
    meta: { id: 'text-letter-format', category: 'text', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'low' },
  },
  'text-highlight-box': {
    component: TextHighlightBox,
    meta: { id: 'text-highlight-box', category: 'text', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'medium' },
  },
  'text-qa-format': {
    component: TextQaFormat,
    meta: { id: 'text-qa-format', category: 'text', inputPosition: 'bottom-center', inputStyle: 'ghost', transition: 'clipExpand', density: 'medium' },
  },
};
