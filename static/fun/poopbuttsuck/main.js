const WORDS = [
  "poop",
  "butt",
  "suck",
  "fuck"
];

const display = document.getElementById("display");

const config = {
  length: 3
};

const currentWords = [];

function getWord() {
  return WORDS[Math.floor(WORDS.length * Math.random())];
}

function makeNewWords() {
  currentWords.length = 0;
  for (let i = 0; i < config.length; i++)
    currentWords.push(getWord());
}

window.addEventListener("load", () => {
  const display = document.getElementById("display");
  
  makeNewWords();
  displayWords();
  
  document.getElementById("more-word").addEventListener("click", e => {
    config.length++;
    if (!currentWords[config.length - 1])
      currentWords.push(getWord());
    displayWords();
  });
  document.getElementById("less-word").addEventListener("click", e => {
    if (config.length > 1)
      config.length--;
    displayWords();
  });
  
  document.getElementById("make").addEventListener("click", () => {
    makeNewWords();
    displayWords();
  });

  function displayWords() {
    let string = currentWords[0];
    for (let i = 1; i < config.length; i++)
      string += " " + currentWords[i];
    display.textContent = string;
  }
});

function displayWords() {
  let string = currentWords[0];
  for (let i = 1; i < config.length; i++)
    string += " " + currentWords[i];
  display.textContent = string;
}
