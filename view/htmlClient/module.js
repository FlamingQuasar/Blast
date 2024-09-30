import { BlastGame } from '../src/core/blastGame.js'
console.log(BlastGame);
			class WebClient{

				constructor(){

				}


			}

            window.onload = function() {
    var canvas = document.getElementById('images_demo');
    var context = canvas.getContext('2d');
    var image = new Image();

    image.onload = function() {
       
    };
	setTimeout(function(){
		context.drawImage(image, 12, 10, 44, 50);
       context.drawImage(image, 62, 10, 44, 50);
       context.drawImage(image, 112, 10, 44, 50);
       context.drawImage(image, 162, 10, 44, 50);
       context.drawImage(image, 212, 10, 44, 50);
       context.drawImage(image, 262, 10, 44, 50);
       context.drawImage(image, 312, 10, 44, 50);
       context.drawImage(image, 362, 10, 44, 50);
       context.drawImage(image, 412, 10, 44, 50);
       context.drawImage(image, 462, 10, 44, 50);
       context.drawImage(image, 512, 10, 44, 50);
	},1000);
      
    image.src = 'htmlClient/assets/tile_blue.png';
}