
const G = document.getElementById.bind(document);
const Q = document.querySelectorAll.bind(document);
const C = document.createElement.bind(document);

const colors = 'aqua, black, blue, fuchsia, gray, green, lime, maroon, navy, purple, red, silver, teal, white, yellow'.split(', ');

function change_title() {
    let new_title = G("input").value;
    document.title = new_title;
    console.log('Title changed to "' + new_title + '"');
    document.activeElement.blur();
    return false;
}

function create_icon(fill, stroke) {
    const canvas = document.createElement('canvas');
    canvas.height = 64;
    canvas.width = 64;
    const context = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 30;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = fill;
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = stroke;
    context.stroke();
    return canvas;
}

function create_options(div) {
    console.log(colors);
    for(let i = 0; i < colors.length; i++) {
        let canvas = create_icon(colors[i], colors[i]);
        canvas.addEventListener("click", () => {change_favicon(colors[i], colors[i]);});
        div.appendChild(canvas);
    }
}

function main() {
    G("form").onsubmit = change_title;
    change_favicon('red', 'red');
    create_options(G("options"));
}

function set_icon_to_canvas(canvas) {
    const link = C('link');
    const oldLinks = Q('link[rel="shortcut icon"]');
    oldLinks.forEach(e => e.parentNode.removeChild(e));
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL();
    document.head.appendChild(link);
}

function change_favicon(fill, stroke) {
    let canvas = create_icon(fill, stroke);
    set_icon_to_canvas(canvas);
}

window.addEventListener('DOMContentLoaded', (event) => {
    main();
});
