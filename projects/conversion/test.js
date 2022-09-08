var fields;
var i_base = 2;
var o_base = 16;
var digits = 1;
var test = 0;
var answer = 0;
var total_correct = 0;

var correct_el;
var input_el;
var correct_time = 0;
var correct_v = 0;
var correction_speed = 0.1;
var time_adjustment = 1;
var correct_size = 200;
var brightness_time = 3.5;
var size_time = 5;
var time;

window.onkeydown = function(e){
    fields.handle_event(e);
}

function select(e){
    input_el.focus();
    console.log("Selecting "+e);
    if(e === "test_input" && fields.fields["test_input"].focus !== "test_input"){
        fields.fields["test_input"].blank = 'TYPE!';
        fields.fields["test_input"].clear();
    }
    fields.select(e);
}

function load(){
    correct_el = document.getElementById("correct");
    input_el = document.getElementById("dummy_input");
    time = new Date();
    generate_test();
    
    fields = new FieldHandler();
    f = fields.fields;
    f.test_input.blank = f.test_input.element.innerHTML;
    fields.fields["test_input"].whitelist = symbols.substring(0, 2);
    fields.fields["i_base"].whitelist = symbols.substring(0, 10);
    fields.fields["o_base"].whitelist = symbols.substring(0, 10);
    fields.fields["digits"].whitelist = symbols.substring(0, 10);
    
    fields.fields["i_base"].submit = submit_i_base;
    fields.fields["o_base"].submit = submit_o_base;
    fields.fields["test_input"].submit = submit_test;
    fields.fields["digits"].submit = submit_digits;
    
    fields.fields["i_base"].unfocus = unfocus_i_base;
    fields.fields["o_base"].unfocus = unfocus_o_base;
    fields.fields["test_input"].unfocus = unfocus_test;
    fields.fields["digits"].unfocus = unfocus_digits;
    
    document.getElementById("test_input").onclick = function(){select("test_input")};
    document.getElementById("i_base").onclick = function(){select("i_base")};
    document.getElementById("o_base").onclick = function(){select("o_base")};
    document.getElementById("digits").onclick = function(){select("digits")};
    
    fields.select_quiet("test_input");
    fields.fields["test_input"].blank = 'TYPE!';
    
    setInterval(update, 30);
}

function update(){
    t = new Date();
    if (correct_v > 0) {
        correct_v = (correct_v-0.1)*.985+0.1;
    }
    correct_el.style.color = "rgba(255, 255, 255, "+correct_v+")";
    correct_el.style.textShadow = "0px 0px 100px rgba(255, 255, 255, "+correct_v+")";
    correct_el.style.fontSize = (correct_v*0.5+0.5)*correct_size+"px";
}

function correct(){
    console.log("Correct!");
    t = new Date();
    time_adjustment *= (1+(t.getTime()-correct_time-brightness_time)/1000*correction_speed)
    correct_v += 0.6;
    total_correct += 1;
}
function incorrect(){
    fields.fields["test_input"].blank = "\""+to_base(test, o_base)+"\" is \""+to_base(test, i_base)+"\"";
    correct_v = 0;
    total_correct -= 3;
    total_correct = Math.max(total_correct, 0);
}
