var airspace = document.querySelector("object#airspace");
var elements;
/**SVG is not available until the window has loaded */
window.onload = function () {
    elements = airspace.contentWindow.document.querySelectorAll("polygon, path, circle");
    showTooltip();
};
/**Overlay toggle */
var overlays = document.querySelectorAll("#options > div > input");
for (var _i = 0, overlays_1 = overlays; _i < overlays_1.length; _i++) {
    var overlay = overlays_1[_i];
    overlay.addEventListener("input", toggleOverlay);
}
function toggleOverlay(e) {
    airspace.contentWindow.document.getElementById(e.target.value).style.display =
        e.target.checked ? "" : "none";
}
/**Height selector */
var input = document.querySelector("input");
input.addEventListener("input", updateValue);
function updateValue() {
    var height = +input.value;
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var el = elements_1[_i];
        if (el.dataset.min && el.dataset.max) {
            if (+el.dataset.min > height || +el.dataset.max < height) {
                el.setAttribute("display", "none");
            }
            else {
                el.setAttribute("display", "");
            }
        }
    }
}
/**Mouse-over tooltip */
function showTooltip() {
    var tooltip = document.getElementById("tooltip");
    var _loop_1 = function (el) {
        el.addEventListener("mouseover", function () {
            over(el);
        });
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseout", out);
    };
    for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
        var el = elements_2[_i];
        _loop_1(el);
    }
    function over(el) {
        var fillin = "\n";
        if (el.dataset["class"]) {
            fillin = "".concat(fillin, "Class: ").concat(el.dataset["class"], "\n");
        }
        if (el.dataset.type) {
            fillin = "".concat(fillin, "Type: ").concat(el.dataset.type, "\n");
        }
        tooltip.style.opacity = "0.6";
        tooltip.innerText =
            el.id + fillin + el.dataset.lower + "-" + el.dataset.upper;
        if (el.dataset.lower) {
        }
    }
    function move(e) {
        tooltip.style.left = "".concat(Math.max(0, e.pageX - 150), "px");
        tooltip.style.top = "".concat(e.pageY, "px");
    }
    function out() {
        tooltip.style.opacity = "0";
    }
}
