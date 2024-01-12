import asyncStorage from "@react-native-async-storage/async-storage";

// 存储数据
export function setData(key, value){
    let jsonStr = null;
    if(value || value===0 || value===false){
        jsonStr = JSON.stringify(value); //所有数据都转成 JSON 字符串保存
    }
    if(!jsonStr){
        jsonStr = "";
    }
    return asyncStorage.setItem(key, jsonStr);
}

// 获取数据
export function getData(key){
    return asyncStorage.getItem(key).then(res => (res ? JSON.parse(res) : "")); //因为保存的都是JSON格式的数据，所以必须经过解析
}

// 删除数据
export function removeData(key){
    return asyncStorage.removeItem(key);
}

// 清除数据
export function clearData(){
    return asyncStorage.clear();
}