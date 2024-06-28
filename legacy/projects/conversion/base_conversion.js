
var symbols = '0123456789abcdefghijklmnopqrstuvwxyz';

function to_base(number, base){
    power = 0;
    var string = '';
    while(number>0){
        string = symbols.charAt(number%base) + string;
        number = Math.trunc(number/base);
    }
    if(string === ''){
        return '0';
    }
    return string;
}
function from_base(number_str, base){//could use parseInt
    var total = 0;
    var i;
    for(i=0;i<number_str.length;i++){
        total += symbols.indexOf(number_str.charAt(i))*Math.pow(base, number_str.length-i-1);
    }
    return total;
}
