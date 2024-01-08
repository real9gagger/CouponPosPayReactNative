import { useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import AppPackageInfo from "@/modules/AppPackageInfo";

export default function MineIndex(props){
    return (
        <ScrollView>
            <Text style={fs20}>个人中心 {AppPackageInfo.getFullVersion()}</Text>
        </ScrollView>
    )
}