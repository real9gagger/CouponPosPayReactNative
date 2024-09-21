/**************** 一些静态数据 ****************/

/* 
    【！！！不建议在此引用任何组件、脚本文件，避免互相引用冲突！！！】
*/

export const CASH_PAYMENT_CODE = "00";//现金支付
export const CREDIT_CARD_PAYMENT_CODE = "01";//信用卡
export const E_MONEY_PAYMENT_CODE = "02"; //电子钱包
export const QR_CODE_PAYMENT_CODE = "03";//二维码
export const EMPTY_DEFAULT_TEXT = "--"; // 空数据时的替代文本
export const DISCOUNT_TYPE_ZK = 1; //优惠类型：折扣
export const DISCOUNT_TYPE_LJ = 2; //优惠类型：立减
export const TRANSACTION_TYPE_BACKUP = "0"; //退款时后台生成的副本订单
export const TRANSACTION_TYPE_RECEIVE = "1"; //收款
export const TRANSACTION_TYPE_CANCEL = "2"; //取消收款
export const TRANSACTION_TYPE_REFUND = "3"; //退款

//现金支付方式
export const cashPayList = [
    {
        logo: "logoCashPay", //LOGO 图片键名！请参考本目录下的 ./Pictures 文件
        name: "現金/Cash",
        pmcode: "00-00", //Payment Code
        subcode: "00"
    }
];

//信用卡付款方式
export const creditCardList = [
    {
        logo: "logoVisa", //LOGO 图片键名！请参考本目录下的 ./Pictures 文件
        name: "VISA",
        pmcode: "01-01", //Payment Code
        subcode: "01"
    },
    {
        logo: "logoMastercard",
        name: "Mastercard",
        pmcode: "01-02",
        subcode: "02"
    },
    {
        logo: "logoJcb",
        name: "JCB",
        pmcode: "01-03",
        subcode: "03"
    },
    {
        logo: "logoAmericanExpress",
        name: "American Express",
        pmcode: "01-04",
        subcode: "04"
    },
    {
        logo: "logoDinersClub",
        name: "Diners Club",
        pmcode: "01-05",
        subcode: "05"
    },
    {
        logo: "logoChinaUnionpay",
        name: "銀聯",
        pmcode: "01-06",
        subcode: "06"
    }
];

//电子钱包
export const eWalletList = [
    {
        logo: "logoIdCredit", //LOGO 图片键名！请参考本目录下的 ./Pictures 文件
        name: "iD",
        pmcode: "02-01", //Payment Code
        subcode: "01"
    },
    {
        logo: "logoJiaotongxiIC",
        name: "交通系IC",
        pmcode: "02-02",
        subcode: "02"
    },
    {
        logo: "logoLetianEdy",
        name: "楽天Edy",
        pmcode: "02-03",
        subcode: "03"
    },
    {
        logo: "logoWaon",
        name: "WAON",
        pmcode: "02-04",
        subcode: "04"
    },
    {
        logo: "logoNanaco",
        name: "nanaco",
        pmcode: "02-05",
        subcode: "05"
    },
    {
        logo: "logoQuicPay",
        name: "QUICPay",
        pmcode: "02-06",
        subcode: "06"
    },
    {
        logo: "logoPitapa",
        name: "PiTaPa",
        pmcode: "02-07",
        subcode: "07"
    }
];

//二维码支持的扫描支付方式
export const qrPayList = [
    {
        logo: "logoRakutenPay", //LOGO 图片键名！请参考本目录下的 ./Pictures 文件
        name: "楽天ペイ",
        pmcode: "03-11", //Payment Code
        subcode: "11"
    },
    {
        logo: "logoLinePay",
        name: "LINEPay",
        pmcode: "03-12",
        subcode: "12"
    },
    {
        logo: "logoPaypay",
        name: "PayPay",
        pmcode: "03-13",
        subcode: "13"
    },
    {
        logo: "logoDbarai",
        name: "d払い",
        pmcode: "03-14",
        subcode: "14"
    },
    {
        logo: "logoAupay",
        name: "auPay",
        pmcode: "03-15",
        subcode: "15"
    },
    {
        logo: "logoMerpay",
        name: "メルペイ",
        pmcode: "03-16",
        subcode: "16"
    },
    {
        logo: "logoTaiwanpay",
        name: "銀行Pay",
        pmcode: "03-19",
        subcode: "19"
    },
    {
        logo: "logoWechatPay",
        name: "WeChatPay",
        pmcode: "03-21",
        subcode: "21"
    },
    {
        logo: "logoAlipay",
        name: "Alipay",
        pmcode: "03-22",
        subcode: "22"
    },
    {
        logo: "logoYunshanfu",
        name: "云闪付",
        pmcode: "03-23",
        subcode: "23"
    },
    {
        logo: "logoBankpay",
        name: "BankPay",
        pmcode: "03-35",
        subcode: "35"
    }
];

//目前支持的语言列表
export const supportLanguageList = [
    {
        name: "日本語",
        code: "ja_JP",
        disabled: false //语言包是否已经翻译好了，true-否，false-是
    },
    {
        name: "简体中文",
        code: "zh_CN",
        disabled: false
    },
    {
        name: "正體中文",
        code: "zh_TW",
        disabled: false
    },
    {
        name: "English",
        code: "en_US",
        disabled: false
    }
];

//目前支持的交易货币
export const supportCurrencyList = [
    {
        name: "日本円",
        code: "JPY",
        symbol: "￥",
        unit: "円"
    },
    {
        name: "人民币",
        code: "CNY",
        symbol: "￥",
        unit: "元"
    },
    {
        name: "新臺幣",
        code: "TWD",
        symbol: "NT$",
        unit: "圓"
    },
    {
        name: "United States Dollar",
        code: "USD",
        symbol: "$",
        unit: "dollar"
    }
];

//主页全部支付类型标签页
export const allPayTypeMap = {
    tabQRCode: {
        ptname: "qrcode.pay",
        pticon: "qrcode-pay"
    },
    tabBankCard: {
        ptname: "credit.card",
        pticon: "bank-card"
    },
    tabEWallet: {
        ptname: "e.wallet",
        pticon: "e-wallet"
    },
    tabCashPay: {
        ptname: "cash.pay",
        pticon: "cash-pay"
    }
};

//获取支付方式信息
export function getPaymentInfo(pmcode, subcode){
    if(pmcode && (typeof pmcode === "string")){
        const fullCode = `${pmcode}-${subcode}`;
        if(pmcode === CASH_PAYMENT_CODE){
            return cashPayList[0];
        } else if(pmcode === CREDIT_CARD_PAYMENT_CODE){
            return creditCardList.find(vx => vx.pmcode === fullCode);
        } else if(pmcode === E_MONEY_PAYMENT_CODE){
            return eWalletList.find(vx => vx.pmcode === fullCode);
        } else { //QR_CODE_PAYMENT_CODE
            return qrPayList.find(vx => vx.pmcode === fullCode);
        }
    }
    return null;
}