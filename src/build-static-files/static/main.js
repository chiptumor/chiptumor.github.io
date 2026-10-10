const buildData = JSON.parse(
  document.getElementById("build-data").textContent
);

const rtf = new Intl.RelativeTimeFormat("best fit", {
  numeric: "auto"
});

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
});
