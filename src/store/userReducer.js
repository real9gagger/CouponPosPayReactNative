import { UPDATE_USERINFO, RESET_USERINFO, SET_ACCESSTOKEN } from "./types";

const initialState = {
    accessToken: "",
    expiresAfterTicks: 0, //令牌过期时间（毫秒数）
    posName: "", //商户名称
    posId: 0, //商户ID
    posLogo: "" //商户LOGO
};

//更新用户信息，传入的参数是一个对象
export function updateUserInfo(infos){
    if(!infos){
        return {
            type: RESET_USERINFO,
            payload: null
        }
    } else {
        return {
            type: UPDATE_USERINFO,
            payload: infos
        }
    }
}

//设置登录令牌
export function setAccessToken(token, expiresIn){
    const realEI = (+expiresIn || 0); //单位：秒
    return {
        type: SET_ACCESSTOKEN,
        payload: {
            accessToken: token,
            expiresAfterTicks: Date.now() + realEI * 1000
        }
    }
}

export default userReducer = (state = initialState, action) => {
    switch(action.type){
        case UPDATE_USERINFO: return {...state, ...action.payload};
        case RESET_USERINFO: return initialState;
        case SET_ACCESSTOKEN: return {...state, ...action.payload};
    }
    
    return state;
}