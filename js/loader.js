document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('body-loading');
});

window.addEventListener('load', function () {
    document.getElementById('d-none').classList.remove('d-none');
    setTimeout(function () {
        document.getElementById('loader-frame').style.display = 'none';
        document.body.classList.remove('body-loading');
    }, 1000);
});