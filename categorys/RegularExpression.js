addBlock('test',tBT.BOOLEAN,
    a => {
        try {
            return this.String_to_Regular_Expression(a.VALUE1).test(String(a.VALUE2))
        }
        catch(e){return this.logError(e)}
    },{
        VALUE1:{
            type: tPT.STRING,
            default: '/^#[0-9a-fA-F]{6}$/'
        },
        VALUE2:{
            type: tPT.STRING,
            default: '#123456'
        }
});
addBlock('exec',tBT.REPORTER,
    a => {
        try {
            return this.String_to_Regular_Expression(a.VALUE1).exec(String(a.VALUE2))
        }
        catch(e){return this.logError(e)}
    },{
        VALUE1:{
            type: tPT.STRING,
            default: '/^#[0-9a-fA-F]{6}$/'
        },
        VALUE2:{
            type: tPT.STRING,
            default: '#123456'
        }
});
addBlock('search',tBT.REPORTER,
    a => {
        try {var VALUE2=this.String_to_Regular_Expression(a.VALUE2);
            if (VALUE2==''){var VALUE2=this._str_ToStr(a.VALUE2)};
            return String(a.VALUE1).search(VALUE2,this._str_ToStr(a.VALUE3))
        }
        catch(e){return this.logError(e)}
    },{
        VALUE1:{
            type: tPT.STRING,
            default: 'Hello,World. hello,ClipCC.'
        },
        VALUE2:{
            type: tPT.STRING,
            default: '/Hello/i'
        }
});
addBlock('match',tBT.REPORTER,
    a => {
        try {
            var VALUE1=String(a.VALUE1);
            var VALUE2=this.String_to_Regular_Expression(a.VALUE2);
            var RETURN=[];
            var RETURN_match=VALUE1.match(VALUE2);
            var MENU=a.MENU;
            if (MENU=='match'){return this.returnForObj(RETURN_match)};
            var i=0;
            if (MENU=='begin'){
                while (VALUE2.test(VALUE1)){
                    RETURN[i] = VALUE2.lastIndex - RETURN_match[i].length;
                    i+=1
                }
            }else if (MENU=='ending'){
                while (VALUE2.test(VALUE1)){
                    RETURN[i] = VALUE2.lastIndex;
                    i+=1
                }
            }else if (MENU=='matchANDbeginANDending'){
                while (VALUE2.test(VALUE1)){
                    var ending = VALUE2.lastIndex;
                    RETURN[i] = [RETURN_match[i], (ending - RETURN_match[i].length), ending];
                    i+=1
                }
            }else if (MENU=='beginANDending'){
                while (VALUE2.test(VALUE1)){
                    var ending = VALUE2.lastIndex;
                    RETURN[i] = [(ending - RETURN_match[i].length), ending];
                    i+=1
                }
            }else{return ''};
            return this.returnForObj(RETURN)
        }
        catch(e){return this.logError(e)}
    },{
        VALUE1:{
            type: tPT.STRING,
            default: 'Hello,World. hello,ClipCC.'
        },
        VALUE2:{
            type: tPT.STRING,
            default: '/Hello/ig'
        },
        MENU:{
            type: tPT.STRING,
            default: 'match',
            menu:this.makeMenus('nhjr.ToolBox.RegularExpression.match',['match','begin','ending','matchANDbeginANDending','beginANDending'])
        }
});
addBlock('replace',tBT.REPORTER,
    a => {
        try {
            if(a.VALUE2[0] =='/') var VALUE2=this.String_to_Regular_Expression(a.VALUE2);
            else var VALUE2=this._str_ToStr(a.VALUE2);
            return String(a.VALUE1).replace(VALUE2,this._str_ToStr(a.VALUE3))
        }
        catch(e){return this.logError(e)}
    },{
        VALUE1:{
            type: tPT.STRING,
            default: 'Hello,World. hello,ClipCC.'
        },
        VALUE2:{
            type: tPT.STRING,
            default: '/Hello/ig'
        },
        VALUE3:{
            type: tPT.STRING,
            default: '"Hi"'
        }
});
addBlock('replaceAll',tBT.REPORTER,
    a => {
        try {
            if(a.VALUE2[0] =='/') var VALUE2=this.String_to_Regular_Expression(a.VALUE2);
            else var VALUE2=this._str_ToStr(a.VALUE2);
            return String(a.VALUE1).replaceAll(VALUE2,this._str_ToStr(a.VALUE3))
        }
        catch(e){return this.logError(e)}
    },{
        VALUE1:{
            type: tPT.STRING,
            default: 'Hello,World. Hello,ClipCC.'
        },
        VALUE2:{
            type: tPT.STRING,
            default: '"Hello"'
        },
        VALUE3:{
            type: tPT.STRING,
            default: '"Hi"'
        }
});
addBlock('split',tBT.REPORTER,
    a => {
        try {var VALUE2=this.String_to_Regular_Expression(a.VALUE2);
            if (VALUE2==''){var VALUE2=this._str_ToStr(a.VALUE2)}
            return this.returnForObj(String(a.VALUE1).split(VALUE2))
        }
        catch(e){return this.logError(e)}
    },{
        VALUE1:{
            type: tPT.STRING,
            default: 'apple banana cat'
        },
        VALUE2:{
            type: tPT.STRING,
            default: '" "'
        }
});
