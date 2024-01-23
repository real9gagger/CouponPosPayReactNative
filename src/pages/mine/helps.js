import { ScrollView, View, Text, StatusBar, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";

export default function MineHelps(props){
    const i18n = useI18N();
    
    return (
        <ScrollView>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <Text style={[pdX, taC, fs18]}>{i18n["nodata"]}</Text>
        </ScrollView>
    );
}