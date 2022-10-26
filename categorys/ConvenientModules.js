addBlock('getScratchList',tBT.REPORTER, (a,util) => this.block_getScratchList(a.ISSTAGE,a.SPRITE,a.NAME,util) ,
    {   NAME: {
            type: tPT.STRING,
            default: 'list'
        },SPRITE:{
            type: tPT.STRING,
            default: 'Stage',
            menu: ()=>this.spritesMenu()
        },ISSTAGE:{
            type: tPT.STRING,
            default: 'true',
            menu: this.isStageMenus()
        }
});
addBlock('saveListToScratch',tBT.COMMAND, (a,util) => this.block_saveListToScratch(a.ISSTAGE,a.SPRITE,a.NAME,a.LIST,util) ,
    {   NAME: {
            type: tPT.STRING,
            default: 'list'
        },LIST:{
            type: tPT.STRING,
            default: '["apple","banana","cat"]'
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
addBlock('getScratchVariable',tBT.REPORTER, (a,util) => this.block_getScratchVariable(a.ISSTAGE,a.SPRITE,a.NAME,util) ,
    {   NAME: {
            type: tPT.STRING,
            default: 'variable'
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
addBlock('saveVariableToScratch',tBT.COMMAND, (a,util) => this.block_saveVariableToScratch(a.ISSTAGE,a.SPRITE,a.NAME,a.VALUE,util,a.OPERATOR,a.IN_TYPE) ,
    {   NAME: {
            type: tPT.STRING,
            default: 'variable'
        },VALUE:{
            type: tPT.STRING,
            default: '0'
        },SPRITE:{
            type: tPT.STRING,
            default: 'Stage',
            menu: ()=>this.spritesMenu()
        },ISSTAGE:{
            type: tPT.STRING,
            default: 'true',
            menu: this.isStageMenus()
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
addBlock('spriteName',tBT.REPORTER, (a,util) => util.target.sprite.name );
addBlock('isStage',tBT.BOOLEAN, (a,util) => util.target.isStage );

addBlock('getSpriteInformation',tBT.BOOLEAN,
    (a,util) => {
        try{
            if(['id','drawableID','effects','direction','rotationStyle','size','tempo','volume','x','y',
              'deprecatedCache','draggable','dragging','isOriginal','visible'].includes(a.IDNAME)){
                    if (a.ISSTAGE=='thisClone') return this.ScratchType(util.target[a.IDNAME]) ;
                    return this.ScratchType(this.block_list_getJson(a.ISSTAGE,a.SPRITE,util).sprite.clones[a.CLONENUM][a.IDNAME])
            }
            if (a.IDNAME=='name') return this.block_list_getJson(a.ISSTAGE,a.SPRITE,util).sprite.name
        }catch(e){return this.logError(e)}
    },{
        SPRITE:{
            type: tPT.STRING,
            default: 'Stage',
            menu: ()=>this.spritesMenu()
        },ISSTAGE:{
            type: tPT.STRING,
            default: 'true',
            menu: this.isStageMenus()
        },CLONENUM:{
            type: tPT.NUMBER,
            default: '0',
        },IDNAME:{
            type: tPT.STRING,
            default: 'id',
            menu: this.makeMenus('nhjr.ToolBox.ConvenientModules.getSpriteInformation',
            ['id','drawableID','effects','direction','rotationStyle','size','tempo','volume','x','y',
            'deprecatedCache','draggable','dragging','isOriginal','visible',
            'name'])
        }
});

addBlock('setSpriteInformation',tBT.COMMAND,
    (a,util) => {
        if(AssignmentOperators.includes(a.OPERATOR) && ['effects','direction','rotationStyle','size','tempo','volume','x','y','draggable','isOriginal','visible'].includes(a.IDNAME)){
            try{var SET=a.SET;
                if (['draggable','isOriginal','visible'].includes(a.IDNAME)){
                    SET= this.inputStrToBool(SET);
                }else if (['direction','size','tempo','volume','x','y'].includes(a.IDNAME)){
                    SET= Number(SET);
                    if (!Number.isFinite(SET)) return
                }else if (a.IDNAME=='effects'){
                    SET= this.inputStrToObj(SET);
                    const scKeyList= ["color","fisheye","whirl","pixelate","mosaic","brightness","ghost"];
                    const SETkeys= SET.keys();
                    for (const i in SETkeys){
                        if (!scKeyList.includes(SETkeys[i]) ||
                            !Number.isFinite(Number(SET[SETkeys[i]]))) return
                    }
                }
                var Json=this.block_list_getJson(a.ISSTAGE,a.SPRITE,util);
                eval(`Json[a.IDNAME]${a.OPERATOR}(SET)`) ;
                Json.updateAllDrawableProperties()
            }catch(e){return this.logError(e)}
        }
    },{
        SPRITE:{
            type: tPT.STRING,
            default: 'Stage',
            menu: ()=>this.spritesMenu()
        },ISSTAGE:{
            type: tPT.STRING,
            default: 'true',
            menu: this.isStageMenus()
        },SET:{
            type: tPT.STRING,
            default: '0',
        },IDNAME:{
            type: tPT.STRING,
            default: 'size',
            menu: this.makeMenus('nhjr.ToolBox.ConvenientModules.getSpriteInformation',
            ['effects','direction','rotationStyle','size','tempo','volume','x','y',
            'draggable','isOriginal','visible'])
        },OPERATOR:{
            type: tPT.STRING,
            default: '=',
            menu: this.AssignmentOperatorsMenu()
        }
});
addBlock('setSpriteXY',tBT.COMMAND,
    (a,util) => {
            try{var X=Number(a.X);
                if (!Number.isFinite(X)) return;
                var Y=Number(a.Y);
                if (!Number.isFinite(Y)) return;
                var Json=this.block_list_getJson(a.ISSTAGE,a.SPRITE,util);
                Json.x=X; Json.y=Y ;
                Json.updateAllDrawableProperties()
            }catch(e){return this.logError(e)}
    },{
        SPRITE:{
            type: tPT.STRING,
            default: 'Stage',
            menu: ()=>this.spritesMenu()
        },ISSTAGE:{
            type: tPT.STRING,
            default: 'true',
            menu: this.isStageMenus()
        },X:{
            type: tPT.NUMBER,
            default: '0',
        },Y:{
            type: tPT.NUMBER,
            default: '0',
        }
});
addBlock('getSpriteEffects',tBT.REPORTER,
    (a,util) => {
            try{
                return this.block_list_getJson(a.ISSTAGE,a.SPRITE,util).effects[a.NAME]
            }catch(e){return this.logError(e)}
    },{
        SPRITE:{
            type: tPT.STRING,
            default: 'Stage',
            menu: ()=>this.spritesMenu()
        },ISSTAGE:{
            type: tPT.STRING,
            default: 'true',
            menu: this.isStageMenus()
        },NAME:{
            type: tPT.STRING,
            default: 'color',
            menu: this.makeMenus('nhjr.ToolBox.ConvenientModules.effects',["color","fisheye","whirl","pixelate","mosaic","brightness","ghost"])
        }
});
addBlock('setSpriteEffects',tBT.COMMAND,
    (a,util) => {
            try{if (AssignmentOperators.includes(a.OPERATOR)){
                    var Json=this.block_list_getJson(a.ISSTAGE,a.SPRITE,util);
                    var effect= Json.effects[a.NAME];
                    eval(`effect${a.OPERATOR}Number(a.VALUE)`);
                    if (!Number.isFinite(effect)) return;
                    Json.effects[a.NAME]= effect;
                    Json.updateAllDrawableProperties()
                }
            }catch(e){return this.logError(e)}
    },{
        SPRITE:{
            type: tPT.STRING,
            default: 'Stage',
            menu: ()=>this.spritesMenu()
        },ISSTAGE:{
            type: tPT.STRING,
            default: 'true',
            menu: this.isStageMenus()
        },NAME:{
            type: tPT.STRING,
            default: 'color',
            menu: this.makeMenus('nhjr.ToolBox.ConvenientModules.effects',["color","fisheye","whirl","pixelate","mosaic","brightness","ghost"])
        },OPERATOR:{
            type: tPT.STRING,
            default: '=',
            menu: this.AssignmentOperatorsMenu()
        },VALUE:{
            type: tPT.NUMBER,
            default: '0',
        }
});
addBlock('getSpriteCostumesInformation',tBT.REPORTER,
    (a,util) => {
        try{
            if(["assetId","bitmapResolution","dataFormat","md5","name","rotationCenterX","rotationCenterY","size","skinId"].includes(a.NAME)){
                return this.ScratchType(this.block_list_getJson(a.ISSTAGE,a.SPRITE,util).sprite.costumes_[a.ITEM][a.NAME])
            }
        }catch(e){return this.logError(e)}
    },{
        SPRITE:{
            type: tPT.STRING,
            default: 'Stage',
            menu: ()=>this.spritesMenu()
        },ISSTAGE:{
            type: tPT.STRING,
            default: 'true',
            menu: this.isStageMenus()
        },ITEM:{
            type: tPT.NUMBER,
            default: '0',
        },NAME:{
            type: tPT.STRING,
            default: 'size',
            menu: this.makeMenus('nhjr.ToolBox.ConvenientModules.CostumesInformation',
            ["assetId","bitmapResolution","dataFormat","md5","name","rotationCenterX","rotationCenterY","size","skinId"])
        }
});
addBlock('getSpriteCostumesCounter',tBT.REPORTER,
    (a,util) => {
        try{
            return this.returnForObj(this.block_list_getJson(a.ISSTAGE,a.SPRITE,util).sprite.costumes_.length)
        }catch(e){return this.logError(e)}
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
addBlock('getSpriteSoundInformation',tBT.BOOLEAN,
    (a,util) => {
        try{
            var Sprite= this.block_list_getJson(a.ISSTAGE,a.SPRITE,util).sprite ;
            if(["assetId","dataFormat","format","md5","name","rate","sampleCount","soundId"].includes(a.NAME)){
                return this.ScratchType(Sprite.sounds[a.ITEM][a.NAME])
            }
            var SP= Sprite.soundBank.soundPlayers[Sprite.sounds[a.ITEM].soundId] ;
            if(['duration','length','numberOfChannels','sampleRate'].includes(a.NAME)){
                return SP.buffer[a.NAME]
            }
            if(['initialized','isPlaying','playbackRate','startingUntil','isStarting'].includes(a.NAME)){
                return SP[a.NAME]
            }
        }catch(e){return this.logError(e)}
    },{
        SPRITE:{
            type: tPT.STRING,
            default: 'Stage',
            menu: ()=>this.spritesMenu()
        },ISSTAGE:{
            type: tPT.STRING,
            default: 'true',
            menu: this.isStageMenus()
        },ITEM:{
            type: tPT.NUMBER,
            default: '0',
        },NAME:{
            type: tPT.STRING,
            default: 'duration',
            menu: this.makeMenus('nhjr.ToolBox.ConvenientModules.SoundInformation',
            ["assetId","dataFormat","format","md5","name","rate","sampleCount","soundId"].concat(
                ['duration','length','numberOfChannels','sampleRate'],
                ['initialized','isPlaying','playbackRate','startingUntil','isStarting']
            ))
        }
});
addBlock('getSpriteSoundsCounter',tBT.REPORTER,
    (a,util) => {
        try{
            return this.returnForObj(this.block_list_getJson(a.ISSTAGE,a.SPRITE,util).sprite.sounds.length)
        }catch(e){return this.logError(e)}
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



addBlock('cloneNumber',tBT.REPORTER, (a,util) => {
    var ID=util.target.id;
    var Clones=util.target.sprite.clones;
    for (const i in Clones){
        if (Clones[i].id==ID) return i
    }return NaN
} );
addBlock('cloneCounter',tBT.REPORTER, () => VM.runtime._cloneCounter );
addBlock('getSpriteCloneCounter',tBT.REPORTER,
    (a,util) => {
        try{return (this.block_list_getJson(a.ISSTAGE,a.SPRITE,util).sprite.clones).length-1
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
});

addBlock('timeStamp',tBT.REPORTER, () => Date.now() );


addBlock('hatWhenBecomeTrue',tBT.HAT,
    (a,util) => {
        try{const block=util.target.blocks._blocks[util.thread.peekStack()];
            if (block===undefined) return;/* 修复直接在积木栏单击会报错的问题 */
            const bool=this.inputStrToBool(a.CONDITION);
            if (block.hasOwnProperty("NTBE_HatOldValue") && block.NTBE_HatOldValue!=(bool) && block.NTBE_HatOldValue==false){
                block.NTBE_HatOldValue = bool;
                return true
            }block.NTBE_HatOldValue = bool
        }
        catch(e){this.logError(e)}
        return false
    },{CONDITION: {
            type: tPT.NTBE_BOOLEAN
        }
});
addBlock('hatWhenChange',tBT.HAT,
    (a,util) => {
        try{const block=util.target.blocks._blocks[util.thread.peekStack()];
            if (block===undefined) return;
            if (block.hasOwnProperty("NTBE_HatOldValue") && block.NTBE_HatOldValue!=(a.CONDITION)) {
                block.NTBE_HatOldValue = a.CONDITION;
                return true
            }block.NTBE_HatOldValue = a.CONDITION
        }
        catch(e){this.logError(e)}
        return false
    },{CONDITION: {
            type: tPT.STRING,
            default: ' '
        }
});

api.addBlock({
    opcode: 'nhjr.ToolBox.nullCmd',
    type: tBT.COMMAND,
    messageId: 'nhjr.ToolBox.nullCmd',
    categoryId: 'nhjr.ToolBox.ConvenientModules',
    param:{ VALUE: {type: tPT.STRING, default: ' '} }
});

addBlock('NeverGonnaGiveYouStart',tBT.HAT,() => false);
addBlock('NeverGonnaLetYouStop',tBT.HAT);

addBlock('hatWhenIsTrue',tBT.HAT,
    (a) => this.inputStrToBool(a.CONDITION) ,
    {CONDITION: {type: tPT.NTBE_BOOLEAN}}
);

addBlock('ifElseReturn',tBT.REPORTER,
    (a) => { if (this.inputStrToBool(a.CONDITION)){return a.VALUE1} else {return a.VALUE2} } ,
    {   CONDITION: {
            type: tPT.NTBE_BOOLEAN
        },
        VALUE1:{
            type:tPT.STRING,
            default:'true'
        },
        VALUE2:{
            type:tPT.STRING,
            default:'false'
        }
    }
);
addBlock('writeClipboard',tBT.COMMAND, /*借鉴自棒棒糖*/
    (a) => {
        if (navigator.clipboard){navigator.clipboard.writeText(a.TEXT)}
        else {this.logError('Clipboard not supported');return 'Clipboard not supported'}; /*不支持剪贴板*/
    },{ TEXT: {
            type: tPT.STRING,
            default: 'Hello World!'
        }
});
