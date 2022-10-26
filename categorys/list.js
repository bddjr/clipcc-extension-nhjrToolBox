addBlock('itemN',tBT.REPORTER,
    a => this.list_itemN(a.LIST,a.N) ,
    {
        LIST:{
            type: tPT.STRING,
            default: '["apple","banana","cat"]'
        },
        N: {
            type: tPT.NUMBER,
            default: beginItemNumber()
        }
});
addBlock('slice',tBT.REPORTER,
    a => this.returnForObj( this.block_slice(this.inputStrToObj(a.LIST), a.NUMBER1, a.NUMBER2) ),
    {
        LIST: {
            type: tPT.STRING,
            default: '["apple","banana","cat"]'
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
addBlock('length',tBT.REPORTER,
    a => {
        try {return (this.inputStrToObj(a.LIST)).length}
        catch(e){return this.logError(e)}
    },{
        LIST:{
            type: tPT.STRING,
            default: '["apple","banana","cat"]'
        }
});
addBlock('indexOf',tBT.REPORTER,
    a => {
        try {
            return (this.inputStrToObj(a.LIST)).indexOf(this.inputStrToObj(a.INDEXOF)) +beginItemNumber()
        }catch(e){return this.logError(e)}
    },{
        LIST:{
            type: tPT.STRING,
            default: '["apple","banana","cat","cat"]'
        },
        INDEXOF:{
            type: tPT.STRING,
            default: '"cat"'
        }
});
addBlock('lastIndexOf',tBT.REPORTER,
    a => {
        try {
            return (this.inputStrToObj(a.LIST)).lastIndexOf(this.inputStrToObj(a.INDEXOF)) +beginItemNumber()
        }
        catch(e){return this.logError(e)}
    },{
        LIST:{
            type: tPT.STRING,
            default: '["apple","banana","cat","cat"]'
        },
        INDEXOF:{
            type: tPT.STRING,
            default: '"cat"'
        }
});
addBlock('includes',tBT.BOOLEAN,
    a => {
        try {return (this.inputStrToObj(a.LIST)).includes(this.inputStrToObj(a.VALUE))}
        catch(e){return this.logError(e)}
    },{
        LIST:{
            type: tPT.STRING,
            default: '["apple","banana","cat"]'
        },
        VALUE:{
            type: tPT.STRING,
            default: '"cat"'
        }
});
addBlock('setN',tBT.REPORTER,
    a => {
        try {
            return this.list_setN(a.LIST,a.N,a.VALUE,a.OPERATOR)
        }catch(e){return this.logError(e)}
    },{
        LIST:{
            type: tPT.STRING,
            default: '["apple","banana","cat"]'
        },
        N:{
            type: tPT.NUMBER,
            default: beginItemNumber()
        },
        VALUE:{
            type: tPT.STRING,
            default: '"cat"'
        },OPERATOR:{
            type: tPT.STRING,
            default: '=',
            menu: this.AssignmentOperatorsMenu()
        }
});
addBlock('addItem',tBT.REPORTER,
    a => {
        try {
            return this.list_push(a.LIST, a.VALUE)
        }
        catch(e){return this.logError(e)}
    },{
        LIST:{
            type: tPT.STRING,
            default: '["apple","banana","cat"]'
        },
        VALUE:{
            type: tPT.STRING,
            default: '"clipcc"'
        }
});
addBlock('removeDuplicateItems',tBT.REPORTER,
    a => {
        try {
            return this.returnForObj(Array.from(new Set(this.inputStrToObj(a.LIST))))
        }
        catch(e){return this.logError(e)}
    },{
        LIST:{
            type: tPT.STRING,
            default: '["apple","apple","apple","banana","banana","banana","cat","cat","cat"]'
        }
});
addBlock('mxxItem',tBT.REPORTER,
    a => {
        try {
            if (['max','min'].includes(a.M)){
                return this.returnForObj(eval(`Math.${a.M}.apply(null, this.inputStrToObj(a.LIST))`))
            } return ''
        }catch(e){return this.logError(e)}
    },{
        LIST:{
            type: tPT.STRING,
            default: '[999,123,456,654,15,30,664]'
        },
        M:{
            type: tPT.STRING,
            default: 'max',
            menu: this.makeMenus('nhjr.ToolBox.list.mxxItem',['max','min'])
        }
});
addBlock('sort',tBT.REPORTER,
    a => {
        try {
            if (['null','up','down'].includes(a.FUN)){
                return this.returnForObj(eval(`this.inputStrToObj(a.LIST).sort(${['','function(a,b){return a-b}','function(a,b){return b-a}'][ ['null','up','down'].indexOf(a.FUN) ]})`))

            }if/*判断是不是仅用于排序的函数*/( /^function(?: )*\(a,b\)(?: )*\{return [ab](?:[.\[][a-zA-Z0-9_\[\]".]+){0,1}(?: )*-(?: )*[ab](?:[.\[][a-zA-Z0-9_\[\]".]+){0,1}\}$/.test(a.FUN) ){

                return this.returnForObj(eval(`this.inputStrToObj(a.LIST).sort(${a.FUN})`))
            }return ''
        }catch(e){return this.logError(e)}
    },{
        LIST:{
            type: tPT.STRING,
            default: '[999,123,456,654,15,30,664]'
        },
        FUN:{
            type: tPT.STRING,
            default: 'up',
            menu: this.makeMenus('nhjr.ToolBox.list.sort.fun',['null','up','down'])
        }
});
addBlock('reverse',tBT.REPORTER,
    a => {
        try {
            return this.returnForObj(this.inputStrToObj(a.LIST).reverse())
        }
        catch(e){return this.logError(e)}
    },{
        LIST:{
            type: tPT.STRING,
            default: '["apple","banana","cat"]'
        }
});
addBlock('flat',tBT.REPORTER,
    a => {
        try {var NUM=a.NUM;
            if (NUM==''){return this.returnForObj(this.inputStrToObj(a.LIST).flat())}

            return this.returnForObj(this.inputStrToObj(a.LIST).flat(a.NUM))
        }catch(e){return this.logError(e)}
    },{
        LIST:{
            type: tPT.STRING,
            default: '["apple",["banana","cat"]]'
        },NUM:{
            type: tPT.NUMBER,
            default: '1'
        }
});
addBlock('fill',tBT.REPORTER,
    a => {
        try {
            var i= JSON.parse(`[${a.FILL}]`);
            /* 防止输入其它内容 */
            if (i instanceof Array){
                if(beginItemNumber() && i[1]>0) i[1] -=1;
                if(slice_includeEnding() && i[2]>0) i[2] +=1;
                return this.returnForObj( eval(`this.inputStrToObj(a.LIST).fill(${ JSON.stringify(i).slice(1,-1) })`) )
            }
        }
        catch(e){return this.logError(e)}
    },{
        LIST:{
            type: tPT.STRING,
            default: '["apple","banana","cat"]'
        },
        FILL:{
            type: tPT.STRING,
            default: '"clipcc",'+beginItemNumber()+',2'
        }
});
addBlock('splice',tBT.REPORTER,
    a => {
        try {
            var i= JSON.parse(`[${a.SPLICE}]`);
            /* 防止输入其它内容 */
            if (i instanceof Array){
                if(beginItemNumber() && i[0]>0) i[0] -=1;
                var j= this.inputStrToObj(a.LIST);
                eval(`j.splice(${JSON.stringify(i).slice(1,-1)})`);
                return this.returnForObj(j)
            }
        }
        catch(e){return this.logError(e)}
    },{
        LIST:{
            type: tPT.STRING,
            default: '["apple","banana","cat"]'
        },
        SPLICE:{
            type: tPT.STRING,
            default: beginItemNumber()+',2,"clipcc","yes"'
        }
});
addBlock('concat',tBT.REPORTER,
    a => {
        try {
            var i=JSON.parse(`[${a.CONCAT}]`);
            /* 防止输入其它内容 */
            if (i instanceof Array) return this.returnForObj( eval(`this.inputStrToObj(a.LIST).concat(${ JSON.stringify(i).slice(1,-1) })`) );
        }
        catch(e){return this.logError(e)}
    },{
        LIST:{
            type: tPT.STRING,
            default: '["apple","banana","cat"]'
        },
        CONCAT:{
            type: tPT.STRING,
            default: '["clipcc","yes"],["!!!","1"]'
        }
});
addBlock('join',tBT.REPORTER,
    a => {
        try {
            return this.returnForObj(this.inputStrToObj(a.LIST).join(a.VALUE))
        }
        catch(e){return this.logError(e)}
    },{
        LIST:{
            type: tPT.STRING,
            default: '["apple","banana","cat"]'
        },
        VALUE:{
            type: tPT.STRING,
            default: ' '
        }
});
