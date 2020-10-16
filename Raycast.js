  var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var FOV = 0; // Angulo de la camara

//Distancia de del rayo:
var Ray_Dist = 0.01;
 
//Variables para guardar los parámetros de la columna anterior:
var altura_anterior = 0;
var nTecho_anterior = 0;
var nSuelo_anterior = 0;
 
//Propiedades del jugador:
var xJugador = 2.0; //Posicion X
var yJugador = 2.0; //Posicion Y
var aJugador = 0.0; //Rotación (ángulo hacia dónde está apuntando)
var velocidad = 0.006; //Velocidad de movimiento
var giro = 0.006; //Velocidad de giro
 
 
//Variables para calcular el delta time:
var lastTime = 0;
var delta = 0;
 
//Propiedades del mapa:
var MAPA_COLS = 10; //Numero de columnas
var MAPA_FILAS = 10; //Numero de filas
 var k=0; 
var datos = 
 [1,1,1,1,1,1,1,1,1,1,
  1,0,0,0,0,0,0,0,1,1,
  1,0,0,0,0,0,0,0,0,1,
  1,1,0,1,1,1,0,0,0,1,
  1,0,0,1,0,0,1,0,0,1,
  1,0,0,0,0,0,1,0,0,1,
  1,0,0,1,0,0,1,0,0,1,
  1,0,1,1,1,1,1,0,0,1,
  1,0,0,0,0,0,0,0,0,1,
  1,1,1,1,1,1,1,1,1,1];

var mapa = new Array(10);
for(var i=0; i<10; i++) {
  mapa[i] = new Array(10);
}

for(var i=0; i<mapa.length; i++) {
  
    for(var j=0; j<mapa[i].length; j++) {
      mapa[i][j] = datos[k];
      k++;
    } 
}


function Alto()
{
  return window.innerWidth;
}  
function Ancho()
{
  return window.innerHeight;
}
c.width = Alto();
c.height = Ancho();
var anchoPantalla = c.width;
var altoPantalla =  c.height;

function radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}
FOV = radians(64);
 
function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
 
function draw()
{
  
  delta = performance.now() - lastTime; ///estppppasd

ctx.rect(0,0,anchoPantalla, altoPantalla);
ctx.fillStyle = "grey";
ctx.fill();
ctx.beginPath();
ctx.rect(0,altoPantalla/2,anchoPantalla, altoPantalla/2);
ctx.fillStyle = "grey";
ctx.fill();
ctx.beginPath();
 
  //Trazar un rayo desde cada una de las columnas de la pantalla:
  for(var x = 0; x < anchoPantalla; x++)
  {
    //La posición inicial del rayo será la del jugador:
    var xRayo = xJugador;
    var yRayo = yJugador;
     
    //Calculamos su ángulo inicial:
    var aRayo = (aJugador - FOV / 2.0) + x*(FOV / anchoPantalla);
     
    //Calculamos el incremento:
    var xIncremento = Math.cos(aRayo)*Ray_Dist;
    var yIncremento = Math.sin(aRayo)*Ray_Dist;
     
    //Calcular la trayectoria del rayo, Ray_Dist a Ray_Dist:
    var choque = false;
    while(!choque)
    {
      //Calcular un nuevo punto de la trayectoria:
      xRayo += xIncremento;
      yRayo += yIncremento;
       
      //Si el rayo sale del mapa, o si colisiona con un muro, salimos del bucle while:
      alert
      if( xRayo < 0 || xRayo >= MAPA_COLS || yRayo < 0 || yRayo >= MAPA_FILAS || mapa[Math.trunc(yRayo)][Math.trunc(xRayo)] != 0)
      {
        choque = true;
      }
    }
     
    //Calcular la distancia corregida del jugador al punto de colisión:
    var distancia = Math.sqrt( Math.pow(xRayo - xJugador, 2) + Math.pow(yRayo - yJugador, 2) );
    distancia = distancia * Math.cos(aRayo - aJugador);
     
    //Calcular la altura del muro:
    var altura = Math.min(altoPantalla, altoPantalla / distancia);
     
    //Calcular el píxel de la pantalla donde hay que empezar a dibujar el muro (nTecho) y donde hay que acabar (nSuelo)
    var nTecho = Math.trunc(altoPantalla / 2.0 - altura/2);
    var nSuelo = Math.trunc(altoPantalla / 2.0 + altura/2);
     
    //Calcular una tonalidad para la columna, que dependerá de la distancia (cuanto más lejos, más oscuro)
    var tonalidad = map_range(Math.min(distancia, 7), 0, 7, 255, 40);
     
ctx.beginPath();
ctx.lineTo(x, nTecho);
ctx.lineTo(x, nSuelo);
ctx.fillStyle = 'black';
ctx.stroke();
     
 
    //Comprobar si hay que dibujar un borde lateral:
    if( Math.abs(altura - altura_anterior) >= 10)
    {
      
      if(altura > altura_anterior){
         ctx.beginPath();
ctx.lineTo(x, nTecho);
ctx.lineTo(x, nSuelo);
ctx.strokeStyle = 'black';
       }
      else{
          ctx.beginPath();
ctx.lineTo(x-1, nTecho_anterior);
ctx.lineTo( x-1, nSuelo_anterior);
ctx.strokeStyle = 'black';

        
      }
    }
     
    //Guardar los parámetros de la columna actual:
    altura_anterior = altura;
    nTecho_anterior = nTecho;
    nSuelo_anterior = nSuelo;
     
    //Dibujar los bordes superiores e inferiores de la pared:
        ctx.beginPath();
         ctx.lineTo(x,nTecho);
        ctx.lineTo(x,nTecho+2);
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.lineTo(x, nSuelo);
        ctx.lineTo( x, nSuelo-2);
        ctx.strokeStyle = 'black';
      
     
  }
 

  lastTime = performance.now();
}
 
document.addEventListener("keydown", function(event) {
    const keyCode= event.which 
    console.log("Presionada: " + keyCode); 
  if (String.fromCharCode(keyCode) == "w" || String.fromCharCode(keyCode) == "W")
  {
    
    //Avanzar la posición del jugador hacia delante:
    xJugador += Math.cos(aJugador)*velocidad*delta;
    yJugador += Math.sin(aJugador)*velocidad*delta;
     
    //Si el jugador ha entrado dentro de una pared se deshace el movimiento:
    if(mapa[Math.trunc(yJugador)][Math.trunc(xJugador)] != 0)
    {
      xJugador -= Math.cos(aJugador)*velocidad*delta;
      yJugador -= Math.sin(aJugador)*velocidad*delta;
    }
  }
   
  //Giro a la izquierda:
  else if (String.fromCharCode(keyCode) == "a" || String.fromCharCode(keyCode) == "A")
  {
    aJugador -= giro*delta;
  }
   
  //Giro a la derecha:
  else if(String.fromCharCode(keyCode) == "d" || String.fromCharCode(keyCode) == "D")
  {
    aJugador += giro*delta;
  }
   
  //Moverse hacia atrás:
  else if(String.fromCharCode(keyCode) == "s" || String.fromCharCode(keyCode) == "S")
  {
    xJugador -= Math.cos(aJugador)*velocidad*delta;
    yJugador -= Math.sin(aJugador)*velocidad*delta;
     
    if(mapa[Math.trunc(yJugador)][Math.trunc(xJugador)] != 0)
    {
      xJugador += Math.cos(aJugador)*velocidad*delta;
      yJugador += Math.sin(aJugador)*velocidad*delta;
    }
  }
});

let secondsPassed;
let oldTimeStamp;
let fps;

function gameLoop(timeStamp) {

    
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

  
    draw();
fps = Math.round(1 / secondsPassed);

    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 200, 50);
    ctx.font = '25px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText("FPS: " + fps, 10, 30);
    
    window.requestAnimationFrame(gameLoop);
}
function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
};
gameLoop(timestamp());
