import { ScrollView, View, Text, Image, StatusBar, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import { bankCardList, eWalletList, qrPayList } from "@/common/Statics";
import LocalPictures from "@/common/Pictures";

const styles = StyleSheet.create({
    itemBox: {
        width: "45%",
        backgroundColor: "#fff",
        margin: 5,
        padding: 10,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center"
    },
    imgBox: {
        width: 60,
        height: 60
    }
});

//支持的支付方式
export default function TestSupportPayment(props){
    const i18n = useI18N();
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={pdX}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <Text>{i18n["qrcode.pay"]}</Text>
            <View style={[fxR, fxWP]}>
                {qrPayList.map(vx => (
                    <View key={vx.pmcode} style={styles.itemBox}>
                        <Image source={LocalPictures[vx.logo]} style={styles.imgBox} />
                        <Text>{vx.name}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}