/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import { Provider } from "react-redux";
import { store, persistor } from "@/store/index";
import { PersistGate } from "redux-persist/integration/react";
import Routers from "@/routers/index";
import ModalProvider from "@/common/Modals";

export default function App(){
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Routers />
                <ModalProvider />{/*自定义弹窗专用*/}
            </PersistGate>
        </Provider>
    );
}
