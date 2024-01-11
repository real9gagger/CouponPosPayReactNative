import { useEffect, useRef, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { dispatchChangeLanguage } from "@/store/setter";
import { useI18N, getLanguageCode } from "@/store/getter";

export default function MineIndex(props){
    const [lgCode, setLgCode] = useState(getLanguageCode());
    const lgList = [
        {
            name: "日本語",
            code: "ja_JP"
        },
        {
            name: "简体中文",
            code: "zh_CN"
        },
        {
            name: "正體中文",
            code: "zh_TW"
        },
        {
            name: "English",
            code: "en_US"
        }
    ];
    
    return (
        <ScrollView style={[fxG1, bgFF]}>
            {
                lgList.map(vx => (
                    <View key={vx.code} style={[fxHC]}>
                        <Text>{vx.name}</Text>
                        <Text>{vx.code === lgCode ? "当前" : ""}</Text>
                    </View>
                ))
            }
        </ScrollView>
    )
}