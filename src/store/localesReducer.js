import AppPackageInfo from "@/modules/AppPackageInfo";
import { CHANGE_LANGUAGE } from "./types";

const regDigits = /\$\[\d+\]/; //用于检查翻译内容是否有占位标记
const regKey = /^([a-z0-9_]+\.){0,4}[a-z0-9_]+$/; //用于检查键名是否规范

//占位填充器，填充 “今天是$[0]年$[1]月$[2]日，星期$[3]，天气晴” 这种格式的多语言文本
function clozeHandler(...args){
    if(!args || !args.length){
        return this.content;
    }
    
    if(!this.slices){
        this.slices = contentParser(this.content);
    }
    
    let output = "";
    
    for(let vx of this.slices){
        if(vx[1] >= 1){
            output += this.content.substr(vx[0], vx[1]);
        }
        if(vx[2] >= 0){
            output += args[vx[2]];
        }
    }
    
    return output;
}

//带有占位标记的内容解析器
//返回一个二维数组，每个子数组（长度固定为3）表示一个内容片段，
//子数组A，A[0] 表示片段的开始索引，A[1] 表示字符数量，如果 A[2] >= 0，则A[2]表示占位标记对应的索引
//示例：txt.substr(A[0], A[1]) + (A[2] >= 0 ? args[A[2]] : "")
function contentParser(txt){
    let start = 0;
    let index1 = 0;
    let index2 = 0;
    let numnth = 0;
    let output = [];//二维数组
    let txtlen = txt.length;
    
    while(index1 < txtlen){
        index1 = txt.indexOf("$[", index1);
        if(index1 < 0){
            break;
        }
        
        index2 = txt.indexOf("]", index1 + 2);
        if(index2 < 0){
            break;
        }
        
        numnth = +txt.substring(index1 + 2, index2);
        if(!isNaN(numnth)){
            output.push([start, index1 - start, numnth]);//长度为3
            start = index1 = index2 + 1;
        } else {
            index1 = index2 + 1;
        }
    }
    
    if(start < txtlen){
        output.push([start, txtlen - start, -1]);
    }
    
    return output;
}

//更改语言设置
export function changeLanguage(lgcode){
    const lange = { i18n: null, code: lgcode };

    switch(lgcode){
        case "zh_TW": lange.i18n = require("@/locales/zh_TW.json"); break;
        case "ja_JP": lange.i18n = require("@/locales/ja_JP.json"); break;
        case "en_US": lange.i18n = require("@/locales/en_US.json"); break;
        default: lange.i18n = require("@/locales/zh_CN.json"); lange.code = "zh_CN"; break;// 默认语言：中文简体
    }
    
    //如果没有被解析过
    if(!lange.i18n["i.have.been.parsed"]){
        //提取哪些需要填充的翻译内容
        for(const kk in lange.i18n){
            //非正式环境才检查键名是否规范
            if(!runtimeEnvironment.isProduction && !regKey.test(kk)){
                throw new Error(`多语言键名“${kk}”不规范，请参考 /src/locales/zh_CN.json 规范化说明。`);
            }
            const txtc = lange.i18n[kk];
            if(txtc.startsWith("\\\\")){
                if(runtimeEnvironment.isProduction || regDigits.test(txtc)){
                    lange.i18n[kk] = { content:txtc.substr(2), slices:null, cloze:clozeHandler }; //由字符串转成对象，调用方式：i18n[kk].cloze(12,34,56);
                } else {
                    throw new Error(`多语言 ${kk} 的内容以“\\\\”开头，但内容里没有 $[xx] 的占位标记！`);
                }
            }
        }
        lange.i18n["i.have.been.parsed"] = "1"; //标记为 “我已被解析过”
    }
    
    return {
        type: CHANGE_LANGUAGE,
        payload: lange
    };
}

//根据用户所在国家初始化语言设置
export function initiLanguage(lgcode){    
    return changeLanguage(lgcode || AppPackageInfo.getLocaleLanguage()); //如果没有语言，则获取 APP 系统语言;
}

export default localesReducer = (state = {}, action) => {
    
    switch(action.type){
        case CHANGE_LANGUAGE: return action.payload;
    }
    
    return state;
}