import { UPDATE_USERINFO, RESET_USERINFO } from "./types";

const initialState = {
    authToken: "",
    nickName: "张欣林"
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

export default userReducer = (state = initialState, action) => {
    switch(action.type){
        case UPDATE_USERINFO: return {...state, ...action.payload};
        case RESET_USERINFO: return initialState;
    }
    
    return state;
}