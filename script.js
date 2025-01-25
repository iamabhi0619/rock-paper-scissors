let us = 0;
let cs = 0;
let tie = 0;
let t = ["rock", "paper", "scissors"];
let namePlace = document.querySelector(".userArea h2");
let name = null;
name = prompt("Enter Your Name..!!");
namePlace.innerHTML = `${name ? name : "Player"} `;

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const choiceButtons = document.querySelectorAll(".choiceButton");
const choiceArea = document.querySelector(".choiceArea");
const userScore = document.querySelector(".score .user");
const compScore = document.querySelector(".score .computer");
const tieScore = document.querySelector(".tie span");
const resultArea = document.querySelector(".result-section");
const nextBtn = document.querySelector("#nextButton");
const userChoiceText = document.querySelector(".userArea p");
const compChoiceText = document.querySelector(".compArea p");
choiceButtons.forEach((button) => {
  button.addEventListener("click", function () {
    let userChoice = button.classList.contains("rock")
      ? "rock"
      : button.classList.contains("paper")
      ? "paper"
      : "scissors";
    checkResult(userChoice);
  });
});
const checkResult = async (user_choice) => {
  choiceArea.style.display = "none";
  let comp_choice = t[Math.floor(Math.random() * 3)];
  await changeHand(user_choice, comp_choice);

  if (user_choice === comp_choice) {
    document.getElementById("result").innerText = "It's a tie!";
    tie++;
  } else if (user_choice === "paper") {
    if (comp_choice === "rock") {
      document.getElementById("result").innerText =
        "You Win!! Paper covers the Rock";
      us++;
    } else {
      document.getElementById("result").innerText =
        "You Lose!! Scissors cuts the Paper";
      cs++;
    }
  } else if (user_choice === "rock") {
    if (comp_choice === "scissors") {
      document.getElementById("result").innerText =
        "You Win!! Rock smashes the Scissors";
      us++;
    } else {
      document.getElementById("result").innerText =
        "You Lose!! Paper covers the Rock";
      cs++;
    }
  } else if (user_choice === "scissors") {
    if (comp_choice === "paper") {
      document.getElementById("result").innerText =
        "You Win!! Scissors cuts the Paper";
      us++;
    } else {
      document.getElementById("result").innerText =
        "You Lose!! Rock smashes the Scissors";
      cs++;
    }
  }
  userScore.innerHTML = us;
  compScore.innerHTML = cs;
  tieScore.innerHTML = tie;
  resultArea.style.display = "block";
  nextBtn.disabled = true;
  nextBtn.style.opacity = "0.7";
  setTimeout(() => {
    nextBtn.disabled = false;
    nextBtn.style.opacity = "1";
  }, 2000);
};

nextBtn.addEventListener("click", () => {
  // Reset the game area for the next round
  choiceArea.style.display = "block";
  resultArea.style.display = "none";

  // Reset hand icons to default
  document.querySelector(".userArea i").classList =
    "fa-solid fa-hand-fist u-hand";
  document.querySelector(".userArea i").style.transform = "rotate(0deg)";
  document.querySelector(".compArea i").classList =
    "fa-solid fa-hand-fist c-hand";
  document.querySelector(".compArea i").style.transform = "rotate(0deg)";
  userChoiceText.innerHTML = "";
  compChoiceText.innerHTML = "";
});

const changeHand = async (user_choice, comp_choice) => {
  let computerHand = document.querySelector(".compArea i");
  let userHand = document.querySelector(".userArea i");
  userChoiceText.innerHTML = capitalizeFirstLetter(user_choice);
  compChoiceText.innerHTML = capitalizeFirstLetter(comp_choice);
  if (user_choice == "rock") {
    userHand.classList = "fa-solid fa-hand-back-fist gameHand";
    userHand.style.transform = "rotate(90deg)";
  } else if (user_choice == "paper") {
    userHand.classList = "fa-solid fa-hand gameHand";
    userHand.style.transform = "rotate(90deg)";
  } else if (user_choice == "scissors") {
    userHand.classList = "fa-solid fa-hand-scissors gameHand";
    userHand.style.transform = "rotate(180deg)";
    userHand.style.transform = "scaleX(-1)";
  }
  if (comp_choice == "rock") {
    computerHand.classList = "fa-solid fa-hand-back-fist gameHand";
    computerHand.style.transform = "rotate(-90deg)";
  } else if (comp_choice == "paper") {
    computerHand.classList = "fa-solid fa-hand gameHand";
    computerHand.style.transform = "rotate(-90deg)";
  } else if (comp_choice == "scissors") {
    computerHand.classList = "fa-solid fa-hand-scissors gameHand";
    computerHand.style.transform = "rotate(0deg)";
  }
};
