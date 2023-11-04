document.addEventListener("resize", () => {
  if (
    window.matchMedia("(orientation: landscape) and (width < 1300px)").matches
  ) {
    alert("hola");
  }
});
