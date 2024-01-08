import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import asyncStorage from "@react-native-async-storage/async-storage";
import localesReducer from "./localesReducer";

const persistConfig = {
    key: "pospayroot",
    storage: asyncStorage,
    whitelist: []
};

const allReducers = combineReducers({
    localesSetting: localesReducer, //本地化设置，不需要保存在缓存里
});

const store = createStore(persistReducer(persistConfig, allReducers));
const persistor = persistStore(store);

export { store, persistor };