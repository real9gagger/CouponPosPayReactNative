import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import asyncStorage from "@react-native-async-storage/async-storage";
import localesReducer from "./localesReducer";
import userReducer from "./userReducer";

const persistConfig = {
    key: "root",
    whitelist: ["userInfo"],
    storage: asyncStorage
};

const allReducers = combineReducers({
    localesSetting: localesReducer, //本地化设置，不需要保存在缓存里
    userInfo: userReducer, //用户信息
});

const store = createStore(persistReducer(persistConfig, allReducers));
const persistor = persistStore(store, {
    manualPersist: true //设置此属性后需要手动调用 persistor.persist()
});

//asyncStorage.getAllKeys().then(console.log)

export { store, persistor };