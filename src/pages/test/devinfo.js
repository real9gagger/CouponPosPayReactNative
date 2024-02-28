import { useEffect, useState } from "react";
import { ScrollView, View, Text, StatusBar, StyleSheet, Dimensions, PixelRatio, Platform } from "react-native";
import AppPackageInfo from "@/modules/AppPackageInfo";

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
        const precision = 8; //数字保留多少位小数
        
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
                case "object": 
                    if(key === "constants"){
                        item.itemKey = "platform.hardware"; //设备硬件信息
                        item.itemValue = (Platform[key].Manufacturer + " " + Platform[key].Model);
                    }
                    break;
            }
            
            if(item.itemValue){
                infos.push(item);
            }
        }
        
        infos.push({
            itemKey: "pixel.ratio",
            itemValue: $mathround(1.0 / PixelRatio.get(), precision)
        });
        
        infos.push({
            itemKey: "app.version",
            itemValue: AppPackageInfo.getFullVersion()
        });
        
        setInfoList(infos);
    }, []);
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={pdX}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View style={[pdHX, brX, bgFF]}>
                {infoList.map((vx, ix) => (
                    <View key={vx.itemKey} style={[fxHC, ix ? styles.infoBox : pdVX]}>
                        <Text style={[fxG1, fs14]}>{vx.itemKey}</Text>
                        <Text style={fs14}>{vx.itemValue}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}