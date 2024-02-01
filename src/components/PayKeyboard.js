import { Component } from "react"
import { TouchableHighlight, View, Text, StyleSheet, Vibration } from "react-native"
import PosPayIcon from "@/components/PosPayIcon"

const TAP_COLOR = "#f0f0f0"
const REGEXP_ZEROS = /^0*$/
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
        height: 50, /* 改了这个值，记得修改 settingIcon 的 right/bottom 值 */
        margin: 2, /* 改了这个值，记得修改 settingIcon 的 right/bottom 值 */
        borderRadius: 8,
        elevation: 0
    },
    keyText: {
        fontSize: 24,
        color: "#333"
    },
    keyColumn: {
        width: "25%"
    },
    confirmBtn: {
        flex: 1,
        backgroundColor: appMainColor
    },
    settingIcon: {
        position: "absolute",
        right: 2 + 5, /* 外边距 + 调整值 */
        bottom: 50 + 2 - 12 - 5, /* 按钮高度 + 外边距 - 图标尺寸 - 调整值 */
        zIndex: 2
    }
})

//用于输入数字密码的支付键盘
class PayKeyboard extends Component {
    constructor(props) {
        super(props)
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
        this.callKP_ = this.__onKeyPress.bind(this, "-")
        this.callKP$ = this.__onKeyPress.bind(this, ".")
        this.callKPO = this.__onKeyPress.bind(this, "O")
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
                if(REGEXP_ZEROS.test(this.inputText)){
                    this.inputText = num
                } else {
                    const idot = this.inputText.lastIndexOf(".") + 1
                    const prec = (+this.props.precision || 0) //保留多少位小数
                    const maxlen = (+this.props.maxlength || 20) //保留多少位小数
                    if(idot > 0 && prec > 0 && this.inputText.length >= (idot + prec) || this.inputText.length > maxlen){
                        return
                    } else {
                        this.inputText += num   
                    }
                }
                break
            case "-":
                this.inputText += num
                break
            case ".": //小数点
                if(this.inputText && +this.props.precision && !this.inputText.includes(num)){
                    this.inputText += num
                } else {
                    return
                }
                break
            case "O":
                if(!REGEXP_ZEROS.test(this.inputText)){
                    this.inputText += "00"
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
                    this.props.onClose(false)
                }
                this.inputText = ""
                return
            case "Y": //确认（yes）
                if(this.props.onConfirm){
                    this.props.onConfirm(this.inputText)
                }
                this.inputText = ""
                return
            default: return
        }
        
        if(this.props.onChange){
            this.props.onChange(this.inputText)
        }
    }
    
    initiText(txt){
        this.inputText = (txt ? txt.toString() : "")
    }
    
    clearText(){
        this.inputText = ""
    }
    
    render(){
        if(this.props.visible === false){
            return null
        }
        
        const isPrec = !!this.props.precision
        const isFixed = !!this.props.fixed
        const isPhoneMode = !!this.props.phoneMode
        const isShowSetting = !!this.props.onSetting
        
        return (
            <View style={[styles.pkContainer, isFixed && styles.pkFixed]}>
                <View style={styles.keyColumn}>
                    <TouchableHighlight underlayColor={TAP_COLOR} onPress={this.callKP7} style={styles.keyBox}><Text style={styles.keyText}>7</Text></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} onPress={this.callKP4} style={styles.keyBox}><Text style={styles.keyText}>4</Text></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} onPress={this.callKP1} style={styles.keyBox}><Text style={styles.keyText}>1</Text></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} onPress={this.callKPE} style={styles.keyBox} onLongPress={this.props.onSetting}><PosPayIcon name="collapse-keyboard" size={20} /></TouchableHighlight>
                    {isShowSetting && <PosPayIcon name="system-setting" color="#aaa" size={12} style={styles.settingIcon} />}
                </View>
                <View style={styles.keyColumn}>
                    <TouchableHighlight underlayColor={TAP_COLOR} onPress={this.callKP8} style={styles.keyBox}><Text style={styles.keyText}>8</Text></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} onPress={this.callKP5} style={styles.keyBox}><Text style={styles.keyText}>5</Text></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} onPress={this.callKP2} style={styles.keyBox}><Text style={styles.keyText}>2</Text></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} onPress={this.callKP0} style={styles.keyBox}><Text style={styles.keyText}>0</Text></TouchableHighlight>
                </View>
                <View style={styles.keyColumn}>
                    <TouchableHighlight underlayColor={TAP_COLOR} onPress={this.callKP9} style={styles.keyBox}><Text style={styles.keyText}>9</Text></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} onPress={this.callKP6} style={styles.keyBox}><Text style={styles.keyText}>6</Text></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} onPress={this.callKP3} style={styles.keyBox}><Text style={styles.keyText}>3</Text></TouchableHighlight>
                    {isPhoneMode ? 
                        <TouchableHighlight underlayColor={TAP_COLOR} onPress={this.callKP_} style={styles.keyBox}><Text style={styles.keyText}>-</Text></TouchableHighlight>
                    : (isPrec ?
                        <TouchableHighlight underlayColor={TAP_COLOR} onPress={this.callKP$} style={styles.keyBox}><Text style={styles.keyText}>.</Text></TouchableHighlight>
                    : /* 非手机号码模式且无小数点时，则默认可以一次输入两个 0 */
                        <TouchableHighlight underlayColor={TAP_COLOR} onPress={this.callKPO} style={styles.keyBox}><Text style={styles.keyText}>00</Text></TouchableHighlight>
                    )}
                </View>
                <View style={styles.keyColumn}>
                    <TouchableHighlight underlayColor={TAP_COLOR} onPress={this.callKPB} style={styles.keyBox}><PosPayIcon name="pay-backspace" size={22} /></TouchableHighlight>
                    <TouchableHighlight underlayColor={TAP_COLOR} onPress={this.callKPD} style={styles.keyBox}><PosPayIcon name="delete-x" size={22} /></TouchableHighlight>
                    <TouchableHighlight underlayColor={appLightColor} onPress={this.callKPY} style={[styles.keyBox, styles.confirmBtn]}><PosPayIcon name="check-confirm" color="#fff" size={22} /></TouchableHighlight>
                </View>
            </View>
        )
    }
}

export default PayKeyboard