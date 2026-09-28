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
  const bannerDatetime = banner.querySelector(".datetime").textContent;

  banner.querySelector("time.relative").textContent
    = getRelativeDate(Date.parse(bannerDatetime));
  banner.querySelector("time.absolute").textContent
    = new Date(bannerDatetime).toLocaleString();
    
  const status = document.getElementById("status");
  const statusDatetime = status.querySelector(".datetime").textContent;

  status.querySelector("time .relative").textContent
    = getRelativeDate(Date.parse(statusDatetime));
  status.querySelector("time .absolute").textContent
    = new Date(statusDatetime).toLocaleString();
});
