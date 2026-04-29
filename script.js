console.log("🚀 NEW DEPLOYMENT VERSION ACTIVE");

// Elements
const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");
const loading = document.getElementById("loading");

const apiURL = "https://api.lyrics.ovh";

let lastSearch = "";

/* ---------------------------
   Load last search on refresh
---------------------------- */
window.addEventListener("load", () => {
  const last = localStorage.getItem("lastSearch");
  if (last) {
    search.value = last;
    lastSearch = last;
    searchSongs(last);
  }
});

/* ---------------------------
   Search form submit
---------------------------- */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const term = search.value.trim();
  if (!term) return;

  lastSearch = term;
  localStorage.setItem("lastSearch", term);

  loading.style.display = "block";
  searchSongs(term);
});

/* ---------------------------
   Fetch songs
---------------------------- */
async function searchSongs(term) {
  try {
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();

    loading.style.display = "none";

    if (!data.data || data.data.length === 0) {
      result.innerHTML = "<p>No results found 😕</p>";
      return;
    }

    showSongs(data);
  } catch (err) {
    loading.style.display = "none";
    result.innerHTML = "<p>Something went wrong. Try again.</p>";
  }
}

/* ---------------------------
   Render song list
---------------------------- */
function showSongs(data) {
  result.innerHTML = `
    <ul class="songs">
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

/* ---------------------------
   Click handler (lyrics + back)
---------------------------- */
result.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  // Lyrics button
  if (btn.dataset.artist && btn.dataset.song) {
    getLyrics(btn.dataset.artist, btn.dataset.song);
    return;
  }

  // Back button
  if (btn.id === "backBtn") {
    searchSongs(lastSearch);
  }
});

/* ---------------------------
   Get lyrics view
---------------------------- */
async function getLyrics(artist, song) {
  try {
    const res = await fetch(`${apiURL}/v1/${artist}/${song}`);
    const data = await res.json();

    result.innerHTML = `
      <button id="backBtn" class="btn">← Back</button>
      <h2>${artist} - ${song}</h2>
      <p>${data.lyrics || "No lyrics found"}</p>
    `;

    more.innerHTML = "";
  } catch (err) {
    result.innerHTML = `
      <button id="backBtn" class="btn">← Back</button>
      <p>Error loading lyrics.</p>
    `;
  }
}