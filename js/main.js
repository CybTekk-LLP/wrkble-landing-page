// fullpage customization
$("#fullpage").fullpage({
  sectionsColor: ["#0e1012", "#E0E0E0", "#0e1012", "#0e1012", "#0e1012"],
  sectionSelector: ".vertical-scrolling",
  slideSelector: ".horizontal-scrolling",
  navigation: false,
  slidesNavigation: true,
  normalScrollElements:
    ".cards-container, .featured-container, .pricing-container",
  controlArrows: false,
  anchors: ["home", "about", "featured", "pricing", "contact"],
  menu: "#menu",
  css3: true,
  scrollingSpeed: 700,
  autoScrolling: true,
  fitToSection: true,
  fitToSectionDelay: 600,
  scrollBar: false,
  easing: "easeInOutCubic",
  easingcss3: "ease",
  loopBottom: false,
  loopTop: false,
  loopHorizontal: true,
  continuousVertical: false,
  continuousHorizontal: false,
  scrollHorizontally: false,
  interlockedSlides: false,
  dragAndMove: true,
  offsetSections: false,
  resetSliders: false,
  fadingEffect: true,
  scrollOverflow: true,
  scrollOverflowMacStyle: true,
  scrollOverflowReset: false,
  touchSensitivity: 15,
  bigSectionsDestination: null,

  // Accessibility
  keyboardScrolling: true,
  animateAnchor: true,
  recordHistory: true,
  afterLoad: function (anchorLink, index) {},

  onLeave: function (index, nextIndex, direction) {},

  afterSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) {},

  onSlideLeave: function (anchorLink, index, slideIndex, direction) {},
});
