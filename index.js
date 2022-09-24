const {api, type, Extension} = require('clipcc-extension');
let nhjrToolBox_Error='';
let nhjrToolBox_hat_oldValue={};
let nhjrToolBox_TemporaryVariable={};
let nhjrToolBox_returnError=false;
let nhjrToolBox_returnObj=false;
const VM = api.getVmInstance();
let alerted = false;

class nhjrToolBoxExtension extends Extension {
    logError(e){
        console.log(e);
        nhjrToolBox_Error=String(e);
        if (nhjrToolBox_returnError){return nhjrToolBox_Error};
        return ''
    }
    strTo_str_(VALUE){//str to "str"
        try{return JSON.stringify([String(VALUE)]).slice(1,-1)}
        catch(e){return this.logError(e)}
    }
    _str_ToStr(VALUE){//"str" to str
        try{if (typeof(VALUE)=='string'){return JSON.parse(`[${VALUE}]`)[0]};
        return VALUE}catch(e){return this.logError(e)}
        
    }
    inputStrToObj(Str){
        if (typeof(Str)!='object'){return JSON.parse(Str)};
        return Str
    }
    String_to_Regular_Expression(VALUE){
        try {if(/^\/[\s\S]*\/[gim]{0,3}$/.test(VALUE)){//鉴定为应该是正则表达式
            return RegExp(VALUE.replace(/^\//,'').replace(/\/[gim]{0,3}$/,'') , /[gim]{0,3}$/.exec(VALUE))
            }
        }catch(e){this.logError(e)};
        return ''
    }
    openHelp(openLink){//来自叶绿素
        if (window.clipAlert) {
            if (alerted) return;
            return new Promise(resolve => {
                alerted = true;
                clipAlert('跳转警告', `该作品尝试将您跳转至 ${openLink}, 您确定要进行跳转吗？`)
                    .then(result => {
                        if (result) window.open(`${openLink}`, '_blank');
                        alerted = false;
                        resolve();
                    });
            });
        }
        if (window.confirm(`该作品尝试将您跳转至 ${openLink}, 您确定要进行跳转吗？`)) {
            window.open(`${openLink}`, '_blank');
        }
    }
    returnForBoolean(VALUE){
        if (typeof(VALUE)=='string'){
            if (/^[\-]?[\d]+(?:\.[\d]*)?$/.test(VALUE)) {return Boolean(Number(VALUE))}
            else {return !(["false","","null","NaN","undefined"].includes(VALUE))}
        };return Boolean(VALUE);
    }
    returnForJSON(VALUE){return this.returnForList(VALUE)}
    returnForList(VALUE){
        try{
            if (['number','boolean','string'].includes(typeof(VALUE))){
                return VALUE
            } else if (typeof(VALUE)=='object'){
                if(nhjrToolBox_returnObj){return VALUE};
                return JSON.stringify(VALUE)
            };return String(VALUE)
        }catch(e){return this.logError(e)}
    }
    list_getN(VALUE_LIST,VALUE_N){
        //必须先输入LIST再输入N
        try{
            var N=VALUE_N;
            if (N=='last'){
                var N = -1 ;
            };
            var N=Number(N);
            if (N < 0){
                var N = this.inputStrToObj(VALUE_LIST).length + N ;
            };
            return N
        }
        catch(e){return this.logError(e)}
    }
    list_itemN(VALUE_LIST,VALUE_N){
        try {
            return this.returnForList(this.inputStrToObj(VALUE_LIST)[ this.list_getN(VALUE_LIST,VALUE_N) ]);
        }
        catch(e){return this.logError(e)}
    }
    list_setN(LIST,N,VALUE){
        try{
            var LIST=this.inputStrToObj(LIST);
            LIST[this.list_getN(LIST,N)]=this._str_ToStr(VALUE);
            return this.returnForList(LIST)
        }
        catch(e){return this.logError(e)}
    }
    makeMenus (block,menus) {
        const menu = [];
        for (const item of menus) {
            menu.push({
                messageId: `${block}.menu.${item}`,
                value: item
            });
        }
        return menu;
    }

    //借鉴自string扩展
    getSpriteByName(isStage,name,runtime){
        for(var sprite in runtime.targets){
            if((isStage||(!isStage&&runtime.targets[sprite].sprite.name==name))&&runtime.targets[sprite].isStage==isStage){
                return runtime.targets[sprite] 
            }}
    }
    setVarValue(varJson,name,value,targetId,type){
        //var variableId = '';
        for(var variable in varJson){
            if(varJson[variable].name==name&&varJson[variable].type==type)
            {VM.setVariableValue(targetId,variable,value);return}
        }
        //if(variableId!='')  vm.setVariableValue(targetId,variableId,value);
    }
    getVarValue(varJson,name,type){
        for(var variable in varJson){
            if(varJson[variable].name==name&&varJson[variable].type==type)  return varJson[variable].value;
        }
    }


    onInit() {
        api.addCategory({
            categoryId: 'nhjr.ToolBox.help', 
            messageId: 'nhjr.ToolBox.help',
            color: '#007ff4'
        });

        api.addCategory({
            categoryId: 'nhjr.ToolBox.StringAndType', 
            messageId: 'nhjr.ToolBox.StringAndType',
            color: '#007ff4'
        });
        api.addCategory({
            categoryId: 'nhjr.ToolBox.JSON', 
            messageId: 'nhjr.ToolBox.JSON',
            color: '#007ff4'
        });
        api.addCategory({
            categoryId: 'nhjr.ToolBox.list', 
            messageId: 'nhjr.ToolBox.list',
            color: '#007ff4'
        });
        api.addCategory({
            categoryId: 'nhjr.ToolBox.TemporaryVariable', 
            messageId: 'nhjr.ToolBox.TemporaryVariable',
            color: '#007ff4'
        });
        api.addCategory({
            categoryId: 'nhjr.ToolBox.RegularExpression', 
            messageId: 'nhjr.ToolBox.RegularExpression',
            color: '#007ff4'
        });
        api.addCategory({
            categoryId: 'nhjr.ToolBox.ConvenientModules', 
            messageId: 'nhjr.ToolBox.ConvenientModules',
            color: '#007ff4'
        });
        api.addCategory({
            categoryId: 'nhjr.ToolBox.debug', 
            messageId: 'nhjr.ToolBox.debug',
            color: '#007ff4'
        });



        //help
        api.addBlock({
            opcode: 'nhjr.ToolBox.help.github',
            type: type.BlockType.COMMAND,
            messageId: 'nhjr.ToolBox.help.github',
            categoryId: 'nhjr.ToolBox.help',
            function: args => this.openHelp("https://github.com/NanHaiJuRuo/clipcc-extension-nhjrToolBox")
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.help.gitee',
            type: type.BlockType.COMMAND,
            messageId: 'nhjr.ToolBox.help.gitee',
            categoryId: 'nhjr.ToolBox.help',
            function: args => this.openHelp("https://gitee.com/nanhaijuruo/clipcc-extension-nhjrToolBox")
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.help.codingclip',
            type: type.BlockType.COMMAND,
            messageId: 'nhjr.ToolBox.help.codingclip',
            categoryId: 'nhjr.ToolBox.help',
            function: args => this.openHelp("https://codingclip.com/editor/970")
        });

        //debug
        api.addBlock({
            opcode: 'nhjr.ToolBox.debug.ConsoleLog',
            type: type.BlockType.COMMAND,
            messageId: 'nhjr.ToolBox.debug.ConsoleLog',
            categoryId: 'nhjr.ToolBox.debug',
            param: {
                PRINT:{
                    type: type.ParameterType.STRING,
                    default: 'hello world'
                }
            },
            function: args => {
                try {console.log(args.PRINT)}
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.debug.error',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.debug.error',
            categoryId: 'nhjr.ToolBox.debug',
            function: args => nhjrToolBox_Error
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.debug.VM',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.debug.VM',
            categoryId: 'nhjr.ToolBox.debug',
            function: args => {
                try {if(nhjrToolBox_returnObj){return JSON.parse(this._str_ToStr(JSON.stringify(VM)))};
                    return this._str_ToStr(JSON.stringify(VM))}
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.debug.hatResult',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.debug.hatResult',
            categoryId: 'nhjr.ToolBox.debug',
            function: args => {
                try {return JSON.stringify(nhjrToolBox_hat_oldValue)}
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.debug.clearHatResult',
            type: type.BlockType.COMMAND,
            messageId: 'nhjr.ToolBox.debug.clearHatResult',
            categoryId: 'nhjr.ToolBox.debug',
            function: args => {
                try {nhjrToolBox_hat_oldValue={}}
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.debug.getAllTemporaryVariableJSON',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.debug.getAllTemporaryVariableJSON',
            categoryId: 'nhjr.ToolBox.debug',
            function: args => {
                try {
                    return JSON.stringify(nhjrToolBox_TemporaryVariable)
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.debug.setReturnError',
            type: type.BlockType.COMMAND,
            messageId: 'nhjr.ToolBox.debug.setReturnError',
            categoryId: 'nhjr.ToolBox.debug',
            function: args => {
                try {nhjrToolBox_returnError=this.returnForBoolean(args.BOOLEAN)}
                catch(e){return this.logError(e)}
            },param: {
                BOOLEAN:{
                    type: type.ParameterType.STRING,
                    default: 'false',
                    menu: this.makeMenus('nhjr.ToolBox.debug',['true','false'])
                }
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.debug.isReturnError',
            type: type.BlockType.BOOLEAN,
            messageId: 'nhjr.ToolBox.debug.isReturnError',
            categoryId: 'nhjr.ToolBox.debug',
            function: args => nhjrToolBox_returnError
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.debug.setReturnObj',
            type: type.BlockType.COMMAND,
            messageId: 'nhjr.ToolBox.debug.setReturnObj',
            categoryId: 'nhjr.ToolBox.debug',
            function: args => {
                try {nhjrToolBox_returnObj=this.returnForBoolean(args.BOOLEAN)}
                catch(e){return this.logError(e)}
            },param: {
                BOOLEAN:{
                    type: type.ParameterType.STRING,
                    default: 'false',
                    menu: this.makeMenus('nhjr.ToolBox.debug',['true','false'])
                }
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.debug.isReturnObj',
            type: type.BlockType.BOOLEAN,
            messageId: 'nhjr.ToolBox.debug.isReturnObj',
            categoryId: 'nhjr.ToolBox.debug',
            function: args => nhjrToolBox_returnObj
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.debug.JSON.parse',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.debug.JSON.parse',
            categoryId: 'nhjr.ToolBox.debug',
            param: {
                VALUE:{
                    type: type.ParameterType.STRING,
                    default: '{"key":"value"}',
                }
            },
            function: args => {
                try {return JSON.parse(args.VALUE)}
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.debug.JSON.stringify',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.debug.JSON.stringify',
            categoryId: 'nhjr.ToolBox.debug',
            param: {
                VALUE:{
                    type: type.ParameterType.ANY
                }
            },
            function: args => {
                try {return JSON.stringify(args.VALUE)}
                catch(e){return this.logError(e)}
            }
        });


        //便利积木 ConvenientModules
        api.addBlock({
            opcode: 'nhjr.ToolBox.ConvenientModules.getScratchList',
            type:type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.ConvenientModules.getScratchList',
            categoryId: 'nhjr.ToolBox.ConvenientModules',
            function: (args,util) => {
                try{
                    var Json = this.getSpriteByName(this.returnForBoolean(args.ISSTAGE),args.SPRITE,util.target.runtime);
                    var returnValue=this.returnForList(this.getVarValue(Json.variables,args.NAME,'list'));
                    return returnValue
                }catch(e){return this.logError(e)}
            },param: {
                NAME: {
                    type: type.ParameterType.STRING,
                    default: 'MyList'
                },
                SPRITE:{
                    type: type.ParameterType.STRING,
                    default: 'Stage'
                },
                ISSTAGE:{
                    type: type.ParameterType.STRING,
                    default: 'true',
                    menu: this.makeMenus('nhjr.ToolBox.ConvenientModules.isStage',['true','false'])
                }
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.ConvenientModules.saveListToScratch',
            type:type.BlockType.COMMAND,
            messageId: 'nhjr.ToolBox.ConvenientModules.saveListToScratch',
            categoryId: 'nhjr.ToolBox.ConvenientModules',
            function: (args,util) => {
                try{
                    var Json = this.getSpriteByName(this.returnForBoolean(args.ISSTAGE),args.SPRITE,util.target.runtime);
                    var saveList=this.inputStrToObj(args.LIST);
                    if (saveList instanceof Array){
                        for (i = 0; i < saveList.length; i++){
                            if (!['string','number'].includes(typeof(saveList[i]))){
                                saveList[i]=String(saveList[i])
                            }
                        };this.setVarValue(Json.variables,args.NAME,saveList,Json.id,'list')
                    }
                    
                }catch(e){return this.logError(e)}
            },param: {
                NAME: {
                    type: type.ParameterType.STRING,
                    default: 'MyList'
                },LIST:{
                    type: type.ParameterType.STRING,
                    default: '["apple","banana","cat"]'
                },SPRITE:{
                    type: type.ParameterType.STRING,
                    default: 'Stage'
                },
                ISSTAGE:{
                    type: type.ParameterType.STRING,
                    default: 'true',
                    menu: this.makeMenus('nhjr.ToolBox.ConvenientModules.isStage',['true','false'])
                }
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.ConvenientModules.getScratchVariable',
            type:type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.ConvenientModules.getScratchVariable',
            categoryId: 'nhjr.ToolBox.ConvenientModules',
            function: (args,util) => {
                try{
                    var Json = this.getSpriteByName(this.returnForBoolean(args.ISSTAGE),args.SPRITE,util.target.runtime);
                    return this.getVarValue(Json.variables,args.NAME,'')
                }catch(e){return this.logError(e)}
            },param: {
                NAME: {
                    type: type.ParameterType.STRING,
                    default: 'MyVariable'
                },SPRITE:{
                    type: type.ParameterType.STRING,
                    default: 'Stage'
                },
                ISSTAGE:{
                    type: type.ParameterType.STRING,
                    default: 'true',
                    menu: this.makeMenus('nhjr.ToolBox.ConvenientModules.isStage',['true','false'])
                }
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.ConvenientModules.saveVariableToScratch',
            type:type.BlockType.COMMAND,
            messageId: 'nhjr.ToolBox.ConvenientModules.saveVariableToScratch',
            categoryId: 'nhjr.ToolBox.ConvenientModules',
            function: (args,util) => {
                try{
                    var Json = this.getSpriteByName(this.returnForBoolean(args.ISSTAGE),args.SPRITE,util.target.runtime);
                    var saveValue=args.VALUE;
                    if (!['string','number'].includes(typeof(saveValue))){
                        saveValue=String(saveValue)
                    };this.setVarValue(Json.variables,args.NAME,saveValue,Json.id,'')
                }catch(e){return this.logError(e)}
            },param: {
                NAME: {
                    type: type.ParameterType.STRING,
                    default: 'MyList'
                },VALUE:{
                    type: type.ParameterType.STRING,
                    default: '0'
                },SPRITE:{
                    type: type.ParameterType.STRING,
                    default: 'Stage'
                },
                ISSTAGE:{
                    type: type.ParameterType.STRING,
                    default: 'true',
                    menu: this.makeMenus('nhjr.ToolBox.ConvenientModules.isStage',['true','false'])
                }
            }
        });

        api.addBlock({
            opcode: 'nhjr.ToolBox.ConvenientModules.hatWhenBecomeTrue',
            type: type.BlockType.HAT,
            messageId: 'nhjr.ToolBox.ConvenientModules.hatWhenBecomeTrue',
            categoryId: 'nhjr.ToolBox.ConvenientModules',
            param: {
                CONDITION: {
                    type: type.ParameterType.BOOLEAN
                }
            },
            function: (args,util) => {
                try{//util.thread.peekStack() 是函数调用来源积木ID。通过这个区分，可以避免bug
                    var CONDITION=this.returnForBoolean(args.CONDITION);
                    if (nhjrToolBox_hat_oldValue[util.thread.peekStack()]!=(CONDITION) && CONDITION) {
                        nhjrToolBox_hat_oldValue[util.thread.peekStack()] = CONDITION;
                        return true;
                    }
                    nhjrToolBox_hat_oldValue[util.thread.peekStack()] = CONDITION;
                }
                catch(e){return this.logError(e)};
                return false;
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.ConvenientModules.hatWhenChange',
            type: type.BlockType.HAT,
            messageId: 'nhjr.ToolBox.ConvenientModules.hatWhenChange',
            categoryId: 'nhjr.ToolBox.ConvenientModules',
            param: {
                CONDITION: {
                    type: type.ParameterType.STRING,
                    default: ' '
                }
            },
            function: (args,util) => {
                try{//util.thread.peekStack() 是函数调用来源积木ID。通过这个区分，可以避免bug
                    if (nhjrToolBox_hat_oldValue[util.thread.peekStack()]!=(args.CONDITION)) {
                        nhjrToolBox_hat_oldValue[util.thread.peekStack()] = args.CONDITION;
                        return true;
                    }
                    nhjrToolBox_hat_oldValue[util.thread.peekStack()] = args.CONDITION;
                }
                catch(e){return this.logError(e)};
                return false;
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.nullCmd',
            type: type.BlockType.COMMAND,
            messageId: 'nhjr.ToolBox.nullCmd',
            categoryId: 'nhjr.ToolBox.ConvenientModules',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: ' '
                }
            },
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.ConvenientModules.NeverGonnaGiveYouStart',
            type: type.BlockType.HAT,
            messageId: 'nhjr.ToolBox.ConvenientModules.NeverGonnaGiveYouStart',
            categoryId: 'nhjr.ToolBox.ConvenientModules',
            function: (args) => false
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.ConvenientModules.NeverGonnaLetYouStop',
            type: type.BlockType.HAT,
            messageId: 'nhjr.ToolBox.ConvenientModules.NeverGonnaLetYouStop',
            categoryId: 'nhjr.ToolBox.ConvenientModules',
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.ConvenientModules.hatWhenIsTrue',
            type: type.BlockType.HAT,
            messageId: 'nhjr.ToolBox.ConvenientModules.hatWhenIsTrue',
            categoryId: 'nhjr.ToolBox.ConvenientModules',
            param: {
                CONDITION: {
                    type: type.ParameterType.BOOLEAN
                }
            },
            function: (args) => {return this.returnForBoolean(args.CONDITION)}
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.ConvenientModules.ifElseReturn',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.ConvenientModules.ifElseReturn',
            categoryId: 'nhjr.ToolBox.ConvenientModules',
            param: {
                CONDITION: {
                    type: type.ParameterType.BOOLEAN
                },
                VALUE1:{
                    type:type.ParameterType.STRING,
                    default:'true'
                },
                VALUE2:{
                    type:type.ParameterType.STRING,
                    default:'false'
                }
            },
            function: (args) => { if (args.CONDITION){return args.VALUE1} else {return args.VALUE2} }
        });
        api.addBlock({//借鉴自棒棒糖
            opcode: 'nhjr.ToolBox.ConvenientModules.writeClipboard',
            type: type.BlockType.COMMAND,
            messageId: 'nhjr.ToolBox.ConvenientModules.writeClipboard',
            categoryId: 'nhjr.ToolBox.ConvenientModules',
            param: {
                TEXT: {
                    type: type.ParameterType.STRING,
                    default: 'Hello World!'
                }
            },
            function: (args) => {
                if (navigator.clipboard){navigator.clipboard.writeText(args.TEXT)}
                else {this.logError('Clipboard not supported')}; //不支持剪贴板
            }
        });


        //String and Type
        api.addBlock({
            //带引号的字符串
            opcode: 'nhjr.ToolBox.StringAndType.strToSTR',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.strToSTR',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: 'Hello World!'
                }
            },
            function: args => {
                try {
                    return this.strTo_str_(args.VALUE)
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.STRtoStr',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.STRtoStr',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: '"Hello\\nWorld!"'
                }
            },
            function: args => this._str_ToStr(args.VALUE)
        });

        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.typeof',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.typeof',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.ANY
                }
            },
            function: args => typeof(args.VALUE)
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.instanceof',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.instanceof',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE1: {
                    type: type.ParameterType.ANY
                },
                VALUE2: {
                    type: type.ParameterType.STRING,
                    default: 'Array'
                }
            },
            function: args => {
                try{if(/^[a-zA-Z]+$/.test(args.VALUE2)){
                        return eval(`args.VALUE1 instanceof ${args.VALUE2}`)
                    };return ''
                }catch(e){return this.logError(e)}
            }
        });

        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.String',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.String',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: 'string'
                }
            },
            function: args => {
                try {return String(args.VALUE)}
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.Number',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.Number',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: '123'
                }
            },
            function: args => {
                try {return Number(args.VALUE)}
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.repeat',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.repeat',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: '唔'
                },
                REPEAT:{
                    type: type.ParameterType.NUMBER,
                    default: '3'
                }
            },
            function: args => {
                try {return (String(args.VALUE)).repeat(args.REPEAT)}
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.slice',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.slice',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: 'Hello World!'
                },
                NUMBER1:{
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                NUMBER2:{
                    type: type.ParameterType.NUMBER,
                    default: '-1'
                }
            },
            function: args => {
                try {
                    if (args.NUMBER2==''){
                        return (String(args.VALUE)).slice(args.NUMBER1,)
                    }else{
                    return (String(args.VALUE)).slice(args.NUMBER1,args.NUMBER2)
                    }
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.return',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.return',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: 'Hello World!'
                }
            },
            function: args => args.VALUE
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.returnColor',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.returnColor',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.COLOR,
                    default: '#4c97ff'
                }
            },
            function: args => args.VALUE
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.returnForBoolean',
            type: type.BlockType.BOOLEAN,
            messageId: 'nhjr.ToolBox.StringAndType.returnForBoolean',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: '0'
                }
            },
            function: args => args.VALUE
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.istrue',
            type: type.BlockType.BOOLEAN,
            messageId: 'nhjr.ToolBox.StringAndType.istrue',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: 'false'
                }
            },
            function: args => this.returnForBoolean(args.VALUE)
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.equal',
            type: type.BlockType.BOOLEAN,
            messageId: 'nhjr.ToolBox.StringAndType.equal',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE1: {
                    type: type.ParameterType.STRING,
                    default: 'abc'
                },VALUE2: {
                    type: type.ParameterType.STRING,
                    default: 'ABC'
                }
            },
            function: args => (args.VALUE1==args.VALUE2)
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.NOTequal',
            type: type.BlockType.BOOLEAN,
            messageId: 'nhjr.ToolBox.StringAndType.NOTequal',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE1: {
                    type: type.ParameterType.STRING,
                    default: 'abc'
                },VALUE2: {
                    type: type.ParameterType.STRING,
                    default: 'ABC'
                }
            },
            function: args => (args.VALUE1!=args.VALUE2)
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.DecimalToHex',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.DecimalToHex',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: '500'
                },
                ADD0X: {
                    type: type.ParameterType.STRING,
                    default: 'true',
                    menu: this.makeMenus('nhjr.ToolBox.StringAndType.hex',['true','false'])
                }
            },
            function: args => {
                try{
                    if (this.returnForBoolean(args.ADD0X)){return '0x'+Number(args.VALUE).toString(16)}
                    else{return Number(args.VALUE).toString(16)}
                }
                catch{return this.logError(e)}
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.HEXToDecimal',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.HEXToDecimal',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: '1f4'
                }
            },
            function: args => {
                try{
                    if (String(args.VALUE).slice(0,3)=='0x'){return Number(args.VALUE)}
                    else{return Number('0x'+args.VALUE)}
                }
                catch{return this.logError(e)}
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.NumberToString',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.NumberToString',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: '500'
                },TOSTRING:{
                    type: type.ParameterType.STRING,
                    default: '16'
                }
            },
            function: args => {
                try{return Number(args.VALUE).toString(Number(args.TOSTRING))}
                catch{return this.logError(e)}
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.RemoveBeginEndingWhiteSpace',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.RemoveBeginEndingWhiteSpace',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: '    Hello World!    '
                }
            },
            function: args => {
                try{return String(args.VALUE).replace(/^\s+/,'').replace(/\s+$/,'')}
                catch(e){return this.logError(e)}    
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.TextToURL',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.TextToURL',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: 'https://codingclip.com'
                },
                CODE:{
                    type: type.ParameterType.STRING,
                    default: 'encodeURIComponent',
                    menu: this.makeMenus('nhjr.ToolBox.StringAndType.TextToURL',['encodeURIComponent','escape','encodeURI'])
                }
            },
            function: args => {
                try{var TextToURL=String(args.VALUE);
                    if (['encodeURIComponent','escape','encodeURI'].includes(args.CODE))
                        {return eval(`${args.CODE}(TextToURL)`)}
                    else{return ''}
                }
                catch(e){return this.logError(e)}    
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.URLToText',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.URLToText',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: 'https%3A%2F%2Fcodingclip.com'
                },
                CODE:{
                    type: type.ParameterType.STRING,
                    default: 'decodeURIComponent',
                    menu: this.makeMenus('nhjr.ToolBox.StringAndType.URLToText',['decodeURIComponent','unescape','decodeURI'])
                }
            },
            function: args => {
                try{
                    var URLToText=String(args.VALUE);
                    if (['decodeURIComponent','unescape','decodeURI'].includes(args.CODE))
                        {return eval(`${args.CODE}(URLToText)`)}
                    else{return ''}
                }
                catch(e){return this.logError(e)}    
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.charCodeAt',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.charCodeAt',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: 'wow'
                },
                NUMBER:{
                    type: type.ParameterType.NUMBER,
                    default: '0',
                }
            },
            function: args => {
                try{return args.VALUE[args.NUMBER].charCodeAt()}
                catch(e){return this.logError(e)}    
            }
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.StringAndType.fromCharCode',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.StringAndType.fromCharCode',
            categoryId: 'nhjr.ToolBox.StringAndType',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: '119'
                }
            },
            function: args => {
                try{return String.fromCharCode(args.VALUE)}
                catch(e){return this.logError(e)}    
            }
        });

        //readJSON
        api.addBlock({
            opcode:'nhjr.ToolBox.JSON.readValueFromKey',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.JSON.readValueFromKey',
            categoryId: 'nhjr.ToolBox.JSON',
            param: {
                JSON:{
                    type: type.ParameterType.STRING,
                    default: '{"key":{"key2":"value"}}'
                },
                KEY: {
                    type: type.ParameterType.STRING,
                    default: '"key","key2"'
                }
            },
            function: args => {
                try{var json=this.inputStrToObj(args.JSON);
                    var i=0;
                    var keys=JSON.parse(`[${args.KEY}]`);
                    var value=json[keys[0]];
                    while (i < keys.length-1){
                        i+=1;
                        var value=value[keys[i]];
                    };return this.returnForJSON(value)
                }catch(e){return this.logError(e)}
        }});
        api.addBlock({
            opcode:'nhjr.ToolBox.JSON.readKeys',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.JSON.readKeys',
            categoryId: 'nhjr.ToolBox.JSON',
            param: {
                JSON:{
                    type: type.ParameterType.STRING,
                    default: '{"key":"value"}'
                },
                MENU: {
                    type: type.ParameterType.STRING,
                    default: 'keys',
                    menu: this.makeMenus('nhjr.ToolBox.JSON.readKeys',['keys','values','entries'])
                }
            },
            function: args => {
                try{if(['keys','values','entries'].includes(args.MENU)){
                    var json=this.inputStrToObj(args.JSON);
                    return this.returnForJSON(eval(`Object.${args.MENU}(json)`))
                }
            }catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.JSON.containsKey',
            type: type.BlockType.BOOLEAN,
            messageId: 'nhjr.ToolBox.JSON.containsKey',
            categoryId: 'nhjr.ToolBox.JSON',
            param: {
                JSON:{
                    type: type.ParameterType.STRING,
                    default: '{"key":"value"}'
                },
                KEY: {
                    type: type.ParameterType.STRING,
                    default: 'key',
                }
            },
            function: args => {
                try {return (this.inputStrToObj(args.JSON)).hasOwnProperty(args.KEY)}
                catch(e){return this.logError(e)}
            }
        });

        //setJSON 未完成！！！！！！
        api.addBlock({
            opcode:'nhjr.ToolBox.JSON.setValue',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.JSON.setValue',
            categoryId: 'nhjr.ToolBox.JSON',
            param: {
                JSON:{
                    type: type.ParameterType.STRING,
                    default: '{"key":{"key2":"value"}}'
                },
                KEY: {
                    type: type.ParameterType.STRING,
                    default: '"key","key2"'
                },
                VALUE:{
                    type: type.ParameterType.STRING,
                    default: '"ok"'
                }
            },
            function: args => {
                try {
                    var keys=JSON.parse(`[${args.KEY}]`);
                    var valueList=[this.inputStrToObj(args.JSON)];
                    var i=0;
                    while (i<keys.length){
                        i+=1;
                        valueList[i]=valueList[i-1][keys[i-1]];
                    };valueList[i]=this._str_ToStr(args.VALUE);
                    while (i>0){
                        valueList[i-1][keys[i-1]]=valueList[i];
                        delete valueList[i];
                        i-=1;
                    };
                    return this.returnForJSON(valueList[0])
                }catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.JSON.keyRename',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.JSON.keyRename',
            categoryId: 'nhjr.ToolBox.JSON',
            param: {
                JSON:{
                    type: type.ParameterType.STRING,
                    default: '{"key":{"key2":"value"}}'
                },
                KEY: {
                    type: type.ParameterType.STRING,
                    default: '"key","key2"'
                },
                NEWKEY:{
                    type: type.ParameterType.STRING,
                    default: '"newKey"'
                }
            },
            function: args => {
                try {
                    var keys=JSON.parse(`[${args.KEY}]`);
                    var NEW=this._str_ToStr(args.NEWKEY);
                    var valueList=[this.inputStrToObj(args.JSON)];
                    var i=0;
                    while (i<keys.length-1){
                        i+=1;console.log(i);
                        valueList[i]=valueList[i-1][keys[i-1]];
                    };
                    valueList[i][NEW]=valueList[i][keys[i]];
                    delete valueList[i][keys[i]];
                    i-=1;
                    while (i>0){
                        valueList[i-1][keys[i-1]]=valueList[i];
                        delete valueList[i];
                        i-=1;
                    };
                    return this.returnForJSON(valueList[0])
                }catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.JSON.delKey',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.JSON.delKey',
            categoryId: 'nhjr.ToolBox.JSON',
            param: {
                JSON:{
                    type: type.ParameterType.STRING,
                    default: '{"key":{"key2":"value"}}'
                },
                KEY: {
                    type: type.ParameterType.STRING,
                    default: '"key","key2"'
                }
            },
            function: args => {
                try {
                    var keys=JSON.parse(`[${args.KEY}]`);
                    var valueList=[this.inputStrToObj(args.JSON)];
                    var i=0;
                    while (i<keys.length-1){
                        i+=1;console.log(i);
                        valueList[i]=valueList[i-1][keys[i-1]];
                    };
                    delete valueList[i][keys[i]];
                    i-=1;
                    while (i>0){
                        valueList[i-1][keys[i-1]]=valueList[i];
                        delete valueList[i];
                        i-=1;
                    };
                    return this.returnForJSON(valueList[0])
                }catch(e){return this.logError(e)}
            }
        });

        //list (array)
        api.addBlock({
            opcode:'nhjr.ToolBox.list.itemN',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.list.itemN',
            categoryId: 'nhjr.ToolBox.list',
            param: {
                LIST:{
                    type: type.ParameterType.STRING,
                    default: '["apple","banana","cat"]'
                },
                N: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                }
            },
            function: args => this.list_itemN(args.LIST,args.N)
        });
        api.addBlock({
            opcode: 'nhjr.ToolBox.list.slice',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.list.slice',
            categoryId: 'nhjr.ToolBox.list',
            param: {
                LIST: {
                    type: type.ParameterType.STRING,
                    default: '["apple","banana","cat"]'
                },
                NUMBER1:{
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                NUMBER2:{
                    type: type.ParameterType.NUMBER,
                    default: '-1'
                }
            },
            function: args => {
                try {
                    if (args.NUMBER2==''){
                        return this.returnForList(this.inputStrToObj(args.LIST).slice(args.NUMBER1,))
                    }else{
                        return this.returnForList(this.inputStrToObj(args.LIST).slice(args.NUMBER1,args.NUMBER2))
                    }
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.list.length',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.list.length',
            categoryId: 'nhjr.ToolBox.list',
            param: {
                LIST:{
                    type: type.ParameterType.STRING,
                    default: '["apple","banana","cat"]'
                }
            },
            function: args => {
                try {return (this.inputStrToObj(args.LIST)).length}
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.list.indexOf',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.list.indexOf',
            categoryId: 'nhjr.ToolBox.list',
            param: {
                LIST:{
                    type: type.ParameterType.STRING,
                    default: '["apple","banana","cat"]'
                },
                INDEXOF:{
                    type: type.ParameterType.STRING,
                    default: '"cat"'
                }
            },
            function: args => {
                try {return (this.inputStrToObj(args.LIST)).indexOf(this._str_ToStr(args.INDEXOF))}
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.list.includes',
            type: type.BlockType.BOOLEAN,
            messageId: 'nhjr.ToolBox.list.includes',
            categoryId: 'nhjr.ToolBox.list',
            param: {
                LIST:{
                    type: type.ParameterType.STRING,
                    default: '["apple","banana","cat"]'
                },
                VALUE:{
                    type: type.ParameterType.STRING,
                    default: '"cat"'
                }
            },
            function: args => {
                try {return (this.inputStrToObj(args.LIST)).includes(this._str_ToStr(args.VALUE))}
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.list.setN',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.list.setN',
            categoryId: 'nhjr.ToolBox.list',
            param: {
                LIST:{
                    type: type.ParameterType.STRING,
                    default: '["apple","banana","cat"]'
                },
                N:{
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                VALUE:{
                    type: type.ParameterType.STRING,
                    default: '"cat"'
                }
            },
            function: args => {
                try {
                    return this.list_setN(args.LIST,args.N,args.VALUE)
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.list.addItem',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.list.addItem',
            categoryId: 'nhjr.ToolBox.list',
            param: {
                LIST:{
                    type: type.ParameterType.STRING,
                    default: '["apple","banana","cat"]'
                },
                VALUE:{
                    type: type.ParameterType.STRING,
                    default: '"clipcc"'
                }
            },
            function: args => {
                try {
                    return this.list_setN(args.LIST, (this.inputStrToObj(args.LIST)).length, args.VALUE)
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.list.removeDuplicateItems',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.list.removeDuplicateItems',
            categoryId: 'nhjr.ToolBox.list',
            param: {
                LIST:{
                    type: type.ParameterType.STRING,
                    default: '["apple","apple","apple","banana","banana","banana","cat","cat","cat"]'
                }
            },
            function: args => {
                try {
                    return this.returnForList(Array.from(new Set(this.inputStrToObj(args.LIST))))
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.list.mxxItem',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.list.mxxItem',
            categoryId: 'nhjr.ToolBox.list',
            param: {
                LIST:{
                    type: type.ParameterType.STRING,
                    default: '[999,123,456,654,15,30,664]'
                },
                M:{
                    type: type.ParameterType.STRING,
                    default: 'max',
                    menu: this.makeMenus('nhjr.ToolBox.list.mxxItem',['max','min'])
                }
            },
            function: args => {
                try {
                    if (['max','min'].includes(args.M)){
                        return this.returnForList(eval(`Math.${args.M}.apply(null, this.inputStrToObj(args.LIST))`))
                    }
                    
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.list.sort',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.list.sort',
            categoryId: 'nhjr.ToolBox.list',
            param: {
                LIST:{
                    type: type.ParameterType.STRING,
                    default: '[999,123,456,654,15,30,664]'
                },
                M:{
                    type: type.ParameterType.STRING,
                    default: 'sort',
                    menu: this.makeMenus('nhjr.ToolBox.list.sort',['sort','reverse'])
                },
                FUN:{
                    type: type.ParameterType.STRING,
                    default: 'up',
                    menu: this.makeMenus('nhjr.ToolBox.list.sort.fun',['null','up','down'])
                }
            },
            function: args => {
                try {
                    if (['sort','reverse'].includes(args.M) && ['null','up','down'].includes(args.FUN)){
                        return this.returnForList(eval(`this.inputStrToObj(args.LIST).${args.M}(${ ( ['','function(a,b){return a-b}','function(a,b){return b-a}'][ ['null','up','down'].indexOf(args.FUN) ] ) })`))
                    }
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.list.join',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.list.join',
            categoryId: 'nhjr.ToolBox.list',
            param: {
                LIST:{
                    type: type.ParameterType.STRING,
                    default: '["apple","banana","cat"]'
                },
                VALUE:{
                    type: type.ParameterType.STRING,
                    default: ' '
                }
            },
            function: args => {
                try {
                    return this.returnForList(this.inputStrToObj(args.LIST).join(args.VALUE))
                }
                catch(e){return this.logError(e)}
            }
        });
        


        //临时变量 Temporary Variable
        api.addBlock({
            opcode:'nhjr.ToolBox.TemporaryVariable.clearAllVariable',
            type: type.BlockType.COMMAND,
            messageId: 'nhjr.ToolBox.TemporaryVariable.clearAllVariable',
            categoryId: 'nhjr.ToolBox.TemporaryVariable',
            function: args => {
                try {
                    nhjrToolBox_TemporaryVariable={}
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.TemporaryVariable.setItoValue',
            type: type.BlockType.COMMAND,
            messageId: 'nhjr.ToolBox.TemporaryVariable.setItoValue',
            categoryId: 'nhjr.ToolBox.TemporaryVariable',
            param: {
                NAME:{
                    type: type.ParameterType.STRING,
                    default: 'i'
                },
                VALUE:{
                    type: type.ParameterType.STRING,
                    default: 'value'
                }
            },
            function: args => {
                try {
                    nhjrToolBox_TemporaryVariable[args.NAME]=args.VALUE
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.TemporaryVariable.getVariable',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.TemporaryVariable.getVariable',
            categoryId: 'nhjr.ToolBox.TemporaryVariable',
            param: {
                NAME:{
                    type: type.ParameterType.STRING,
                    default: 'i'
                }
            },
            function: args => {
                try {
                    return nhjrToolBox_TemporaryVariable[args.NAME]
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.TemporaryVariable.deleteVariable',
            type: type.BlockType.COMMAND,
            messageId: 'nhjr.ToolBox.TemporaryVariable.deleteVariable',
            categoryId: 'nhjr.ToolBox.TemporaryVariable',
            param: {
                NAME:{
                    type: type.ParameterType.STRING,
                    default: 'i'
                }
            },
            function: args => {
                try {
                    delete nhjrToolBox_TemporaryVariable[args.NAME]
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.TemporaryVariable.VariableExist',
            type: type.BlockType.BOOLEAN,
            messageId: 'nhjr.ToolBox.TemporaryVariable.VariableExist',
            categoryId: 'nhjr.ToolBox.TemporaryVariable',
            param: {
                NAME:{
                    type: type.ParameterType.STRING,
                    default: 'i'
                }
            },
            function: args => {
                try {
                    return (args.NAME in nhjrToolBox_TemporaryVariable)
                }
                catch(e){return this.logError(e)}
            }
        });

        //正则表达式 Regular Expression
        api.addBlock({
            opcode:'nhjr.ToolBox.RegularExpression.test',
            type: type.BlockType.BOOLEAN,
            messageId: 'nhjr.ToolBox.RegularExpression.test',
            categoryId: 'nhjr.ToolBox.RegularExpression',
            param: {
                VALUE1:{
                    type: type.ParameterType.STRING,
                    default: '/^#[0-9a-fA-F]{6}$/'
                },
                VALUE2:{
                    type: type.ParameterType.STRING,
                    default: '#123456'
                }
            },
            function: args => {
                try {
                    return this.String_to_Regular_Expression(args.VALUE1).test(String(args.VALUE2))
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.RegularExpression.exec',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.RegularExpression.exec',
            categoryId: 'nhjr.ToolBox.RegularExpression',
            param: {
                VALUE1:{
                    type: type.ParameterType.STRING,
                    default: '/^#[0-9a-fA-F]{6}$/'
                },
                VALUE2:{
                    type: type.ParameterType.STRING,
                    default: '#123456'
                }
            },
            function: args => {
                try {
                    return this.String_to_Regular_Expression(args.VALUE1).exec(String(args.VALUE2))
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.RegularExpression.search',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.RegularExpression.search',
            categoryId: 'nhjr.ToolBox.RegularExpression',
            param: {
                VALUE1:{
                    type: type.ParameterType.STRING,
                    default: 'Hello,World. hello,ClipCC.'
                },
                VALUE2:{
                    type: type.ParameterType.STRING,
                    default: '/Hello/i'
                }
            },
            function: args => {
                try {
                    return String(args.VALUE1).search(this.String_to_Regular_Expression(args.VALUE2))
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.RegularExpression.match',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.RegularExpression.match',
            categoryId: 'nhjr.ToolBox.RegularExpression',
            param: {
                VALUE1:{
                    type: type.ParameterType.STRING,
                    default: 'Hello,World. hello,ClipCC.'
                },
                VALUE2:{
                    type: type.ParameterType.STRING,
                    default: '/Hello/ig'
                },
                MENU:{
                    type: type.ParameterType.STRING,
                    default: 'match',
                    menu:this.makeMenus('nhjr.ToolBox.RegularExpression.match',['match','begin','ending','matchANDbeginANDending','beginANDending'])
                }
            },
            function: args => {
                try {
                    var VALUE1=String(args.VALUE1);
                    var VALUE2=this.String_to_Regular_Expression(args.VALUE2);
                    var RETURN=[];
                    var RETURN_match=VALUE1.match(VALUE2);
                    var MENU=args.MENU;
                    if (MENU=='match'){return this.returnForList(RETURN_match)};
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
                    return this.returnForList(RETURN)
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.RegularExpression.replace',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.RegularExpression.replace',
            categoryId: 'nhjr.ToolBox.RegularExpression',
            param: {
                VALUE1:{
                    type: type.ParameterType.STRING,
                    default: 'Hello,World. hello,ClipCC.'
                },
                VALUE2:{
                    type: type.ParameterType.STRING,
                    default: '/Hello/ig'
                },
                VALUE3:{
                    type: type.ParameterType.STRING,
                    default: '"Hi"'
                }
            },
            function: args => {
                try {
                    return String(args.VALUE1).replace(this.String_to_Regular_Expression(args.VALUE2),this._str_ToStr(args.VALUE3))
                }
                catch(e){return this.logError(e)}
            }
        });
        api.addBlock({
            opcode:'nhjr.ToolBox.RegularExpression.split',
            type: type.BlockType.REPORTER,
            messageId: 'nhjr.ToolBox.RegularExpression.split',
            categoryId: 'nhjr.ToolBox.RegularExpression',
            param: {
                VALUE1:{
                    type: type.ParameterType.STRING,
                    default: 'apple banana cat'
                },
                VALUE2:{
                    type: type.ParameterType.STRING,
                    default: '" "'
                }
            },
            function: args => {
                try {var VALUE2=this.String_to_Regular_Expression(args.VALUE2);
                    if (VALUE2==''){var VALUE2=this._str_ToStr(args.VALUE2)}
                    return this.returnForList(String(args.VALUE1).split(VALUE2))
                }
                catch(e){return this.logError(e)}
            }
        });
    }



    onUninit() {
        api.removeCategory('nhjr.ToolBox.help');
        api.removeCategory('nhjr.ToolBox.JSON');
        api.removeCategory('nhjr.ToolBox.list');
        api.removeCategory('nhjr.ToolBox.TemporaryVariable');
        api.removeCategory('nhjr.ToolBox.StringAndType');
        api.removeCategory('nhjr.ToolBox.RegularExpression');
        api.removeCategory('nhjr.ToolBox.ConvenientModules');
        api.removeCategory('nhjr.ToolBox.debug');
    }
}
module.exports = nhjrToolBoxExtension;