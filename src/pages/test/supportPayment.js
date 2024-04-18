import { useEffect, useState } from "react";
import { ScrollView, View, Text, Image, StatusBar, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import { CASH_PAYMENT_CODE, CREDIT_CARD_PAYMENT_CODE, E_MONEY_PAYMENT_CODE, QR_CODE_PAYMENT_CODE, creditCardList, eWalletList, qrPayList, cashPayList } from "@/common/Statics";
import { getSupportPaymentMap } from "@/modules/PaymentHelper";
import LocalPictures from "@/common/Pictures";

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
    const [supports, setSupports] = useState({}); //检查是否是支持的支付方式
    
    useEffect(() => {
        const myPmMap = getSupportPaymentMap();
        
        supports[CREDIT_CARD_PAYMENT_CODE] = 0;
        supports[E_MONEY_PAYMENT_CODE] = 0;
        supports[QR_CODE_PAYMENT_CODE] = 0;
        supports[CASH_PAYMENT_CODE] = 0;
        
        for(const vp of creditCardList){
            if(myPmMap[vp.pmcode] || myPmMap[CREDIT_CARD_PAYMENT_CODE]){
                supports[vp.pmcode] = true;
                supports[CREDIT_CARD_PAYMENT_CODE]++;
            }
        }
        for(const vp of eWalletList){
            if(myPmMap[vp.pmcode] || myPmMap[E_MONEY_PAYMENT_CODE]){
                supports[vp.pmcode] = true;
                supports[E_MONEY_PAYMENT_CODE]++;
            }
        }
        for(const vp of qrPayList){
            if(myPmMap[vp.pmcode] || myPmMap[QR_CODE_PAYMENT_CODE]){
                supports[vp.pmcode] = true;
                supports[QR_CODE_PAYMENT_CODE]++;
            }
        }
        for(const vp of cashPayList){
            if(myPmMap[vp.pmcode] || myPmMap[CASH_PAYMENT_CODE]){
                supports[vp.pmcode] = true;
                supports[CASH_PAYMENT_CODE]++;
            }
        }
        
        setSupports({...supports});
    }, []);
    
    //【以下列表仅显示当前店铺已申请并可用的支付方式】
    return (
        <ScrollView style={pgEE} contentContainerStyle={pdX}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            {!!supports[CREDIT_CARD_PAYMENT_CODE] && <>
                <Text style={styles.titleBox}>{i18n["credit.card"]}</Text>
                <View style={[fxR, fxWP, mgBS]}>
                    {creditCardList.map((vx, ix) => (supports[vx.pmcode] &&
                        <View key={vx.pmcode} style={ix%2===0 ? styles.itemBox1 : styles.itemBox2}>
                            <View style={styles.itemContent}>
                                <Image source={LocalPictures[vx.logo]} style={styles.imgBox} />
                                <Text style={fxG1}>{vx.name}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </>}
            {!!supports[E_MONEY_PAYMENT_CODE] && <>
                <Text style={styles.titleBox}>{i18n["e.wallet"]}</Text>
                <View style={[fxR, fxWP, mgBS]}>
                    {eWalletList.map((vx, ix) => (supports[vx.pmcode] &&
                        <View key={vx.pmcode} style={ix%2===0 ? styles.itemBox1 : styles.itemBox2}>
                            <View style={styles.itemContent}>
                                <Image source={LocalPictures[vx.logo]} style={styles.imgBox} />
                                <Text style={fxG1}>{vx.name}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </>}
            {!!supports[QR_CODE_PAYMENT_CODE] && <>
                <Text style={styles.titleBox}>{i18n["qrcode.pay"]}</Text>
                <View style={[fxR, fxWP, mgBS]}>
                    {qrPayList.map((vx, ix) => (supports[vx.pmcode] &&
                        <View key={vx.pmcode} style={ix%2===0 ? styles.itemBox1 : styles.itemBox2}>
                            <View style={styles.itemContent}>
                                <Image source={LocalPictures[vx.logo]} style={styles.imgBox} />
                                <Text style={fxG1}>{vx.name}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </>}
            {!!supports[CASH_PAYMENT_CODE] && <>
                <Text style={styles.titleBox}>{i18n["cash.pay"]}</Text>
                <View style={[fxR, fxWP, mgBS]}>
                    {cashPayList.map((vx, ix) => (supports[vx.pmcode] &&
                        <View key={vx.pmcode} style={ix%2===0 ? styles.itemBox1 : styles.itemBox2}>
                            <View style={styles.itemContent}>
                                <Image source={LocalPictures[vx.logo]} style={styles.imgBox} />
                                <Text style={fxG1}>{vx.name}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </>}
        </ScrollView>
    );
}