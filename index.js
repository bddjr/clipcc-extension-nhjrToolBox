const nhjrToolBox_version= require('extension-version');
window.nhjrToolBox_version= nhjrToolBox_version;

const {api,type,Extension}= require('clipcc-extension');
const tBT= type.BlockType;
const tPT= type.ParameterType;
const setting_default= ()=> api.getSettings('nhjr.ToolBox.setting.default');
const beginItemNumber= ()=> Number(!setting_default() && api.getSettings('nhjr.ToolBox.setting.itemNumber_beginAt_1'));
const slice_includeEnding= ()=> (!setting_default() && api.getSettings('nhjr.ToolBox.setting.slice_includeEnding'));

const VM= api.getVmInstance();
const scratchAllowTypes= ['string', 'number', 'boolean'];
const AssignmentOperators= ['=', '+=', '-=', '*=', '/=', '%='];
const inTypeMenu_list= ['','Number','String','ScratchBoolean'];
var NTB_alerted= false;

var NTB_Error= '';
var NTB_ErrorList= [];
var NTB_ErrorListLengthLimit= 50;/*报错列表长度限制*/
var NTB_consoleLogError= true;
var NTB_TemporaryVariable= {};
var NTB_returnError= false;
var NTB_returnObj= false;

const categorys= ['help', 'StringAndType', 'JSON', 'list', 'TemporaryVariable', 'RegularExpression', 'ConvenientModules', 'debug'];

const NTB_globalFunList= ['logError', 'VarRead', 'VarSet', 'VarJSONSet', 'getExtensionVariable', 'strTo_str_', '_str_ToStr',
    'inputStrToObj', 'String_to_Regular_Expression', 'openHelp', 'returnForBoolean', 'returnForObj', 'list_getN', 'list_itemN', 'list_setN',
    'makeMenus', 'spritesMenu', 'getScratchSpriteByName', 'setScratchVarValue', 'getScratchVarValue', 'block_JSON_readValueFromKey',
    'block_JSON_readKeys', 'block_JSON_setValue', 'block_JSON_keyRename', 'block_JSON_delKey'];

var addCategoryName= '';

module.exports=class NTBE extends Extension {

onUninit() {
    /*移除全局函数*/
    for (const i in NTB_globalFunList) {
        api.unregisterGlobalFunction('NTB_' + NTB_globalFunList[i])
    }
    /*移除模块*/
    for (const i in categorys) {
        api.removeCategory('nhjr.ToolBox.' + categorys[i])
    }

    console.log(`Thanks for use nhjrToolBox ${nhjrToolBox_version}, goodbye`)
}
addBlock(in_opc, in_type, in_Func, in_param, in_option) {
    var catId = 'nhjr.ToolBox.' + addCategoryName;
    var opc = catId + '.' + in_opc;
    if( in_type == tBT.REPORTER && api.getSettings('nhjr.ToolBox.setting.reporterBlock_to_booleanBlock') && !api.getSettings('nhjr.ToolBox.setting.default') ){
        var in_type= tBT.BOOLEAN
    }
    api.addBlock({
        opcode: opc,
        type: in_type,
        messageId: opc,
        categoryId: catId,
        param: in_param,
        function: in_Func,
        /* compile: in_Func,*/
    })
}
addBlocks(LIST){
    for(const i in LIST){
        var j= LIST[i];
        this.addBlock(j[0],j[1],j[2],j[3])
    }
}
onInit() {
    try{
        /*添加全局函数*/
        for (const i in NTB_globalFunList) {
            eval(`api.registerGlobalFunction('NTB_'+NTB_globalFunList[i],${'this.' + NTB_globalFunList[i]})`)
        }
        /*BOOLEAN填空类型*/
        if(setting_default()) var inputBoolean_to = 'BOOLEAN'
          else var inputBoolean_to = api.getSettings('nhjr.ToolBox.setting.inputBoolean_to') ;
        tPT.NTBE_BOOLEAN = tPT[inputBoolean_to] ;
        /*添加类型与积木*/
        const addBlock = this.addBlock;
        for (const i in categorys) {
            addCategoryName = categorys[i];
            /*添加类型*/
            if(setting_default()) var color= '#007ff4'
              else{
                var color= api.getSettings(`nhjr.ToolBox.setting.category.${addCategoryName}.color`).toString(16);
                color= '#'+ '0'.repeat(6 - color.length) + color 
            }
            api.addCategory({
                categoryId: 'nhjr.ToolBox.' + addCategoryName,
                messageId: 'nhjr.ToolBox.' + addCategoryName,
                color: color
            });
            /*添加积木*/eval(require(`./categorys/${addCategoryName}.js`));
        }

        console.log(`Welcome to use nhjrToolBox ${nhjrToolBox_version} !`)
    }catch(e){console.error(e);window.alert('nhjr.ToolBox error\n'+e)}
}





/* 以下是扩展用到的函数 */

logError(e) {
    if (NTB_consoleLogError) console.error(e);
    NTB_Error = String(e);
    if (NTB_ErrorListLengthLimit > 0) {
        if (NTB_ErrorList.length + 1 >= NTB_ErrorListLengthLimit) {
            NTB_ErrorList.splice(0, NTB_ErrorList.length - NTB_ErrorListLengthLimit + 1)
        }
        NTB_ErrorList.push(String(e));
    }
    if (NTB_returnError) return NTB_Error;
    return ''
}
isVarName(NAME) {
    try {
        if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(NAME)) {
            eval(NAME);
            return true
        }
    } catch (e) { }
    return false
}
VarRead(NAME) {
    if (this.isVarName(NAME)) return eval(NAME)
}
VarSet(NAME, OPERATOR, VALUE) {
    if (AssignmentOperators.includes(OPERATOR) && this.isVarName(NAME)) eval(NAME + OPERATOR + 'VALUE')
}
VarJSONSet(NAME, KEY, OPERATOR, VALUE) {
    if (AssignmentOperators.includes(OPERATOR) && this.isVarName(NAME)) eval(`${NAME}[KEY]${OPERATOR}VALUE`)
}

openHelp(openLink) {/*来自叶绿素*/
    if (window.clipAlert) {
        if (NTB_alerted) return;
        return new Promise(resolve => {
            NTB_alerted = true;
            clipAlert('跳转警告', `该作品尝试将您跳转至 ${openLink}, 您确定要进行跳转吗？`)
                .then(result => {
                    if (result) window.open(`${openLink}`, '_blank');
                    NTB_alerted = false;
                    resolve();
                });
        });
    }
    if (window.confirm(`该作品尝试将您跳转至 ${openLink}, 您确定要进行跳转吗？`)) {
        window.open(`${openLink}`, '_blank');
    }
}


strTo_str_(VALUE) {/* str to "str" */
    return JSON.stringify(String(VALUE)) 
}
_str_ToStr(VALUE) {/* "str" to str */
    if (typeof VALUE == 'string') {
        return this.returnForObj(JSON.parse(VALUE))
    }
    return this.returnForObj(VALUE)
}
inputStrToObj(Str) {
    if (typeof Str == 'object') return Str ;
    var i= ['undefined','NaN','Infinity','-Infinity'].indexOf(Str);
    if(i>-1) return [undefined,NaN,Infinity,-Infinity][i] ;
    return JSON.parse(Str)
}
String_to_Regular_Expression(VALUE) {
    ////try {
        if (/^\/[\s\S]*\/[gim]{0,3}$/.test(VALUE)) {/*鉴定为应该是正则表达式*/
            return RegExp(VALUE.replace(/^\/|\/[gim]{0,3}$/g, ''), /[gim]{0,3}$/.exec(VALUE))
        }
//} catch (e) { this.logError(e) }
}

inputStrToBool(value) {/* 改自clipcc-vm/src/util/cast.js */
    if (typeof value === 'string') {
        if ((value === '') ||
            (value === '0') ||
            (value.toLowerCase() === 'false')) {
            return false;
        }
        return true;
    }
    return Boolean(value);
}
/*{以下方法不符合scratch的判断方式，因此弃用。
    if (typeof(VALUE)=='string'){
        if (/^[\-]?[\d]+(?:\.[\d]*)?$/.test(VALUE)) {return Boolean(Number(VALUE))}
        return !(["false",""].includes(VALUE))
    };return Boolean(VALUE);
}*/

isScratchType(value){
    if (typeof value =='number') return Number.isFinite(value) ;/* 非有限数也会损坏作品 */
    return scratchAllowTypes.includes(typeof value)
}
returnForObj(VALUE) {
    try {
        if (typeof VALUE == 'object') {
            if (NTB_returnObj) return VALUE ;
            return JSON.stringify(VALUE)
        }
        if (this.isScratchType(VALUE)) {
            return VALUE
        }
        return String(VALUE)
    } catch (e) { return this.logError(e) }
}
ScratchType(VALUE) {
    try {
        if (typeof VALUE == 'object') {
            return JSON.stringify(VALUE)
        }
        if (this.isScratchType(VALUE)) {
            return VALUE
        }
        return String(VALUE)
    } catch (e) { return this.logError(e) }
}
list_getN(VALUE_LIST, VALUE_N) {
    /*必须先输入LIST再输入N*/
    try {
        var N = VALUE_N;
        if (N == 'last') N = -1
          else if(typeof N !='number') N = Number(N);
        if (N < 0) N = this.inputStrToObj(VALUE_LIST).length + N
          else if (beginItemNumber()) N-= 1;
        return N
    }catch (e) { return this.logError(e) }
}
list_itemN(VALUE_LIST, VALUE_N) {
    try {
        var list= this.inputStrToObj(VALUE_LIST);
        return this.returnForObj(list[this.list_getN(list, VALUE_N)]);
    }
    catch (e) { return this.logError(e) }
}
list_setN(LIST, N, VALUE, OPERATOR) {
    try {
        /* 避免滥用eval */if (!AssignmentOperators.includes(OPERATOR)) return;
        var LIST = this.inputStrToObj(LIST);
        eval(`LIST[this.list_getN(LIST,N)]${OPERATOR}this.inputStrToObj(VALUE)`);
        return this.returnForObj(LIST)
    }
    catch (e) { return this.logError(e) }
}
list_push(LIST, VALUE) {
    try {
        var LIST = this.inputStrToObj(LIST);
        LIST.push(this.inputStrToObj(VALUE));
        return this.returnForObj(LIST)
    }
    catch (e) { return this.logError(e) }
}
makeMenus(block, menus) {
    const menu = [];
    for (const item of menus) {
        menu.push({
            messageId: `${block}.menu.${item}`,
            value: item
        });
    }
    return menu;
}
spritesMenu() {
    var export_sprites = {};
    for (const targetId in VM.runtime.targets) {
        if (!VM.runtime.targets.hasOwnProperty(targetId)) continue;
        const name = VM.runtime.targets[targetId].sprite.name;
        export_sprites[name] = name
    } return Object.entries(export_sprites)
}
isStageMenus() {
    return this.makeMenus('nhjr.ToolBox.ConvenientModules.isStage', ['true', 'false', 'thisSprite', 'thisClone', 'id', 'drawableID'])
}
AssignmentOperatorsMenu() {
    return this.makeMenus('nhjr.ToolBox.OperatorsMenu', AssignmentOperators)
}
inTypeMenu(){
    return this.makeMenus('nhjr.ToolBox.inTypeMenu',inTypeMenu_list)
}



block_JSON_readValueFromKey(Json, KEY) {
    try {
        var json = this.inputStrToObj(Json);
        var i = 0;
        const keys = JSON.parse(`[${KEY}]`);
        var value = json[keys[0]];
        if(beginItemNumber()){
            while (i < keys.length - 1) {
                i += 1;
                var key = keys[i];
                if(value instanceof Array) key= Number(key)-1;
                var value = value[key];
            }
        }else{
            while (i < keys.length - 1) {
                i += 1;
                var value = value[keys[i]];
            }
        }
        return this.returnForObj(value)
    } catch (e) { return this.logError(e) }
}
block_JSON_readKeys(Json, MENU) {
    try {
        if (['keys', 'values', 'entries'].includes(MENU)) {
            return this.ScratchType( eval(`Object.${MENU}( this.inputStrToObj(Json) )`) )
        }
    } catch (e) { return this.logError(e) }
}
block_JSON_setValue(Json, KEY, VALUE, OPERATOR) {
    try {
        if (!AssignmentOperators.includes(OPERATOR)) return '';
        const keys = JSON.parse(`[${KEY}]`);
        var json= this.inputStrToObj(Json);
        var value = json;
        var i = 0;
        if(beginItemNumber()){
            while (i < keys.length -1) {
                i += 1;
                var key = keys[i-1];
                if(value instanceof Array) key= Number(key)-1;
                value = value[key];
            }
            var key = keys[i];
            if(value instanceof Array) key= Number(key)-1;
            eval(`value[key]${OPERATOR}this.inputStrToObj(VALUE)`);
        }else{
            while (i < keys.length -1) {
                i += 1;
                value = value[keys[i - 1]];
            }
            eval(`value[keys[i]]${OPERATOR}this.inputStrToObj(VALUE)`);
        }
        return this.returnForObj(json)
    } catch (e) { return this.logError(e) }
}
block_JSON_keyRename(Json, KEY, NEWKEY) {
    try {
        var keys = JSON.parse(`[${KEY}]`);
        var NEW = this._str_ToStr(NEWKEY);
        var json = this.inputStrToObj(Json);
        var value = json;
        var i = 0;
        if(beginItemNumber()){
            while (i < keys.length - 1) {
                i += 1;
                var key = keys[i-1];
                if(value instanceof Array) key= Number(key)-1;
                value = value[key];
            }
            /*新建相同值的键*/
            if(value instanceof Array) NEW= Number(NEW)-1;
            value[NEW] = value[keys[i]];
            /*删除旧键*/
            var key = keys[i];
            if(value instanceof Array) key= Number(key)-1
            delete value[key];
        }else{
            while (i < keys.length - 1) {
                i += 1;
                value = value[keys[i - 1]];
            }
            value[NEW] = value[keys[i]];
            delete value[keys[i]];
        }
        return this.returnForObj(value)
    } catch (e) { return this.logError(e) }
}
block_JSON_delKey(Json, KEY) {
    try {
        var keys = JSON.parse(`[${KEY}]`);
        var json= this.inputStrToObj(Json);
        var value = json;
        var i = 0;
        if(beginItemNumber()){
            while (i < keys.length - 1) {
                i += 1;
                var key = keys[i-1];
                if(value instanceof Array) key= Number(key)-1;
                value = value[key]
            }
            var key = keys[i];
            if(value instanceof Array) key= Number(key)-1;
            delete value[key];
        }else{
            while (i < keys.length - 1) {
                i += 1;
                value = value[keys[i - 1]];
            }
            delete value[keys[i]];
        }
        
        return this.returnForObj(json)
    } catch (e) { return this.logError(e) }
}


block_slice(VALUE,INn1,INn2){
    try {
        var [n1,n2]= [Math.round(Number(INn1)), Math.round(Number(INn2))];
        if (INn2=='' || (slice_includeEnding() && n2+1 ==0)){
            return VALUE.slice(n1-beginItemNumber(),)
        }
        if(slice_includeEnding()) n2+= 1;
        if(beginItemNumber()){
            if(n2>-1) n2-= 1;
            if(n1>0) n1-= 1;
        }
        return VALUE.slice(n1, n2)
    }catch(e){return this.logError(e)}
}



block_list_getJson(isStage, sprite, util) {
    if (isStage == 'thisClone') return util.target;
    if (isStage == 'thisSprite') return util.target.sprite.clones[0];
    return this.getScratchSpriteByName(isStage, sprite, util.runtime)
}

block_getScratchList(isStage, sprite, name, util) {
    try {
        var Json = this.block_list_getJson(isStage, sprite, util);
        var returnValue = this.returnForObj(this.getScratchVarValue(Json.variables, name, 'list'));
        return returnValue
    } catch (e) { return this.logError(e) }
}
block_saveListToScratch(isStage, sprite, name, LIST, util) {
    try {
        var Json = this.block_list_getJson(isStage, sprite, util);
        var saveList = this.inputStrToObj(LIST);
        if (saveList instanceof Array) {
            for (const i in saveList) {
                /* 避免损坏作品 */
                if (saveList[i] === null) {
                    saveList[i] = ''
                } else if (!this.isScratchType(saveList[i])) {
                    saveList[i] = String(saveList[i])
                }
            }
            this.setScratchVarValue(Json.variables, name, saveList, Json.id, 'list')
        }

    } catch (e) { return this.logError(e) }
}
block_getScratchVariable(isStage, sprite, name, util) {
    try {
        var Json = this.block_list_getJson(isStage, sprite, util);
        return this.getScratchVarValue(Json.variables, name, '')
    } catch (e) { return this.logError(e) }
}
block_saveVariableToScratch(isStage, sprite, name, VALUE, util, OPERATOR, IN_TYPE) {
    try {
        /* 避免滥用eval */if (!AssignmentOperators.includes(OPERATOR) || !inTypeMenu_list.includes(IN_TYPE)) return;

        var Json = this.block_list_getJson(isStage, sprite, util);
        var saveValue= this.getScratchVarValue(Json.variables, name, '');
        if(IN_TYPE=='ScratchBoolean') eval(`saveValue${OPERATOR}this.inputStrToBool(VALUE)`)
          else eval(`saveValue${OPERATOR+IN_TYPE}(VALUE)`);
        if (saveValue === null) saveValue = ''/* 避免损坏作品 */
          else if (!this.isScratchType(saveValue)) {
            saveValue = String(saveValue)
        }
        this.setScratchVarValue(Json.variables, name, saveValue, Json.id, '')
    } catch (e) { return this.logError(e) }
}




/*部分内容借鉴自string扩展*/
getScratchSpriteByName(isStage, name, runtime) {
    if (['id', 'drawableID'].includes(isStage)) {
        for (var sprite in runtime.targets) {
            if (runtime.targets[sprite][isStage] == name) {
                return runtime.targets[sprite]
            }
        }
    } else {
        var isStage = this.inputStrToBool(isStage);
        for (var sprite in runtime.targets) {
            if ((isStage || (!isStage && runtime.targets[sprite].sprite.name == name)) && runtime.targets[sprite].isStage == isStage) {
                return runtime.targets[sprite]
            }
        }
    }
}
setScratchVarValue(varJson, name, value, targetId, type) {
    for (var variable in varJson) {
        if (varJson[variable].name == name && varJson[variable].type == type) {
            varJson[variable].value = value;
            if (type == 'list') varJson[variable]._monitorUpToDate = false;
            return
        }
    }
}
getScratchVarValue(varJson, name, type) {
    for (var variable in varJson) {
        if (varJson[variable].name == name && varJson[variable].type == type) return varJson[variable].value;
    }
}

}