
const context = new AudioContext();
const a4 = 440;

class Note {
    constructor(note_str) {
        this.note = note_str;
    }
    frequency = function() {
        var a = a4;
        if(!isNaN(this.note)){
            return a*Math.pow(2, (this.note+3)/12-1);
        }
        if(this.note.substring(this.note.length-2, this.note.length) === 'Hz'){
            return parseFloat(this.note);
        }
        switch(this.note){
            case "Ab":
                return a*Math.pow(2, 11/12-1);
            case "A":
                return a;
            case "Bb":
                return a*Math.pow(2, 13/12-1);
            case "B":
                return a*Math.pow(2, 14/12-1);
            case "C":
                return a*Math.pow(2, 3/12-1);
            case "Db":
                return a*Math.pow(2, 4/12-1);
            case "D":
                return a*Math.pow(2, 5/12-1);
            case "Eb":
                return a*Math.pow(2, 6/12-1);
            case "E":
                return a*Math.pow(2, 7/12-1);
            case "F":
                return a*Math.pow(2, 8/12-1);
            case "Gb":
                return a*Math.pow(2, 9/12-1);
            case "G":
                return a*Math.pow(2, 10/12-1);
        }
    }
    set = function(note){
        this.note = note;
    }
}

class Sound {
    constructor(note){
        var t = new Date();
        this.o = context.createOscillator();
        this.gain = context.createGain();
        this.o.connect(this.gain).connect(context.destination);
        this.gain.connect(context.destination);
        this.note = new Note(note);
        this.o.frequency.setValueAtTime(this.note.frequency(), context.currentTime);
        this.o.detune.setValueAtTime(100, context.currentTime);
        this.gain_time = t.getTime();
        this.gain_function = this.zero;
        this.gain_interval = setInterval(this.gain_ud, 30);
    }
    zero = function(x){
        return 0;
    }
    gain_ud = function(){
        var t = new Date();
        var x = t.getTime() - this.gain_time;
        this.gain_time = t.getTime();
        this.gain.gain.value = this.gain_function(x);
    }
    set = function(note){
        this.note.set(note);
        this.o.frequency.setValueAtTime(this.note.frequency(), context.currentTime);
    }
    start = function(gain){
        if(typeof gain !== 'undefined'){
            this.gain.gain.value = gain;
        }
        this.o.start(1);
        var t = new Date();
        this.gain_time = t.getTime();
        clearInterval(this.gain_interval);
        this.gain_interval = setInterval(this.gain_ud, 30);
    }
    stop = function(){
        this.o.stop();
        clearInterval(this.gain_interval);
    }
}
