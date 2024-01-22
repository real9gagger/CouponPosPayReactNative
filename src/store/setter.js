import { store } from "./index"; //使用 useDispatch 报错，因此直接使用 store.dispatch，但官方不推荐：https://github.com/reduxjs/react-redux/discussions/1789
import { changeLanguage, initiLanguage } from "./localesReducer";
import { updateUserInfo, setAccessToken } from "./userReducer";

/* ================ 本地语言相关 ================ */
export function dispatchChangeLanguage(lgcode){
    store.dispatch(changeLanguage(lgcode));
}
export function dispatchInitiLanguage(){
    return initiLanguage().then(store.dispatch);
}

/* ================ 用户信息相关 ================ */
export function dispatchUpdateUserInfo(infos){
    store.dispatch(updateUserInfo(infos));
}
export function dispatchSetAccessToken(token, expin, account, password){
    store.dispatch(setAccessToken(token, expin, account, password));
}