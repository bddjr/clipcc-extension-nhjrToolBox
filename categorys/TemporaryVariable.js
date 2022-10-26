addBlock('clearAllVariable',tBT.COMMAND,()=>{
    try {
        NTB_TemporaryVariable={}
    }catch(e){return this.logError(e)}
});
addBlock('setItoValue',tBT.COMMAND,
    a => {
        try {
            if (AssignmentOperators.includes(a.OPERATOR) && inTypeMenu_list.includes(a.IN_TYPE)){
                if(a.IN_TYPE=='ScratchBoolean') eval(`NTB_TemporaryVariable[a.NAME]${a.OPERATOR}this.inputStrToBool(a.VALUE)`)
                else eval(`NTB_TemporaryVariable[a.NAME]${a.OPERATOR+a.IN_TYPE}(a.VALUE)`)
            }
        }catch(e){return this.logError(e)}
    },{
        NAME:{
            type: tPT.STRING,
            default: 'i'
        },
        VALUE:{
            type: tPT.STRING,
            default: 'value'
        },OPERATOR:{
            type: tPT.STRING,
            default: '=',
            menu: this.AssignmentOperatorsMenu()
        },IN_TYPE:{
            type: tPT.STRING,
            default: '',
            menu: this.inTypeMenu()
        }
});
addBlock('getVariable',tBT.REPORTER,
    a => {
        try {
            return NTB_TemporaryVariable[a.NAME]
        }
        catch(e){return this.logError(e)}
    },{
        NAME:{
            type: tPT.STRING,
            default: 'i'
        }
});
addBlock('deleteVariable',tBT.COMMAND,
    a => {
        try {
            delete NTB_TemporaryVariable[a.NAME]
        }
        catch(e){return this.logError(e)}
    },{
        NAME:{
            type: tPT.STRING,
            default: 'i'
        }
});
addBlock('VariableExist',tBT.BOOLEAN,
    a => {
        try {
            return (a.NAME in NTB_TemporaryVariable)
        }
        catch(e){return this.logError(e)}
    },{
        NAME:{
            type: tPT.STRING,
            default: 'i'
        }
});


/* 角色局部变量 */
addBlock('clearSpriteAllVariable',tBT.COMMAND,
    (a,util)=>{
            try {
                this.block_list_getJson(a.ISSTAGE,a.SPRITE,util).NTBE_TemporaryVariable={}
            }catch(e){return this.logError(e)}
    },{
        SPRITE:{
            type: tPT.STRING,
            default: 'Stage',
            menu: ()=>this.spritesMenu()
        },
        ISSTAGE:{
            type: tPT.STRING,
            default: 'true',
            menu: this.isStageMenus()
        }
    }
);
addBlock('setItoSpriteValue',tBT.COMMAND,
    (a,util) => {
        try {
            var t= this.block_list_getJson(a.ISSTAGE,a.SPRITE,util);
            if (!t.hasOwnProperty('NTBE_TemporaryVariable')) t.NTBE_TemporaryVariable={} ;
            if (AssignmentOperators.includes(a.OPERATOR) && inTypeMenu_list.includes(a.IN_TYPE)){
                if(a.IN_TYPE=='ScratchBoolean') eval(`t.NTBE_TemporaryVariable[a.NAME]${a.OPERATOR}this.inputStrToBool(a.VALUE)`)
                else eval(`t.NTBE_TemporaryVariable[a.NAME]${a.OPERATOR+a.IN_TYPE}a.VALUE`)
            }
        }catch(e){return this.logError(e)}
    },{
        NAME:{
            type: tPT.STRING,
            default: 'i'
        },
        VALUE:{
            type: tPT.STRING,
            default: 'value'
        },OPERATOR:{
            type: tPT.STRING,
            default: '=',
            menu: this.AssignmentOperatorsMenu()
        },SPRITE:{
            type: tPT.STRING,
            default: 'Stage',
            menu: ()=>this.spritesMenu()
        },
        ISSTAGE:{
            type: tPT.STRING,
            default: 'true',
            menu: this.isStageMenus()
        },IN_TYPE:{
            type: tPT.STRING,
            default: '',
            menu: this.inTypeMenu()
        }
});
addBlock('getSpriteVariable',tBT.REPORTER,
    (a,util) => {
        try {
            var Json= this.block_list_getJson(a.ISSTAGE,a.SPRITE,util);
            if(Json.hasOwnProperty('NTBE_TemporaryVariable')) return Json.NTBE_TemporaryVariable[a.NAME]
        }
        catch(e){return this.logError(e)}
    },{
        NAME:{
            type: tPT.STRING,
            default: 'i'
        },SPRITE:{
            type: tPT.STRING,
            default: 'Stage',
            menu: ()=>this.spritesMenu()
        },
        ISSTAGE:{
            type: tPT.STRING,
            default: 'true',
            menu: this.isStageMenus()
        }
});
addBlock('deleteSpriteVariable',tBT.COMMAND,
    (a,util) => {
        try {
            delete this.block_list_getJson(a.ISSTAGE,a.SPRITE,util).NTBE_TemporaryVariable[a.NAME]
        }
        catch(e){return this.logError(e)}
    },{
        NAME:{
            type: tPT.STRING,
            default: 'i'
        },SPRITE:{
            type: tPT.STRING,
            default: 'Stage',
            menu: ()=>this.spritesMenu()
        },
        ISSTAGE:{
            type: tPT.STRING,
            default: 'true',
            menu: this.isStageMenus()
        }
});
addBlock('SpriteVariableExist',tBT.BOOLEAN,
    (a,util) => {
        try {
            var Json= this.block_list_getJson(a.ISSTAGE,a.SPRITE,util);
            if(Json.hasOwnProperty('NTBE_TemporaryVariable')) return a.NAME in Json.NTBE_TemporaryVariable ;
            return false
        }
        catch(e){return this.logError(e)}
    },{
        NAME:{
            type: tPT.STRING,
            default: 'i'
        },SPRITE:{
            type: tPT.STRING,
            default: 'Stage',
            menu: ()=>this.spritesMenu()
        },
        ISSTAGE:{
            type: tPT.STRING,
            default: 'true',
            menu: this.isStageMenus()
        }
});
