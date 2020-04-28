
var glow_size = 48;
var glow_start = glow_size;
var glow_window = 12;
var glow_calls = 0;
var glow_speed = 80;

max = Math.max;
min = Math.min;

function glow(){
    glow_calls += 1;
    var a = glow_size+Math.cos(glow_calls*Math.PI/glow_speed)*glow_window;
    document.getElementById('welcome').style.textShadow = "0px 0px "+a+"px #cccccc";
    var b = max(min(glow_calls/glow_speed/4, 0.9), 0.2);
    document.getElementById("explore_txt").style.color = "rgba(255, 255, 255, "+b+")";
    a = (1-max(min(glow_calls/glow_speed/4, 1), 0))*255;
    document.getElementById("welcome").style.color = "rgba(255, 255, 255, "+(1-b/0.9)+")";
    if(b === 0.9){
        if(glow_size>0){
            glow_size-=0.1;
        }
        else{
            document.getElementById("welcome").style.color ="rgb(255, 255, 255)";
            document.getElementById('welcome').style.textShadow = "none";
            
        }
        if(glow_window>0){
            glow_window-=0.1
        }
    }
}
function fadeIn(){
    glow_calls += 1;
    var brightness = Math.pow(Math.sin(glow_calls*Math.PI/glow_speed/2), 2);
    var b=Math.max(brightness*0.4-0.2, 0);
    var a = brightness*(glow_size+glow_window);
    document.getElementById('welcome').style.textShadow = "0px 0px "+a+"px #cccccc";
    document.getElementById("explore_txt").style.color = "rgba(255, 255, 255, "+b+")";
    if(a === glow_size+glow_window){
        glow_calls = 0;
        setInterval(glow, 30)
    }
    else{
        setTimeout(fadeIn, 60);
    }
}
function fullscreenListener(){
    document.body.onkeydown = function(e){
        enterFullscreen();
    }
}

function enterFullscreen(){
    if (document.body.requestFullscreen) {
        document.body.requestFullscreen();
    } else if (document.body.mozRequestFullScreen) { /* Firefox */
        document.body.mozRequestFullScreen();
    } else if (document.body.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        document.body.webkitRequestFullscreen();
    } else if (document.body.msRequestFullscreen) { /* IE/Edge */
        document.body.msRequestFullscreen();
    }
}

function exitFullscreen(){
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

function next(){
    window.location.href = "next.html";
}

function go(){
    fadeIn();
    fullscreenListener();
}



