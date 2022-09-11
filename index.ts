const airspace: HTMLObjectElement = document.querySelector("object#airspace");
var elements: NodeListOf<SVGPolygonElement>;

/**SVG is not available until the window has loaded */
window.onload = () => {
  elements = airspace.contentWindow.document.querySelectorAll("polygon");
  showTooltip();
};

/**Overlay toggle */
const overlays:NodeListOf<HTMLDivElement> = document.querySelectorAll('#options > div > input')
for(const overlay of overlays){
  overlay.addEventListener("input", toggleOverlay)
}

function toggleOverlay(e) {
  airspace.contentWindow.document.getElementById(e.target.value).style.display = e.target.checked ? "" : "none"
}

/**Height selector */
const input = document.querySelector("input")
input.addEventListener("input", updateValue);

function updateValue() {
  const height = input.value;
  for (const element of elements) {
    if (element.dataset.min || element.dataset.max) {
      console.log(height, element.dataset.min, element.dataset.max);
      if (element.dataset.min > height || element.dataset.max < height) {
        element.setAttribute("display", "none");
      } else {
        console.log("here");
        element.removeAttribute("display");
      }
    }
  }
}

/**Mouse-over tooltip */
function showTooltip() {
  var tooltip = document.getElementById("tooltip");
  for (const el of elements){
    el.addEventListener("mouseover", over);
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseout", out);
  }

  function over() {
    tooltip.style.opacity = "0.6"
  }

  function move(e) {
    tooltip.style.left = `${Math.max(0, e.pageX - 150)}px`
    tooltip.style.top = `${e.pageY}px`
  }

  function out() {
    tooltip.style.opacity = "0"
  }
}
