import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import asyncStorage from "@react-native-async-storage/async-storage";
import localesReducer from "./localesReducer";
import userReducer from "./userReducer";
import settingsReducer from "./settingsReducer";

const persistConfig = {
    key: "root",
    whitelist: ["userInfo", "appSettings"],
    storage: asyncStorage
};

const timerTask = {//定时器任务
    tmID: 0, //定时器ID
    isDone: false, //定时器是否完成任务
    tryTimes: 0 //定时器执行了多少次
};

const allReducers = combineReducers({
    localesLanguage: localesReducer, //本地化设置，不需要保存在缓存里
    userInfo: userReducer, //用户信息
    appSettings: settingsReducer, //APP设置
});

const store = createStore(persistReducer(persistConfig, allReducers));

const persistor = persistStore(store, {
    manualPersist: false //设置此属性为 “true” 后需要手动调用 persistor.persist()
}, function(){
    timerTask.isDone = true;
});

const oniniti = (callback) => {
    timerTask.tmID = setInterval(() => {
        if(timerTask.isDone){
            clearInterval(timerTask.tmID);
            callback(1);
        } else {
            if(++timerTask.tryTimes > 40){
                clearInterval(timerTask.tmID);
                callback(0);
            }
            console.log("正在监听持久化存储器是否初始化完成::::", timerTask.tryTimes);
        }
    }, 50);
}

//asyncStorage.getAllKeys().then(console.log);
//asyncStorage.getItem("persist:root").then(console.log);

export { store, persistor, oniniti };