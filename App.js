/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store, persistor, oniniti } from "@/store/index";
import { dispatchInitiLanguage } from "@/store/setter";
import { PersistGate } from "redux-persist/integration/react";
import Routers from "@/routers/index";
import ModalProvider from "@/common/Modals";

export default function App(){
    useEffect(() => {
        oniniti(dispatchInitiLanguage); //完成初始化后显示界面
        !runtimeEnvironment.isProduction && console.log(">>>> 发布前请按照 README.md 中的“第三方插件修改说明”修改后再发布");
    }, []);
    
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Routers />
                <ModalProvider />{/*自定义弹窗专用*/}
            </PersistGate>
        </Provider>
    );
}
