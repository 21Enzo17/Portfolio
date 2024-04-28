document.addEventListener('DOMContentLoaded', function() {
    let blur = 1;
    let increasing = true;
  
    function animate() {
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
  
      document.getElementById('background').style.filter = `blur(${blur}px)`; 
  
      requestAnimationFrame(animate); 
    }
  
    animate(); 
  });