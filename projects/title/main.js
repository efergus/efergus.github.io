
const G = document.getElementById.bind(document);

function change_title() {
    let new_title = G("input").value;
    document.title = new_title;
    console.log('Title changed to "' + new_title + '"');
    return false;
}

function main() {
    G("form").onsubmit = change_title;
    changeFavicon('red', 'red');
}

function changeFavicon(fill, stroke) {
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

    const link = document.createElement('link');
    const oldLinks = document.querySelectorAll('link[rel="shortcut icon"]');
    oldLinks.forEach(e => e.parentNode.removeChild(e));
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL();
    document.head.appendChild(link);
}

window.addEventListener('DOMContentLoaded', (event) => {
    main();
});
