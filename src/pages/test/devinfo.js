import { useEffect, useRef, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StatusBar, StyleSheet, Dimensions, PixelRatio, Platform } from "react-native";
import { getI18N, useAppSettings } from "@/store/getter";
import { dispatchUpdateAppSettings } from "@/store/setter";
import AppPackageInfo from "@/modules/AppPackageInfo";
import ReceiptsPlus from "@/modules/ReceiptsPlus";

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
    const pressCount = useRef(0);
    const appSettings = useAppSettings();
    
    const onItemPress = (idx) => {
        return function() {
            if(infoList[idx].itemKey === "app.isPOSMode"){
                if((++pressCount.current) >= 6){//连续按够次数就切换模式。需要【强制】重启APP才能生效
                    if(appSettings.isUsePosMode){
                        dispatchUpdateAppSettings("isUsePosMode", false);
                        $toast(getI18N("posmode.no.tip"), 3000);
                    } else {
                        dispatchUpdateAppSettings("isUsePosMode", true);
                        $toast(getI18N("posmode.yes.tip"), 3000);
                    }
                    pressCount.current = 0;
                }
            } else {
                pressCount.current = 0;
            }
        }
    }
    
    useEffect(() => {
        const winInfo = Dimensions.get("window");
        const infos = [];
        const precision = 8; //数字保留多少位小数
        const insInfo = ReceiptsPlus.getInstalledInfos();
        
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
        
        for(const key in insInfo){
            infos.push({
                itemKey: "installed." + key,
                itemValue: insInfo[key]
            });
        }
        
        infos.push({
            itemKey: "pixel.ratio",
            itemValue: $mathround(1.0 / PixelRatio.get(), precision)
        });
        
        infos.push({
            itemKey: "app.isPOSMode",
            itemValue: (appSettings.isUsePosMode ? "true" : "false")
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
                    <TouchableOpacity activeOpacity={0.6} key={vx.itemKey} onPress={onItemPress(ix)} style={[fxHC, ix ? styles.infoBox : pdVX]}>
                        <Text style={[fxG1, fs14]}>{vx.itemKey}</Text>
                        <Text style={fs14}>{vx.itemValue}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}