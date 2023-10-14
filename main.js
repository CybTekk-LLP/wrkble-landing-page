// fullpage customization
$("#fullpage").fullpage({
  sectionsColor: ["#0e1012", "#348899", "#F2AE72", "#5C832F", "#0e1012"],
  sectionSelector: ".vertical-scrolling",
  slideSelector: ".horizontal-scrolling",
  navigation: false,
  slidesNavigation: true,
  controlArrows: false,
  anchors: ["home", "about", "featured", "pricing", "contact"],
  menu: "#menu",
  afterLoad: function (anchorLink, index) {},

  onLeave: function (index, nextIndex, direction) {},

  afterSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) {},

  onSlideLeave: function (anchorLink, index, slideIndex, direction) {},
});
