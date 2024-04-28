// Asegúrate de que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function() {
    let blur = 1;
    let increasing = true;
  
    function animate() {
      if (increasing) {
        blur += 0.01; // Aumenta el desenfoque progresivamente
        if (blur >= 1.5) {
          increasing = false;
        }
      } else {
        blur -= 0.01; // Disminuye el desenfoque progresivamente
        if (blur <= 0) {
          increasing = true;
        }
      }
  
      document.getElementById('background').style.filter = `blur(${blur}px)`; // Aplica el desenfoque al div de fondo
  
      requestAnimationFrame(animate); // Solicita el siguiente cuadro de la animación
    }
  
    animate(); // Inicia la animación
  });