addBlock('readValueFromKey',tBT.REPORTER,
    a => this.block_JSON_readValueFromKey(a.JSON,a.KEY) ,
    {
        JSON:{
            type: tPT.STRING,
            default: '{"key":{"key2":"value"}}'
        },
        KEY: {
            type: tPT.STRING,
            default: '"key","key2"'
        }
});
addBlock('readKeys',tBT.REPORTER,
    a => this.block_JSON_readKeys(a.JSON,a.MENU) ,
    {
        JSON:{
            type: tPT.STRING,
            default: '{"key":"value"}'
        },
        MENU: {
            type: tPT.STRING,
            default: 'keys',
            menu: this.makeMenus('nhjr.ToolBox.JSON.readKeys',['keys','values','entries'])
        }
});
addBlock('containsKey',tBT.BOOLEAN,
    a => {
        try {return (this.inputStrToObj(a.JSON)).hasOwnProperty(a.KEY)}
        catch(e){return this.logError(e)}
    },{
        JSON:{
            type: tPT.STRING,
            default: '{"key":"value"}'
        },
        KEY: {
            type: tPT.STRING,
            default: 'key',
        }
});
addBlock('setValue',tBT.REPORTER,
    a => this.block_JSON_setValue(a.JSON,a.KEY,a.VALUE,a.OPERATOR) ,
    {
        JSON:{
            type: tPT.STRING,
            default: '{"key":{"key2":"value"}}'
        },
        KEY: {
            type: tPT.STRING,
            default: '"key","key2"'
        },
        VALUE:{
            type: tPT.STRING,
            default: '"ok"'
        },OPERATOR:{
            type: tPT.STRING,
            default: '=',
            menu: this.AssignmentOperatorsMenu()
        }
});
addBlock('keyRename',tBT.REPORTER,
    a => this.block_JSON_keyRename(a.JSON,a.KEY,a.NEWKEY) ,
    {
        JSON:{
            type: tPT.STRING,
            default: '{"key":{"key2":"value"}}'
        },
        KEY: {
            type: tPT.STRING,
            default: '"key","key2"'
        },
        NEWKEY:{
            type: tPT.STRING,
            default: '"newKey"'
        }
});
addBlock('delKey',tBT.REPORTER,
    a => this.block_JSON_delKey(a.JSON,a.KEY) ,
    {
        JSON:{
            type: tPT.STRING,
            default: '{"key":{"key2":"value"}}'
        },
        KEY: {
            type: tPT.STRING,
            default: '"key","key2"'
        }
});
