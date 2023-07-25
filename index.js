window.addEventListener("load", () => {
  let chars = [];

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
    if (!e.target.classList.contains("grayed")) return;
    e.target.classList.remove("grayed");
    let x = e.target.innerText;
    let a = "";
    x.split("").forEach((letter) => {
      a += letter;
      getChars(a, e);
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

  async function getChars(letters, elem) {
    if (!letters) return;
    chars = [];
    await fetch(`http://ccdb.hemiola.com/characters/cantonese/${letters.toLowerCase()}`).then((r) => r.json()).then((d) => {
      d.forEach((c) => chars.push(c.string));
      if (elem && chars.length > 0) elem.target.innerText = chars[getRandomInt(0, chars.length)] + " ";
    });
  }
});