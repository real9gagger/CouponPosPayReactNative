import { UPDATE_SETTINGS, UNKNOWN_ACTION } from "./types";

const initialState = {
    languageCode: "", //语言编码，如：zh_CN
};

//更新本地设置
export function updateAppSettings(key, value){
    if(key && typeof key === "string"){
        return {
            type: UPDATE_SETTINGS,
            payload: {
                [key]: value
            }
        }
    } else {
        return {
            type: UNKNOWN_ACTION,
            payload: null
        }
    }
}

//更新语言设置
export function updateLanguageSettings(code){
    return {
        type: UPDATE_SETTINGS,
        payload: {
            "languageCode": code
        }
    }
}

export default settingsReducer = (state = initialState, action) => {
    switch(action.type){
        case UPDATE_SETTINGS: return {...state, ...action.payload};
    }

    return state;
}