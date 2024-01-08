/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import { Provider } from "react-redux";
import { store, persistor } from "@/store/index";
import { PersistGate } from "redux-persist/integration/react";
import Routers from "@/routers/index";

export default function App(){
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Routers />
            </PersistGate>
        </Provider>
    );
}
