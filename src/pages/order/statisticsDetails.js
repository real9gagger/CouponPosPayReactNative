import { useEffect, useState, useRef, Fragment } from "react";
import { ScrollView, Pressable, View, Text, StyleSheet } from "react-native";
import { useI18N, useAppSettings } from "@/store/getter";
import { getPaymentInfo } from "@/common/Statics";
import LoadingTip from "@/components/LoadingTip";

const FIRST_CELL_WIDTH = 70;

const styles = StyleSheet.create({
    containerBox: {
        paddingHorizontal: 5,
        backgroundColor: "#fff"
    },
    dateBox: {
        fontSize: 12,
        fontWeight: "bold",
        padding: 5,
        color: appMainColor
    },
    cellBox1: {
        fontSize: 12,
        width: FIRST_CELL_WIDTH,
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    cellBox2: {
        width: (deviceDimensions.screenWidth - FIRST_CELL_WIDTH - 10) / 4,
        fontSize: 12,
        paddingHorizontal: 5,
        paddingVertical: 10,
        textAlign: "right"
    },
    lineBox: {
        backgroundColor: "#fff",
        borderTopColor: "#aaa", 
        borderTopWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 5
    }
});

//销售统计明细
export default function OrderStatisticsDetails(props){
    const i18n = useI18N();
    const ltRef = useRef(null);
    const [detailsList, setDetailsList] = useState([]);
    const [sumInfo, setSumInfo] = useState({
        total: 0, //订单总额
        tax: 0, //税
        discount: 0, //折扣
        amount: 0 //实际金额
    });
    
    const onItemPress = (oo) => {
        if(!oo.paymentName){
            const pmInfo = getPaymentInfo(oo.paymentType, oo.creditCardBrand || oo.eMoneyType || oo.qrPayType);
            if(pmInfo){
                oo.paymentName = pmInfo.name;
                oo.paymentLogo = pmInfo.logo;
            }
        }
        
        props.navigation.navigate("订单详情", oo);
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
            
            if(ltRef.current.isFirstPage()){
                setDetailsList(list);
            } else {
                setDetailsList([...detailsList, ...list]);
            }
            
            ltRef.current.setNoMore(queryParams.pageSize, list.length);
            
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
    
    useEffect(getDetailsList, [])
    
    return (<>
        <View style={styles.containerBox}>
            <View style={[fxHC, bgEE]}>
                <Text style={styles.cellBox1} numberOfLines={1}>{i18n["transaction.time"]}</Text>
                <Text style={styles.cellBox2} numberOfLines={1}>{i18n["order.amount"]}</Text>
                <Text style={styles.cellBox2} numberOfLines={1}>{i18n["tax"]}</Text>
                <Text style={styles.cellBox2} numberOfLines={1}>{i18n["coupon.discount"]}</Text>
                <Text style={styles.cellBox2} numberOfLines={1}>{i18n["transaction.amount"]}</Text>
            </View>
        </View>
        <ScrollView style={pgFF} onScroll={onSVScroll} contentContainerStyle={styles.containerBox}>
            {detailsList.map(vx => 
                <Fragment key={vx.id}>
                    {vx.tstData && <Text style={styles.dateBox}>{vx.tstData}</Text>}
                    <Pressable style={fxHC} android_ripple={tcCC} onPress={() => onItemPress(vx)}>
                        <Text style={styles.cellBox1}>{vx.transactionTime.substr(11)}</Text>
                        <Text style={styles.cellBox2}>{vx.orderAmount || 0}</Text>
                        <Text style={styles.cellBox2}>{vx.tax || 0}</Text>
                        <Text style={styles.cellBox2}>-{vx.discountAmount || 0}</Text>
                        <Text style={styles.cellBox2}>{vx.amount || 0}</Text>
                    </Pressable>
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
        <View style={bgFF}>
            <View style={styles.lineBox}></View>
            <View style={[fxHC, styles.containerBox]}>
                <Text style={[styles.cellBox1, fwB]} numberOfLines={1}>{i18n["summation"]}</Text>
                <Text style={[styles.cellBox2, fwB]} numberOfLines={1}>{sumInfo.total}</Text>
                <Text style={[styles.cellBox2, fwB]} numberOfLines={1}>{sumInfo.tax}</Text>
                <Text style={[styles.cellBox2, fwB]} numberOfLines={1}>-{sumInfo.discount}</Text>
                <Text style={[styles.cellBox2, fwB]} numberOfLines={1}>{sumInfo.amount}</Text>
            </View>
        </View>
    </>)
}