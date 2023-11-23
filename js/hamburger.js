document.addEventListener("DOMContentLoaded", () => {
  let input = document.getElementById("check");
  let pane = document.querySelector(".pane");
  let list = document.querySelectorAll(".hamburger-options li");
  input.addEventListener("change", () => {
    if (input.checked) {
      pane.classList.add("slideIn");
    } else {
      pane.classList.remove("slideIn");
    }
  });
  list.forEach((li) => {
    li.addEventListener("click", () => {
      input.checked = false;
      setTimeout(() => {
        pane.classList.remove("slideIn");
      }, 50);
    });
  });
  if (!!localStorage.getItem("userType")) {
    document.querySelector(".link-changer").href =
      "https://wrkble.com/dashboard";
  }
});
