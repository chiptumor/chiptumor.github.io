const buildData = JSON.parse(
  document.getElementById("build-data").textContent
);

function getRelativeDate(date) {
  const ago = Date.now() - date;

  const frame = {};
  frame.second = 1000;
  frame.minute = frame.second * 60;
  frame.hour = frame.minute * 60;
  frame.day = frame.hour * 24;
  frame.week = frame.day * 7;
  frame.month = frame.week * 4;
  frame.year = frame.month * 12;

  const items = Object.entries(frame);
  
  for (let i = items.length - 1; i >= 0; i--) {
    const [ label, unit ] = items[i];

    if (ago < unit) continue;
    
    const span = Math.floor(ago / unit);
    return `${span} ${label}${ span > 1 ? "s" : "" } ago`;
  }

  return "Just now";
}

window.addEventListener("load", () => {
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
  })
});
