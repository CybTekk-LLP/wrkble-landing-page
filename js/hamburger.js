document.addEventListener("DOMContentLoaded", () => {
  let input = document.getElementById("check");
  let pane = document.querySelector(".pane");
  input.addEventListener("change", () => {
    if (input.checked) {
      //   pane.style.display = "block";
      pane.classList.add("slideIn");
    } else {
      pane.classList.remove("slideIn");
      setTimeout(() => {
        // pane.style.display = "none";
      }, 3000);
    }
  });

  if (!!localStorage.getItem("userType")) {
    document.querySelector(".link-changer").href =
      "https://wrkble.com/dashboard";
  }
});
