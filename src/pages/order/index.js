import { useEffect, useRef, useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Image, RefreshControl, StatusBar, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import { getPaymentInfo } from "@/common/Statics";
import { CREDIT_CARD_PAYMENT_CODE, E_MONEY_PAYMENT_CODE, QR_CODE_PAYMENT_CODE, TRANSACTION_TYPE_RECEIVE, TRANSACTION_TYPE_REFUND } from "@/common/Statics";
import { formatDate } from "@/utils/helper";
import LocalPictures from "@/common/Pictures";
import PosPayIcon from "@/components/PosPayIcon";
import PopupX from "@/components/PopupX";
import RadioBox from "@/components/RadioBox";
import CheckBox from "@/components/CheckBox";
import GradientButton from "@/components/GradientButton";
import LoadingTip from "@/components/LoadingTip";
import DatePicker from "react-native-date-picker";

const styles = StyleSheet.create({
    contentBox: {
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    itemBox: {
        display: "flex",
        flexDirection: "row",
        padding: 10,
        backgroundColor: "#fff",
        marginBottom: 5,
        borderRadius: 8
    },
    itemLeft: {
        width: "75%",
        paddingRight: 10
    },
    logoBox: {
        width: 40,
        height: 40,
        marginBottom: 4
    },
    nameLabel: {
        fontSize: 10,
        color: "#666"
    },
    labelBox: {
        fontSize: 14,
        marginTop: 15,
        marginBottom: 5
    },
    inputBox: {
        borderColor: "#aaa",
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 14
    },
    dateBox: {
        borderColor: "#aaa",
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        flex: 1
    },
    selectsBox: {
        display: "flex",
        flexDirection: "row",
        borderColor: "#aaa",
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    paramsBox: {
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomColor: "#ddd",
        borderBottomWidth: StyleSheet.hairlineWidth
    }
});

function getOrderListByParams(params){
    return $request("getPosAppOrderList", params).then(res => {
        const list = (res || []);
        const pmap = {};
        
        for(const vx of list){
            const subType = (vx.creditCardBrand || vx.eMoneyType || vx.qrPayType);
            const pmKey = `${vx.paymentType}_${subType}`;
            
            if(!!pmap[pmKey]){
                const pmInfo = pmap[pmKey];
                vx.paymentName = pmInfo.name;
                vx.paymentLogo = pmInfo.logo;
            } else {
                const pmInfo = getPaymentInfo(vx.paymentType, subType);
                if(pmInfo){
                    vx.paymentName = pmInfo.name;
                    vx.paymentLogo = pmInfo.logo;
                    pmap[pmKey] = pmInfo;
                }
            }
        }
        
        return list;
    });
}

export default function OrderIndex(props){
    const i18n = useI18N();
    const ltRef = useRef(null);
    const [orderList, setOrderList] = useState([]);
    const [isPopupShow, setIsPopupShow] = useState(false);
    const [tdi, setTDI] = useState([0, null, null, "", ""]); // transaction date info。索引0- 日期选择框绑定是开始（1）还是结束（2）或者不显示选择框（0），1-开始日期Date对象，2-结束日期Date对象，3-开始日期字符串，4-结束日期字符串
    const [osn, setOSN] = useState(null); //order slip number
    const [ttc, setTTC] = useState(null); //transaction type code
    const [pmc, setPMC] = useState([/*CREDIT_CARD_PAYMENT_CODE, E_MONEY_PAYMENT_CODE, QR_CODE_PAYMENT_CODE*/]); //payment method code
    const [paramsText, setParamsText] = useState(""); //参数简要说明文本
    
    const onItemPress = (oo) => {
        props.navigation.navigate("订单详情", oo);
    }
    const onPopupShow = () => {
        setIsPopupShow(true);
    }
    const onPopupClose = () => {
        setIsPopupShow(false);
    }
    const getTtcName = (code) => {
        switch(code){
            case TRANSACTION_TYPE_RECEIVE: return i18n["transaction.receive"];
            case TRANSACTION_TYPE_REFUND: return i18n["transaction.refund"];
            default: return "";
        }
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
    const getPmiName = (code) => {
        switch(code){
            case CREDIT_CARD_PAYMENT_CODE: return i18n["credit.card"];
            case E_MONEY_PAYMENT_CODE: return i18n["e.wallet"];
            case QR_CODE_PAYMENT_CODE: return i18n["qrcode.pay"];
            default: return "";
        }
    }
    const onTdiDone = (date) => {
        if(date){
            tdi[tdi[0]] = date;
            tdi[tdi[0] + 2] = formatDate(date, "yyyy/MM/dd");
            tdi[0] = 0;
            setTDI([...tdi]);
        }
    }
    const onTdiOpen = (idx) => {
        return function(){
            tdi[0] = idx;
            setTDI([...tdi]);
        }
    }
    const onTdiClose = () => {
        if(tdi[0]){
            tdi[0] = 0;
            setTDI([...tdi]);
        }
    }
    const getTdiName = (sd, ed) => {
        if(sd){
            const ssss = sd.substr(0, 10);
            if(ed && !ed.startsWith(ssss)){
                return ssss + "~" + ed.substr(0, 10);
            } else {
                return ssss;
            }
        } else {
            if(ed){
                return ed.substr(0, 10);
            } else {
                return "";
            }
        }
    }
    const queryOrders = () => {
        if(!ltRef.current.canLoadMore()){
            return;
        } else {
            ltRef.current.setLoading(true);
        }
        
        const params = {
            pageNum: ltRef.current.getPage(),
            pageSize: 20,
            startTime: tdi[1] ? formatDate(tdi[1], "yyyy-MM-dd 00:00:00") : null,
            endTime: tdi[2] ? formatDate(tdi[2], "yyyy-MM-dd 23:59:59") : null,
            paymentType: pmc[0],
            slipNumber: osn,
            transactionType: ttc
        };
        const txts = [];
        
        if(ltRef.current.isFirstPage()){
            (!!params.startTime || !!params.endTime) && txts.push(getTdiName(params.startTime, params.endTime));
            (!!params.slipNumber) && txts.push(params.slipNumber);
            (!!params.transactionType) && txts.push(getTtcName(params.transactionType));
            (!!params.paymentType) && txts.push(getPmiName(params.paymentType));
            
            setOrderList([]);
            setIsPopupShow(false);
            setParamsText(txts.join(","));
        }
        
        getOrderListByParams(params).then(res => {
            if(ltRef.current.isFirstPage()){
                setOrderList(res);
            } else {
                setOrderList([...orderList, ...res]);
            }
            ltRef.current.setNoMore(params.pageSize, res.length);
        }).catch(ltRef.current.setErrMsg);
    }
    const onSVScroll = (evt) => {
        const { layoutMeasurement, contentOffset, contentSize } = evt.nativeEvent;
        if(ltRef.current.isScrollDown(contentOffset.y) && ltRef.current.canLoad()){
            const isCloseToBottom = (layoutMeasurement.height + contentOffset.y) >= (contentSize.height - 40); // 这里的 40 可以根据需要调整
            if (isCloseToBottom) {
                ltRef.current.nextPage();
                queryOrders();
            }
        }
        ltRef.current.setScrollTop(contentOffset.y);
    }
    const onSearchOrders = () => {
        ltRef.current.resetState();
        queryOrders();
    }
    
    useEffect(queryOrders, []);
    
    return (<>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <TouchableOpacity style={[fxHC, styles.paramsBox]} onPress={onPopupShow} activeOpacity={0.6}>
            <PosPayIcon name="query-params" size={14} offset={-5} />
            <Text style={[fxG1, fs12, pdRX]} numberOfLines={1}>{paramsText || i18n["options.any"]}</Text>
            <Text style={fs12}>{i18n["filter"]}</Text>
            <PosPayIcon name="filter-list" size={14} offset={5} style={{marginBottom: -2}} />
        </TouchableOpacity>
        <ScrollView 
            style={pgEE} 
            contentContainerStyle={styles.contentBox}
            onScroll={onSVScroll}
            refreshControl={<RefreshControl refreshing={false} onRefresh={queryOrders} />}>
            {orderList.map((vx, ix) => 
                <TouchableOpacity key={vx.id} style={styles.itemBox} onPress={() => onItemPress(vx)} activeOpacity={0.5}>
                    <View style={styles.itemLeft}>
                        <View style={fxHC}>
                            <Text style={[fs12, fxG1]}>{i18n["transaction.amount"]}</Text>
                            <Text style={[fs12, fwB]}>{vx.amount} {vx.currencyCode}</Text>
                        </View>
                        <View style={fxHC}>
                            <Text style={[fs12, fxG1]}>{i18n["transaction.type"]}</Text>
                            {vx.transactionType===TRANSACTION_TYPE_RECEIVE
                            ? <Text style={[fs12, tcG0, taC]}>{i18n["transaction.receive"]}</Text>
                            : <Text style={[fs12, tcR1, taC]}>{i18n["transaction.refund"]}</Text>
                            }
                        </View>
                        <View style={fxHC}>
                            <Text style={[fs12, fxG1]}>{i18n["transaction.time"]}</Text>
                            <Text style={fs12}>{vx.transactionTime}</Text>
                        </View>
                        <View style={fxHC}>
                            <Text style={[fs12, fxG1]}>{i18n["transaction.number"]}</Text>
                            <Text style={fs12}>{vx.slipNumber}</Text>
                        </View>
                    </View>
                    <View style={[fxG1, fxVM]}>
                        <Image style={styles.logoBox} source={LocalPictures[vx.paymentLogo] || LocalPictures.unknownPayment} />
                        <Text style={styles.nameLabel}>{vx.paymentName || i18n["unknown"]}</Text>
                    </View>
                </TouchableOpacity>
            )}
            <LoadingTip 
                ref={ltRef}
                noMoreText={i18n["nomore"]}
                noDataText={i18n["nodata"]}
                retryLabel={i18n["retry"]}
                errorTitle={i18n["loading.error"]}
                alwaysShowLoading={true}
                onRetry={queryOrders} />
        </ScrollView>
        <PopupX showMe={isPopupShow} onClose={onPopupClose} title={i18n["filter"]}>
            <View style={pdHX}>
                <Text style={styles.labelBox}>{i18n["transaction.time"]}</Text>
                <View style={fxHC}>
                    <Text style={[styles.dateBox, !tdi[3] && tcAA]} onPress={onTdiOpen(1)}>{tdi[3] || i18n["begindate"]}</Text>
                    <Text style={[mgHX, fs14]}>~</Text>
                    <Text style={[styles.dateBox, !tdi[4] && tcAA]} onPress={onTdiOpen(2)}>{tdi[4] || i18n["enddate"]}</Text>
                </View>
                
                <Text style={styles.labelBox}>{i18n["transaction.number"]}</Text>
                <TextInput defaultValue={osn} onChangeText={setOSN} placeholder={i18n["optional"]} style={styles.inputBox}></TextInput>
                
                <Text style={styles.labelBox}>{i18n["transaction.type"]}</Text>
                <View style={styles.selectsBox}>
                    <RadioBox size={18} label={i18n["options.any"]} style={fxG1} checked={!ttc} onPress={onTtcChange(null)} />
                    <RadioBox size={18} label={i18n["transaction.receive"]} style={fxG1} checked={ttc===TRANSACTION_TYPE_RECEIVE} onPress={onTtcChange(TRANSACTION_TYPE_RECEIVE)} />
                    <RadioBox size={18} label={i18n["transaction.refund"]} style={fxG1} checked={ttc===TRANSACTION_TYPE_REFUND} onPress={onTtcChange(TRANSACTION_TYPE_REFUND)} />
                </View>
                
                <Text style={styles.labelBox}>{i18n["payment.method"]}</Text>
                <View style={styles.selectsBox}>
                    <CheckBox size={18} label={i18n["credit.card"]} checked={pmc.includes(CREDIT_CARD_PAYMENT_CODE)} onPress={onPmcChange(CREDIT_CARD_PAYMENT_CODE)} />
                    <CheckBox size={18} label={i18n["e.wallet"]} style={mgLX} checked={pmc.includes(E_MONEY_PAYMENT_CODE)} onPress={onPmcChange(E_MONEY_PAYMENT_CODE)} />
                    <CheckBox size={18} label={i18n["qrcode.pay"]} style={mgLX} checked={pmc.includes(QR_CODE_PAYMENT_CODE)} onPress={onPmcChange(QR_CODE_PAYMENT_CODE)} />
                </View>
            </View>
            <View style={[fxR, pdX, {marginTop: 80}]}>
                <GradientButton style={fxG1} onPress={onPopupClose}>{i18n["btn.cancel"]}</GradientButton>
                <GradientButton style={[fxG1, mgLS]} onPress={onSearchOrders}>{i18n["btn.confirm"]}</GradientButton>
            </View>
        </PopupX>
        <DatePicker
            modal={true}
            date={tdi[tdi[0]] || (new Date())} 
            open={tdi[0] > 0} 
            onCancel={onTdiClose}
            onConfirm={onTdiDone}
            confirmText={i18n["btn.confirm"]}
            cancelText={i18n["btn.cancel"]}
            title={i18n[tdi[0] <= 1 ? "begindate" : "enddate"]}
            theme="light"
            mode="date" />
    </>);
}