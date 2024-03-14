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
            if(item[keyField]){
                outputObj[item[keyField]] = callBack(item);
            }
        }
    } else if (cbType === "string") {
        for (const item of sourceArray) {
            if(item[keyField]){
                outputObj[item[keyField]] = item[callBack];
            }
        }
    } else {
        for (const item of sourceArray) {
            if(item[keyField]){
                outputObj[item[keyField]] = item;
            }
        }
    }

    return outputObj;
}

//格式化日期
export function formatDate(dateObj, formatStr) {
	if(!dateObj){
		dateObj = new Date();
	} else if(typeof dateObj === "number"){
        dateObj = new Date(dateObj);
    } else if(!dateObj.getDate){ //不是日期
        return dateObj.toString();
    }
	
	if(!formatStr || typeof(formatStr) !== "string"){
		formatStr = "yyyy-MM-dd hh:mm:ss";
	}
	
    const ooo = [
		[/(y+)/, dateObj.getFullYear()], //year
        [/(M+)/, dateObj.getMonth() + 1], //month
        [/(d+)/, dateObj.getDate()], //day
        [/(h+)/, dateObj.getHours()], //hour
        [/(m+)/, dateObj.getMinutes()], //minute
        [/(s+)/, dateObj.getSeconds()], //second
        [/(q+)/, Math.floor(dateObj.getMonth() / 3) + 1], //quarter
        [/(S+)/, dateObj.getMilliseconds()] //millisecond
    ];
	
    for (const arr of ooo) {
        if (arr[0].test(formatStr)) {
			const mat = RegExp.$1;
			const val = arr[1].toString();            
			if(val.length >= mat.length){
				formatStr = formatStr.replace(mat, val);
			} else {
				formatStr = formatStr.replace(mat, ("00000000" + val).substr(-mat.length));
			}
        }
    }
	
    return formatStr;
}