
const G = document.getElementById.bind(document);
const Q = document.querySelectorAll.bind(document);
const C = document.createElement.bind(document);

const colors = '#BF360C #E53935 #F57F17 #FBC02D #D81B60 #8E24AA #5E35B1 #3949AB #1E88E5 #0D47A1 #00897B #1B5E20 #607D8B #757575 #000000'.split(' ');

let bg_color = '#E53935';
let bd_color = '#E53935';

function update_title() {
    let input = G("input");
    let new_title = input.value;
    if (input.value === "") {
        new_title = "Title";
    }
    document.title = new_title;
    set_params();
    return new_title;
}

function change_title() {
    let input = G("input");
    let new_title = update_title();
    console.log('Title changed to "' + new_title + '"');
    input.placeholder = new_title;
    input.value = "";
    input.blur();
    return false;
}

function create_dot(fill, stroke) {
    const elem = C('span');
    elem.style.backgroundColor = fill;
    elem.style.borderColor = stroke;
    elem.classList.add('dot');
    return elem;
}

function create_icon(fill, stroke) {
    const canvas = C('canvas');
    canvas.height = 64;
    canvas.width = 64;
    const context = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 24;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = fill;
    context.fill();
    context.lineWidth = 12;
    context.strokeStyle = stroke;
    context.stroke();
    return canvas;
}

function create_options(options) {
    console.log(colors);
    let div = C("div");
    for(let i = 0; i < colors.length; i++) {
        let elem = create_dot(colors[i], colors[i]);
        elem.addEventListener("click", () => {change_favicon(colors[i], undefined);});
        div.appendChild(elem);
    }
    options.appendChild(div);
    let border = C("div");
    for(let i = 0; i < colors.length; i++) {
        let elem = create_dot("transparent", colors[i]);
        elem.addEventListener("click", () => {change_favicon(bg_color, colors[i]);});
        border.appendChild(elem);
    }
    options.appendChild(border);
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
    if (stroke === undefined) {
        stroke = fill;
    }
    bg_color = fill;
    bd_color = stroke;
    let canvas = create_icon(fill, stroke);
    set_icon_to_canvas(canvas);
    set_params();
}

function get_params() {
    // the following is pretty inelegant
    var url = new URL(window.location.href);
    let b = url.searchParams.get("b");
    if (b) {
        bg_color = b;
    }
    let s = url.searchParams.get("s");
    if (s) {
        bd_color = s;
    }
    let t = url.searchParams.get("t");
    if (t) {
        input.value = t;
    }
}

function set_params() {
    var url = new URL(window.location.href);
    url.searchParams.set("b", bg_color);
    url.searchParams.set("s", bd_color);
    url.searchParams.set("t", document.title);
    history.replaceState({path: url.href}, '', url.href);
    console.log(url.href);
}

function main() {
    get_params();
    G("input").oninput = update_title;
    G("form").onsubmit = change_title;
    change_favicon(bg_color, bd_color);
    update_title();
    create_options(G("options"));
}

window.addEventListener('DOMContentLoaded', (event) => {
    main();
});
