package com.couponpospayreactnative.cardreader;

import android.util.Log;

import androidx.annotation.NonNull;

import com.couponpospayreactnative.MainActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;
import com.panasonic.smartpayment.android.api.cardreaderlibrary.Card;
import com.panasonic.smartpayment.android.api.cardreaderlibrary.CardReader;
import com.panasonic.smartpayment.android.api.cardreaderlibrary.CardType;
import com.panasonic.smartpayment.android.api.cardreaderlibrary.FelicaCard;
import com.panasonic.smartpayment.android.api.cardreaderlibrary.ICardReaderObserver;
import com.panasonic.smartpayment.android.api.cardreaderlibrary.emv.EmvCard;
import com.panasonic.smartpayment.android.api.cardreaderlibrary.emv.EmvCardReader;
import com.panasonic.smartpayment.android.api.cardreaderlibrary.emv.EmvTagData;
import com.panasonic.smartpayment.android.api.cardreaderlibrary.emv.ExtractionData;
import com.panasonic.smartpayment.android.api.cardreaderlibrary.emv.ExtractionParameter;
import com.panasonic.smartpayment.android.api.cardreaderlibrary.emv.IEmvCardReaderObserver;
import com.panasonic.smartpayment.android.api.cardreaderlibrary.emv.ReadParameter;
import com.panasonic.smartpayment.android.api.cardreaderlibrary.emv.TargetTrack;
import com.panasonic.smartpayment.android.api.cardreaderlibrary.felica.FelicaCardReader;

public class CardReaderHelper extends ReactContextBaseJavaModule {
    private final String TAG = CardReaderHelper.class.getSimpleName();
    private final int READ_TIMEOUT_SECONDS = 20; //读卡超时时间，单位：秒
    private final String EVENT_EMITER_NAME = "ON_CARD_READING";

    public CardReaderHelper(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "CardReaderHelper";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getSdkVersion() {
        if (MainActivity.isPanasonicJTC60Device()) {
            return CardReader.SDK_VERSION;
        } else {
            return "";
        }
    }

    //去掉读卡
    @ReactMethod
    public void cancelRead() {
        if (MainActivity.isPanasonicJTC60Device()) {
            if (CardReader.cardReader != null) {
                CardReader.cardReader.cancel();
            }
            CardReader.clear();
        }
    }

    //获取支持的卡的映射表
    @ReactMethod(isBlockingSynchronousMethod = true)
    public WritableMap getSupportCardMap() {

        WritableMap wm = Arguments.createMap();

        wm.putInt(CardType.CARDTYPE_FELICA.name(), 0xFF0000); //菲莉卡
        wm.putInt(CardType.CARDTYPE_ICCL.name(), 0xEE0000); //非接触式IC卡
        wm.putInt(CardType.CARDTYPE_ICCT.name(), 0xEE0011); //接触式IC卡

        wm.putInt(CardType.CARDTYPE_MS.name(), 0xDD0000); //磁力卡
        wm.putInt(CardType.CARDTYPE_EMVANY.name(), 0xCC0000);
        wm.putInt(CardType.CARDTYPE_MIFARE.name(), 0xBB0000);
        wm.putInt(CardType.CARDTYPE_TYPEA.name(), 0xAA0000);
        wm.putInt(CardType.CARDTYPE_TYPEB.name(), 0xAA0011);
        wm.putInt(CardType.CARDTYPE_NONE.name(), 0x000000);

        return wm;
    }

    //获取事件名称
    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getEventName() {
        return EVENT_EMITER_NAME;
    }

    //开始读卡
    @ReactMethod
    public void startRead(int cardTypeCode) {
        switch (cardTypeCode) {
            case 0xFF0000: //菲莉卡
                startReadFelica();
                break;
            case 0xEE0000: //非接触式IC卡
                startReadEmv(CardType.CARDTYPE_ICCL);
                break;
            case 0xEE0011: //接触式IC卡
                startReadEmv(CardType.CARDTYPE_ICCT);
                break;
            case 0xDD0000: //磁力卡
                startReadEmv(CardType.CARDTYPE_MS);
                break;
            default:
                break;
        }
    }

    //2024年4月28日 开始读卡 Felica 卡
    private void startReadFelica() {
        if (!MainActivity.isPanasonicJTC60Device()) {
            return;
        }

        ICardReaderObserver icro = new ICardReaderObserver() {
            @Override
            public void onTouchWaitingStarted() {
                //Notification of start waiting for holding a card.
                //正在等待用户把卡靠近感应区
                emitEventToJS(new CardReadingInfo("FelicaTouchWaitingStarted", CardReadingInfo.READ_WAITING));
            }

            @Override
            public void onFinished(Card card) {
                //Notification of card reading result

                CardReadingInfo cri = new CardReadingInfo("FelicaFinished", CardReadingInfo.READ_NULL_CARD);

                if (card != null) {
                    if (card.getResultCode() == CardReadingInfo.READ_SUCCESS) {
                        if (card.getCardType() == CardType.CARDTYPE_FELICA) {
                            FelicaCard flc = (FelicaCard) card;
                            cri.setCardNumber(bytes2Text(flc.getIdm()));
                            cri.setCardResponseData(bytes2Text(flc.getResponseData()));
                            cri.setProcessingMessage(CardReadingInfo.READ_SUCCESS);
                        } else {
                            cri.setProcessingMessage(CardReadingInfo.READ_CARD_TYPE_ERROR);
                        }
                    } else {
                        cri.setProcessingMessage(card.getResultCode());
                    }

                    cri.setCardResultCode(card.getResultCode());
                    cri.setCardErrorInfo(card.getErrorInfo());
                    cri.setCardType(card.getCardType() != null ? card.getCardType().name() : CardType.CARDTYPE_NONE.name());

                    Log.d(TAG, "Felica 读卡结果：" + cri.getProcessingMessage() + "，卡号：" + cri.getCardNumber() + "，响应数据：" + cri.getCardResponseData());
                }

                emitEventToJS(cri);
            }
        };

        CardReader flReader = new CardReader(getReactApplicationContext());
        int processingAcceptance = 999;

        try {
            processingAcceptance = flReader.readCard(READ_TIMEOUT_SECONDS, CardType.CARDTYPE_FELICA, icro);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        Log.d(TAG, "进度校验码::::" + processingAcceptance);
        switch (processingAcceptance){
            case 0: break; //调用成功！
            case 111: emitEventToJS(new CardReadingInfo("FelicaFailed", CardReadingInfo.READ_SEQUENCE_ERROR)); break; //因处理中⽽⽆法受理（例如：忙碌中）
            case 106: emitEventToJS(new CardReadingInfo("FelicaFailed", CardReadingInfo.READ_INVALID_PARAMETER)); break; //⽆效的参数
            case 999: emitEventToJS(new CardReadingInfo("FelicaFailed", CardReadingInfo.READ_NULL_INSTANCE)); break; //空的实例
            default: emitEventToJS(new CardReadingInfo("FelicaFailed", CardReadingInfo.READ_OTHER_ERROR)); break; //意外的异常
        }
    }

    //2024年4月28日 开始读卡 EMV 卡
    private void startReadEmv(CardType ct) {
        if (!MainActivity.isPanasonicJTC60Device() || ct == null) {
            return;
        }

        //generate parameter
        ReadParameter readParameter = new ReadParameter();
        readParameter.setPackageName(null);
        EmvCardReader ecReader = (EmvCardReader) CardReader.get(getReactApplicationContext(), ct);
        int resultCode = 999;

        IEmvCardReaderObserver icro = new IEmvCardReaderObserver() {
            @Override
            public void onCardDetectStarted() {
                Log.d(TAG, "检测卡已开始....");
                emitEventToJS(new CardReadingInfo("EmvCardDetectStarted"));
            }

            @Override
            public void onCardDetected(CardType cardType) {
                Log.d(TAG, "检测卡完成....");
                CardReadingInfo cri = new CardReadingInfo("EmvCardDetected");
                cri.setCardType(cardType != null ? cardType.name() : CardType.CARDTYPE_NONE.name());
                emitEventToJS(cri);
            }

            @Override
            public void onCompleted(Card card) {
                Log.d(TAG, "读取卡信息完成....");
                CardReadingInfo cri = new CardReadingInfo("EmvCompleted");

                ecReader.finish(); //请务必在“onCompleted“之后执⾏。除⾮调⽤finish，否则即使调⽤ readCard，也会返回序列错误 (OPOS_E_FAILURE(111))。

                if (card != null) {
                    if (card.getResultCode() == CardReadingInfo.READ_SUCCESS) {
                        if (card.getCardType() == CardType.CARDTYPE_MS) {
                            EmvCard emvc = (EmvCard) card;
                            cri.setCardResponseData(getEmvResult(emvc, 1));
                            cri.setCardHolderName(emvc.getCardHolderName());
                            cri.setProcessingMessage(CardReadingInfo.READ_SUCCESS);
                        } else {
                            cri.setProcessingMessage(CardReadingInfo.READ_CARD_TYPE_ERROR);
                        }
                    } else {
                        cri.setProcessingMessage(card.getResultCode());
                    }

                    cri.setCardResultCode(card.getResultCode());
                    cri.setCardErrorInfo(card.getErrorInfo());
                    cri.setCardType(card.getCardType() != null ? card.getCardType().name() : CardType.CARDTYPE_NONE.name());

                    Log.d(TAG, "Felica 读卡结果：" + cri.getProcessingMessage() + "，卡号：" + cri.getCardNumber() + "，响应数据：" + cri.getCardResponseData());
                } else {
                    cri.setProcessingMessage(CardReadingInfo.READ_NULL_CARD);
                }

                emitEventToJS(cri);
            }

            @Override
            public void onRequestReswipe() {
                Log.d(TAG, "请求重新刷卡....");
                emitEventToJS(new CardReadingInfo("EmvRequestReswipe"));
            }

            @Override
            public void onContactlessIcCardRead() {
                Log.d(TAG, "读取非接触式IC卡....");
                emitEventToJS(new CardReadingInfo("EmvContactlessIcCardRead"));
            }

            @Override
            public void onIcApplicationSelectionStarted() {
                Log.d(TAG, "IC应用选择开始....");
                emitEventToJS(new CardReadingInfo("EmvIcApplicationSelectionStarted"));
            }

            @Override
            public void onIcApplicationSelected(String sv) {
                Log.d(TAG, "IC应用选择完成....");
                CardReadingInfo cri = new CardReadingInfo("EmvIcApplicationSelectionStarted");
                cri.setIcSelectedValue(sv);
                emitEventToJS(cri);
            }

            @Override
            public void onClRemoval() {
                Log.d(TAG, "非接触式IC卡断开连接....");
                emitEventToJS(new CardReadingInfo("EmvClRemoval"));
            }
        };

        try {
            resultCode = ecReader.readCard(READ_TIMEOUT_SECONDS, ct, readParameter, icro);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        Log.d(TAG, "进度校验码::::" + resultCode);

        switch (resultCode){
            case 0: break; //调用成功！
            case 111: emitEventToJS(new CardReadingInfo("EmvFailed", CardReadingInfo.READ_SEQUENCE_ERROR)); break; //因处理中⽽⽆法受理（例如：忙碌中）
            case 106: emitEventToJS(new CardReadingInfo("EmvFailed", CardReadingInfo.READ_INVALID_PARAMETER)); break; //⽆效的参数
            case 999: emitEventToJS(new CardReadingInfo("EmvFailed", CardReadingInfo.READ_NULL_INSTANCE)); break; //空的实例
            default: emitEventToJS(new CardReadingInfo("EmvFailed", CardReadingInfo.READ_OTHER_ERROR)); break; //意外的异常
        }
    }

    // Convert bytes data to text string.
    private String bytes2Text(byte[] bytes) {
        if (bytes != null && bytes.length > 0) {
            StringBuilder sb = new StringBuilder();
            for (byte chr : bytes) {
                sb.append((char) chr);
            }
            return sb.toString();
        }
        return "";
    }

    private String getEmvResult(EmvCard emvc, int track) {
        String result = "";
        CardType ct = emvc.getCardType();

        if (ct == CardType.CARDTYPE_MS || ct == CardType.CARDTYPE_ICCT) {//磁力卡或者接触式IC卡
            Log.d(TAG, "getEmvResult: " +
                    emvc.getCardHolderName() + ":::" +
                    emvc.getMaskedJis1Track2Data() + ":::" +
                    emvc.getMaskedJis2Data() + ":::" +
                    emvc.getContactlessData());
            if (track == 0) { //JIS1_TRACK1
                result = emvc.getCardHolderName();
            } else if (track == 1) { //JIS1_TRACK2
                result = emvc.getMaskedJis1Track2Data();
            } else if (track == 2) { //JIS2_TRACK
                result = emvc.getMaskedJis2Data();
            } else if (track == 3) { //JIS2_TRACK_WITH_PARAMETER
                //get input data
                String searchKeyword = "2024年4月29日，暂不支持搜索！";
                ExtractionParameter ep = new ExtractionParameter(TargetTrack.TRACKTYPE_JIS2);
                ep.setPosition(0, 5);
                ep.setKeyword(searchKeyword, 0);
                ExtractionData ed = emvc.getTargetTrackData(ep);
                if (ed.isSuccessful()) {
                    result = ed.getTrackData();
                } else {
                    Log.d(TAG, "找不到相关的数据...");
                }
            }
        } else if (ct == CardType.CARDTYPE_ICCL) { //非接触式IC卡
            EmvTagData etd = emvc.getContactlessData();
            if (etd != null) {
                result = (etd.getTagNumber() + ":" + etd.getTagData());
            }
        }

        return result;
    }

    //发送事件给前端JS
    private void emitEventToJS(CardReadingInfo cri) {
        RCTDeviceEventEmitter jsm = getReactApplicationContext().getJSModule(RCTDeviceEventEmitter.class);
        jsm.emit(EVENT_EMITER_NAME, cri.getMapData());
    }
}
