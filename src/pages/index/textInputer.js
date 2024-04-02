import { useState } from "react";
import { View, Text, TextInput, StatusBar, Keyboard, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import GradientButton from "@/components/GradientButton";

const CLEAR_BUTTON_LG = ["#ccc", "#aaa"];
const styles = StyleSheet.create({
    inputBox: {
        backgroundColor: "#fff",
        borderTopColor: "#ccc",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomColor: appMainColor,
        borderBottomWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 15,
        fontSize: 16
    },
    maxBox: {
        position: "absolute",
        right: 5,
        bottom: 5,
        zIndex: 1,
        fontSize: 10,
        color: "#666"
    },
    btnDone: {
        flexGrow: 1,
        flexBasis: 0,
        marginLeft: 15
    }
});

//文本输入器
export default function IndexTextInputer(props){
    const maxLen = 120;
    const i18n = useI18N();
    const [txt, setTxt] = useState(props.route.params.defaultText);
    
    const clearText = () => {
        setTxt(null);
    }
    
    const doneText = () => {
        props.route.params?.onGoBack(txt || "");
        Keyboard.dismiss();
        props.navigation.goBack();
    }
    
    return (
        <View style={pgEE}>
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
                    keyboardType={!props.route.params.isNumberPad ? "default" : "number-pad"}
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