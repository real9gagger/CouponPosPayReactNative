//将字符串日期转成日期对象
export function parseStringDate(dt) {
    if (dt && typeof(dt) === "string") {
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

//解析优惠券扫描结果
export function parseCouponScanResult(cc){
    if(!cc || typeof(cc) !== "string"){
        return null;
    }
    
    const items = cc.split("#");
    if(items.length >= 10){
        return {
            picurl: null,
            title: items[1],
            cpcode: items[1], //优惠码
            ptcode: items[0], //分销码
            distype: (+items[2] || 0), //1-折扣，2-立减，其他值-未知
            discount: (+items[3] || 0), //折扣率，或者立减金额
            condition: (+items[6] || 0), //满免条件
            expiration: (items[8].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3 ~ ") + items[9].replace(/(\d{4})(\d{2})/, "$1-$2-")),
            taxfreerate: (+items[5] || 0), //免税比例 tax free rate，百分数，有多少比例是免税的。比如 5%，总金额是 100，那么有 20 块是免税的，剩下80元需要计算税收
            createtime: Date.now() //创建时间的时间戳
        };
    } else {
        return null;
    }
}

//扫描结束后去服务器查询优惠券信息
export function queryCouponScanResult(cc){
    return $request("getDiscountDetailByDiscountCode", { discountCode: cc }).then(res => ({
        picurl: $ossimage(res.spuImageUrl), //优惠券图片
        title: res.discountName, //优惠券名称
        cpcode: res.discountCode, //优惠码
        ptcode: res.tourPromotionCode, //分销码
        distype: (+res.discountTypeValue || 0), //1-折扣，2-立减，其他值-未知
        discount: (+res.attrValue || 0), //折扣率，或者立减金额
        condition: (+res.startAmount || 0), //满免条件
        expiration: (res.startTime && res.endTime ? res.startTime.substr(0, 10) + " ~ " + res.endTime.substr(0, 10) : "2099-12-31"), //有效日期范围
        taxfreerate: (+res.taxRate || 0), //免税比例 tax free rate，百分数，有多少比例是免税的。比如 5%，总金额是 100，那么有 20 块是免税的，剩下80元需要计算税收
        createtime: Date.now() //创建时间的时间戳
    }));
}

//检查优惠券是否已过期
export function checkCouponExpiration(exp){
    if(!exp){
        return true; //没有时间限制
    }
    const arr = exp.split("~");
    const nowDate = new Date();
    
    if(arr.length === 1){//只有终止日期
        const endDate = parseStringDate(arr[0]);
        endDate.setHours(23, 59, 59);
        return (nowDate <= endDate);
    } else {//起始日期 ~ 终止日期
        const startDate = parseStringDate(arr[0]);
        const endDate = parseStringDate(arr[1]);
        
        startDate.setHours(0, 0, 0);
        endDate.setHours(23, 59, 59);
        return (nowDate >= startDate && nowDate <= endDate);
    }
}

//获取正负值优惠金额，用于显示（收款时小于等于 0，退款时大于等于 0）
export function getDiscountMoney(num){
    if(!num){
        return "0";
    }
    const numType = (typeof num);
    
    if(numType === "number"){
        if(num > 0){//收款时后台返回为正数
            return ("+" + num);
        } else {//退款时后台返回为负数
            return ("-" + Math.abs(num));
        }
    } else if(numType === "string") {
        if(num === "0"){
            return "0";
        } else if(num[0] === "-"){//退款时后台返回为负数
            return num;
        } else {//收款时后台返回为正数
            return ("+" + num);
        }
    } else {
        return "0";
    }
}