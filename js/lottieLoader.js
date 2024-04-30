document.addEventListener("DOMContentLoaded", function () {
    var containers = document.getElementsByClassName('lottie-container');
    for (var i = 0; i < containers.length; i++) {
        lottie.loadAnimation({
            container: containers[i], // the DOM element that will contain the animation
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: './img/carga/moon.json' // the path to the animation json
        });
    }
});