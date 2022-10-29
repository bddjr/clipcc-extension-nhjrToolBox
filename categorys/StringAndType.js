addBlock('strToSTR',tBT.REPORTER, /*opcode是历史遗留问题，请记得这不是大小写转换。*/
    a => {
        try {
            return this.strTo_str_(a.VALUE)
        }catch(e){return this.logError(e)}
    },{VALUE: {
            type: tPT.STRING,
            default: 'Hello World!'
        }
});
addBlock('STRtoStr',tBT.REPORTER, /*opcode是历史遗留问题，请记得这不是大小写转换。*/
    a => {
        try {
            return this._str_ToStr(a.VALUE)
        }catch(e){return this.logError(e)}
    },
    {VALUE: {
            type: tPT.STRING,
            default: '"Hello\\nWorld!"'
        }
});
addBlock('typeof',tBT.REPORTER, a => typeof(a.VALUE) , {VALUE: {type: tPT.ANY}} );
addBlock('instanceof',tBT.BOOLEAN,
    a => {
        try{
            if(/^[a-zA-Z]+$/.test(a.VALUE2)){
                return eval(`a.VALUE1 instanceof ${a.VALUE2}`)
            }
            return ''
        }catch(e){return this.logError(e)}
    },{
        VALUE1: {
            type: tPT.ANY
        },
        VALUE2: {
            type: tPT.STRING,
            default: 'Array'
        }
});
addBlock('String',tBT.REPORTER,
    a => String(a.VALUE) ,
    {
        VALUE: {
            type: tPT.STRING,
            default: 'string'
        }
});
addBlock('Number',tBT.REPORTER,
    a => Number(a.VALUE) ,
    {
        VALUE: {
            type: tPT.STRING,
            default: '123'
        }
});
addBlock('ScratchType',tBT.REPORTER,
    a => this.ScratchType(a.VALUE) ,
    {
        VALUE: {
            type: tPT.STRING,
            default: ' '
        }
});
addBlock('repeat',tBT.REPORTER,
    a => String(a.VALUE).repeat(a.REPEAT) ,
    {
        VALUE: {
            type: tPT.STRING,
            default: '唔'
        },
        REPEAT:{
            type: tPT.NUMBER,
            default: '3'
        }
});
addBlock('slice',tBT.REPORTER,
    a => this.block_slice(String(a.VALUE), a.NUMBER1, a.NUMBER2),
    {
        VALUE: {
            type: tPT.STRING,
            default: 'Hello World!'
        },
        NUMBER1:{
            type: tPT.NUMBER,
            default: beginItemNumber()
        },
        NUMBER2:{
            type: tPT.NUMBER,
            default: '-1'
        }
});
addBlock('return',tBT.REPORTER, a => a.VALUE , { VALUE: { type: tPT.STRING, default: 'Hello World!' } } );
addBlock('returnColor',tBT.REPORTER, a => a.VALUE , { VALUE: { type: tPT.COLOR, default: '#4c97ff' } } );

addBlock('returnForBoolean',tBT.BOOLEAN, a => a.VALUE , { VALUE: { type: tPT.STRING, default: '0' } } );
addBlock('istrue',tBT.BOOLEAN, a => this.inputStrToBool(a.VALUE) , { VALUE: { type: tPT.STRING, default: 'false' } } );

addBlock('equal',tBT.BOOLEAN, a => (a.VALUE1==a.VALUE2) ,
    {
        VALUE1: {
            type: tPT.STRING,
            default: 'abc'
        },VALUE2: {
            type: tPT.STRING,
            default: 'ABC'
        }
});
addBlock('NOTequal',tBT.BOOLEAN, a => (a.VALUE1!=a.VALUE2) ,
    {
        VALUE1: {
            type: tPT.STRING,
            default: 'abc'
        },VALUE2: {
            type: tPT.STRING,
            default: 'ABC'
        }
});
addBlock('equalEqual',tBT.BOOLEAN, a => (a.VALUE1===a.VALUE2) ,
    {
        VALUE1: {
            type: tPT.STRING,
            default: 'abc'
        },VALUE2: {
            type: tPT.STRING,
            default: 'ABC'
        }
});
addBlock('NOTequalEqual',tBT.BOOLEAN, a => (a.VALUE1!==a.VALUE2) ,
    {
        VALUE1: {
            type: tPT.STRING,
            default: 'abc'
        },VALUE2: {
            type: tPT.STRING,
            default: 'ABC'
        }
});
addBlock('DecimalToHex',tBT.REPORTER, a => {
        try{
            if (this.inputStrToBool(a.ADD0X)){
                var i= Math.round(Number(a.VALUE));
                if(!Number.isFinite(i)) return i.toString(16);
                if(i<0) return i.toString(16).replace(/^-/,'-0x');
                return '0x'+ i.toString(16);
            }
            return Number(a.VALUE).toString(16);
        }catch(e){return this.logError(e)}
    },{
        VALUE: {
            type: tPT.NUMBER,
            default: '500'
        },
        ADD0X: {
            type: tPT.STRING,
            default: 'true',
            menu: this.makeMenus('nhjr.ToolBox.StringAndType.hex',['true','false'])
        }
});
addBlock('HEXToDecimal',tBT.REPORTER, a => {
    try{
        var value= String(a.VALUE);
        if(/^-/.test(value)){
            if (/^-0x/.test(value)) return Number(value);
            return Number(value.replace(/^-/,'-0x'));
        }else{
            if (/^0x/.test(value)) return Number(value);
            return Number('0x'+value);
        }
    }catch(e){return this.logError(e)}
},{
    VALUE: {
        type: tPT.STRING,
        default: '1f4'
    }
});
addBlock('NumberToString',tBT.REPORTER, a => {
        try{return Number(a.VALUE).toString(Number(a.TOSTRING))}
        catch(e){return this.logError(e)}
    },{
        VALUE: {
            type: tPT.NUMBER,
            default: '500'
        },TOSTRING:{
            type: tPT.NUMBER,
            default: '36'
        }
});
addBlock('parseInt',tBT.REPORTER, a => {
    try{return parseInt(a.V1, a.V2)}
    catch(e){return this.logError(e)}
},{
    V1: {
        type: tPT.STRING,
        default: 'dw'
    },V2:{
        type: tPT.NUMBER,
        default: '36'
    }
});
addBlock('RemoveBeginEndingWhiteSpace',tBT.REPORTER, a => {
        try{return String(a.VALUE).trim()}
        catch(e){return this.logError(e)}    
    },{
        VALUE: {
            type: tPT.STRING,
            default: '    Hello World!    '
        }
});
addBlock('TextToURL',tBT.REPORTER, a => {
        try{var TextToURL=String(a.VALUE);
            if (['encodeURIComponent','escape','encodeURI'].includes(a.CODE)){
                return eval(a.CODE+'(TextToURL)')
            }else{return ''}
        }catch(e){return this.logError(e)}    
    },{
        VALUE: {
            type: tPT.STRING,
            default: 'https://codingclip.com'
        },
        CODE:{
            type: tPT.STRING,
            default: 'encodeURIComponent',
            menu: this.makeMenus('nhjr.ToolBox.StringAndType.TextToURL',['encodeURIComponent','escape','encodeURI'])
        }
});
addBlock('URLToText',tBT.REPORTER, a => {
        try{var URLToText=String(a.VALUE);
            if (['decodeURIComponent','unescape','decodeURI'].includes(a.CODE)){
                return eval(a.CODE+'(URLToText)')
            }else{return ''}
        }catch(e){return this.logError(e)}    
    },{
        VALUE: {
            type: tPT.STRING,
            default: 'https%3A%2F%2Fcodingclip.com'
        },
        CODE:{
            type: tPT.STRING,
            default: 'decodeURIComponent',
            menu: this.makeMenus('nhjr.ToolBox.StringAndType.URLToText',['decodeURIComponent','unescape','decodeURI'])
        }
});
addBlock('toUpperOrLowerCase',tBT.REPORTER, a => {
    try{
        if (['toUpperCase','toLowerCase'].includes(a.CODE)){
            var VALUE=String(a.VALUE);
            return eval(`VALUE.${a.CODE}()`)
        }else{return ''}
    }catch(e){return this.logError(e)}    
},{
    VALUE: {
        type: tPT.STRING,
        default: 'CodingClip'
    },
    CODE:{
        type: tPT.STRING,
        default: 'toUpperCase',
        menu: this.makeMenus('nhjr.ToolBox.StringAndType.toUpperOrLowerCase',['toUpperCase','toLowerCase'])
    }
});
addBlock('charCodeAt',tBT.REPORTER,a => {
        try{return a.VALUE[ a.NUMBER - beginItemNumber() ].charCodeAt()}
        catch(e){return this.logError(e)}    
    },{
        VALUE: {
            type: tPT.STRING,
            default: 'wow'
        },
        NUMBER:{
            type: tPT.NUMBER,
            default: beginItemNumber(),
        }
});
addBlock('fromCharCode',tBT.REPORTER,a => {
        try{return String.fromCharCode(a.VALUE)}
        catch(e){return this.logError(e)}    
    },{
        VALUE: {
            type: tPT.STRING,
            default: '119'
        }
});
