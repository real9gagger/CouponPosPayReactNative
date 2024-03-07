import { useEffect, useState } from "react";
import { View, Text, TextInput, StatusBar, Keyboard, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import GradientButton from "@/components/GradientButton";

const CLEAR_BUTTON_LG = ["#ccc", "#aaa"];
const styles = StyleSheet.create({
    inputBox: {
        backgroundColor: "#f0f0f0",
        borderTopColor: "#999",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#999",
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 10,
        paddingVertical: 15,
        fontSize: 16
    },
    maxBox: {
        position: "absolute",
        right: 10,
        bottom: 5,
        zIndex: 1,
        fontSize: 10,
        color: "#999"
    },
    btnDone: {
        flexGrow: 1,
        flexBasis: 0,
        marginLeft: 15
    }
});

//文本输入器
export default function IndexTextInputer(props){
    const maxLen = 100;
    const i18n = useI18N();
    const [txt, setTxt] = useState(null);
    
    const clearText = () => {
        setTxt(null);
    }
    
    const doneText = () => {
        props.route.params?.onGoBack(txt || "");
        Keyboard.dismiss();
        props.navigation.goBack();
    }
    
    useEffect(() => {
       setTxt(props.route.params.defaultText);
    }, []);
    
    return (
        <View style={pgFF}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View>
                <TextInput
                    style={styles.inputBox}
                    defaultValue={txt}
                    placeholder={i18n["input.text.tip"]}
                    autoFocus={true}
                    multiline={true}
                    maxLength={maxLen}
                    onChangeText={setTxt}
                />
                <Text style={styles.maxBox}>{maxLen - (txt ? txt.length : 0)}</Text>
            </View>
            <View style={fxG1}>{/* 占位专用 */}</View>
            <View style={[fxR, pdX]}>
                <GradientButton style={fxG1} onPress={clearText} lgColors={CLEAR_BUTTON_LG}>{i18n["btn.clear"]}</GradientButton>
                <GradientButton style={styles.btnDone} onPress={doneText}>{i18n["btn.done"]}</GradientButton>
            </View>
        </View>
    );
}