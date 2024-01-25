import { useEffect, useState } from "react";
import { ScrollView, View, Text, StatusBar, StyleSheet, Dimensions, PixelRatio, Platform } from "react-native";

const styles = StyleSheet.create({
    infoBox: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#ddd",
        paddingVertical: 15
    }
});

//设备信息
export default function TestDevinfo(props){
    const [infoList, setInfoList] = useState([]);
    
    useEffect(() => {
        const winInfo = Dimensions.get("window");
        const infos = [];
        const precision = 6; //数字保留多少位小数
        
        for(const key in winInfo){
            const item = { itemKey: "window." + key };
            
            switch(typeof winInfo[key]){
                case "string": item.itemValue = winInfo[key]; break;
                case "number": item.itemValue = $mathround(winInfo[key], precision); break;
                case "boolean": item.itemValue = winInfo[key].toString(); break;
            }
            
            if(item.itemValue){
                infos.push(item);
            }
        }
        
        for(const key in Platform){
            const item = { itemKey: "platform." + key };
            
            switch(typeof Platform[key]){
                case "string": item.itemValue = Platform[key]; break;
                case "number": item.itemValue = $mathround(Platform[key], precision); break;
                case "boolean": item.itemValue = Platform[key].toString(); break;
            }
            
            if(item.itemValue){
                infos.push(item);
            }
        }
        
        infos.push({
            itemKey: "pixel.ratio",
            itemValue: $mathround(1.0 / PixelRatio.get(), precision)
        });
        
        setInfoList(infos);
    }, []);
    
    return (
        <ScrollView style={fxG1} contentContainerStyle={pdX}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View style={[pdHX, brX, bgFF]}>
                {infoList.map(vx => (
                    <View key={vx.itemKey} style={[fxHC, styles.infoBox]}>
                        <Text style={[fxG1, fs14]}>{vx.itemKey}</Text>
                        <Text style={fs14}>{vx.itemValue}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}