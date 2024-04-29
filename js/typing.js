$(document).ready(function(){

    var msg = 'Hola!, soy Enzo Meneghini.';
    var k = 0;
    var char = 0;
    var output = $('#typing-text');
    var back=false; // valida si se suma o se resta

    var app = {
        init: function(text, target){
            target.html('');
            char = text.length;
            this.sayHello(text, target);
        },
        sayHello: function(text, target){
            target.text(text.slice(0,k));
            var that = this;

            if(!back){ //valida que sea false

                if(k ==text.length)back=!back ; // valida si k es igual longitud del arreglo para ir hacia atras
                k++;
            }else{
                k--; 
                if(k == 0) back=!back; // valida que k sea igual a 0 para ir hacia adelante
            }

            var timer = setTimeout(function(){
                that.sayHello(text, target);
            }, 100);
        }
    };
    app.init(msg, output);
    });