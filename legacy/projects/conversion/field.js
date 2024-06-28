
function getFieldElements(){
    var f = document.getElementsByClassName("field");
    var o = [];
    var i;
    for(i in f){
        if(f[i].id){
            o[f[i].id] = f[i];
        }
    }
    return o;
}

class FieldClass {
    element;
    blank = '...';
    input_str = '';
    whitelist = '';
    constructor(e){
        this.element = e;
    }
    get output(){
        return this.input_str;
    }
    set output(value){
        this.set(value);
    }
    input(key){
        if(key === 'Backspace'){
            this.input_str = this.input_str.substring(0, this.input_str.length-1);
        }
        else if(key === 'Enter'){
            this.submit();
        }
        else if(key.length === 1 && (!this.whitelist || this.whitelist.indexOf(key)>=0)){
            this.input_str += key;
        }
        if(this.input_str === ''){
            this.element.innerHTML = this.blank;
        }
        else{
            this.element.innerHTML = this.input_str;
        }
    }
    set(value){
        if(value === ''){
            this.clear();
        }
        else{
            this.input_str = value;
            this.element.innerHTML = value;
        }
    }
    clear(){
        this.input_str = '';
        this.element.innerHTML = this.blank;        
    }
}

class FieldHandler {
    focus = '';
    fields = [];
    constructor(){
        var f = getFieldElements();
        var i;
        for(i in f){
            this.fields[f[i].id] = new FieldClass(f[i]);
        }
    }
    select(f){
        if(f !== this.focus){
            this.fields[this.focus].unfocus();
            this.select_quiet(f);
        }
    }
    select_quiet(f){
        this.focus = f;
        this.fields[f].clear();
    }
    handle_event(e){
        this.fields[this.focus].input(e.key);
    }
}
