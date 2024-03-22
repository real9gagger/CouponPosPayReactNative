import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useI18N, useAppSettings } from "@/store/getter";
import { EMPTY_DEFAULT_TEXT, CREDIT_CARD_PAYMENT_CODE, E_MONEY_PAYMENT_CODE, QR_CODE_PAYMENT_CODE, TRANSACTION_TYPE_RECEIVE, TRANSACTION_TYPE_REFUND } from "@/common/Statics";
import DateRangeBox, { clearDateRangeCache, setDateRangeData, getBeginDateString, getEndDateString } from "@/components/DateRangeBox";
import PosPayIcon from "@/components/PosPayIcon";
import GradientButton from "@/components/GradientButton";
import PopupX from "@/components/PopupX";
import RadioBox from "@/components/RadioBox";
import CheckBox from "@/components/CheckBox";
import TextualButton from "@/components/TextualButton";

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
    headerBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eee",
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    btnBox: {
        backgroundColor: "#fff",
        borderColor: appDarkColor,
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginRight: 5,
        color: "#000"
    },
    btnChecked: {
        backgroundColor: appMainColor,
        borderColor: appMainColor,
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 10,
        paddingVertical: 7,
        marginRight: 5,
        color: "#fff"
    },
    filterBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eee",
        paddingHorizontal: 10,
        paddingVertical: 10
    }
});

const drbUniqueKey = "StatisticsFilterDRB";
const dateNameList = [
    "yesterday", 
    "today", 
    "statistics.recent.1week",
    "statistics.recent.1month",
    "statistics.recent.3month",
    "statistics.recent.6month",
    "statistics.recent.1year"
];

export default function OrderStatistics(props){
    
    const i18n = useI18N();
    const appSettings = useAppSettings();
    const [statisData, setStatisData] = useState({});
    const [isPopupShow, setIsPopupShow] = useState(false);
    const [ttc, setTTC] = useState(null); //transaction type code
    const [pmc, setPMC] = useState([]); //payment method code
    const [sdn, setSDN] = useState("today"); //select date name
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
    const getTtcName = (code) => {
        switch(code){
            case TRANSACTION_TYPE_RECEIVE: return i18n["order.status.received"];
            case TRANSACTION_TYPE_REFUND: return i18n["order.status.refunded"];
            default: return "";
        }
    }
    const getPmiName = (code) => {
        switch(code){
            case CREDIT_CARD_PAYMENT_CODE: return i18n["credit.card"];
            case E_MONEY_PAYMENT_CODE: return i18n["e.wallet"];
            case QR_CODE_PAYMENT_CODE: return i18n["qrcode.pay"];
            default: return "";
        }
    }
    const getTdiName = (sd, ed) => {
        //get transaction date info name
        if(sdn){
            return i18n[sdn];
        }
        
        if(sd){
            const ssss = sd.substr(0, 10);
            if(!ed){
                return "≥" + ssss;
            } else if(ed.startsWith(ssss)) {
                return ssss;
            } else {
                return ssss + "~" + ed.substr(0, 10);
            }
        } else {
            if(ed){
                return "≤" + ed.substr(0, 10);
            } else {
                return "";
            }
        }
    }
    const onStartStatistics = () => {
        const params = {
            startTime: getBeginDateString(drbUniqueKey, "yyyy-MM-dd 00:00:00"),
            endTime: getEndDateString(drbUniqueKey, "yyyy-MM-dd 23:59:59"),
            paymentType: pmc[0],
            transactionType: ttc
        };
        const txts = [];

        (!!params.startTime || !!params.endTime) && txts.push(getTdiName(params.startTime, params.endTime));
        (!!params.transactionType) && txts.push(getTtcName(params.transactionType));
        (!!params.paymentType) && txts.push(getPmiName(params.paymentType));

        setIsPopupShow(false);
        setParamsText(txts.join(", "));
        
        $request("getOrderStatistics", params).then(setStatisData);
    }
    const onDateNameCheck = (nm) => {
        return function(){
            const date1 = new Date(); //起始日期
            const date2 = new Date(); //结束日期
            switch(nm){
                case "yesterday": date1.setDate(date1.getDate() - 1); date2.setDate(date2.getDate() - 1); break;
                case "statistics.recent.1week": date1.setDate(date1.getDate() - 7); break;
                case "statistics.recent.1month": date1.setMonth(date1.getMonth() - 1); break;
                case "statistics.recent.3month": date1.setMonth(date1.getMonth() - 3); break;
                case "statistics.recent.6month": date1.setMonth(date1.getMonth() - 6); break;
                case "statistics.recent.1year": date1.setFullYear(date1.getFullYear() - 1); break;
                default: break; //today
            }
            
            if(sdn === nm){
                setSDN("");
                setDateRangeData(drbUniqueKey, null, null); //同步更新日期控件数据，下次打开弹窗时就会显示这两个日期
            } else {
                setSDN(nm);
                setDateRangeData(drbUniqueKey, date1, date2); //同步更新日期控件数据，下次打开弹窗时就会显示这两个日期
            }
        }
    }
    const onFilterConfirm = () => {
        if(sdn){
            setSDN(""); //值变化后会自动调用 “onStartStatistics”！！！
        } else {
            onStartStatistics();
        }
    }
    
    useEffect(() => {
        setDateRangeData(drbUniqueKey, new Date(), new Date()); //设置起始、结束默认日期
        return function(){
            clearDateRangeCache(drbUniqueKey);
        } 
    }, []);
    useEffect(onStartStatistics, [sdn]);
    
    return (<>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={fxG0} contentContainerStyle={styles.headerBox}>
            {dateNameList.map(vx => (
                <TextualButton key={vx} style={sdn===vx ? styles.btnChecked : styles.btnBox} onPress={onDateNameCheck(vx)}>{i18n[vx]}</TextualButton>
            ))}
        </ScrollView>
        <TouchableOpacity style={styles.filterBox} activeOpacity={0.8} onPress={onPopupShow}>
            <PosPayIcon name="query-params" size={14} offset={-5} />
            <Text style={[fxG1, fs12, pdRX]} numberOfLines={1}>{paramsText || i18n["options.any"]}</Text>
            <Text style={fs12}>{i18n["filter"]}</Text>
            <PosPayIcon name="filter-list" size={14} offset={5} style={{marginBottom: -2}} />
        </TouchableOpacity>
        <View style={[pgEE, pdS]}>
            <View style={[fxHC, fxWP]}>
                <View style={styles.itemBox}>
                    <View style={fxHM}>
                        <Text style={styles.valueUnitHidden}>{appSettings.currencyUnit}</Text>
                        <Text style={styles.valueBox}>{statisData?.totalOrderAmount || EMPTY_DEFAULT_TEXT}</Text>
                        <Text style={styles.valueUnit}>{appSettings.currencyUnit}</Text>
                    </View>
                    <Text style={styles.titleBox}>{i18n["statistics.total.sales"]}</Text>
                </View>
                <View style={[styles.itemBox, styles.itemRight]}>
                    <View style={fxHM}>
                        <Text style={styles.valueUnitHidden}>{appSettings.currencyUnit}</Text>
                        <Text style={styles.valueBox}>{statisData?.totalDiscountAmount || EMPTY_DEFAULT_TEXT}</Text>
                        <Text style={styles.valueUnit}>{appSettings.currencyUnit}</Text>
                    </View>
                    <Text style={styles.titleBox}>{i18n["statistics.total.discount"]}</Text>
                </View>
            </View>
            <View style={[fxHC, fxWP, styles.rowBottom]}>
                <View style={styles.itemBox}>
                    <View style={fxHM}>
                        <Text style={styles.valueUnitHidden}>{appSettings.currencyUnit}</Text>
                        <Text style={styles.valueBox}>{statisData?.totalTaxAmount || EMPTY_DEFAULT_TEXT}</Text>
                        <Text style={styles.valueUnit}>{appSettings.currencyUnit}</Text>
                    </View>
                    <Text style={styles.titleBox}>{i18n["statistics.total.tax"]}</Text>
                </View>
                <View style={[styles.itemBox, styles.itemRight]}>
                    <View style={fxHM}>
                        <Text style={styles.valueUnitHidden}>{appSettings.currencyUnit}</Text>
                        <Text style={styles.valueBox}>{statisData?.totalAmount || EMPTY_DEFAULT_TEXT}</Text>
                        <Text style={styles.valueUnit}>{appSettings.currencyUnit}</Text>
                    </View>
                    <Text style={styles.titleBox}>{i18n["statistics.total.income"]}</Text>
                </View>
            </View>
        </View>
        {/* <View style={[bgEE, pdS]}>
            <GradientButton>{i18n["print"]}</GradientButton>
        </View> */}
        <PopupX showMe={isPopupShow} onClose={onPopupClose} title={i18n["filter"]}>
            <View style={pdHX}>
                <Text style={styles.labelBox}>{i18n["transaction.time"]}</Text>
                <DateRangeBox
                    style={styles.selectsBox}
                    confirmText={i18n["btn.confirm"]}
                    cancelText={i18n["btn.cancel"]}
                    beginPlaceholder={i18n["begindate"]}
                    endPlaceholder={i18n["enddate"]}
                    uniqueKey={drbUniqueKey}
                />
                
                <Text style={styles.labelBox}>{i18n["order.status"]}</Text>
                <View style={styles.selectsBox}>
                    <RadioBox size={18} label={i18n["options.any"]} style={fxG1} checked={!ttc} onPress={onTtcChange(null)} />
                    <RadioBox size={18} label={i18n["order.status.received"]} style={fxG1} checked={ttc===TRANSACTION_TYPE_RECEIVE} onPress={onTtcChange(TRANSACTION_TYPE_RECEIVE)} />
                    <RadioBox size={18} label={i18n["order.status.refunded"]} style={fxG1} checked={ttc===TRANSACTION_TYPE_REFUND} onPress={onTtcChange(TRANSACTION_TYPE_REFUND)} />
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
                <GradientButton style={[fxG1, mgLS]} onPress={onFilterConfirm}>{i18n["btn.confirm"]}</GradientButton>
            </View>
        </PopupX>
    </>);
}