import { TouchableHighlight, ScrollView, View, Text, StatusBar, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import PosPayIcon from "@/components/PosPayIcon";

const styles = StyleSheet.create({
    blankBox: {
        height: 10
    },
    boxDivider: {
        borderTopColor: "#ddd",
        borderTopWidth: StyleSheet.hairlineWidth
    }
})

const settingList = [
    {
        pageName: "语言设置", //页面名称
        i18nLabel: "language.header",
        i18nDesc: "app.lgname" //描述性文本
    }
];

if(!runtimeEnvironment.isProduction){
    settingList.push({
        pageName: "测试中心",
        i18nLabel: "test.centre",
        i18nDesc: "test.debug.available"
    });
}

export default function SettingIndex(props){
    const i18n = useI18N();
    const onItemPress = (pageName) => {
        props.navigation.navigate(pageName)
    }
    
    return (
        <ScrollView>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View style={styles.blankBox}>{/*占位专用*/}</View>
            {settingList.map((vx, ix) => (
                <TouchableHighlight key={vx.pageName} style={[pdHX, bgFF]} underlayColor="#eee" onPress={() => onItemPress(vx.pageName)}>
                    <View style={[pdVX, fxHC, ix && styles.boxDivider]}>
                        <Text style={[fs18, fxG1]}>{i18n[vx.i18nLabel]}</Text>
                        <Text style={!vx.i18nDesc ? dpN : [fs14, tc99]}>{i18n[vx.i18nDesc]}</Text>
                        <PosPayIcon name="right-arrow" color="#aaa" size={22} />
                    </View>
                </TouchableHighlight>
            ))}
        </ScrollView>
    )
}