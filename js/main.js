let cards = document.querySelector(".cards-container");
let featured = document.querySelector(".featured-container");
let pricing = document.querySelector(".pricing-container");

window.addEventListener("resize", () => {
  resizeCheck();
});
// ".cards-container-scroll, .featured-container-scroll, .pricing-container-scroll",
const resizeCheck = () => {
  if (window.matchMedia("(max-width: 1300px)").matches) {
    !cards.classList.contains("cards-container-scroll") &&
      cards.classList.add("cards-container-scroll");
    !featured.classList.contains("featured-container-scroll") &&
      featured.classList.add("featured-container-scroll");
    !pricing.classList.contains("pricing-container-scroll") &&
      pricing.classList.add("pricing-container-scroll");
  } else {
    cards.classList.contains("cards-container-scroll") &&
      cards.classList.remove("cards-container-scroll");
    featured.classList.contains("featured-container-scroll") &&
      featured.classList.remove("featured-container-scroll");
    pricing.classList.contains("pricing-container-scroll") &&
      pricing.classList.remove("pricing-container-scroll");
  }
};
resizeCheck();
// fullpage customization
$("#fullpage").fullpage({
  sectionsColor: ["#0e1012", "#E0E0E0", "#0e1012", "#0e1012", "#0e1012"],
  sectionSelector: ".vertical-scrolling",
  slideSelector: ".horizontal-scrolling",
  navigation: false,
  slidesNavigation: true,
  normalScrollElements:
    ".cards-container-scroll, .featured-container-scroll, .pricing-container-scroll",
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
