var airspace = document.querySelector("object#airspace");
var uk = document.querySelector("object#uk");
var elements;
/**SVG is not available until the window has loaded */
window.onload = function () {
    elements = airspace.contentWindow.document.querySelectorAll("polygon, path, circle");
    showTooltip();
    panzoom();
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
function panzoom() {
    var transformMatrix = [1, 0, 0, 1, 0, 0];
    var svgAirspace = airspace.contentWindow.document.querySelector("svg");
    var svgUK = uk.contentWindow.document.querySelector("svg");
    var viewbox = svgAirspace.getAttributeNS(null, "viewBox").split(" ");
    var centerX = parseFloat(viewbox[2]) / 2;
    var centerY = parseFloat(viewbox[3]) / 2;
    var matrixGroupAirspace = svgAirspace.querySelector("g");
    var matrixGroupUK = svgUK.querySelector("g");
    var offset, transformAirspace, transformUK;
    var panning = false;
    airspace.contentWindow.document.addEventListener("wheel", zoom);
    airspace.contentWindow.document.addEventListener("mousedown", startDrag);
    airspace.contentWindow.document.addEventListener("mousemove", drag);
    airspace.contentWindow.document.addEventListener("mouseup", endDrag);
    airspace.contentWindow.document.addEventListener("mouseleave", endDrag);
    function startDrag(evt) {
        panning = true;
        offset = getMousePosition(evt);
        // Get all the transforms currently on this element
        var transformsAirspace = matrixGroupAirspace.transform.baseVal;
        // Ensure the first transform is a translate transform
        if (transformsAirspace.length === 0 ||
            transformsAirspace.getItem(0).type !==
                SVGTransform.SVG_TRANSFORM_TRANSLATE) {
            // Create an transform that translates by (0, 0)
            var translateAispace = svgAirspace.createSVGTransform();
            translateAispace.setTranslate(0, 0);
            // Add the translation to the front of the transforms list
            matrixGroupAirspace.transform.baseVal.insertItemBefore(translateAispace, 0);
        }
        // Get initial translation amount
        transformAirspace = transformsAirspace.getItem(0);
        // Get all the transforms currently on this element
        var transformsUK = matrixGroupUK.transform.baseVal;
        // Ensure the first transform is a translate transform
        if (transformsUK.length === 0 ||
            transformsUK.getItem(0).type !==
                SVGTransform.SVG_TRANSFORM_TRANSLATE) {
            // Create an transform that translates by (0, 0)
            var translateUK = svgUK.createSVGTransform();
            translateUK.setTranslate(0, 0);
            // Add the translation to the front of the transforms list
            matrixGroupUK.transform.baseVal.insertItemBefore(translateUK, 0);
        }
        // Get initial translation amount
        transformUK = transformsUK.getItem(0);
        offset.x -= transformAirspace.matrix.e;
        offset.y -= transformAirspace.matrix.f;
    }
    function drag(evt) {
        if (panning) {
            evt.preventDefault();
            var coord = getMousePosition(evt);
            transformAirspace.setTranslate(coord.x - offset.x, coord.y - offset.y);
            transformUK.setTranslate(coord.x - offset.x, coord.y - offset.y);
        }
    }
    function endDrag(evt) {
        panning = false;
    }
    function getMousePosition(evt) {
        var CTM = svgAirspace.getScreenCTM();
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }
    function pan(dx, dy) {
        transformMatrix[4] += dx;
        transformMatrix[5] += dy;
        var newMatrix = "matrix(" + transformMatrix.join(" ") + ")";
        matrixGroupAirspace.setAttributeNS(null, "transform", newMatrix);
        matrixGroupUK.setAttributeNS(null, "transform", newMatrix);
    }
    function zoom(evt) {
        var scale = evt.deltaY < 0 ? 1.25 : 0.8;
        for (var i = 0; i < 4; i++) {
            transformMatrix[i] *= scale;
        }
        // var offset = getMousePosition(evt)
        // transformMatrix[4] += (1 - scale) * centerX;
        // transformMatrix[5] += (1 - scale) * centerY;
        var newMatrix = "matrix(" + transformMatrix.join(" ") + ")";
        svgAirspace.setAttributeNS(null, "transform", newMatrix);
        svgUK.setAttributeNS(null, "transform", newMatrix);
    }
}
