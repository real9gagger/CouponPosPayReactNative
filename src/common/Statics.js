/**************** 一些静态数据 ****************/

export const QR_PAYMENT_CODE = "03";

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
        logo: "logoRakutenPay",
        name: "楽天ペイ",
        pmcode: "11" //Payment Code
    },
    {
        logo: "logoLinePay",
        name: "LINEPay",
        pmcode: "12"
    },
    {
        logo: "logoPaypay",
        name: "PayPay",
        pmcode: "13"
    },
    {
        logo: "logoDbarai",
        name: "d払い",
        pmcode: "14"
    },
    {
        logo: "logoAupay",
        name: "auPay",
        pmcode: "15"
    },
    {
        logo: "logoMerpay",
        name: "メルペイ",
        pmcode: "16"
    },
    {
        logo: "logoTaiwanpay",
        name: "銀行Pay",
        pmcode: "19"
    },
    {
        logo: "logoWechatPay",
        name: "WeChatPay",
        pmcode: "21"
    },
    {
        logo: "logoAlipay",
        name: "Alipay",
        pmcode: "22" 
    },
    {
        logo: "logoYunshanfu",
        name: "銀聯",
        pmcode: "23"
    },
    {
        logo: "logoBankpay",
        name: "BankPay",
        pmcode: "35"
    }
];

//获取支付方式信息
export function getPaymentInfo(pmcode, subcode){
    if(pmcode && (typeof pmcode === "string")){
        if(pmcode.startsWith("01")){
            return bankCardList.find(vx => vx.pmcode === pmcode);
        } else if(pmcode.startsWith("02")){
            return eWalletList.find(vx => vx.pmcode === `${pmcode}-${subcode}`);
        } else {
            return qrPayList.find(vx => vx.pmcode === subcode);
        }
    }
    return null;
}