const images = require('images');
function render(viewport, element) {
    if (element.style) {
        let img = images(element.style.width, element.style.height || 1000);

        if (element.style["background-color"]) {
            /**@type string */
            let color = element.style["background-color"];
            color.match(/rgb\((\d+),(\d+),(\d+)\)/);
            img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3));

            viewport.draw(img, element.style.left || 0, element.style.right || 0);
            // viewport.draw(img, element.style.left || 0, element.style.right || 0);
        }
    }

    if (element.children) {
        for (const child of element.children) {
            render(viewport, child)
        }
    }

}

module.exports = render;