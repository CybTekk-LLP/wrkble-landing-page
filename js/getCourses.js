const base = "https://staging.wrkble.com/api/";
const endpoint = "courses";
let courses;
async function getCourses(base, endpoint, method, message) {
  await fetch(base + endpoint, {
    method: method,
    headers: {
      "Content-Type": "Application/JSON",
    },
    body: method !== "GET" ? JSON.stringify(message) : undefined,
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else throw new Error("Not 2xx response", { cause: res });
    })
    .then((data) => (courses = data))
    .catch((e) => console.log(e));
}
document.addEventListener("DOMContentLoaded", async () => {
  await getCourses(base, endpoint, "GET");
  let i = 0;
  document.querySelectorAll(".featured-card").forEach((card) => {
    card.querySelector("h2").textContent = courses[i].title
      .split(" ", 2)
      .join(" ");
    card.querySelector(".difficulty").textContent =
      courses[i].difficulty.toString().charAt(0).toUpperCase() +
      courses[i].difficulty.slice(1);
    card.querySelector(".difficulty").classList.add(courses[i].difficulty);
    card.querySelector(".course-content").textContent =
      courses[i].description.slice(0, 70) + "...";
    let j = 0;
    card.querySelectorAll(".tag-container .tag").forEach((tag) => {
      tag.textContent = courses[i].tags[j].slice(0, 7);
      j++;
    });
    card.querySelector("img").src = courses[i].thumbnail;
    card.querySelector("a").href =
      "https://staging.wrkble.com/api/courses/" + courses[i].id;
    // console.log(courses[i], card);
    i++;
  });
});
