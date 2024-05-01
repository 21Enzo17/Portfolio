let sectionIndex = 0;
                let isScrolling = false;
            
                // Crea una nueva instancia de Hammer en el elemento que deseas que tenga desplazamiento táctil
                let hammer = new Hammer(document.body);
            
                hammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
            
                hammer.on('swipeup', function() {
                    if (isScrolling) return;
                    isScrolling = true;
                    sectionIndex = Math.min(sectionIndex + 1, document.querySelectorAll('.section').length - 1);
                    document.querySelectorAll('.section')[sectionIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setTimeout(() => { isScrolling = false; }, 500); // Ajusta este valor según la duración de tu animación de desplazamiento
                });
            
                hammer.on('swipedown', function() {
                    if (isScrolling) return;
                    isScrolling = true;
                    sectionIndex = Math.max(sectionIndex - 1, 0);
                    document.querySelectorAll('.section')[sectionIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setTimeout(() => { isScrolling = false; }, 500); // Ajusta este valor según la duración de tu animación de desplazamiento
                });
            
                document.addEventListener('wheel', (event) => {
                    event.preventDefault();
            
                    if (isScrolling) return;
                    isScrolling = true;
            
                    if (event.deltaY > 0) {
                        sectionIndex = Math.min(sectionIndex + 1, document.querySelectorAll('.section').length - 1);
                    } else {
                        sectionIndex = Math.max(sectionIndex - 1, 0);
                    }
            
                    document.querySelectorAll('.section')[sectionIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setTimeout(() => { isScrolling = false; }, 500); // Ajusta este valor según la duración de tu animación de desplazamiento
                }, { passive: false });