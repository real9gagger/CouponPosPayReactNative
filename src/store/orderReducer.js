import { 
    ADD_FAILED_ORDER, 
    REMOVE_FAILED_ORDER, 
    UPDATE_FAILED_ORDER, 
    UPDATE_FAILED_FIELD, 
    SYNCHRONOUS_ALL_ORDER, 
    ON_REFUND_SUCCESSFUL, 
    INITI_ORDER_DATA, 
    UNKNOWN_ACTION
} from "./types";

const initialState = {
    postFailedCache: [], //提交失败的订单数据要及时保存在缓存里，防止数据丢失【重要】！！！
    isSyncingAll: false, //是否正在同步所有提交失败的缓存数据
    refundSuccessfulOrderID: 0, //退款成功的订单ID！
}

export function addFailedOrder(apiName, postData, errMsg){
    if(apiName && postData && typeof(postData) === "object"){
        postData.__postTimestamp = Date.now(); //提交的时间戳
        postData.__tryTimes = 1; //重新尝试提交到服务器的次数（默认1次）
        postData.__errorMessage = (errMsg || ""); //提交出错消息
        postData.__isSyncing = false; //是否正在同步
        //以下属性是只读的
        postData.__apiName = apiName.toString(); //API名称，
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

export function updateFailedOrder(fid, errmsg, syncing){
    if(fid && typeof(fid) === "number" && fid > 0){
        return {
            type: UPDATE_FAILED_ORDER,
            payload: [fid, errmsg, syncing]
        }
    } else {
        return {
            type: UNKNOWN_ACTION,
            payload: 0
        } 
    }
}

export function updateFailedField(fid, field, newval){
    if(fid && typeof(fid) === "number" && fid > 0){
        return {
            type: UPDATE_FAILED_FIELD,
            payload: [fid, field, newval]
        }
    } else {
        return {
            type: UNKNOWN_ACTION,
            payload: 0
        } 
    }
}

export function synchronousAllOrder(bo){
    return {
        type: SYNCHRONOUS_ALL_ORDER,
        payload: bo
    }
}

export function onRefundSuccessful(oid){
    return {
        type: ON_REFUND_SUCCESSFUL,
        payload: (+oid || 0)
    }
}

export function onInitiOrderData(){
    return {
        type: INITI_ORDER_DATA,
        payload: null
    }
}

export default orderReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_FAILED_ORDER: //新增一个同步失败的订单数据
            if(action.payload.__fid){
                state.postFailedCache = [...state.postFailedCache, action.payload];
                return {...state};
            }
            break;
        case REMOVE_FAILED_ORDER: //删除一条缓存数据
            if(action.payload){
                state.postFailedCache = state.postFailedCache.filter(vxo => vxo.__fid !== action.payload);
                return {...state};
            }
            break;
        case UPDATE_FAILED_ORDER: //更新一条缓存数据
            const pfc = state.postFailedCache.find(vxo => vxo.__fid === action.payload[0]);
            if(pfc){//如果再次提交失败，则更新相关信息
                pfc.__tryTimes++;
                pfc.__postTimestamp = Date.now();
                pfc.__errorMessage = (action.payload[1] || "");
                pfc.__isSyncing = !!action.payload[2];
                state.postFailedCache = [...state.postFailedCache];
                return {...state};
            }
            break;
        case UPDATE_FAILED_FIELD: //更新某条缓存数据的某个字段的值
            const tmp = state.postFailedCache.find(vxo => vxo.__fid === action.payload[0]);
            if(tmp && tmp[action.payload[1]]){//如果再次提交失败，则更新相关信息
                tmp[action.payload[1]] = action.payload[2];
                state.postFailedCache = [...state.postFailedCache];
                return {...state};
            }
            break;
        case SYNCHRONOUS_ALL_ORDER: //同步全部订单
            return {...state, isSyncingAll: !!action.payload};
        case ON_REFUND_SUCCESSFUL: //退款成功
            return {...state, refundSuccessfulOrderID: action.payload};
        case INITI_ORDER_DATA: //初始化订单数据
            return {...state, isSyncingAll: false, refundSuccessfulOrderID: 0};
    }
    return state;
}