package com.couponpospayreactnative.cardreader;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

public class CardReadingInfo {

    public static final int READ_SUCCESS = 0; //读取成功
    public static final int READ_CANCEL = 1; //用户取消操作
    public static final int READ_INVALID_PARAMETER = 106; //参数错误
    public static final int READ_SEQUENCE_ERROR = 111; //序列错误
    public static final int READ_CARD_READ_TIME_OUT = 112; //读卡超时
    public static final int READ_CARD_READ_FAIL = 114; //读卡失败
    public static final int READ_OTHER_ERROR = -1; //未知的其他错误
    public static final int READ_CARD_TYPE_ERROR = 9000; //卡类型错误
    public static final int READ_WAITING = 9001; //正在等待用户把卡靠近感应区
    public static final int READ_NULL_INSTANCE = 9002; //空的实例
    public static final int READ_NULL_CARD = 9003; //空的卡

    private String processingName = "";
    private String processingMessage = "";
    private String cardErrorInfo = "";
    private String cardNumber = "";
    private String cardType = "";
    private String cardResponseData = "";
    private String cardHolderName = ""; //持卡人名称
    private String icSelectedValue = ""; //IC应用选择完成时返回的值
    private int cardResultCode = 0;

    public CardReadingInfo(String pn) {
        this.processingName = pn;
    }
    public CardReadingInfo(String pn, int code) {
        this.processingName = pn;
        this.processingMessage = this.getErrMsg(code);
    }

    public void setProcessingName(String pn) {
        this.processingName = pn;
    }

    public void setProcessingMessage(int code) {
        this.processingMessage = this.getErrMsg(code);
    }

    public void setCardErrorInfo(String cei) {
        this.cardErrorInfo = cei;
    }

    public void setCardNumber(String cn) {
        this.cardNumber = cn;
    }

    public void setCardType(String ct) {
        this.cardType = ct;
    }

    public void setCardResponseData(String crd) {
        this.cardResponseData = crd;
    }

    public void setCardResultCode(int crc) {
        this.cardResultCode = crc;
    }

    public void setCardHolderName(String chn) {
        this.cardHolderName = chn;
    }

    public void setIcSelectedValue(String isv) {
        this.icSelectedValue = isv;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public String getCardType() {
        return cardType;
    }

    public String getCardResponseData() {
        return cardResponseData;
    }

    public String getProcessingMessage() {
        return processingMessage;
    }

    public WritableMap getMapData() {
        WritableMap output = Arguments.createMap();

        output.putString("processingName", this.processingName);
        output.putString("processingMessage", this.processingMessage);
        output.putString("cardErrorInfo", this.cardErrorInfo);
        output.putString("cardNumber", this.cardNumber);
        output.putString("cardType", this.cardType);
        output.putString("cardHolderName", this.cardHolderName);
        output.putString("cardResponseData", this.cardResponseData);
        output.putString("icSelectedValue", this.icSelectedValue);
        output.putInt("cardResultCode", this.cardResultCode);

        return output;
    }

    private String getErrMsg(int code) {
        switch (code) {
            case READ_SUCCESS:
                return "Card reading is successful!";
            case READ_CARD_TYPE_ERROR:
                return "Card type error!";
            case READ_WAITING:
                return "Start waiting for holding a card!";
            case READ_NULL_INSTANCE:
                return "Get card reader instance failed!";
            case READ_NULL_CARD:
                return "The card is null!";
            case READ_CANCEL:
                return "Card reading is canceled!";
            case READ_INVALID_PARAMETER:
                return "Parameter is invalid!";
            case READ_SEQUENCE_ERROR:
                return "Sequence is error!";
            case READ_CARD_READ_TIME_OUT:
                return "Card reading is time out!";
            case READ_CARD_READ_FAIL:
                return "Card reading is failed!";
            case READ_OTHER_ERROR:
                return "Other error is occurred!";
            default:
                return "Unknown error is occurred!";
        }
    }
}
