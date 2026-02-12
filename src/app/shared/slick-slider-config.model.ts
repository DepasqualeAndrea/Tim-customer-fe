type BaseSettings = {
  speed: number
  slidesToShow: number
  slidesToScroll: number
  swipe: boolean
  swipeToSlide: boolean
  draggable: boolean
  edgeFriction: number
  touchThreshold: number
  initialSlide: number
  arrows: boolean
  prevArrow: boolean
  nextArrow: boolean
  appendArrows: string
  dots: boolean
  dotsClass: string
  appendDots: string
  infinite: boolean
  autoplay: boolean
  autoplaySpeed: number
  adaptiveHeight: boolean
  centerMode: boolean
  variableWidth: boolean
  touchMove: boolean
  cssEase: CssEase
  easing: CssEase
  focusOnSelect: boolean
  fade: boolean
  asNavFor: string
  rtl: boolean
  accessibility: boolean
  centerPadding: string
  customPaging: Function
  lazyLoad: LazyLoadMode
  mobileFirst: boolean
  pauseOnFocus: boolean
  pauseOnHover: boolean
  pauseOnDotsHover: boolean
  respondTo: string
  rows: number
  slidesPerRow: number
  slide: HTMLElement
  useCSS: boolean
  useTransform: boolean
  vertical: boolean
  verticalSwiping: boolean
  waitForAnimate: boolean
  zIndex: number
}

type LazyLoadMode = 'ondemand' | 'progressive'
type CssEase = 'ease' | 'linear' | 'ease-in-out' | 'ease-in' | 'ease-out'

type SlickBaseSettings = Partial<BaseSettings>
type SlickResponsiveSetting = {breakpoint: number, settings: SlickBaseSettings}

export type SlickSliderConfigSettings = SlickBaseSettings & {
  responsive?: SlickResponsiveSetting[]
}