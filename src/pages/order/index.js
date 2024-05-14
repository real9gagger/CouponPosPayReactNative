import { useEffect, useRef, useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Image, RefreshControl, StatusBar, StyleSheet } from "react-native";
import { useI18N, useOnRefundSuccessful } from "@/store/getter";
import { getPaymentInfo } from "@/common/Statics";
import { CASH_PAYMENT_CODE, CREDIT_CARD_PAYMENT_CODE, E_MONEY_PAYMENT_CODE, QR_CODE_PAYMENT_CODE, TRANSACTION_TYPE_RECEIVE, TRANSACTION_TYPE_REFUND } from "@/common/Statics";
import DateRangeBox, { clearDateRangeCache, getBeginDateString, getEndDateString } from "@/components/DateRangeBox";
import LocalPictures from "@/common/Pictures";
import PosPayIcon from "@/components/PosPayIcon";
import PopupX from "@/components/PopupX";
import RadioBox from "@/components/RadioBox";
import CheckBox from "@/components/CheckBox";
import GradientButton from "@/components/GradientButton";
import LoadingTip from "@/components/LoadingTip";

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
        marginTop: 10,
        marginBottom: 5
    },
    inputBox: {
        borderBottomColor: "#ccc",
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingTop: 5,
        paddingBottom: 10,
        paddingHorizontal: 0,
        fontSize: 14
    },
    selectsBox: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        borderBottomColor: "#ccc",
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingTop: 5,
        paddingBottom: 10
    },
    selectsItem: {
        flexBasis: "50%"
    },
    paramsBox: {
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomColor: "#ddd",
        borderBottomWidth: StyleSheet.hairlineWidth
    }
});

const drbUniqueKey = "OrderFilterDRB";

function getOrderListByParams(params){
    return $request("getPosAppOrderList", params).then(res => {
        const list = (res.rows || []);
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
        
        if(list.length){
            list[0].totalRecordsOfOrderTemp = (+res.total || 0); //总条数（临时变量）
        }
        
        return list;
    });
}

export default function OrderIndex(props){
    const i18n = useI18N();
    const ltRef = useRef(null);
    const useOrs = useOnRefundSuccessful();
    const [orderList, setOrderList] = useState([]);
    const [isPopupShow, setIsPopupShow] = useState(false);
    const [osn, setOSN] = useState(null); //order slip number
    const [ttc, setTTC] = useState(null); //transaction type code
    const [pmc, setPMC] = useState([/*CASH_PAYMENT_CODE, CREDIT_CARD_PAYMENT_CODE, E_MONEY_PAYMENT_CODE, QR_CODE_PAYMENT_CODE*/]); //payment method code
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
            case TRANSACTION_TYPE_RECEIVE: return i18n["order.status.received"];
            case TRANSACTION_TYPE_REFUND: return i18n["order.status.refunded"];
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
            case CASH_PAYMENT_CODE: return i18n["cash.pay"];
            default: return "";
        }
    }
    const getTdiName = (sd, ed) => {
        //get transaction date info name
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
    const queryOrders = () => {
        if(!ltRef.current.canLoadMore()){
            return;
        } else {
            ltRef.current.setLoading(true);
        }
        const params = {
            pageNum: ltRef.current.getPage(),
            pageSize: 20,
            startTime: getBeginDateString(drbUniqueKey, "yyyy-MM-dd 00:00:00"),
            endTime: getEndDateString(drbUniqueKey, "yyyy-MM-dd 23:59:59"),
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
            setParamsText(txts.join(", "));
        }
        
        getOrderListByParams(params).then(res => {
            if(res.length){
                let nth = (params.pageNum - 1) * params.pageSize;
                for(const vxo of res){
                    vxo.oid = (nth++); //计算唯一键值！
                }
                
                ltRef.current.setNoMore(res[0].totalRecordsOfOrderTemp , orderList.length + res.length);
                
                if(ltRef.current.isFirstPage()){
                    setOrderList(res);
                } else {
                    setOrderList([...orderList, ...res]);
                }
            } else {
                ltRef.current.setNoMore(0, 0);
            }
        }).catch(ltRef.current.setErrMsg);
    }
    const onSVScroll = (evt) => {
        const { layoutMeasurement, contentOffset, contentSize } = evt.nativeEvent;
        if(ltRef.current.isScrollDown(contentOffset.y) && ltRef.current.canLoadMore()){
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
    
    useEffect(() => {
        queryOrders();
        return function(){
            clearDateRangeCache(drbUniqueKey);
        }
    }, []);
    
    //退款成功时订单 ID 会变化，则刷新订单状态。
    useEffect(() => {
        if(useOrs){
            ltRef.current.resetState();
            queryOrders();
        }
    }, [useOrs]);
    
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
                <TouchableOpacity key={vx.oid} style={styles.itemBox} onPress={() => onItemPress(vx)} activeOpacity={0.5}>
                    <View style={styles.itemLeft}>
                        <View style={fxHC}>
                            <Text style={[fs12, fxG1]}>{i18n["order.amount"]}</Text>
                            <Text style={[fs12, fwB]}>{vx.orderAmount} {vx.currencyCode}</Text>
                        </View>
                        <View style={fxHC}>
                            <Text style={[fs12, fxG1]}>{i18n["order.status"]}</Text>
                            {vx.transactionType===TRANSACTION_TYPE_RECEIVE
                            ? <Text style={[fs12, tcG0, taC]}>{i18n["order.status.received"]}</Text>
                            : <Text style={[fs12, tcR0, taC]}>{i18n["order.status.refunded"]}</Text>
                            }
                        </View>
                        <View style={fxHC}>
                            <Text style={[fs12, fxG1]}>{i18n["transaction.number"]}</Text>
                            <Text style={fs12}>{vx.slipNumber}</Text>
                        </View>
                        <View style={fxHC}>
                            <Text style={[fs12, fxG1]}>{i18n["transaction.time"]}</Text>
                            <Text style={fs12}>{vx.transactionTime}</Text>
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
                <DateRangeBox
                    style={styles.selectsBox}
                    confirmText={i18n["btn.confirm"]}
                    cancelText={i18n["btn.cancel"]}
                    beginPlaceholder={i18n["begindate"]}
                    endPlaceholder={i18n["enddate"]}
                    uniqueKey={drbUniqueKey}
                />
                
                <Text style={styles.labelBox}>{i18n["transaction.number"]}</Text>
                <TextInput defaultValue={osn} onChangeText={setOSN} placeholder={i18n["optional"]} style={styles.inputBox}></TextInput>
                
                <Text style={styles.labelBox}>{i18n["order.status"]}</Text>
                <View style={styles.selectsBox}>
                    <RadioBox size={18} label={i18n["options.any"]} style={fxG1} checked={!ttc} onPress={onTtcChange(null)} />
                    <RadioBox size={18} label={i18n["order.status.received"]} style={fxG1} checked={ttc===TRANSACTION_TYPE_RECEIVE} onPress={onTtcChange(TRANSACTION_TYPE_RECEIVE)} />
                    <RadioBox size={18} label={i18n["order.status.refunded"]} style={fxG1} checked={ttc===TRANSACTION_TYPE_REFUND} onPress={onTtcChange(TRANSACTION_TYPE_REFUND)} />
                </View>
                
                <Text style={styles.labelBox}>{i18n["payment.method"]}</Text>
                <View style={styles.selectsBox}>
                    <CheckBox size={18} label={i18n["qrcode.pay"]} style={styles.selectsItem} checked={pmc.includes(QR_CODE_PAYMENT_CODE)} onPress={onPmcChange(QR_CODE_PAYMENT_CODE)} />
                    <CheckBox size={18} label={i18n["credit.card"]} style={styles.selectsItem} checked={pmc.includes(CREDIT_CARD_PAYMENT_CODE)} onPress={onPmcChange(CREDIT_CARD_PAYMENT_CODE)} />
                    <CheckBox size={18} label={i18n["e.wallet"]} style={styles.selectsItem} checked={pmc.includes(E_MONEY_PAYMENT_CODE)} onPress={onPmcChange(E_MONEY_PAYMENT_CODE)} />
                    <CheckBox size={18} label={i18n["cash.pay"]} style={styles.selectsItem} checked={pmc.includes(CASH_PAYMENT_CODE)} onPress={onPmcChange(CASH_PAYMENT_CODE)} />
                </View>
            </View>
            <View style={[fxR, pdX, {marginTop: 50}]}>
                <GradientButton style={fxG1} onPress={onPopupClose}>{i18n["btn.cancel"]}</GradientButton>
                <GradientButton style={[fxG1, mgLS]} onPress={onSearchOrders}>{i18n["btn.confirm"]}</GradientButton>
            </View>
        </PopupX>
    </>);
}