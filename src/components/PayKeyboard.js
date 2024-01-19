import { Component } from "react"
import { TouchableHighlight, View, Text, StyleSheet, Vibration } from "react-native"
import { getI18N } from "@/store/getter"
import PosPayIcon from "@/components/PosPayIcon"

const TAP_COLOR = "#f3f3f3"

const styles = StyleSheet.create({
    pkContainer: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#e9e9e9",
        padding: 9
    },
    pkFixed: {
        position: "absolute",
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 666
    },
    keyBox: {
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "#fff",
        height: (deviceDimensions.isLandscape ? 40 : 55),
        margin: 3,
        borderRadius: 8,
        elevation: 0
    },
    keyText: {
        fontSize: 24,
        color: "#000"
    },
    keyColumn: {
        width: "25%"
    },
    confirmBtn: {
        flex: 1,
        backgroundColor: appMainColor
    },
    confirmText: {
        fontSize: 18,
        color: "#fff"
    }
})

//用于输入数字密码的支付键盘
class PayKeyboard extends Component {
    constructor(props) {
        super(props)
        this.confirmText = getI18N("btn.confirm")
        this.inputText = ""
        this.callKP0 = this.__onKeyPress.bind(this, "0")
        this.callKP1 = this.__onKeyPress.bind(this, "1")
        this.callKP2 = this.__onKeyPress.bind(this, "2")
        this.callKP3 = this.__onKeyPress.bind(this, "3")
        this.callKP4 = this.__onKeyPress.bind(this, "4")
        this.callKP5 = this.__onKeyPress.bind(this, "5")
        this.callKP6 = this.__onKeyPress.bind(this, "6")
        this.callKP7 = this.__onKeyPress.bind(this, "7")
        this.callKP8 = this.__onKeyPress.bind(this, "8")
        this.callKP9 = this.__onKeyPress.bind(this, "9")
        this.callKP_ = this.__onKeyPress.bind(this, ".")
        this.callKPB = this.__onKeyPress.bind(this, "B")
        this.callKPD = this.__onKeyPress.bind(this, "D")
        this.callKPE = this.__onKeyPress.bind(this, "E")
        this.callKPY = this.__onKeyPress.bind(this, "Y")
    }
    
    __onKeyPress(num){
        Vibration.vibrate(50)
        switch(num){
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9": 
            case "0": 
                if(this.inputText === "0"){
                    this.inputText = num
                } else {
                    const idot = this.inputText.lastIndexOf(".") + 1
                    const prec = (+this.props.precision || 0) //保留多少位小数
                    if(idot > 0 && prec > 0 && this.inputText.length >= (idot + prec)){
                        return
                    } else {
                        this.inputText += num   
                    }
                }
                break
            case ".": //小数点
                if(this.inputText && +this.props.precision && !this.inputText.includes(num)){
                    this.inputText += num
                } else {
                    return
                }
                break
            case "B": //退格（backspace）
                if(this.inputText){
                    this.inputText = this.inputText.substr(0, this.inputText.length - 1)
                } else {
                    return
                }
                break
            case "D": //清空（delete）
                if(this.inputText){
                    this.inputText = ""
                } else {
                    return
                }
                break
            case "E": //退出（exit）
                if(this.props.onClose){
                    this.props.onClose()
                }
                return
            case "Y": //确认（yes）
                if(this.props.onConfirm){
                    this.props.onConfirm(this.inputText)
                }
                return
            default: return
        }
        
        if(this.props.onChange){
            this.props.onChange(this.inputText)
        }
    }
    
    render(){
        const isprec = !!this.props.precision
        const isfixed = !!this.props.fixed
        return (
            <View style={[styles.pkContainer, isfixed && styles.pkFixed]}>
                <View style={styles.keyColumn}>
                    <TouchableHighlight underlayColor={TAP_COLOR} activeOpacity={1} onPress={this.callKP7} style={styles.keyBox}><Text style={styles.keyText}>7</Text></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} activeOpacity={1} onPress={this.callKP4} style={styles.keyBox}><Text style={styles.keyText}>4</Text></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} activeOpacity={1} onPress={this.callKP1} style={styles.keyBox}><Text style={styles.keyText}>1</Text></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} activeOpacity={1} onPress={this.callKPE} style={styles.keyBox}><PosPayIcon name="collapse-keyboard" size={20} /></TouchableHighlight>
                </View>
                <View style={styles.keyColumn}>
                    <TouchableHighlight underlayColor={TAP_COLOR} activeOpacity={1} onPress={this.callKP8} style={styles.keyBox}><Text style={styles.keyText}>8</Text></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} activeOpacity={1} onPress={this.callKP5} style={styles.keyBox}><Text style={styles.keyText}>5</Text></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} activeOpacity={1} onPress={this.callKP2} style={styles.keyBox}><Text style={styles.keyText}>2</Text></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} activeOpacity={1} onPress={this.callKP0} style={styles.keyBox}><Text style={styles.keyText}>0</Text></TouchableHighlight>
                </View>
                <View style={styles.keyColumn}>
                    <TouchableHighlight underlayColor={TAP_COLOR} activeOpacity={1} onPress={this.callKP9} style={styles.keyBox}><Text style={styles.keyText}>9</Text></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} activeOpacity={1} onPress={this.callKP6} style={styles.keyBox}><Text style={styles.keyText}>6</Text></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} activeOpacity={1} onPress={this.callKP3} style={styles.keyBox}><Text style={styles.keyText}>3</Text></TouchableHighlight>
                    <TouchableHighlight underlayColor={isprec && TAP_COLOR} activeOpacity={1} onPress={this.callKP_} style={[styles.keyBox, !isprec && op05]}><Text style={styles.keyText}>.</Text></TouchableHighlight>
                </View>
                <View style={styles.keyColumn}>
                    <TouchableHighlight underlayColor={TAP_COLOR} activeOpacity={1} onPress={this.callKPB} style={styles.keyBox}><PosPayIcon name="pay-backspace" size={22} /></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} activeOpacity={1} onPress={this.callKPD} style={styles.keyBox}><PosPayIcon name="delete-x" size={22} /></TouchableHighlight>
                    <TouchableHighlight underlayColor={appLightColor} activeOpacity={1} onPress={this.callKPY} style={[styles.keyBox, styles.confirmBtn]}><Text style={styles.confirmText}>{this.confirmText}</Text></TouchableHighlight>
                </View>
            </View>
        )
    }
}

export default PayKeyboard