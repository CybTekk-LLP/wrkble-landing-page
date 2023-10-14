// fullpage customization
$("#fullpage").fullpage({
  sectionsColor: ["#0e1012", "#E0E0E0", "#0e1012", "#E0E0E0", "#0e1012"],
  sectionSelector: ".vertical-scrolling",
  slideSelector: ".horizontal-scrolling",
  navigation: false,
  slidesNavigation: true,
  normalScrollElements: ".cards-container",
  controlArrows: false,
  anchors: ["home", "about", "featured", "pricing", "contact"],
  menu: "#menu",
  afterLoad: function (anchorLink, index) {},

  onLeave: function (index, nextIndex, direction) {},

  afterSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) {},

  onSlideLeave: function (anchorLink, index, slideIndex, direction) {},
});
