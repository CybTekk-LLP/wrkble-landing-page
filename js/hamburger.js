document.addEventListener("DOMContentLoaded", () => {
  let input = document.getElementById("check");
  let pane = document.querySelector(".pane");
  input.addEventListener("change", () => {
    if (input.checked) {
      pane.style.display = "block";
      pane.style.opacity = 1;
    } else {
      pane.style.display = "none";
      pane.style.opacity = 0;
    }
  });

  if (!!localStorage.getItem("userType")) {
    document.querySelector(".link-changer").href =
      "https://wrkble.com/dashboard";
  }
});
