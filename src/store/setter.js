import { store } from "./index"; //使用 useDispatch 报错，因此直接使用 store.dispatch，但官方不推荐：https://github.com/reduxjs/react-redux/discussions/1789
import { changeLanguage } from "./localesReducer";
import { updateUserInfo } from "./userReducer";

export function dispatchChangeLanguage(lgcode){
    store.dispatch(changeLanguage(lgcode));
}

export function dispatchUpdateUserInfo(infos){
    store.dispatch(updateUserInfo(infos));
}