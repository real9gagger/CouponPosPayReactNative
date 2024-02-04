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

//登出时，重置用户信息
export function resetUserInfo(){
    return {
        type: RESET_USERINFO,
        payload: null
    }
}

//设置登录令牌
export function setAccessToken(accessToken, expiresIn, loginAccount, loginPassword){
    const expiresAfterTicks = Date.now() + (+expiresIn || 0) * 1000; //单位：毫秒
    return {
        type: SET_ACCESSTOKEN,
        payload: {
            accessToken,
            expiresAfterTicks,
            loginAccount,
            loginPassword
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