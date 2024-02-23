/**************** 一些静态数据 ****************/

export const CREDIT_CARD_PAYMENT_CODE = "01";
export const QR_CODE_PAYMENT_CODE = "03";
export const EMPTY_DEFAULT_TEXT = "--"; // 空数据时的替代文本
export const DISCOUNT_TYPE_ZK = 1; //优惠类型：折扣
export const DISCOUNT_TYPE_LJ = 2; //优惠类型：立减

//信用卡付款方式
export const creditCardList = [
    /* {
        logo: "unknownPayment", //LOGO 图片键名！请参考本目录下的 ./Pictures 文件
        name: "支持手动输入信用卡号",
        pmcode: "01-00" //Payment Code
    }, */
    {
        logo: "logoVisa",
        name: "VISA",
        pmcode: "01-01" 
    },
    {
        logo: "logoMastercard",
        name: "Mastercard",
        pmcode: "01-02"
    },
    {
        logo: "logoJcb",
        name: "JCB",
        pmcode: "01-03"
    },
    {
        logo: "logoAmericanExpress",
        name: "American Express",
        pmcode: "01-04"
    },
    {
        logo: "logoDinersClub",
        name: "Diners Club",
        pmcode: "01-05"
    },
    {
        logo: "logoChinaUnionpay",
        name: "銀聯",
        pmcode: "01-06"
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
        pmcode: "03-11" //Payment Code
    },
    {
        logo: "logoLinePay",
        name: "LINEPay",
        pmcode: "03-12"
    },
    {
        logo: "logoPaypay",
        name: "PayPay",
        pmcode: "03-13"
    },
    {
        logo: "logoDbarai",
        name: "d払い",
        pmcode: "03-14"
    },
    {
        logo: "logoAupay",
        name: "auPay",
        pmcode: "03-15"
    },
    {
        logo: "logoMerpay",
        name: "メルペイ",
        pmcode: "03-16"
    },
    {
        logo: "logoTaiwanpay",
        name: "銀行Pay",
        pmcode: "03-19"
    },
    {
        logo: "logoWechatPay",
        name: "WeChatPay",
        pmcode: "03-21"
    },
    {
        logo: "logoAlipay",
        name: "Alipay",
        pmcode: "03-22" 
    },
    {
        logo: "logoYunshanfu",
        name: "銀聯",
        pmcode: "03-23"
    },
    {
        logo: "logoBankpay",
        name: "BankPay",
        pmcode: "03-35"
    }
];

//目前支持的语言列表
export const supportLanguageList = [
    {
        name: "日本語",
        code: "ja_JP",
        disabled: true //语言包是否已经翻译好了，true-否，false-是
    },
    {
        name: "简体中文",
        code: "zh_CN",
        disabled: false
    },
    {
        name: "正體中文",
        code: "zh_TW",
        disabled: true
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

//获取支付方式信息
export function getPaymentInfo(pmcode, subcode){
    if(pmcode && (typeof pmcode === "string")){
        const fullCode = `${pmcode}-${subcode}`;
        if(pmcode.startsWith("01")){
            return creditCardList.find(vx => vx.pmcode === fullCode);
        } else if(pmcode.startsWith("02")){
            return eWalletList.find(vx => vx.pmcode === fullCode);
        } else {
            return qrPayList.find(vx => vx.pmcode === fullCode);
        }
    }
    return null;
}