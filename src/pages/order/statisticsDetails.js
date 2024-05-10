import { useEffect, useState, useRef, Fragment } from "react";
import { ScrollView, TouchableOpacity, View, Text, Switch, StyleSheet } from "react-native";
import { useI18N, useAppSettings } from "@/store/getter";
import { getPaymentInfo } from "@/common/Statics";
import LoadingTip from "@/components/LoadingTip";
import LinearGradient from "react-native-linear-gradient";
import PosPayIcon from "@/components/PosPayIcon";
import PopupX from "@/components/PopupX";
import RadioBox from "@/components/RadioBox";

const FIRST_CELL_WIDTH = 80;
const CONTENT_PADDING_TB = 0;
const CONTENT_BOX_WIDTH = (deviceDimensions.screenWidth - CONTENT_PADDING_TB * 2);
const LG_BAR_COLORS = ["#DCF2F1", "#5AB2FF"];
const LG_BAR_START = {x:0, y:0.5};
const LG_BAR_END = {x:1, y:0.5};

const styles = StyleSheet.create({
    containerBox: {
        paddingHorizontal: CONTENT_PADDING_TB,
        backgroundColor: "#fff"
    },
    dateBox: {
        fontSize: 12,
        fontWeight: "bold",
        padding: 5,
        color: appMainColor
    },
    cellBox0: {
        backgroundColor: "#A0E9FF",
        color: "#000"
    },
    cellBox1: {
        fontSize: 12,
        width: FIRST_CELL_WIDTH,
        paddingHorizontal: 5,
        paddingVertical: 10,
        zIndex: 9
    },
    cellBox2: {
        width: (CONTENT_BOX_WIDTH - FIRST_CELL_WIDTH) / 4,
        fontSize: 12,
        paddingHorizontal: 5,
        paddingVertical: 10,
        textAlign: "right",
        zIndex: 9
    },
    lineBox: {
        borderTopColor: "#ccc", 
        borderTopWidth: StyleSheet.hairlineWidth
    },
    barBox: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 0,
        opacity: 0.6,
        width: 0
    },
    reviewBox: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 8888,
        width: 150,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundColor: "#fff",
        paddingHorizontal: 5,
        paddingVertical: 5
    },
    titleBox: {
        fontSize: 14,
        marginTop: 10
    },
    selectsBox: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        borderBottomColor: "#ccc",
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingVertical: 10
    },
    selectsItem: {
        flexBasis: "50%"
    },
});

//销售统计明细
export default function OrderStatisticsDetails(props){
    const i18n = useI18N();
    const appSettings = useAppSettings();
    const ltRef = useRef(null);
    const prevDate = useRef("[!NULL!]");
    const [detailsList, setDetailsList] = useState([]);
    const [sumInfo, setSumInfo] = useState({
        total: 0, //订单总额
        totmin: 1e16, //最小订单金额
        totmax: 0, //最大订单金额
        
        tax: 0, //税
        taxmin: 1e16, //最小税
        taxmax: 0, //最大税
        
        discount: 0, //折扣
        dctmin: 1e16, //最小折扣
        dctmax: 0, //最大折扣
        
        amount: 0, //实际金额
        amtmin: 1e16, //最小实际金额
        amtmax: 0, //最大实际金额
        
        days: 0, //天数
    });
    const [activedColumn, setActivedColumn] = useState(0x00); //需要高亮显示的列
    const [showBar, setShowBar] = useState(0x11); //需要显示的柱状图
    const [isShowDate, setIsShowDate] = useState(true); //是否显示日期
    const [isPopupShow, setIsPopupShow] = useState(false); //是否显示弹窗
    
    const onItemPress = (oo) => {
        return function(){
            if(!oo.paymentName){
                const pmInfo = getPaymentInfo(oo.paymentType, oo.creditCardBrand || oo.eMoneyType || oo.qrPayType);
                if(pmInfo){
                    oo.paymentName = pmInfo.name;
                    oo.paymentLogo = pmInfo.logo;
                }
            }
            
            props.navigation.navigate("订单详情", oo);
        }
    }
    const getDetailsList = () => {
        if(!ltRef.current.canLoadMore()){
            console.log("没有更多统计明细了...");
            return;
        } else {
            console.log("即将加载更多统计明细...");
            ltRef.current.setLoading(true);
        }
        
        const queryParams = props.route.params || {};
        
        queryParams.pageSize = 20;
        queryParams.pageNum = ltRef.current.getPage();
        
        $request("getPosAppOrderList", queryParams).then(res => {
            const list = (res || []);
            const money = [0, 0, 0, 0];
            
            let nth = (Date.now() * 1000) + (queryParams.pageNum - 1) * queryParams.pageSize;
            
            for(const item of list){
                if(!item.transactionTime){
                    item.tstData = prevDate.current = "0000-00-00";
                    sumInfo.days++; //天数加一
                } else if(!item.transactionTime.startsWith(prevDate.current)){
                    item.tstData = prevDate.current = item.transactionTime.substr(0, 10);
                    sumInfo.days++; //天数加一
                }
                
                item.orderUID = (nth++); //计算唯一键值！
                
                money[0] = (+item.orderAmount || 0);
                money[1] = (+item.tax || 0);
                money[2] = (+item.discountAmount || 0);
                money[3] = (+item.amount || 0);
                
                sumInfo.total += money[0];
                sumInfo.totmin = Math.min(sumInfo.totmin, money[0]);
                sumInfo.totmax = Math.max(sumInfo.totmax, money[0]);
                
                sumInfo.tax += money[1];
                sumInfo.taxmin = Math.min(sumInfo.taxmin, money[1]);
                sumInfo.taxmax = Math.max(sumInfo.taxmax, money[1]);
                
                sumInfo.discount += money[2];
                sumInfo.dctmin = Math.min(sumInfo.dctmin, money[2]);
                sumInfo.dctmax = Math.max(sumInfo.dctmax, money[2]);
                
                sumInfo.amount += money[3];
                sumInfo.amtmin = Math.min(sumInfo.amtmin, money[3]);
                sumInfo.amtmax = Math.max(sumInfo.amtmax, money[3]);
            }
            
            ltRef.current.setNoMore(queryParams.pageSize, list.length);
            
            setDetailsList([...detailsList, ...list]);
            setSumInfo({...sumInfo});
        }).catch(ltRef.current.setErrMsg);
    }
    const onSVScroll = (evt) => {
        const { layoutMeasurement, contentOffset, contentSize } = evt.nativeEvent;
        if(ltRef.current.isScrollDown(contentOffset.y) && ltRef.current.canLoadMore()){
            const isCloseToBottom = (layoutMeasurement.height + contentOffset.y) >= (contentSize.height - 40); // 这里的 40 可以根据需要调整
            if (isCloseToBottom) {
                ltRef.current.nextPage();
                getDetailsList();
            }
        }
        ltRef.current.setScrollTop(contentOffset.y);
    }
    const onACChanged = (code) => {
        return function(){
            if(code === activedColumn){
                setActivedColumn(0x00);
            } else {
                setActivedColumn(code);
            }
            setIsPopupShow(false);
        }
    }
    const onSBChanged = (code) => {
        return function(){
            setShowBar(code);
            setIsPopupShow(false);
        }
    }
    const onSDChanged = () => {
        setIsShowDate(!isShowDate);
        setIsPopupShow(false);
    }
    const onPopupShow = () => {
        setIsPopupShow(true);
    }
    const onPopupClose = () => {
        setIsPopupShow(false);
    }
    const avgOfDays = (val) => {
        if(!val || !sumInfo.days){
            return "0";
        } else {
            return $tofixed(val / sumInfo.days);
        }
    }
    const avgOfOrders = (val) => {
        if(!val || !detailsList.length){
            return "0";
        } else {
            return $tofixed(val / detailsList.length);
        }
    }
    const getBarWidth = (val) => {
        switch(showBar){
            case 0x11: 
                if(val.orderAmount && sumInfo.totmax){
                    return {width: Math.ceil(val.orderAmount * CONTENT_BOX_WIDTH / sumInfo.totmax)}; //订单金额
                }
                break;
            case 0x22: 
                if(val.tax && sumInfo.taxmax){
                    return {width: Math.ceil(val.tax * CONTENT_BOX_WIDTH / sumInfo.taxmax)}; //税
                }
                break;
            case 0x33:
                if(val.discountAmount && sumInfo.dctmax){
                    return {width: Math.ceil(val.discountAmount * CONTENT_BOX_WIDTH / sumInfo.dctmax)}; //优惠金额
                }
                break;
            case 0x44:
                if(val.amount && sumInfo.amtmax){
                    return {width: Math.ceil(val.amount * CONTENT_BOX_WIDTH / sumInfo.amtmax)}; //交易金额
                }
                break;
        }
        return {display: "none"};
    }
    
    useEffect(getDetailsList, []);
    
    return (<>
        <View style={styles.containerBox}>
            <View style={[fxHC, bgEE]}>
                <Text style={[styles.cellBox1, activedColumn===0xFF && styles.cellBox0]} onPress={onACChanged(0xFF)} numberOfLines={1}>{i18n["transaction.time"]}</Text>
                <Text style={[styles.cellBox2, activedColumn===0xEE && styles.cellBox0]} onPress={onACChanged(0xEE)} numberOfLines={1}>{i18n["order.amount"]}</Text>
                <Text style={[styles.cellBox2, activedColumn===0xDD && styles.cellBox0]} onPress={onACChanged(0xDD)} numberOfLines={1}>{i18n["tax"]}</Text>
                <Text style={[styles.cellBox2, activedColumn===0xCC && styles.cellBox0]} onPress={onACChanged(0xCC)} numberOfLines={1}>{i18n["coupon.discount"]}</Text>
                <Text style={[styles.cellBox2, activedColumn===0xBB && styles.cellBox0]} onPress={onACChanged(0xBB)} numberOfLines={1}>{i18n["transaction.amount"]}</Text>
            </View>
        </View>
        <ScrollView style={pgFF} onScroll={onSVScroll} contentContainerStyle={styles.containerBox}>
            <TouchableOpacity style={styles.reviewBox} activeOpacity={0.6} onPress={onPopupShow}>
                <Text style={fs12}>{i18n["statistics.details.displays"]}</Text>
                <PosPayIcon name="query-params" size={14} offset={5} />
            </TouchableOpacity>
            {detailsList.map(vx => 
                <Fragment key={vx.orderUID}>
                    {isShowDate && vx.tstData && <Text style={styles.dateBox}>{vx.tstData}</Text>}
                    <TouchableOpacity style={fxHC} activeOpacity={0.5} onPress={onItemPress(vx)}>
                        <Text style={[styles.cellBox1, activedColumn===0xFF && styles.cellBox0]}>{vx.transactionTime.substr(11)}</Text>
                        <Text style={[styles.cellBox2, activedColumn===0xEE && styles.cellBox0]}>{vx.orderAmount || 0}</Text>
                        <Text style={[styles.cellBox2, activedColumn===0xDD && styles.cellBox0]}>{vx.tax || 0}</Text>
                        <Text style={[styles.cellBox2, activedColumn===0xCC && styles.cellBox0]}>-{vx.discountAmount || 0}</Text>
                        <Text style={[styles.cellBox2, activedColumn===0xBB && styles.cellBox0]}>{vx.amount || 0}</Text>
                        {/* 柱状趋势条 */ !!showBar && <LinearGradient style={[styles.barBox, getBarWidth(vx)]} colors={LG_BAR_COLORS} start={LG_BAR_START} end={LG_BAR_END} />}
                    </TouchableOpacity>
                </Fragment>
            )}
            <LoadingTip
                ref={ltRef}
                noMoreText={i18n["statistics.details.nomore"].cloze(sumInfo.days, detailsList.length)}
                noDataText={i18n["nodata"]}
                retryLabel={i18n["retry"]}
                errorTitle={i18n["loading.error"]}
                alwaysShowLoading={true}
                onRetry={getDetailsList} />
            {!!detailsList.length && <>
                <View style={styles.containerBox}>
                    <View style={styles.lineBox}></View>
                </View>
                <View style={[fxHC, styles.containerBox]}>
                    <Text style={[styles.cellBox1, activedColumn===0xFF && styles.cellBox0]} numberOfLines={1}>{i18n["statistics.details.minval"]}</Text>
                    <Text style={[styles.cellBox2, activedColumn===0xEE && styles.cellBox0]} numberOfLines={1}>{sumInfo.totmin}</Text>
                    <Text style={[styles.cellBox2, activedColumn===0xDD && styles.cellBox0]} numberOfLines={1}>{sumInfo.taxmin}</Text>
                    <Text style={[styles.cellBox2, activedColumn===0xCC && styles.cellBox0]} numberOfLines={1}>-{sumInfo.dctmin}</Text>
                    <Text style={[styles.cellBox2, activedColumn===0xBB && styles.cellBox0]} numberOfLines={1}>{sumInfo.amtmin}</Text>
                </View>
                <View style={[fxHC, styles.containerBox]}>
                    <Text style={[styles.cellBox1, activedColumn===0xFF && styles.cellBox0]} numberOfLines={1}>{i18n["statistics.details.maxval"]}</Text>
                    <Text style={[styles.cellBox2, activedColumn===0xEE && styles.cellBox0]} numberOfLines={1}>{sumInfo.totmax}</Text>
                    <Text style={[styles.cellBox2, activedColumn===0xDD && styles.cellBox0]} numberOfLines={1}>{sumInfo.taxmax}</Text>
                    <Text style={[styles.cellBox2, activedColumn===0xCC && styles.cellBox0]} numberOfLines={1}>-{sumInfo.dctmax}</Text>
                    <Text style={[styles.cellBox2, activedColumn===0xBB && styles.cellBox0]} numberOfLines={1}>{sumInfo.amtmax}</Text>
                </View>
                <View style={[fxHC, styles.containerBox]}>
                    <Text style={[styles.cellBox1, activedColumn===0xFF && styles.cellBox0]} numberOfLines={1}>{i18n["statistics.details.avgoforders"]}</Text>
                    <Text style={[styles.cellBox2, activedColumn===0xEE && styles.cellBox0]} numberOfLines={1}>{avgOfOrders(sumInfo.total)}</Text>
                    <Text style={[styles.cellBox2, activedColumn===0xDD && styles.cellBox0]} numberOfLines={1}>{avgOfOrders(sumInfo.tax)}</Text>
                    <Text style={[styles.cellBox2, activedColumn===0xCC && styles.cellBox0]} numberOfLines={1}>-{avgOfOrders(sumInfo.discount)}</Text>
                    <Text style={[styles.cellBox2, activedColumn===0xBB && styles.cellBox0]} numberOfLines={1}>{avgOfOrders(sumInfo.amount)}</Text>
                </View>
                <View style={[fxHC, styles.containerBox]}>
                    <Text style={[styles.cellBox1, activedColumn===0xFF && styles.cellBox0]} numberOfLines={1}>{i18n["statistics.details.avgofdays"]}</Text>
                    <Text style={[styles.cellBox2, activedColumn===0xEE && styles.cellBox0]} numberOfLines={1}>{avgOfDays(sumInfo.total)}</Text>
                    <Text style={[styles.cellBox2, activedColumn===0xDD && styles.cellBox0]} numberOfLines={1}>{avgOfDays(sumInfo.tax)}</Text>
                    <Text style={[styles.cellBox2, activedColumn===0xCC && styles.cellBox0]} numberOfLines={1}>-{avgOfDays(sumInfo.discount)}</Text>
                    <Text style={[styles.cellBox2, activedColumn===0xBB && styles.cellBox0]} numberOfLines={1}>{avgOfDays(sumInfo.amount)}</Text>
                </View>
            </>}
        </ScrollView>
        <View style={styles.containerBox}>
            <View style={styles.lineBox}></View>
        </View>
        <View style={[fxHC, styles.containerBox]}>
            <Text style={[styles.cellBox1, fwB, activedColumn===0xFF && styles.cellBox0]} numberOfLines={1}>{i18n["summation"]}({appSettings.regionalCurrencyUnit})</Text>
            <Text style={[styles.cellBox2, fwB, activedColumn===0xEE && styles.cellBox0]} numberOfLines={1}>{sumInfo.total}</Text>
            <Text style={[styles.cellBox2, fwB, activedColumn===0xDD && styles.cellBox0]} numberOfLines={1}>{sumInfo.tax}</Text>
            <Text style={[styles.cellBox2, fwB, activedColumn===0xCC && styles.cellBox0]} numberOfLines={1}>-{sumInfo.discount}</Text>
            <Text style={[styles.cellBox2, fwB, activedColumn===0xBB && styles.cellBox0]} numberOfLines={1}>{sumInfo.amount}</Text>
        </View>
        <PopupX showMe={isPopupShow} onClose={onPopupClose} title={i18n["statistics.details.displays"]}>
            <View style={pdHX}>
                <Text style={styles.titleBox}>{i18n["statistics.details.showbar"]}</Text>
                <View style={styles.selectsBox}>
                    <RadioBox size={18} style={styles.selectsItem} checked={showBar===0x00} onPress={onSBChanged(0x00)} label={i18n["nothing"]} />
                    <RadioBox size={18} style={styles.selectsItem} checked={showBar===0x11} onPress={onSBChanged(0x11)} label={i18n["order.amount"]} />
                    <RadioBox size={18} style={styles.selectsItem} checked={showBar===0x22} onPress={onSBChanged(0x22)} label={i18n["tax"]} />
                    <RadioBox size={18} style={styles.selectsItem} checked={showBar===0x33} onPress={onSBChanged(0x33)} label={i18n["coupon.discount"]} />
                    <RadioBox size={18} style={styles.selectsItem} checked={showBar===0x44} onPress={onSBChanged(0x44)} label={i18n["transaction.amount"]} />
                </View>
                <View style={styles.selectsBox}>
                    <Text style={[fs14, fxG1]}>{i18n["statistics.details.showdate"]}</Text>
                    <Switch value={isShowDate} thumbColor={isShowDate ? appMainColor : switchTrackColor.thumbColor} trackColor={switchTrackColor} onValueChange={onSDChanged} />
                </View>
                <Text style={styles.titleBox}>{i18n["statistics.details.hlcolumn"]}</Text>
                <View style={styles.selectsBox}>                    
                    <RadioBox size={18} style={styles.selectsItem} checked={activedColumn===0x00} onPress={onACChanged(0x00)} label={i18n["nothing"]} />
                    <RadioBox size={18} style={styles.selectsItem} checked={activedColumn===0xFF} onPress={onACChanged(0xFF)} label={i18n["transaction.time"]} />
                    <RadioBox size={18} style={styles.selectsItem} checked={activedColumn===0xEE} onPress={onACChanged(0xEE)} label={i18n["order.amount"]} />
                    <RadioBox size={18} style={styles.selectsItem} checked={activedColumn===0xDD} onPress={onACChanged(0xDD)} label={i18n["tax"]} />
                    <RadioBox size={18} style={styles.selectsItem} checked={activedColumn===0xCC} onPress={onACChanged(0xCC)} label={i18n["coupon.discount"]} />
                    <RadioBox size={18} style={styles.selectsItem} checked={activedColumn===0xBB} onPress={onACChanged(0xBB)} label={i18n["transaction.amount"]} />
                </View>
            </View>
        </PopupX>
    </>)
}