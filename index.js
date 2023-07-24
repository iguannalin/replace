window.addEventListener("load", () => {
  let chars = [];
  const phElem = document.getElementById("phrase");
  const stElem = document.getElementById("strokes");
  let difficulty = 1;

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  let lines = [];
  // text taken from Project Gutenberg Australia: http://gutenberg.net.au/ebooks02/0201091h.html
  fetch("waves.txt").then((file) => file.text()).then((d) => {
    getLines(d);
  });

  function connectWord(e) {
    e.preventDefault();
    e.target.classList.remove("grayed");
    let x = e.target.innerText;
    console.log(x);
    let a = "";
    x.split("").forEach((letter) => {
      a += letter;
      getChars(a).then(() => {
        console.log(chars);
      });
    });
  }

  function getLines(t) {
    let div = document.getElementById("poem");
    let wmax = 350;
    let r = getRandomInt(wmax, t.length);
    let line = t.substring(r-wmax, r);
    line.split(" ").forEach((word, index) => {
      if (index < wmax) {
        lines.push(word);
        let span = document.createElement("a");
        span.innerHTML = (word.trim() + " ");
        span.classList = "grayed";
        span.onclick = connectWord;
        div.appendChild(span);
      }
    })
  }

  async function getChars(letters) {
    if (!letters) return;
    chars = [];
    await fetch(`http://ccdb.hemiola.com/characters/cantonese/${letters}`).then((r) => r.json()).then((d) => {
      d.forEach((c) => chars.push(c.string));
    })
  }

  function makePhrase() {
    if (!chars || !chars[2]) return;
    difficulty = difficulty >= 20 ? difficulty = 2 : difficulty + 1;
    phElem.innerHTML = "";
    stElem.innerHTML = difficulty;
    for (let i = 0; i < 4; i++) {
      let x = chars[difficulty][getRandomInt(0, chars[difficulty].length)];
      phElem.innerHTML = phElem.innerText.includes(x) ? i-=1 : phElem.innerHTML + x;
    }
  }
  
  // makePhrase();
  // document.body.addEventListener('click', makePhrase);
});