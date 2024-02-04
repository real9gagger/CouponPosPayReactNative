/**************** 一些静态数据 ****************/

//信用卡
export const bankCardList = [
    {
        logo: "logoChinaUnionpay", //LOGO 图片键名！请参考本目录下的 ./Pictures 文件
        name: "银联UnionPay",
        pmcode: "01" //Payment Code
    }
];

//电子钱包
export const eWalletList = [
    {
        logo: "logoIdCredit", //LOGO 图片键名！请参考本目录下的 ./Pictures 文件
        name: "iD",
        pmcode: "02-01" //Payment Code
    },
    {
        logo: "logoJiaotongxiIC",
        name: "交通系IC",
        pmcode: "02-02"
    },
    {
        logo: "logoLetianEdy",
        name: "楽天Edy",
        pmcode: "02-03"
    },
    {
        logo: "logoWaon",
        name: "WAON",
        pmcode: "02-04"
    },
    {
        logo: "logoNanaco",
        name: "nanaco",
        pmcode: "02-05"
    },
    {
        logo: "logoQuicPay",
        name: "QUICPay",
        pmcode: "02-06"
    },
    {
        logo: "logoPitapa",
        name: "PiTaPa",
        pmcode: "02-07"
    }
];

//二维码支持的扫描支付方式
export const qrPayList = [
    {
        logo: "unknownPayment",
        name: "楽天ペイ",
        pmcode: "11" //Payment Code
    },
    {
        logo: "unknownPayment",
        name: "LINEPay",
        pmcode: "12"
    },
    {
        logo: "unknownPayment",
        name: "PayPay",
        pmcode: "13"
    },
    {
        logo: "unknownPayment",
        name: "d払い",
        pmcode: "14"
    },
    {
        logo: "unknownPayment",
        name: "auPay",
        pmcode: "15"
    },
    {
        logo: "unknownPayment",
        name: "メルペイ",
        pmcode: "16"
    },
    {
        logo: "unknownPayment",
        name: "銀行Pay",
        pmcode: "19"
    },
    {
        logo: "unknownPayment",
        name: "WeChatPay",
        pmcode: "21"
    },
    {
        logo: "unknownPayment",
        name: "Alipay",
        pmcode: "22" 
    },
    {
        logo: "unknownPayment",
        name: "銀聯",
        pmcode: "23"
    },
    {
        logo: "unknownPayment",
        name: "BankPay",
        pmcode: "35"
    }
];

//获取支付方式信息
export function getPaymentInfo(pmcode){
    if(pmcode && (typeof pmcode === "string")){
        if(pmcode.startsWith("01")){
            return bankCardList.find(vx => vx.pmcode === pmcode);
        } else if(pmcode.startsWith("02")){
            return eWalletList.find(vx => vx.pmcode === pmcode);
        } else {
            return qrPayList.find(vx => vx.pmcode === pmcode);
        }
    }
    return null;
}