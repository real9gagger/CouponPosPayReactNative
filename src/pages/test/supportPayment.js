import { Fragment, useEffect, useRef, useState } from "react";
import { ScrollView, View, Text, Image, StatusBar, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import { CASH_PAYMENT_CODE, CREDIT_CARD_PAYMENT_CODE, E_MONEY_PAYMENT_CODE, QR_CODE_PAYMENT_CODE, creditCardList, eWalletList, qrPayList, cashPayList } from "@/common/Statics";
import { getSupportPaymentMap } from "@/modules/PaymentHelper";
import LocalPictures from "@/common/Pictures";
import TextualButton from "@/components/TextualButton";

const styles = StyleSheet.create({
    titleBox: {
        fontSize: 16,
        fontWeight: "bold"
    },
    itemBox1: {
        width: "50%",
        paddingTop: 6,
        paddingRight: 3
    },
    itemBox2: {
        width: "50%",
        paddingTop: 6,
        paddingLeft: 3
    },
    itemContent: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center"
    },
    imgBox: {
        width: 55,
        height: 55,
        marginRight: 5
    }
});

//支持的支付方式
export default function TestSupportPayment(props){
    const i18n = useI18N();
    const [myPayments, setMyPayments] = useState([]); //支持的支付方式
    
    const showThosePayments = () => {
        const pms = [
            { isShowingSupports: true, pmtList: [], unsupportCount: 0 },
            { i18nTitle: "credit.card", pmtList: [] },
            { i18nTitle: "e.wallet", pmtList: [] },
            { i18nTitle: "qrcode.pay", pmtList: [] },
            { i18nTitle: "cash.pay", pmtList: [] },
        ];
        
        if(!myPayments.length || !myPayments[0].isShowingSupports){
            const myPmMap = getSupportPaymentMap();
            for(const vp of creditCardList){
                if(myPmMap[vp.pmcode] || myPmMap[CREDIT_CARD_PAYMENT_CODE]){
                    pms[1].pmtList.push(vp);
                } else {
                    pms[0].unsupportCount++; //不支持的支付方式数量
                }
            }
            for(const vp of eWalletList){
                if(myPmMap[vp.pmcode] || myPmMap[E_MONEY_PAYMENT_CODE]){
                    pms[2].pmtList.push(vp);
                } else {
                    pms[0].unsupportCount++;
                }
            }
            for(const vp of qrPayList){
                if(myPmMap[vp.pmcode] || myPmMap[QR_CODE_PAYMENT_CODE]){
                    pms[3].pmtList.push(vp);
                } else {
                    pms[0].unsupportCount++;
                }
            }
            for(const vp of cashPayList){
                if(myPmMap[vp.pmcode] || myPmMap[CASH_PAYMENT_CODE]){
                    pms[4].pmtList.push(vp);
                } else {
                    pms[0].unsupportCount++;
                }
            }
        } else {
            pms[0].isShowingSupports = false;
            pms[0].unsupportCount = 88888888;
            pms[1].pmtList.push(...creditCardList);
            pms[2].pmtList.push(...eWalletList);
            pms[3].pmtList.push(...qrPayList);
            pms[4].pmtList.push(...cashPayList);
        }

        setMyPayments(pms);
    }
    
    useEffect(showThosePayments, []);
    
    //【以下列表仅显示当前店铺已申请并可用的支付方式】
    return (
        <ScrollView style={pgEE} contentContainerStyle={pdX}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            {myPayments.map(v0 => !!v0.pmtList.length && 
                <Fragment key={v0.i18nTitle}>
                    <Text style={styles.titleBox}>{i18n[v0.i18nTitle]} ({v0.pmtList.length})</Text>
                    <View style={[fxR, fxWP, mgBS]}>
                        {v0.pmtList.map((vx, ix) =>
                            <View key={vx.pmcode} style={ix%2===0 ? styles.itemBox1 : styles.itemBox2}>
                                <View style={styles.itemContent}>
                                    <Image source={LocalPictures[vx.logo]} style={styles.imgBox} />
                                    <Text style={fxG1}>{vx.name}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </Fragment>
            )}
            <TextualButton visible={myPayments[0]?.unsupportCount!==0} style={[pdVX, tcMC, fs12]} onPress={showThosePayments}>{i18n[myPayments[0]?.isShowingSupports ? "payment.all.show" : "payment.supports.show"]}</TextualButton>
        </ScrollView>
    );
}