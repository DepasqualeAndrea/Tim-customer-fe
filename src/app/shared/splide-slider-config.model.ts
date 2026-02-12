
export interface SplideSettings extends ResponsiveOptions {
  type?: string;
  role?: string;
  waitForTransition?: boolean;
  autoWidth?: boolean;
  autoHeight?: boolean;
  start?: number;
  arrowPath?: string;
  autoplay?: boolean | 'pause';
  interval?: number;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  resetProgress?: boolean;
  lazyLoad?: boolean | 'nearby' | 'sequential';
  preloadPages?: number;
  keyboard?: boolean | 'global' | 'focused';
  wheel?: boolean;
  wheelMinThreshold?: number;
  wheelSleep?: number;
  releaseWheel?: boolean;
  direction?: 'ltr' | 'rtl' | 'ttb';
  cover?: boolean;
  slideFocus?: boolean;
  isNavigation?: boolean;
  trimSpace?: boolean | 'move';
  updateOnMove?: boolean;
  mediaQuery?: 'min' | 'max';
  focusableNodes?: string;
  noDrag?: string;
  live?: boolean;
  useScroll?: boolean;
  breakpoints?: Record<string | number, ResponsiveOptions>;
  reducedMotion?: SplideSettings;
  classes?: Record<string, string>;
  i18n?: Record<keyof typeof I18N | string, string>;
}

interface ResponsiveOptions {
  [key: string]: any;
  label?: string;
  labelledby?: string;
  speed?: number;
  rewind?: boolean;
  rewindSpeed?: number;
  rewindByDrag?: boolean;
  width?: number | string;
  height?: number | string;
  fixedWidth?: number | string;
  fixedHeight?: number | string;
  heightRatio?: number;
  perPage?: number;
  perMove?: number;
  clones?: number;
  cloneStatus?: boolean;
  focus?: number | 'center';
  gap?: number | string;
  padding?: number | string | {
      left?: number | string;
      right?: number | string;
  } | {
      top?: number | string;
      bottom?: number | string;
  };
  arrows?: boolean;
  pagination?: boolean;
  paginationKeyboard?: boolean;
  paginationDirection?: SplideSettings['direction'];
  easing?: string;
  easingFunc?: (t: number) => number;
  drag?: boolean | 'free';
  snap?: boolean;
  dragMinThreshold?: number | {
      mouse: number;
      touch: number;
  };
  flickPower?: number;
  flickMaxPages?: number;
  destroy?: boolean | 'completely';
}

declare const I18N: {
  prev: string;
  next: string;
  first: string;
  last: string;
  slideX: string;
  pageX: string;
  play: string;
  pause: string;
  carousel: string;
  slide: string;
  select: string;
  slideLabel: string;
};