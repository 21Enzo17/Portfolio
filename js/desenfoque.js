document.addEventListener('DOMContentLoaded', function() {
    let blur = 1;
    let increasing = true;
    let blurEnabled = true;
    let stats = new Stats();
    stats.begin();

    function animate() {
      if (blurEnabled) {
        
        if (increasing) {
          blur += 0.01; 
          if (blur >= 1.5) {
            increasing = false;
          }
        } else {
          blur -= 0.01; 
          if (blur <= 0) {
            increasing = true;
          }
        }
      }
      
  
      document.getElementById('background').style.filter = `blur(${blur}px)`; 
      
      stats.end();
      var fps = stats.fps;
      if (fps < 30 && blurEnabled) {
        console.log('Desactivando animación de desenfoque');
          // Desactiva la animación de desenfoque
          blurEnabled = false;
      } else if (fps > 35 && !blurEnabled) {
          // Reactiva la animación de desenfoque
          blurEnabled = true;
      }
      requestAnimationFrame(animate); 
    }
  
    animate(); 
  });