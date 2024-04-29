let particlesInstance = null;

        function loadParticles() {
            tsParticles
                .load({
                    id: "tsparticles",
                    url: "./js/particles.json",
                })
                .then(container => {
                    console.log("callback - tsparticles config loaded");
                    particlesInstance = container;
                })
                .catch(error => {
                    console.error(error);
                });
        }

        document.getElementById('toggle-particles').addEventListener('click', function () {
            var particlesMsg = document.getElementById('particles-toggle-msg');
            var particlesMsgText = document.getElementById('particles-msg-text');
            if (particlesInstance) {
                particlesInstance.destroy();
                particlesInstance = null;
                particlesMsgText.textContent = 'Las partículas han sido desactivadas.';
                particlesMsg.style.display = 'block';
            } else {
                loadParticles();
                particlesMsgText.textContent = 'Las partículas han sido activadas.';
                particlesMsg.style.display = 'block';
            }
        });

        document.getElementById('particles-msg-close').addEventListener('click', function () {
            console.log('cerrar');
            document.getElementById('particles-toggle-msg').style.display = 'none';
        });

        loadParticles();