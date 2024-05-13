import { useEffect, useState, useRef, Fragment } from "react";
import { ScrollView, TouchableOpacity, View, Text, StyleSheet, FlatList } from "react-native";
import { useI18N, useAppSettings } from "@/store/getter";
import { getPaymentInfo } from "@/common/Statics";
import LoadingTip from "@/components/LoadingTip";
import LinearGradient from "react-native-linear-gradient";
import PosPayIcon from "@/components/PosPayIcon";
import PopupX from "@/components/PopupX";

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
    subtotalBox: {
        fontWeight: "bold",
        color: appMainColor
    },
    cellBox0: {
        backgroundColor: "#A0E9FF"
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
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundColor: "#fff",
        paddingHorizontal: 5,
        paddingTop: 10
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
        flexBasis: "33.33333333%",
        textAlign: "center",
        paddingHorizontal: 5,
        lineHeight: 36,
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "#f0f0f0"
    },
    selectsChecked: {
        backgroundColor: appMainColor,
        color: "#fff"
    }
});

//销售统计明细
export default function OrderStatisticsDetails(props){
    const i18n = useI18N();
    const appSettings = useAppSettings();
    const ltRef = useRef(null);
    const prevDate = useRef("[!NULL!]");
    const prevIndex = useRef(-1);
    const [detailsList, setDetailsList] = useState([]);
    const [sumInfo, setSumInfo] = useState({
        total: 0, //订单总额
        totmin: 1e16, //最小订单金额
        totmax: 0, //最大订单金额
        totdaymax: 0, //按天算时的最大值
        
        tax: 0, //税
        taxmin: 1e16, //最小税
        taxmax: 0, //最大税
        taxdaymax: 0, //按天算时的最大值
        
        discount: 0, //折扣
        dctmin: 1e16, //最小折扣
        dctmax: 0, //最大折扣
        dctdaymax: 0, //按天算时的最大值
        
        amount: 0, //实际金额
        amtmin: 1e16, //最小实际金额
        amtmax: 0, //最大实际金额
        amtdaymax: 0, //按天算时的最大值
        
        days: 0, //天数
    });
    const [activedColumn, setActivedColumn] = useState(0x00); //需要高亮显示的列
    const [showBar, setShowBar] = useState(0x00); //需要显示的柱状图
    const [showData, setShowData] = useState(0x00); //是否显示日期
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
            const money = [0, 0, 0, 0]; //临时变量
            
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
            
            const newList = [...detailsList, ...list];
            
            //统计每日小计
            for(let idx = newList.length - 1; idx >= 0; idx--){
                
                money[0] += (+newList[idx].orderAmount || 0);
                money[1] += (+newList[idx].tax || 0);
                money[2] += (+newList[idx].discountAmount || 0);
                money[3] += (+newList[idx].amount || 0);
                
                if(newList[idx].subtotalData){
                    newList[idx].subtotalData = money;
                    
                    sumInfo.totdaymax = Math.max(sumInfo.totdaymax, money[0]);
                    sumInfo.taxdaymax = Math.max(sumInfo.taxdaymax, money[1]);
                    sumInfo.dctdaymax = Math.max(sumInfo.dctdaymax, money[2]);
                    sumInfo.amtdaymax = Math.max(sumInfo.amtdaymax, money[3]);
                    
                    break;
                } else if(newList[idx].tstData){
                    newList[idx].subtotalData = [...money];
                    
                    sumInfo.totdaymax = Math.max(sumInfo.totdaymax, money[0]);
                    sumInfo.taxdaymax = Math.max(sumInfo.taxdaymax, money[1]);
                    sumInfo.dctdaymax = Math.max(sumInfo.dctdaymax, money[2]);
                    sumInfo.amtdaymax = Math.max(sumInfo.amtdaymax, money[3]);
                    
                    money[0] = money[1] = money[2] = money[3] = 0;
                }
            }
            
            setDetailsList(newList);
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
            setIsPopupShow(false);
            if(code === activedColumn){
                setActivedColumn(0x00);
            } else {
                setActivedColumn(code);
            }
        }
    }
    const onSBChanged = (code) => {
        return function(){
            setIsPopupShow(false);
            if(code === showBar){
                setShowBar(0x00);
            } else {
                setShowBar(code);
            }
        }
    }
    const onSDChanged = (code) => {
        return function(){
            setIsPopupShow(false);
            if(code === showData){
                setShowData(0x00);
            } else {
                setShowData(code);
            }
        }
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
    const getBarWidthOfOrder = (val) => {
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
    const getBarWidthOfDay = (val) => {
        if(showData === 0x88){ //只有值显示每日小计时才能显示柱状图
            switch(showBar){
                case 0x11: 
                    if(val.subtotalData[0] && sumInfo.totdaymax){
                        return {width: Math.ceil(val.subtotalData[0] * CONTENT_BOX_WIDTH / sumInfo.totdaymax)}; //每日订单金额
                    }
                    break;
                case 0x22: 
                    if(val.subtotalData[1] && sumInfo.taxdaymax){
                        return {width: Math.ceil(val.subtotalData[1] * CONTENT_BOX_WIDTH / sumInfo.taxdaymax)}; //每日税收金额
                    }
                    break;
                case 0x33:
                    if(val.subtotalData[2] && sumInfo.dctdaymax){
                        return {width: Math.ceil(val.subtotalData[2] * CONTENT_BOX_WIDTH / sumInfo.dctdaymax)}; //每日优惠金额
                    }
                    break;
                case 0x44:
                    if(val.subtotalData[3] && sumInfo.amtdaymax){
                        return {width: Math.ceil(val.subtotalData[3] * CONTENT_BOX_WIDTH / sumInfo.amtdaymax)}; //每日交易金额
                    }
                    break;
            }
        }
        return {display: "none"};
    }
    /* const myRenderItem = (args) => {
        const vx = args.item;
        
        return (
            <Fragment key={vx.orderUID}>
                {showData !== 0x99 && vx.tstData && 
                    <View style={fxHC}>
                        <Text style={[styles.cellBox1, styles.subtotalBox, activedColumn===0xFF && styles.cellBox0]}>{vx.tstData}</Text>
                        <Text style={[styles.cellBox2, styles.subtotalBox, activedColumn===0xEE && styles.cellBox0]}>{vx.subtotalData[0]}</Text>
                        <Text style={[styles.cellBox2, styles.subtotalBox, activedColumn===0xDD && styles.cellBox0]}>{vx.subtotalData[1]}</Text>
                        <Text style={[styles.cellBox2, styles.subtotalBox, activedColumn===0xCC && styles.cellBox0]}>-{vx.subtotalData[2]}</Text>
                        <Text style={[styles.cellBox2, styles.subtotalBox, activedColumn===0xBB && styles.cellBox0]}>{vx.subtotalData[3]}</Text>
                        <LinearGradient style={[styles.barBox, getBarWidthOfDay(vx)]} colors={LG_BAR_COLORS} start={LG_BAR_START} end={LG_BAR_END} />
                    </View>
                }
                {showData !== 0x88 && 
                    <TouchableOpacity style={fxHC} activeOpacity={0.5} onPress={onItemPress(vx)}>
                        <Text style={[styles.cellBox1, activedColumn===0xFF && styles.cellBox0]}>{vx.transactionTime.substr(11)}</Text>
                        <Text style={[styles.cellBox2, activedColumn===0xEE && styles.cellBox0]}>{vx.orderAmount || 0}</Text>
                        <Text style={[styles.cellBox2, activedColumn===0xDD && styles.cellBox0]}>{vx.tax || 0}</Text>
                        <Text style={[styles.cellBox2, activedColumn===0xCC && styles.cellBox0]}>-{vx.discountAmount || 0}</Text>
                        <Text style={[styles.cellBox2, activedColumn===0xBB && styles.cellBox0]}>{vx.amount || 0}</Text>
                        <LinearGradient style={[styles.barBox, getBarWidthOfOrder(vx)]} colors={LG_BAR_COLORS} start={LG_BAR_START} end={LG_BAR_END} />
                    </TouchableOpacity>
                }
            </Fragment>
        );
    } */
    
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
            {!!detailsList.length && 
                <TouchableOpacity style={styles.reviewBox} activeOpacity={0.6} onPress={onPopupShow}>
                    <Text style={[fs12, tcMC, fwB]}>{i18n["statistics.details.displays"]}</Text>
                    <PosPayIcon name="query-params" color={appMainColor} size={14} offset={5} />
                </TouchableOpacity>
            }
            {detailsList.map(vx => 
                <Fragment key={vx.orderUID}>
                    {showData !== 0x99 && vx.tstData && 
                        <View style={fxHC}>
                            <Text style={[styles.cellBox1, styles.subtotalBox, activedColumn===0xFF && styles.cellBox0]}>{vx.tstData}</Text>
                            <Text style={[styles.cellBox2, styles.subtotalBox, activedColumn===0xEE && styles.cellBox0]}>{vx.subtotalData[0]}</Text>
                            <Text style={[styles.cellBox2, styles.subtotalBox, activedColumn===0xDD && styles.cellBox0]}>{vx.subtotalData[1]}</Text>
                            <Text style={[styles.cellBox2, styles.subtotalBox, activedColumn===0xCC && styles.cellBox0]}>-{vx.subtotalData[2]}</Text>
                            <Text style={[styles.cellBox2, styles.subtotalBox, activedColumn===0xBB && styles.cellBox0]}>{vx.subtotalData[3]}</Text>
                            <LinearGradient style={[styles.barBox, getBarWidthOfDay(vx)]} colors={LG_BAR_COLORS} start={LG_BAR_START} end={LG_BAR_END} />
                        </View>
                    }
                    {showData !== 0x88 && 
                        <TouchableOpacity style={fxHC} activeOpacity={0.5} onPress={onItemPress(vx)}>
                            <Text style={[styles.cellBox1, activedColumn===0xFF && styles.cellBox0]}>{vx.transactionTime.substr(11)}</Text>
                            <Text style={[styles.cellBox2, activedColumn===0xEE && styles.cellBox0]}>{vx.orderAmount || 0}</Text>
                            <Text style={[styles.cellBox2, activedColumn===0xDD && styles.cellBox0]}>{vx.tax || 0}</Text>
                            <Text style={[styles.cellBox2, activedColumn===0xCC && styles.cellBox0]}>-{vx.discountAmount || 0}</Text>
                            <Text style={[styles.cellBox2, activedColumn===0xBB && styles.cellBox0]}>{vx.amount || 0}</Text>
                            <LinearGradient style={[styles.barBox, getBarWidthOfOrder(vx)]} colors={LG_BAR_COLORS} start={LG_BAR_START} end={LG_BAR_END} />
                        </TouchableOpacity>
                    }
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
        <PopupX showMe={isPopupShow} onClose={onPopupClose} title={i18n["statistics.details.displays"]} tips={i18n["statistics.details.tip"]}>
            <View style={pdHX}>
                <Text style={styles.titleBox}>{i18n["statistics.details.showbar"]}</Text>
                <View style={styles.selectsBox}>
                    <Text style={[styles.selectsItem, showBar===0x11 && styles.selectsChecked]} numberOfLines={1} onPress={onSBChanged(0x11)}>{i18n["order.amount"]}</Text>
                    <Text style={[styles.selectsItem, showBar===0x22 && styles.selectsChecked]} numberOfLines={1} onPress={onSBChanged(0x22)}>{i18n["tax"]}</Text>
                    <Text style={[styles.selectsItem, showBar===0x33 && styles.selectsChecked]} numberOfLines={1} onPress={onSBChanged(0x33)}>{i18n["coupon.discount"]}</Text>
                    <Text style={[styles.selectsItem, showBar===0x44 && styles.selectsChecked]} numberOfLines={1} onPress={onSBChanged(0x44)}>{i18n["transaction.amount"]}</Text>
                </View>
                <Text style={styles.titleBox}>{i18n["statistics.details.showdata"]}</Text>
                <View style={styles.selectsBox}>
                    <Text style={[styles.selectsItem, showData===0x00 && styles.selectsChecked]} numberOfLines={1} onPress={onSDChanged(0x00)}>{i18n["options.any"]}</Text>
                    <Text style={[styles.selectsItem, showData===0x88 && styles.selectsChecked]} numberOfLines={1} onPress={onSDChanged(0x88)}>{i18n["statistics.details.dailysubtotal"]}</Text>
                    <Text style={[styles.selectsItem, showData===0x99 && styles.selectsChecked]} numberOfLines={1} onPress={onSDChanged(0x99)}>{i18n["statistics.details.dailysales"]}</Text>
                </View>
                <Text style={styles.titleBox}>{i18n["statistics.details.hlcolumn"]}</Text>
                <View style={styles.selectsBox}>
                    <Text style={[styles.selectsItem, activedColumn===0xFF && styles.selectsChecked]} numberOfLines={1} onPress={onACChanged(0xFF)}>{i18n["transaction.time"]}</Text>
                    <Text style={[styles.selectsItem, activedColumn===0xEE && styles.selectsChecked]} numberOfLines={1} onPress={onACChanged(0xEE)}>{i18n["order.amount"]}</Text>
                    <Text style={[styles.selectsItem, activedColumn===0xDD && styles.selectsChecked]} numberOfLines={1} onPress={onACChanged(0xDD)}>{i18n["tax"]}</Text>
                    <Text style={[styles.selectsItem, activedColumn===0xCC && styles.selectsChecked]} numberOfLines={1} onPress={onACChanged(0xCC)}>{i18n["coupon.discount"]}</Text>
                    <Text style={[styles.selectsItem, activedColumn===0xBB && styles.selectsChecked]} numberOfLines={1} onPress={onACChanged(0xBB)}>{i18n["transaction.amount"]}</Text>
                </View>
            </View>
        </PopupX>
    </>)
}