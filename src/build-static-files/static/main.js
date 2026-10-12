const buildData = JSON.parse(
  document.getElementById("build-data").textContent
);

const rtf = new Intl.RelativeTimeFormat();

function getRelativeDate(date) {
  const elapsed = Date.now() - date;

  const msPer = {};
  msPer.second = 1000;
  msPer.minute = msPer.second * 60;
  msPer.hour = msPer.minute * 60;
  msPer.day = msPer.hour * 24;
  msPer.week = msPer.day * 7;
  msPer.month = msPer.day * 30;
  msPer.year = msPer.day * 365;

  const units = Object.entries(msPer);
  
  for (let i = units.length - 1; i >= 0; i--) {
    const [ name, ms ] = units[i];

    if (elapsed < ms) continue;
    
    const count = Math.floor(elapsed / ms);
    return rtf.format(-count, name);
  }

  return "Just now";
}

window.addEventListener("load", () => {
  // display dynamic content dates

  const banner = document.getElementById("banner");
  const { bannerDate } = buildData;

  banner.querySelector("time.relative").textContent
    = getRelativeDate(Date.parse(bannerDate));
  banner.querySelector("time.absolute p").textContent
    = new Date(bannerDate).toLocaleString();
    
  const status = document.getElementById("status");
  const { statusDate } = buildData;

  status.querySelector("time .relative").textContent
    = getRelativeDate(Date.parse(statusDate));
  status.querySelector("time .absolute").textContent
    = new Date(statusDate).toLocaleString();

  // make banner properly interactable

  const details = banner.querySelector("details");
  const detailsButton = banner.querySelector(".expand-collapse");

  banner.addEventListener("click", event => {
    if (!details.open) {
      event.preventDefault();
      details.open = true;
    }
  });

  detailsButton.addEventListener("click", event => {
    if (details.open) {
      details.open = false;
      event.stopPropagation();
    }
  });
  
  // add splash text

  const { splashes } = buildData;
  
  const splash = getSplash(splashes);

  function getSplash(array) {
    const item = array[Math.floor(Math.random() * array.length)];
    if (typeof item === "string")
      return item;
    else
      return getSplash(item);
  }

  const splashElement = document.querySelector("main > hgroup p");

  splashElement.textContent = "";
  splashElement.ariaLabel = splash;
  
  const spans = Array.from(splash).map((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.ariaHidden = "true";
    span.style.setProperty("--delay", i);
    return span;
  });

  splashElement.append(...spans);

  // playlist functionality

  const playerElement = document.getElementById("music-player");

  const isOpen = () => playerElement.classList.contains("open");

  playerElement.addEventListener("click", event => {
    if (!isOpen()) {
      event.preventDefault();
      playerElement.classList.add("open");
    }
  });

  playerElement.querySelector(".expand-collapse")
    .addEventListener("click", event => {
      if (isOpen()) {
        playerElement.classList.remove("open");
        event.stopPropagation();
      }
    });

  const audio = playerElement.querySelector("audio");
  const playlist = (() => {
    const array = Object.entries(buildData.playlist);
    const shuffled = [];

    while (array.length) {
      const index = Math.floor(Math.random() * array.length);
      shuffled.push(array.splice(index, 1)[0]);
    }

    return shuffled;
  })();

  const loadingText = "\u2022 \u2022 \u2022";

  function formatTime(total) {
    const seconds = Math.floor(total % 60);
    const minutes = Math.floor(total / 60);
    return String(minutes) + ":" + String(seconds).padStart(2, "0");
  }

  const sel = query => playerElement.querySelector(query);

  const element = {
    title: sel(".meta .title"),
    artist: sel(".meta .artist"),
    quote: sel("blockquote"),
    controls: {
      playPause: sel(".controls .play-pause"),
      prev: sel(".controls .prev"),
      next: sel(".controls .next")
    },
    duration: {
      elapsed: sel(".duration .elapsed"),
      remaining: sel(".duration .remaining"),
      total: sel(".duration .right")
    },
    progress: sel(".progress div")
  }

  const player = {
    index: 0,
    get song() {
      const song = playlist[player.index];
      return {
        file: song[0],
        info: song[1]
      };
    }
  };

  function loadSong() {
    audio.src = "/res/playlist/" + player.song.file;
    audio.currentTime = 0;
    updateTime();
  }

  function updateTime() {
    if (isNaN(audio.duration)) {
      [ "elapsed", "remaining", "total" ].forEach(i =>
        element.duration[i].innerText = loadingText
      );
      element.progress.style.setProperty("--progress", 0);

      return;
    }

    element.duration.elapsed.innerText
      = formatTime(audio.currentTime);
    element.duration.remaining.innerText
      = formatTime(audio.duration - audio.currentTime);
    element.duration.total.innerText
      = formatTime(audio.duration);
    element.progress.style.setProperty("--progress",
      audio.currentTime / audio.duration
    );
  }

  function updateInfo() {
    if (isNaN(audio.duration)) {
      element.title.innerText = loadingText;
      element.artist.innerText = loadingText;

      return;
    }

    const { file, info } = player.song;

    if (info.url) {
      const anchor = document.createElement("a");
      anchor.href = info.url;
      anchor.innerText = info.title;
      element.title.replaceChildren(anchor);
    } else {
      element.title.innerText = info.title;
    }

    const fullArtist = [];

    let artistName = info.artist.name;
    if (info.type) artistName += info.type;

    let artist;
    if (info.artist.url) {
      artist = document.createElement("a");
      artist.href = info.artist.url;
      artist.innerText = artistName;
    } else {
      artist = artistName;
    }

    fullArtist.push(artist);

    if (info.type) {
      fullArtist.push(" (");

      const { original } = info;

      let originalText;
      if (original.url) {
        originalText = document.createElement("a");
        originalText.href = original.url;
        originalText.innerText = "Original";
      } else {
        originalText = "Original";
      }

      fullArtist.push(originalText, " by ");

      let artist;
      if (original.artist.url) {
        artist = document.createElement("a");
        artist.href = original.artist.url;
        artist.innerText = original.artist.name;
      } else {
        artist = original.artist.name;
      }

      fullArtist.push(artist, ")");
    }
    
    element.artist.replaceChildren(...fullArtist);

    element.quote.innerHTML = info.comments;
  }

  function navNext() {
    if (player.index !== playlist.length - 1)
      player.index++;
    else
      player.index = 0;

    loadSong();
    
    if (!element.controls.playPause.classList.contains("paused"))
      audio.play();
  }

  function navPrev() {
    if (player.index !== 0)
      player.index--;
    else
      player.index = playlist.length - 1;

    loadSong();

    if (!element.controls.playPause.classList.contains("paused"))
      audio.play();
  }

  audio.volume = 0.5;

  loadSong();

  audio.addEventListener("loadedmetadata", () => {
    updateInfo();
    updateTime();
  });
  audio.addEventListener("timeupdate", updateTime);
  audio.addEventListener("ended", navNext);
  audio.addEventListener("play", () =>
    element.controls.playPause.classList.remove("paused")
  );
  audio.addEventListener("pause", () =>
    element.controls.playPause.classList.add("paused")
  );
  audio.addEventListener("error", error => {
    window.alert("PLAYLIST ERROR! Please check console for more information.");
    console.error(
      "Audio element fired the \"error\" event, which can't be good."
      + "\n\nThe error can be found below; if you may please, contact me and"
      + "share it. I'd be grateful."
    )
    console.info(error);
  });

  element.controls.prev.addEventListener("click", navPrev);
  element.controls.next.addEventListener("click", navNext);
  element.controls.playPause.addEventListener("click", () => {
    if (element.controls.playPause.classList.contains("paused")) {
      audio.play();
      element.controls.playPause.classList.remove("paused");
    } else {
      audio.pause();
      element.controls.playPause.classList.add("paused");
    }
  });

  navigator.mediaSession.setActionHandler("play", () =>
    audio.play().catch(console.error)
  );
  navigator.mediaSession.setActionHandler("pause", () => audio.pause());
  navigator.mediaSession.setActionHandler("previoustrack", navPrev);
  navigator.mediaSession.setActionHandler("nexttrack", navNext);
});
