console.log("🚀 NEW DEPLOYMENT VERSION ACTIVE");
window.addEventListener("load", () => {
  const last = localStorage.getItem("lastSearch");
  if (last) {
    search.value = last;
    searchSongs(last);
  }
});

const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");
const loading = document.getElementById("loading");

const apiURL = "https://api.lyrics.ovh";

let lastSearch = "";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const term = search.value.trim();
  if (!term) return;

  lastSearch = term;
  localStorage.setItem("lastSearch", term);

  loading.style.display = "block";

  searchSongs(term);
});

async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  loading.style.display = "none";
  showSongs(data);
}

function showSongs(data) {
  result.innerHTML = `
    <ul>
      ${data.data
        .map(
          (song) => `
        <li>
          <strong style="color:#8d56fd">${song.artist.name}</strong> - ${song.title}
          <button class="btn" 
            data-artist="${song.artist.name}" 
            data-song="${song.title}">
            Get Lyrics
          </button>
        </li>
      `
        )
        .join("")}
    </ul>
  `;
}

result.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const artist = e.target.dataset.artist;
    const song = e.target.dataset.song;

    getLyrics(artist, song);

    const backBtn = document.createElement("button");
    backBtn.textContent = "← Back";
    backBtn.className = "btn";

    backBtn.addEventListener("click", () => {
      searchSongs(lastSearch);
    });

    result.prepend(backBtn);
  }
});

async function getLyrics(artist, song) {
  const res = await fetch(`${apiURL}/v1/${artist}/${song}`);
  const data = await res.json();

  result.innerHTML = `
    <h2>${artist} - ${song}</h2>
    <p>${data.lyrics || "No lyrics found"}</p>
  `;

  more.innerHTML = "";
}