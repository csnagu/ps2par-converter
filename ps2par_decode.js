function deconv(){
	strout = "";
	strin = document.form1.text1.value.toUpperCase();
	tansaku(strin, 1);
    fix(strout);
	document.form1.text2.value = str1;
}

function fix(str){
    var i;
    var chr;
    str1 = "";

    for(i = 0; i < str.length; i++){
        chr = str.charAt(i);
        if(i%18 == 0){str1 += "patch=1,EE,0";}
        else if(chr == " "){str1 += ",word,";}
        else{str1 += chr.toUpperCase();}
    }
}

function tansaku(str, nmode){
	var val = "";
	var f = 0;
	var chr;
	var i;
	var dtkind = 0;
	var err = 0;

	for(i = 0; i < str.length; i++){
		chr = str.charAt(i);
		if((chr >= "\x30" && chr <= "\x39") || (chr >= "\x41" && chr <= "\x46")){
			if(f < 8 && dtkind < 2){
				f++;
				val += chr;
			}
		}else if(chr == "\x20" || chr == "\x0d" || chr == "\x0a"){
			if(f > 0){
				for(j = f; j < 8; j++){val = "0" + val;}
				strout += convert_num(val, dtkind, nmode);
				if(chr == "\x20" && dtkind == 0){
					dtkind++;
				}else{
					dtkind = 0;
				}
				val = "";
				strout += chr;
				f = 0;
			}
		}else{
			err = 1;
			break;
		}
	}

	if(err == 0 && f > 0){
		for(j = f; j < 8; j++){val = "0" + val;}
		strout += convert_num(val, dtkind, nmode);
	}
}

function convert_num(val, dtkind, nmode) {
	var i;
	var ret = "";

	b1 = new Array(3);
	b2 = new Array(3);

	if(dtkind == 0){
		bxor = new Array(0xA6, 0x96, 0x01, 0x82);
	}else{
		bxor = new Array(0xD9, 0x3B, 0x1B, 0xCC);
	}

	for(i = 0; i < 4; i++){
		b1[i] = parseInt(val.substr(i * 2, 2), 16);
		if(nmode == 0){
			b2[i] = b1[i] ^ bxor[i];
			b2[i] += bxor[(i + 1) & 3];
			b2[i] &= 0xFF;
		}else{
			b1[i] += 256 - bxor[(i + 1) & 3];
			b1[i] &= 0xFF;
			b2[i] = b1[i] ^ bxor[i];
		}
		if(b2[i] < 16){ret += "0";}
		ret += b2[i].toString(16);
	}
	return ret;
}
