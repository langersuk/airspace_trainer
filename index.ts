const airspace: HTMLObjectElement = document.querySelector("object#airspace");
var elements: NodeListOf<SVGPolygonElement | SVGPathElement | SVGCircleElement>;

/**SVG is not available until the window has loaded */
window.onload = () => {
  elements = airspace.contentWindow.document.querySelectorAll(
    "polygon, path, circle"
  );
  showTooltip();
};

/**Overlay toggle */
const overlays: NodeListOf<HTMLDivElement> = document.querySelectorAll(
  "#options > div > input"
);
for (const overlay of overlays) {
  overlay.addEventListener("input", toggleOverlay);
}

function toggleOverlay(e) {
  airspace.contentWindow.document.getElementById(e.target.value).style.display =
    e.target.checked ? "" : "none";
}

/**Height selector */
const input = document.querySelector("input");
input.addEventListener("input", updateValue);

function updateValue() {
  const height = +input.value;
  for (const el of elements) {
    if (el.dataset.min && el.dataset.max) {
      if (+el.dataset.min > height || +el.dataset.max < height) {
        el.setAttribute("display", "none");
      } else {
        el.setAttribute("display", "");
      }
    }
  }
}

/**Mouse-over tooltip */
function showTooltip() {
  var tooltip = document.getElementById("tooltip");
  for (const el of elements) {
    el.addEventListener("mouseover", function () {
      over(el);
    });
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseout", out);
  }

  function over(el: SVGPolygonElement | SVGPathElement | SVGCircleElement) {
    let fillin = "\n";
    if (el.dataset.class) {
      fillin = `${fillin}Class: ${el.dataset.class}\n`
    }
    if (el.dataset.type) {
      fillin = `${fillin}Type: ${el.dataset.type}\n`
    }
    tooltip.style.opacity = "0.6";
    tooltip.innerText =
      el.id + fillin + el.dataset.lower + "-" + el.dataset.upper;
    if (el.dataset.lower) {
    }
  }

  function move(e) {
    tooltip.style.left = `${Math.max(0, e.pageX - 150)}px`;
    tooltip.style.top = `${e.pageY}px`;
  }

  function out() {
    tooltip.style.opacity = "0";
  }
}