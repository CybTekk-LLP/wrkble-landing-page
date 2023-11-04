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
      cards.classList.add("featured-container-scroll");
    !pricing.classList.contains("pricing-container-scroll") &&
      pricing.classList.add("pricing-container-scroll");
  } else {
    cards.classList.contains("cards-container-scroll") &&
      cards.classList.remove("cards-container-scroll");
    featured.classList.contains("featured-container-scroll") &&
      cards.classList.remove("featured-container-scroll");
    pricing.classList.contains("pricing-container-scroll") &&
      pricing.classList.remove("pricing-container-scroll");
  }
};
