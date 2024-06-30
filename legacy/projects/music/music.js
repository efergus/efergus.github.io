
const context = new AudioContext();


function handle_key(event){
    sound.gain_function = Math.sin;
    sound.start(1);
}

function load(){
    o = context.createOscillator();
    g = context.createGain();
    o.connect(g).connect(context.destination);
    o.frequency.setValueAtTime(440, context.currentTime);
    g.gain.value = 1;
    o.start(1);
    
    o2 = context.createOscillator();
    o2.connect(g).connect(context.destination);
    o2.frequency.setValueAtTime(466.16, context.currentTime);
    o2.start();
}
