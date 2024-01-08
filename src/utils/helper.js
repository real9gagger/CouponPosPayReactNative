//将字符串日期转成日期对象
export function parseStringDate(dt) {
    if (dt) {
        /* const dtType = (typeof dt);
        if(dtType==="string"){
            return new Date(dt.replace(/-/g, "/"));
        } else if(dtType==="number"){
            return new Date(dt);
        } */

        const date = new Date(dt.replace(/-/g, "/"));
        if (!isNaN(date.getTime())) { //not a Invalid Date
            return date;
        }
    }
    return new Date();
}

//数组转对象
export function arrayToObject(sourceArray, keyField, callBack) {
    if (!sourceArray || !sourceArray.length || !keyField) {
        return {};
    }

    const outputObj = {};
    const cbType = (typeof callBack);

    if (cbType === "function") {
        for (const item of sourceArray) {
            outputObj[item[keyField]] = callBack(item);
        }
    } else if (cbType === "string") {
        for (const item of sourceArray) {
            outputObj[item[keyField]] = item[callBack];
        }
    } else {
        for (const item of sourceArray) {
            outputObj[item[keyField]] = item;
        }
    }

    return outputObj;
}
