"use strict"

// globals
var canvas;

// various configurations
var options = {
    canvas: {
        id: 'playground',
        width: '400',
        height: '300',
        imageUrl: 'img/phillylove.jpg'
    }
}

function init(){
    // create canvas and add image to it 
    canvas = new Canvas(options.canvas);
    // pipeImage(canvas);
    pipeVideo(canvas);
}

function filterIt(canvas){
    // simplify image by making it greyscale
    var greyscale = new Filter({type: 'greyscale'});
    canvas.applyFilter(greyscale);
    
    var gaussian = new Filter({type: 'gaussian'});
    // canvas.applyFilter(gaussian);

    // apply sobel 
    var sobel = new EdgeDetect({kernel: 'sobel', threshold: 100});
    canvas.doEdgeDetect(sobel);

}

function pipeImage(){
    canvas.drawImage(options.canvas.imageUrl, function(){
        doSobel(canvas);
    });
}

function pipeVideo(c){
    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia ||
    navigator.webkitGetUserMedia || navigator.msGetUserMedia;
    navigator.getUserMedia({
        video: true,
    }, function(stream) {
        var video = document.getElementById('user-video');
        video.src = window.URL.createObjectURL(stream);
        video.addEventListener('play', function() {
           // Every 33 milliseconds copy the video image to the canvas
           setInterval(function() {
              if (video.paused || video.ended) return;
              c.context.drawImage(video, 0, 0, c.dimensions.width, c.dimensions.height);
              filterIt(c);
           }, 10);
        }, false);
    }, function(e){error(e)})
}

init();