import { useSelector, useStore } from "react-redux";
import { store } from "./index";

/* export function useGetter(...names) {
    const output = {};
    const state = useSelector(vs => vs);
    for(const nm of names){
        switch(nm){
            case "i18n": output.i18n = state.localesSetting.i18n; break;
        }
    }
    return output;
} */

//只能在函数组件使用
export function useI18N() {
    return useSelector(state => state.localesSetting.i18n);
}
//类组件中使用
export function getI18N(){
    return store.getState().localesSetting.i18n;
}