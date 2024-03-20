import { ADD_FAILED_ORDER, REMOVE_FAILED_ORDER, UPDATE_FAILED_ORDER, UNKNOWN_ACTION } from "./types";

const initialState = {
    postFailedCache: [] //提交失败的订单数据要及时保存在缓存里，防止数据丢失【重要】！！！
}

export function addFailedOrder(apiName, postData, errMsg){
    if(apiName && postData && typeof(postData) === "object"){
        postData.__postTimestamp = Date.now(); //提交的时间戳
        postData.__tryTimes = 1; //重新尝试提交到服务器的次数（默认1次）
        postData.__apiName = apiName.toString(); //API名称，
        postData.__errorMessage = (errMsg || ""); //提交出错消息
        postData.__fid = (postData.__postTimestamp * 1000) + Math.round(Math.random() * 1000); //16位数字的ID
        return {
            type: ADD_FAILED_ORDER,
            payload: postData
        }
    } else {
        return {
            type: UNKNOWN_ACTION,
            payload: null
        } 
    }
}

export function removeFailedOrder(fid){
    if(fid && typeof(fid) === "number" && fid > 0){
        return {
            type: REMOVE_FAILED_ORDER,
            payload: fid
        }
    } else {
        return {
            type: UNKNOWN_ACTION,
            payload: 0
        } 
    }
}

export function updateFailedOrder(fid, errmsg){
    if(fid && typeof(fid) === "number" && fid > 0){
        return {
            type: UPDATE_FAILED_ORDER,
            payload: [fid, errmsg]
        }
    } else {
        return {
            type: UNKNOWN_ACTION,
            payload: 0
        } 
    }
}

export default orderReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_FAILED_ORDER: 
            if(action.payload.__fid){
                state.postFailedCache.push(action.payload);
                return {...state};
            }
            break;
        case REMOVE_FAILED_ORDER:
            const idx = state.postFailedCache.findIndex(vxo => vxo.__fid === action.payload);
            if(idx >= 0){
                state.postFailedCache.splice(idx, 1);
                return {...state};
            }
            break;
        case UPDATE_FAILED_ORDER:
            const pfc = state.postFailedCache.find(vxo => vxo.__fid === action.payload[0]);
            if(pfc){//如果再次提交失败，则更新相关信息
                pfc.__tryTimes++;
                pfc.__postTimestamp = Date.now();
                pfc.__errorMessage = (action.payload[1] || "");
                return {...state};
            }
            break;
    }
    return state;
}