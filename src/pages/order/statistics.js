import { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useI18N, useAppSettings } from "@/store/getter";
import { EMPTY_DEFAULT_TEXT, CREDIT_CARD_PAYMENT_CODE, E_MONEY_PAYMENT_CODE, QR_CODE_PAYMENT_CODE, TRANSACTION_TYPE_RECEIVE, TRANSACTION_TYPE_REFUND } from "@/common/Statics";
import PosPayIcon from "@/components/PosPayIcon";
import GradientButton from "@/components/GradientButton";
import PopupX from "@/components/PopupX";
import RadioBox from "@/components/RadioBox";
import CheckBox from "@/components/CheckBox";
import DateRangeBox from "@/components/DateRangeBox";

const styles = StyleSheet.create({
    itemBox: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10
    },
    itemRight: {
        marginLeft: 5
    },
    rowBottom: {
        marginTop: 5
    },
    titleBox: {
        fontSize: 14,
        textAlign: "center",
        marginTop: 10
    },
    valueBox: {
        fontSize: 20,
        fontWeight: "bold",
        color: appDarkColor
    },
    valueUnit: {
        fontSize: 10,
        marginLeft: 2,
        paddingTop: 6,
        color: "#666"
    },
    valueUnitHidden: {
        fontSize: 10,
        marginRight: 2,
        color: "#fff"
    },
    labelBox: {
        fontSize: 14,
        marginTop: 10,
        marginBottom: 5
    },
    selectsBox: {
        display: "flex",
        flexDirection: "row",
        borderBottomColor: "#ccc",
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingTop: 5,
        paddingBottom: 10
    },
    paramsBox: {
        backgroundColor: "#eee",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomColor: "#eee",
        borderBottomWidth: StyleSheet.hairlineWidth
    }
});

export default function OrderStatistics(props){
    
    const i18n = useI18N();
    const appSettings = useAppSettings();
    const drbRef = useRef(null);
    const [statisData, setStatisData] = useState({});
    const [isPopupShow, setIsPopupShow] = useState(false);
    const [ttc, setTTC] = useState(null); //transaction type code
    const [pmc, setPMC] = useState([]); //payment method code
    const [paramsText, setParamsText] = useState(""); //参数简要说明文本
    
    const onPopupShow = () => {
        setIsPopupShow(true);
    }
    const onPopupClose = () => {
        setIsPopupShow(false);
    }
    const onTtcChange = (code) => {
        return function(){
            setTTC(code);
        }
    }
    const onPmcChange = (code) => {
        return function(){
            /* 【2024年3月8日 还不支持多个支付方式查询！！！】
            const idx = pmc.indexOf(code);
            if(idx >= 0){
                pmc.splice(idx, 1);
            } else {
                pmc.push(code);
            }
            setPMC([...pmc]); */
            if(pmc.includes(code)){
                setPMC([]);
            } else {
                setPMC([code]);
            }
        }
    }
    const onStartStatistics = () => {
    }
    
    useEffect(() => {
        $request("getOrderStatistics").then(setStatisData);
    }, []);
    
    return (<>
        <TouchableOpacity style={[fxHC, styles.paramsBox]} onPress={onPopupShow} activeOpacity={0.6}>
            <PosPayIcon name="query-params" size={14} offset={-5} />
            <Text style={[fxG1, fs12, pdRX]} numberOfLines={1}>{paramsText || i18n["options.any"]}</Text>
            <Text style={fs12}>{i18n["filter"]}</Text>
            <PosPayIcon name="filter-list" size={14} offset={5} style={{marginBottom: -2}} />
        </TouchableOpacity>
        <View style={[pgEE, pdX]}>
            <View style={[fxHC, fxWP]}>
                <View style={styles.itemBox}>
                    <View style={fxHM}>
                        <Text style={styles.valueUnitHidden}>{appSettings.currencyUnit}</Text>
                        <Text style={styles.valueBox}>{statisData.totalOrderAmount || EMPTY_DEFAULT_TEXT}</Text>
                        <Text style={styles.valueUnit}>{appSettings.currencyUnit}</Text>
                    </View>
                    <Text style={styles.titleBox}>累计销售</Text>
                </View>
                <View style={[styles.itemBox, styles.itemRight]}>
                    <View style={fxHM}>
                        <Text style={styles.valueUnitHidden}>{appSettings.currencyUnit}</Text>
                        <Text style={styles.valueBox}>{statisData.totalDiscountAmount || EMPTY_DEFAULT_TEXT}</Text>
                        <Text style={styles.valueUnit}>{appSettings.currencyUnit}</Text>
                    </View>
                    <Text style={styles.titleBox}>累计优惠</Text>
                </View>
            </View>
            <View style={[fxHC, fxWP, styles.rowBottom]}>
                <View style={styles.itemBox}>
                    <View style={fxHM}>
                        <Text style={styles.valueUnitHidden}>{appSettings.currencyUnit}</Text>
                        <Text style={styles.valueBox}>{statisData.totalTax || EMPTY_DEFAULT_TEXT}</Text>
                        <Text style={styles.valueUnit}>{appSettings.currencyUnit}</Text>
                    </View>
                    <Text style={styles.titleBox}>累计收税</Text>
                </View>
                <View style={[styles.itemBox, styles.itemRight]}>
                    <View style={fxHM}>
                        <Text style={styles.valueUnitHidden}>{appSettings.currencyUnit}</Text>
                        <Text style={styles.valueBox}>{statisData.totalAmount || EMPTY_DEFAULT_TEXT}</Text>
                        <Text style={styles.valueUnit}>{appSettings.currencyUnit}</Text>
                    </View>
                    <Text style={styles.titleBox}>累计收入</Text>
                </View>
            </View>
        </View>
        <PopupX showMe={isPopupShow} onClose={onPopupClose} title={i18n["filter"]}>
            <View style={pdHX}>
                <Text style={styles.labelBox}>{i18n["transaction.time"]}</Text>
                <DateRangeBox
                    ref={drbRef}
                    style={styles.selectsBox}
                    confirmText={i18n["btn.confirm"]}
                    cancelText={i18n["btn.cancel"]}
                    beginPlaceholder={i18n["begindate"]}
                    endPlaceholder={i18n["enddate"]}
                />
                
                <Text style={styles.labelBox}>{i18n["transaction.type"]}</Text>
                <View style={styles.selectsBox}>
                    <RadioBox size={18} label={i18n["options.any"]} style={fxG1} checked={!ttc} onPress={onTtcChange(null)} />
                    <RadioBox size={18} label={i18n["transaction.receive"]} style={fxG1} checked={ttc===TRANSACTION_TYPE_RECEIVE} onPress={onTtcChange(TRANSACTION_TYPE_RECEIVE)} />
                    <RadioBox size={18} label={i18n["transaction.refund"]} style={fxG1} checked={ttc===TRANSACTION_TYPE_REFUND} onPress={onTtcChange(TRANSACTION_TYPE_REFUND)} />
                </View>
                
                <Text style={styles.labelBox}>{i18n["payment.method"]}</Text>
                <View style={styles.selectsBox}>
                    <CheckBox size={18} label={i18n["credit.card"]} style={fxG1} checked={pmc.includes(CREDIT_CARD_PAYMENT_CODE)} onPress={onPmcChange(CREDIT_CARD_PAYMENT_CODE)} />
                    <CheckBox size={18} label={i18n["e.wallet"]} style={fxG1} checked={pmc.includes(E_MONEY_PAYMENT_CODE)} onPress={onPmcChange(E_MONEY_PAYMENT_CODE)} />
                    <CheckBox size={18} label={i18n["qrcode.pay"]} style={fxG1} checked={pmc.includes(QR_CODE_PAYMENT_CODE)} onPress={onPmcChange(QR_CODE_PAYMENT_CODE)} />
                </View>
            </View>
            <View style={[fxR, pdX, {marginTop: 100}]}>
                <GradientButton style={fxG1} onPress={onPopupClose}>{i18n["btn.cancel"]}</GradientButton>
                <GradientButton style={[fxG1, mgLS]} onPress={onStartStatistics}>{i18n["btn.confirm"]}</GradientButton>
            </View>
        </PopupX>
    </>);
}