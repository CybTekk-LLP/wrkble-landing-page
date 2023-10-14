"use strict";
let words = document.querySelectorAll(".word");
let words2 = document.querySelectorAll(".word2");
words.forEach((word) => {
  let letters = word.textContent.split("");
  word.textContent = "";
  letters.forEach((letter) => {
    let span = document.createElement("span");
    span.textContent = letter;
    span.className = "letter";
    word.append(span);
  });
});
words2.forEach((word) => {
  let letters = word.textContent.split("");
  word.textContent = "";
  letters.forEach((letter) => {
    let span = document.createElement("span");
    span.textContent = letter;
    span.className = "letter";
    word.append(span);
  });
});
let currentWordIndex = 0;
let currentWordIndex2 = 0;
let maxWordIndex = words.length - 1;
let maxWordIndex2 = words2.length - 1;
words[currentWordIndex].style.opacity = "1";
words2[currentWordIndex2].style.opacity = "1";
let rotateText = () => {
  let currentWord = words[currentWordIndex];
  let currentWord2 = words2[currentWordIndex2];
  let nextWord =
    currentWordIndex === maxWordIndex ? words[0] : words[currentWordIndex + 1];
  let nextWord2 =
    currentWordIndex2 === maxWordIndex2
      ? words2[0]
      : words2[currentWordIndex2 + 1];
  // rotate out letters of current word
  Array.from(currentWord.children).forEach((letter, i) => {
    setTimeout(() => {
      letter.className = "letter out";
    }, i * 80);
  });
  Array.from(currentWord2.children).forEach((letter, i) => {
    setTimeout(() => {
      letter.className = "letter out";
    }, i * 80);
  });
  // reveal and rotate in letters of next word
  nextWord.style.opacity = "1";
  nextWord2.style.opacity = "1";
  Array.from(nextWord.children).forEach((letter, i) => {
    letter.className = "letter behind";
    setTimeout(() => {
      letter.className = "letter in";
    }, 340 + i * 80);
  });
  Array.from(nextWord2.children).forEach((letter, i) => {
    letter.className = "letter behind";
    setTimeout(() => {
      letter.className = "letter in";
    }, 340 + i * 80);
  });
  currentWordIndex =
    currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
  currentWordIndex2 =
    currentWordIndex2 === maxWordIndex2 ? 0 : currentWordIndex2 + 1;
};
rotateText();
setInterval(rotateText, 4000);
