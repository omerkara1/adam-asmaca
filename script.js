const word_el = document.getElementById("word");
const popup = document.getElementById("popup-container");
const message_el = document.getElementById("success-message");
const wrongLetters_el = document.getElementById("wrong-letters");
const items = document.querySelectorAll(".item");
const message = document.getElementById("message");
const PlayAgainBtn = document.getElementById("play-again");
const score = document.getElementById("point");

const correctLetters = [];
const wrongLetters = [];
let selectedWord = getRandomWord();
let gamePoint = 100;

// rastgele kelime seçme
function getRandomWord() {
  const words = [
    "java",
    "python",
    "at",
    "kotlın",
    "yuzuk",
    "polat",
    "alemdar",
    "mematı",
    "abdulhey",
    "savunma",
    "ıka",
    "unmanned",
  ];
  return words[Math.floor(Math.random() * words.length)];
}

// Ekrana kelimeleri gösterme
function displayWord() {
  word_el.innerHTML = `
        ${selectedWord
          .split("")
          .map(
            (letter) => `
            <div class="letter">
                ${correctLetters.includes(letter) ? letter : ""}
            </div>
        `
          )
          .join("")}
    
    
    `;
  addToLS({ value: gamePoint });
  check();
}

// hatalı harf kontrolü
function updateWrongLetters() {
  wrongLetters_el.innerHTML = `
        ${wrongLetters.length > 0 ? "<h3>Hatalı Harfler</h3>" : ""}
        ${wrongLetters.map((letter) => `<span> ${letter} </span>`)}
    
    `;
  // yanlış harfte adamın asılması için itemleri dolaşıp ekrana çıkartmak için foreach ile items'i dolaşmak
  items.forEach((item, index) => {
    const errorCount = wrongLetters.length;

    if (index < errorCount) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });

  addToLS({ value: gamePoint });
  check();
}

// puan hesaplama
function check() {
  // ls veriyi çağırdık. dolu mu boş mu kontrol ettik eğer boş ve geçersizse çalışmayacak
  let pointGame = getFromLS();

  if (pointGame.value === undefined || pointGame.value === null) return;
  // oyunu kaybettiniz mesajının gösterilmesi
  if (wrongLetters.length === items.length) {
    popup.style.display = "flex";
    message_el.innerText = "Maalesef Kaybettiniz :(";
    score.innerText = `Puanınız: ${pointGame.value < 0 ? 0 : pointGame.value}`;
    return;
  }

  const w = word_el.innerText.replace(/\n/g, "");
  if (w === selectedWord) {
    popup.style.display = "flex";
    message_el.innerText = "Tebrikler kazandınız :)";
    score.innerText = `Puanınız: ${
      pointGame.value > 100 ? 100 : pointGame.value
    }`;
    return;
  }
}

// * LOCAL STORAGE EKLEME
function addToLS(value) {
  // * LS eklerken ilk başta belirlediğimiz key(anahtar) sonrada value(değer) girilir
  localStorage.setItem("pointt", JSON.stringify(value));
}

// * LOCAL STORAGE'DAN VERİ ÇAĞIRMA/ GETİRME
function getFromLS() {
  // * veri getirilirken de sadece key girilir
  return JSON.parse(localStorage.getItem("pointt"));
}

function displayMessage() {
  message.classList.add("show");

  setTimeout(function () {
    message.classList.remove("show");
  }, 2000);
}

PlayAgainBtn.addEventListener("click", function () {
  correctLetters.splice(0);
  wrongLetters.splice(0);

  selectedWord = getRandomWord();
  displayWord();
  updateWrongLetters();

  popup.style.display = "none";
});

window.addEventListener("keydown", function (e) {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;

    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        displayMessage();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        gamePoint -= 20;
        updateWrongLetters();
      } else {
        displayMessage();
      }
    }
  }
});

displayWord();
