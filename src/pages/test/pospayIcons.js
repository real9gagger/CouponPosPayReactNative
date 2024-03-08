import { ScrollView, StatusBar, View, Text, StyleSheet } from "react-native";
import { getAllIconName } from "@/components/PosPayIcon";
import PosPayIcon from "@/components/PosPayIcon";

const styles = StyleSheet.create({
    iconBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: 5,
        backgroundColor: "#fff",
        padding: 5,
        borderRadius: 10,
        flexGrow: 1
    },
    nameBox: {
        fontSize: 12,
        marginTop: 5
    }
});

export default function TestPospayIcons(props){
    
    const iconList = getAllIconName();
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={pdS}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View style={[fxR, fxWP]}>
                {iconList.map(vx => (
                    <View key={vx} style={styles.iconBox}>
                        <PosPayIcon name={vx} size={40} />
                        <Text style={styles.nameBox}>{vx}</Text>
                    </View>
                ))}
            </View>
            <Text style={[fs14, tc99, taC, {marginTop: 10, marginBottom: 5}]}>图标数量: {iconList.length}</Text>
        </ScrollView>
    )
}