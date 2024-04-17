import { ScrollView, View, Text, Image, StatusBar, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import { creditCardList, eWalletList, qrPayList, cashPayList } from "@/common/Statics";
import LocalPictures from "@/common/Pictures";

const styles = StyleSheet.create({
    titleBox: {
        fontSize: 16,
        marginTop: 15,
        fontWeight: "bold"
    },
    titleFirst: {
        marginTop: 0
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
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={pdX}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <Text style={[styles.titleBox, styles.titleFirst]}>{i18n["credit.card"]}</Text>
            <View style={[fxR, fxWP]}>
                {creditCardList.map((vx, ix) => (
                    <View key={vx.pmcode} style={ix%2===0 ? styles.itemBox1 : styles.itemBox2}>
                        <View style={styles.itemContent}>
                            <Image source={LocalPictures[vx.logo]} style={styles.imgBox} />
                            <Text style={fxG1}>{vx.name}</Text>
                        </View>
                    </View>
                ))}
            </View>
            <Text style={styles.titleBox}>{i18n["e.wallet"]}</Text>
            <View style={[fxR, fxWP]}>
                {eWalletList.map((vx, ix) => (
                    <View key={vx.pmcode} style={ix%2===0 ? styles.itemBox1 : styles.itemBox2}>
                        <View style={styles.itemContent}>
                            <Image source={LocalPictures[vx.logo]} style={styles.imgBox} />
                            <Text style={fxG1}>{vx.name}</Text>
                        </View>
                    </View>
                ))}
            </View>
            <Text style={styles.titleBox}>{i18n["qrcode.pay"]}</Text>
            <View style={[fxR, fxWP]}>
                {qrPayList.map((vx, ix) => (
                    <View key={vx.pmcode} style={ix%2===0 ? styles.itemBox1 : styles.itemBox2}>
                        <View style={styles.itemContent}>
                            <Image source={LocalPictures[vx.logo]} style={styles.imgBox} />
                            <Text style={fxG1}>{vx.name}</Text>
                        </View>
                    </View>
                ))}
            </View>
            <Text style={styles.titleBox}>{i18n["cash.pay"]}</Text>
            <View style={[fxR, fxWP]}>
                {cashPayList.map((vx, ix) => (
                    <View key={vx.pmcode} style={ix%2===0 ? styles.itemBox1 : styles.itemBox2}>
                        <View style={styles.itemContent}>
                            <Image source={LocalPictures[vx.logo]} style={styles.imgBox} />
                            <Text style={fxG1}>{vx.name}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}