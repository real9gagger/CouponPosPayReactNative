import { useEffect, useState, useRef, Fragment } from "react";
import { ScrollView, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useI18N, useAppSettings } from "@/store/getter";
import { getPaymentInfo } from "@/common/Statics";
import LoadingTip from "@/components/LoadingTip";

const FIRST_CELL_WIDTH = 80;
const CONTENT_PADDING_TB = 0;

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
        paddingVertical: 10
    },
    cellBox2: {
        width: (deviceDimensions.screenWidth - FIRST_CELL_WIDTH - CONTENT_PADDING_TB * 2) / 4,
        fontSize: 12,
        paddingHorizontal: 5,
        paddingVertical: 10,
        textAlign: "right"
    },
    lineBox: {
        borderTopColor: "#ccc", 
        borderTopWidth: StyleSheet.hairlineWidth
    }
});

//销售统计明细
export default function OrderStatisticsDetails(props){
    const i18n = useI18N();
    const appSettings = useAppSettings();
    const ltRef = useRef(null);
    const [detailsList, setDetailsList] = useState([]);
    const [sumInfo, setSumInfo] = useState({
        total: 0, //订单总额
        tax: 0, //税
        discount: 0, //折扣
        amount: 0 //实际金额
    });
    const [activedColumn, setActivedColumn] = useState(0);
    
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
            return;
        } else {
            ltRef.current.setLoading(true);
        }
        
        const queryParams = props.route.params || {};
        
        queryParams.pageSize = 20;
        queryParams.pageNum = ltRef.current.getPage();
        
        $request("getPosAppOrderList", queryParams).then(res => {
            let list = (res || []);
            let prevDate = "[!NULL!]";
            
            for(let item of list){
                if(!item.transactionTime){
                    item.transactionTime = "0000-00-00 00:00:00";
                }
                
                if(!item.transactionTime.startsWith(prevDate)){
                    item.tstData = prevDate = item.transactionTime.substr(0, 10);
                }
                
                sumInfo.total += (+item.orderAmount || 0);
                sumInfo.tax += (+item.tax || 0);
                sumInfo.discount += (+item.discountAmount || 0);
                sumInfo.amount += (+item.amount || 0);
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
                setActivedColumn(0);
            } else {
                setActivedColumn(code);
            }
        }
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
            {detailsList.map(vx => 
                <Fragment key={vx.id}>
                    {vx.tstData && <Text style={styles.dateBox}>{vx.tstData}</Text>}
                    <TouchableOpacity style={fxHC} activeOpacity={0.5} onPress={onItemPress(vx)}>
                        <Text style={[styles.cellBox1, activedColumn===0xFF && styles.cellBox0]}>{vx.transactionTime.substr(11)}</Text>
                        <Text style={[styles.cellBox2, activedColumn===0xEE && styles.cellBox0]}>{vx.orderAmount || 0}</Text>
                        <Text style={[styles.cellBox2, activedColumn===0xDD && styles.cellBox0]}>{vx.tax || 0}</Text>
                        <Text style={[styles.cellBox2, activedColumn===0xCC && styles.cellBox0]}>-{vx.discountAmount || 0}</Text>
                        <Text style={[styles.cellBox2, activedColumn===0xBB && styles.cellBox0]}>{vx.amount || 0}</Text>
                    </TouchableOpacity>
                </Fragment>
            )}
            <LoadingTip
                ref={ltRef}
                noMoreText={i18n["nomore"]}
                noDataText={i18n["nodata"]}
                retryLabel={i18n["retry"]}
                errorTitle={i18n["loading.error"]}
                alwaysShowLoading={true}
                onRetry={getDetailsList} />
        </ScrollView>
        <View style={styles.containerBox}>
            <View style={styles.lineBox}></View>
        </View>
        <View style={[fxHC, styles.containerBox]}>
            <Text style={[styles.cellBox1, fwB, activedColumn===0xFF && styles.cellBox0]} numberOfLines={1}>{i18n["summation"]} ({appSettings.regionalCurrencyUnit})</Text>
            <Text style={[styles.cellBox2, fwB, activedColumn===0xEE && styles.cellBox0]} numberOfLines={1}>{sumInfo.total}</Text>
            <Text style={[styles.cellBox2, fwB, activedColumn===0xDD && styles.cellBox0]} numberOfLines={1}>{sumInfo.tax}</Text>
            <Text style={[styles.cellBox2, fwB, activedColumn===0xCC && styles.cellBox0]} numberOfLines={1}>-{sumInfo.discount}</Text>
            <Text style={[styles.cellBox2, fwB, activedColumn===0xBB && styles.cellBox0]} numberOfLines={1}>{sumInfo.amount}</Text>
        </View>
    </>)
}