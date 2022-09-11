var airspace = document.querySelector("object#airspace");
var elements;
var input = document.querySelector("input");
input.addEventListener("input", updateValue);
// const dangerAreas = document.getElementById("danger_areas")
// dangerAreas.addEventListener("input", toggleOverlay)
// const aar = document.getElementById("aar")
// aar.addEventListener("input", toggleOverlay)
// const tras = document.getElementById("tras")
// tras.addEventListener("input", toggleOverlay)
var overlays = document.querySelectorAll('#options > div > input');
for (var _i = 0, overlays_1 = overlays; _i < overlays_1.length; _i++) {
    var overlay = overlays_1[_i];
    console.log(overlay);
    overlay.addEventListener("input", toggleOverlay);
}
window.onload = function () {
    /**SVG is not available until the window has loaded */
    elements = airspace.contentWindow.document.querySelectorAll("polygon");
    showTooltip();
};
function toggleOverlay(e) {
    airspace.contentWindow.document.getElementById(e.target.value).style.display = e.target.checked ? "" : "none";
}
function updateValue() {
    var height = input.value;
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var element = elements_1[_i];
        if (element.dataset.min || element.dataset.max) {
            console.log(height, element.dataset.min, element.dataset.max);
            if (element.dataset.min > height || element.dataset.max < height) {
                element.setAttribute("display", "none");
            }
            else {
                console.log("here");
                element.removeAttribute("display");
            }
        }
    }
}
function showTooltip() {
    var tooltip = document.getElementById("tooltip");
    for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
        var el = elements_2[_i];
        el.addEventListener("mouseover", over);
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseout", out);
    }
    function over() {
        tooltip.style.opacity = "0.6";
    }
    function move(e) {
        tooltip.style.left = "".concat(Math.max(0, e.pageX - 150), "px");
        tooltip.style.top = "".concat(e.pageY, "px");
    }
    function out() {
        tooltip.style.opacity = "0";
    }
}
