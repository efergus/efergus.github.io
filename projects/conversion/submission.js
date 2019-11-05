
function submit_i_base(){
    unfocus_i_base();
    select("test_input");
}
function submit_o_base(){
    unfocus_o_base();
    select("test_input");
}
function submit_digits(){
    unfocus_digits();
    select("test_input");
}
function submit_test(){
    fields.fields["test_input"].blank = 'TYPE!';
    answer = from_base(fields.fields["test_input"].output, i_base);
    console.log("Answer: "+answer+" Test: "+test);
    if(answer === test){
        correct();
    }
    else{
        incorrect();
    }
    generate_test();
    fields.fields["test_input"].clear();
}

function unfocus_i_base(){
    var a = fields.fields["i_base"].output ? from_base(fields.fields["i_base"].output, 10) : i_base;
    if(a !== i_base && a > 0 && a <= 36){
        i_base = a;
        fields.fields["test_input"].whitelist = symbols.substring(0, i_base);
        generate_test();
    }
    fields.fields["i_base"].set(i_base.toString());
}
function unfocus_o_base(){
    var a = fields.fields["o_base"].output ? from_base(fields.fields["o_base"].output, 10) : o_base;
    if(a !== o_base && a > 0 && a <= 36){
        o_base = a;
        generate_test();
    }
    fields.fields["o_base"].set(o_base.toString());
}
function unfocus_digits(){
    console.log("Digits unfocused");
    var a = fields.fields["digits"].output ? from_base(fields.fields["digits"].output, 10) : digits;
    if(a !== digits && a > 0 && a < 20){
        digits = a;
        generate_test();
    }
    if(digits > 1){
        document.getElementById("s").innerHTML = "s";
    }
    fields.fields["digits"].output = digits.toString();
}
function unfocus_test(){
    fields.fields["test_input"].blank = "______";
    fields.fields["test_input"].clear();
    input_el.focus();
}

function generate_test(){
    var new_test = Math.floor(Math.random()*(Math.pow(o_base, digits)-1));
    test = new_test < test ? new_test : new_test+1;
    str = to_base(test, o_base);
    document.getElementById("test_output").innerHTML = "0".repeat(digits-str.length)+str;
    console.log("Next test: "+to_base(test, o_base));
}
