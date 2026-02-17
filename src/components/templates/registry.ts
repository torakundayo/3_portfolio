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
import { TextQaFormat } from './text/QaFormat';

interface TemplateEntry {
  component: ComponentType<TemplateProps>;
  meta: TemplateMeta;
}

export const templateRegistry: Record<string, TemplateEntry> = {
  // ─── Welcome ───
  'welcome': {
    component: WelcomeMinimalInput,
    meta: { id: 'welcome', category: 'welcome', inputPosition: 'center', inputStyle: 'dark-glass', transition: 'scaleBlur' },
  },

  // ─── Profile (5) ───
  'profile-hero-split': {
    component: ProfileHeroSplit,
    meta: { id: 'profile-hero-split', category: 'profile', inputPosition: 'bottom-center', inputStyle: 'glass', transition: 'slideOver' },
  },
  'profile-centered-bio': {
    component: ProfileCenteredBio,
    meta: { id: 'profile-centered-bio', category: 'profile', inputPosition: 'bottom-center', inputStyle: 'dark-glass', transition: 'scaleBlur' },
  },
  'profile-card-stack': {
    component: ProfileCardStack,
    meta: { id: 'profile-card-stack', category: 'profile', inputPosition: 'bottom-center', inputStyle: 'glass', transition: 'clipExpand' },
  },
  'profile-minimal-intro': {
    component: ProfileMinimalIntro,
    meta: { id: 'profile-minimal-intro', category: 'profile', inputPosition: 'bottom-center', inputStyle: 'minimal', transition: 'verticalSplit' },
  },
  'profile-full-portrait': {
    component: ProfileFullPortrait,
    meta: { id: 'profile-full-portrait', category: 'profile', inputPosition: 'bottom-right', inputStyle: 'dark-glass', transition: 'clipExpand' },
  },

  // ─── Projects (5) ───
  'projects-horizontal-slider': {
    component: ProjectsHorizontalSlider,
    meta: { id: 'projects-horizontal-slider', category: 'projects', inputPosition: 'bottom-center', inputStyle: 'glass', transition: 'slideOver' },
  },
  'projects-grid-gallery': {
    component: ProjectsGridGallery,
    meta: { id: 'projects-grid-gallery', category: 'projects', inputPosition: 'bottom-center', inputStyle: 'dark-glass', transition: 'scaleBlur' },
  },
  'projects-spotlight': {
    component: ProjectsSpotlight,
    meta: { id: 'projects-spotlight', category: 'projects', inputPosition: 'bottom-right', inputStyle: 'dark-glass', transition: 'clipExpand' },
  },
  'projects-timeline': {
    component: ProjectsTimeline,
    meta: { id: 'projects-timeline', category: 'projects', inputPosition: 'bottom-center', inputStyle: 'glass', transition: 'verticalSplit' },
  },
  'projects-showcase-stack': {
    component: ProjectsShowcaseStack,
    meta: { id: 'projects-showcase-stack', category: 'projects', inputPosition: 'bottom-center', inputStyle: 'dark-glass', transition: 'slideOver' },
  },

  // ─── Skills (5) ───
  'skills-bar-chart': {
    component: SkillsBarChart,
    meta: { id: 'skills-bar-chart', category: 'skills', inputPosition: 'bottom-center', inputStyle: 'dark-glass', transition: 'slideOver' },
  },
  'skills-radar-chart': {
    component: SkillsRadarChart,
    meta: { id: 'skills-radar-chart', category: 'skills', inputPosition: 'bottom-center', inputStyle: 'dark-glass', transition: 'scaleBlur' },
  },
  'skills-tag-cloud': {
    component: SkillsTagCloud,
    meta: { id: 'skills-tag-cloud', category: 'skills', inputPosition: 'bottom-center', inputStyle: 'glass', transition: 'clipExpand' },
  },
  'skills-category-cards': {
    component: SkillsCategoryCards,
    meta: { id: 'skills-category-cards', category: 'skills', inputPosition: 'bottom-center', inputStyle: 'glass', transition: 'verticalSplit' },
  },
  'skills-matrix': {
    component: SkillsMatrix,
    meta: { id: 'skills-matrix', category: 'skills', inputPosition: 'bottom-center', inputStyle: 'dark-glass', transition: 'slideOver' },
  },

  // ─── Career (4) ───
  'career-vertical-timeline': {
    component: CareerVerticalTimeline,
    meta: { id: 'career-vertical-timeline', category: 'career', inputPosition: 'bottom-center', inputStyle: 'glass', transition: 'verticalSplit' },
  },
  'career-horizontal-timeline': {
    component: CareerHorizontalTimeline,
    meta: { id: 'career-horizontal-timeline', category: 'career', inputPosition: 'bottom-center', inputStyle: 'glass', transition: 'slideOver' },
  },
  'career-company-cards': {
    component: CareerCompanyCards,
    meta: { id: 'career-company-cards', category: 'career', inputPosition: 'bottom-center', inputStyle: 'dark-glass', transition: 'scaleBlur' },
  },
  'career-journey': {
    component: CareerJourney,
    meta: { id: 'career-journey', category: 'career', inputPosition: 'bottom-center', inputStyle: 'glass', transition: 'clipExpand' },
  },

  // ─── Values (3) ───
  'values-quote-card': {
    component: ValuesQuoteCard,
    meta: { id: 'values-quote-card', category: 'values', inputPosition: 'bottom-center', inputStyle: 'dark-glass', transition: 'clipExpand' },
  },
  'values-manifesto': {
    component: ValuesManifesto,
    meta: { id: 'values-manifesto', category: 'values', inputPosition: 'bottom-center', inputStyle: 'dark-glass', transition: 'verticalSplit' },
  },
  'values-story-format': {
    component: ValuesStoryFormat,
    meta: { id: 'values-story-format', category: 'values', inputPosition: 'bottom-center', inputStyle: 'glass', transition: 'scaleBlur' },
  },

  // ─── Contact (3) ───
  'contact-card': {
    component: ContactCard,
    meta: { id: 'contact-card', category: 'contact', inputPosition: 'bottom-center', inputStyle: 'glass', transition: 'scaleBlur' },
  },
  'contact-minimal-links': {
    component: ContactMinimalLinks,
    meta: { id: 'contact-minimal-links', category: 'contact', inputPosition: 'bottom-center', inputStyle: 'minimal', transition: 'verticalSplit' },
  },
  'contact-fullscreen-cta': {
    component: ContactFullscreenCta,
    meta: { id: 'contact-fullscreen-cta', category: 'contact', inputPosition: 'bottom-center', inputStyle: 'dark-glass', transition: 'clipExpand' },
  },

  // ─── Text (5) ───
  'text-centered-prose': {
    component: TextCenteredProse,
    meta: { id: 'text-centered-prose', category: 'text', inputPosition: 'bottom-center', inputStyle: 'glass', transition: 'scaleBlur' },
  },
  'text-magazine-layout': {
    component: TextMagazineLayout,
    meta: { id: 'text-magazine-layout', category: 'text', inputPosition: 'bottom-center', inputStyle: 'glass', transition: 'slideOver' },
  },
  'text-letter-format': {
    component: TextLetterFormat,
    meta: { id: 'text-letter-format', category: 'text', inputPosition: 'bottom-center', inputStyle: 'minimal', transition: 'verticalSplit' },
  },
  'text-highlight-box': {
    component: TextHighlightBox,
    meta: { id: 'text-highlight-box', category: 'text', inputPosition: 'bottom-center', inputStyle: 'glass', transition: 'clipExpand' },
  },
  'text-qa-format': {
    component: TextQaFormat,
    meta: { id: 'text-qa-format', category: 'text', inputPosition: 'bottom-center', inputStyle: 'glass', transition: 'scaleBlur' },
  },
};
