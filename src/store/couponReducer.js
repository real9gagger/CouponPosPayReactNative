import { SET_LAST_COUPON, ADD_A_COUPON, DELETE_A_COUPON, DELETE_ALL_COUPON, UNKNOWN_ACTION } from "./types";

const initialState = {
    lastUsed: null,//上次使用的优惠券
    addedList: [], //手动添加的优惠券列表（功能暂未完善）
};

//设置最近使用的优惠券
export function setLastUsed(info){
    if(!info){
        return {
            type: SET_LAST_COUPON,
            payload: null
        }
    } else {
        return {
            type: SET_LAST_COUPON,
            payload: info
        }
    }
}

//添加一张优惠券
export function addNewCoupon(info){
    if(info){
        return {
            type: ADD_A_COUPON,
            payload: info
        }
    } else {
        return {
            type: UNKNOWN_ACTION,
            payload: null
        } 
    }
}

//删除优惠券，不传参数则删除所有优惠券！
export function deleteAddedCoupon(code){
    if(code){
        return {
            type: DELETE_A_COUPON,
            payload: code
        }
    } else if(code === null){
        return {
            type: DELETE_ALL_COUPON,
            payload: null
        } 
    } else {
        return {
            type: UNKNOWN_ACTION,
            payload: null
        } 
    }
}

export default couponReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_LAST_COUPON: return {...state, lastUsed: action.payload};
        case ADD_A_COUPON: 
            if(action.payload.cpcode){
                state.addedList = [...state.addedList, action.payload];
                return {...state};
            }
            break;
        case DELETE_A_COUPON:
            if(action.payload){
                state.addedList = state.addedList.filter(vxo => vxo.cpcode !== action.payload);
                return {...state};
            }
            break;
        case DELETE_ALL_COUPON: return {...state, addedList: []};
    }
    
    return state;
}