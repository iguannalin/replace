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

  function connectWord(e) {
    e.preventDefault();
    if (!e.target.classList.contains("grayed")) return;
    e.target.classList.remove("grayed");
    let x = e.target.innerText;
    let a = "";
    x.split("").forEach((letter, index) => {
      if (letter == " ") return;
      a += letter;
      if (index > 2 && chars.length < 1) a = a.substring(1, index); // if still no results found, change word around
      getChars(a, e);
    });
  }

  async function getChars(letters, elem) {
    if (!letters) return;
    chars = [];
    await fetch(`https://seasons986.pythonanywhere.com/?letter=${letters.toLowerCase()}`, {
      mode: "cors", // no-cors, *cors, same-origin,
      headers: {
        "Content-Type": "application/json",
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
    .then((r) => r.json()).then((d) => {
      d.forEach((c) => chars.push(c.string));
      if (elem && chars.length > 0) elem.target.innerText = chars[getRandomInt(0, chars.length)] + " ";
    });
  }
});