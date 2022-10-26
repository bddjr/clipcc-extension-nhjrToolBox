addBlock('ConsoleLog',tBT.COMMAND,
    a => {
        try {console.log(a.PRINT)}
        catch(e){return this.logError(e)}
    },{PRINT:{
        type: tPT.STRING,
        default: 'hello world'
        }
});
addBlock('error',tBT.REPORTER, () => NTB_Error);
addBlock('errorList',tBT.REPORTER, () => this.ScratchType(NTB_ErrorList));
addBlock('clearErrorList',tBT.COMMAND, () => {NTB_ErrorList=[]});
addBlock('setErrorListLengthLimit',tBT.COMMAND,
    a => {
        var n= Math.round(Number(a.NUMBER));
        if (n<0 || [NaN,Infinity].includes(n)) n=0 ;
        NTB_ErrorListLengthLimit= n;
        if (NTB_ErrorList.length >= NTB_ErrorListLengthLimit){
            NTB_ErrorList.splice(0, NTB_ErrorList.length - NTB_ErrorListLengthLimit)
        }
    },{NUMBER:{
            type: tPT.NUMBER,
            default: '50',
        }
});
addBlock('getErrorListLengthLimit',tBT.REPORTER, () => NTB_ErrorListLengthLimit);
addBlock('setConsoleLogError',tBT.COMMAND,
    a => {
        try {NTB_consoleLogError=this.inputStrToBool(a.BOOLEAN)}
        catch(e){return this.logError(e)}
    },{BOOLEAN:{
        type: tPT.STRING,
        default: 'false',
        menu: this.makeMenus('nhjr.ToolBox.debug',['true','false'])
        }
});
addBlock('isConsoleLogError',tBT.BOOLEAN, () => NTB_consoleLogError);

addBlock('VM',tBT.REPORTER, () => {
    try{
        return VM.toJSON()
    }catch(e){return this.logError(e)}
});
addBlock('getAllTemporaryVariableJSON',tBT.REPORTER, () => {
    try {
        return JSON.stringify(NTB_TemporaryVariable)
    }
    catch(e){return this.logError(e)}
});
addBlock('getSpriteAllTemporaryVariableJSON',tBT.REPORTER, (a,util) => {
    try {
        var Json= this.block_list_getJson(a.ISSTAGE,a.SPRITE,util);
        if(Json.hasOwnProperty('NTBE_TemporaryVariable')) return JSON.stringify(Json.NTBE_TemporaryVariable)
    }
    catch(e){return this.logError(e)}
},{
    SPRITE:{
        type: tPT.STRING,
        default: 'Stage',
        menu: ()=>this.spritesMenu()
    },ISSTAGE:{
        type: tPT.STRING,
        default: 'true',
        menu: this.isStageMenus()
    }
});
addBlock('setReturnError',tBT.COMMAND,
    a => {
        try {NTB_returnError=this.inputStrToBool(a.BOOLEAN)}
        catch(e){return this.logError(e)}
    },{BOOLEAN:{
            type: tPT.STRING,
            default: 'false',
            menu: this.makeMenus('nhjr.ToolBox.debug',['true','false'])
        }
});
addBlock('isReturnError',tBT.BOOLEAN, () => NTB_returnError);

addBlock('setReturnObj',tBT.COMMAND,
    a => {
        try {NTB_returnObj=this.inputStrToBool(a.BOOLEAN)}
        catch(e){return this.logError(e)}
    },{BOOLEAN:{
            type: tPT.STRING,
            default: 'false',
            menu: this.makeMenus('nhjr.ToolBox.debug',['true','false'])
        }
});
addBlock('isReturnObj',tBT.BOOLEAN, () => NTB_returnObj);

addBlock('JSON.parse',tBT.REPORTER,
    a => {
        try {return JSON.parse(a.VALUE)}
        catch(e){return this.logError(e)}
    },{VALUE:{
            type: tPT.STRING,
            default: '{"key":"value"}',
        }
});
addBlock('JSON.stringify',tBT.REPORTER,
    a => {
        try {return JSON.stringify(a.VALUE)}
        catch(e){return this.logError(e)}
    },{VALUE:{
            type: tPT.STRING,
            default:' '
        }
});
/*
addBlock('newObj',tBT.REPORTER,
    a => {
        try {return new a.VALUE}
        catch(e){return this.logError(e)}
    },{VALUE:{
            type: tPT.STRING,
            default:' '
        }
});
addBlock('logUtil',tBT.COMMAND, (a,util) => console.log(util) );
addBlock('logVM',tBT.COMMAND, () => console.log(VM) );
addBlock('updateAllDrawableProperties',tBT.COMMAND, (a,util) => util.target.updateAllDrawableProperties() );
*/
