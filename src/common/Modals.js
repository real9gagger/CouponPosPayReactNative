import { 
    View, 
    Text, 
    Modal, 
    Easing, 
    Animated,
    StyleSheet, 
    TouchableOpacity,
    TouchableHighlight,
    DeviceEventEmitter,
    NativeEventEmitter } from "react-native"
import { Component } from "react"
import { getI18N } from "@/store/getter"
//import AppNavigationInfo from "@/modules/AppNavigationInfo"

const EVENT_ADD_DIALOG = "EVENT_ADD_DIALOG" //添加对话框
const EVENT_REMOVE_DIALOG = "EVENT_REMOVE_DIALOG" //移除对话框

const eventEmitter = DeviceEventEmitter || new NativeEventEmitter() // fix react native web does not support DeviceEventEmitter
 
const styles = StyleSheet.create({
    modalBg: {
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        flex: 1
    },
    alertBox: {
        position: "absolute", 
        left: "10%",
        top: "38%",
        zIndex: 1001,
        backgroundColor: "#fff",
        borderRadius: 6,
        width: "80%", 
        maxWidth: 600,
        overflow: "hidden"
    },
    alertTitle: {
        textAlign: "center",
        fontSize: 18,
        color: "#666",
        paddingTop: 15,
        marginBottom: -10
    },
    alertMsg: {
        textAlign: "center",
        fontSize: 18,
        color: "#000",
        paddingVertical: 30,
        paddingHorizontal: 15
    },
    btnBox: {
        display: "flex",
        flexDirection: "row"
    },
    okBtn: {
        padding: 15,
        borderTopColor: "#ddd",
        borderTopWidth: StyleSheet.hairlineWidth,
        flex: 1
    },
    okText: {
        textAlign: "center",
        fontSize: 18,
        color: appMainColor,
        fontWeight: "bold"
    },
    cancelBtn: {
        padding: 15,
        borderTopColor: "#ddd",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderRightColor: "#ddd",
        borderRightWidth: StyleSheet.hairlineWidth,
        flex: 1
    },
    cancelText: {
        textAlign: "center",
        fontSize: 18,
        color: "#333",
        fontWeight: "bold"
    }
})

export function showAlert(msg, title, btntxt){
    return new Promise(function (resolve, reject) {
        if((!msg) || (typeof msg !== "string")){
            reject(0)
        }
        
        if(!btntxt){
            btntxt = getI18N("btn.confirm")
        }
        
        const onDialogClose = () => {
            eventEmitter.emit(EVENT_REMOVE_DIALOG, 1) //1-点确定关闭的，2-点返回键或者遮罩层关闭的
        }
        const alertDialog = (
            <View style={styles.alertBox} onClose={resolve}>
                {title && <Text style={styles.alertTitle}>{title}</Text>}
                <Text style={styles.alertMsg}>{msg}</Text>
                <TouchableHighlight 
                    style={styles.okBtn} 
                    underlayColor="#eee" 
                    onPress={onDialogClose}><Text style={styles.okText}>{btntxt}</Text></TouchableHighlight>
            </View>
        )
        
        eventEmitter.emit(EVENT_ADD_DIALOG, alertDialog)
    })
}

export function showConfirm(msg, title, notxt, yestxt){
    return new Promise(function (resolve, reject) {
        if((!msg) || (typeof msg !== "string")){
            reject(0)
        }
        
        if(!notxt){
            notxt = getI18N("btn.cancel")
        }
        
        if(!yestxt){
            yestxt = getI18N("btn.confirm")
        }
        
        const onDialogCancel = () => {
            eventEmitter.emit(EVENT_REMOVE_DIALOG, 1) //0-表示确认，1-点取消按钮关闭的，2-点返回键或者遮罩层关闭的
        }
        
        const onDialogConfirm = () => {
            eventEmitter.emit(EVENT_REMOVE_DIALOG, 0) //0-表示确认， 1-点确定关闭的，2-点返回键或者遮罩层关闭的
            resolve(0)
        }
        
        const confirmDialog = (
            <View style={styles.alertBox} onClose={reject}>
                {title && <Text style={styles.alertTitle}>{title}</Text>}
                <Text style={styles.alertMsg}>{msg}</Text>
                <View style={styles.btnBox}>
                    <TouchableHighlight
                        style={styles.cancelBtn} 
                        underlayColor="#eee" 
                        onPress={onDialogCancel}><Text style={styles.cancelText}>{notxt}</Text></TouchableHighlight>
                    <TouchableHighlight
                        style={styles.okBtn} 
                        underlayColor="#eee" 
                        onPress={onDialogConfirm}><Text style={styles.okText}>{yestxt}</Text></TouchableHighlight>
                </View>
            </View>
        )
        
        eventEmitter.emit(EVENT_ADD_DIALOG, confirmDialog)
    })
}

export default class ModalProvider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShow: false,
            dialogComponent: null
        }
        this.addEvent = null
        this.removeEvent = null
    }
    
    componentDidMount() {
        this.addEvent && this.addEvent.remove()
        this.removeEvent && this.removeEvent.remove()
        this.addEvent = eventEmitter.addListener(EVENT_ADD_DIALOG, this.__addDialog.bind(this))
        this.removeEvent = eventEmitter.addListener(EVENT_REMOVE_DIALOG, this.__removeDialog.bind(this))
    }
    
    componentWillUnmount() {
        this.addEvent.remove()
        this.removeEvent.remove()
        this.addEvent = null
        this.removeEvent = null
    }
    
    //添加对话框
    __addDialog(children){
        if(!this.state.isShow){
            this.setState({
                dialogComponent: children,
                isShow: true
            })
            //AppNavigationInfo.setColor(0xFF999999);
        }
    }
    //移除对话框
    __removeDialog(code){
        if(this.state.isShow){
            if(+code && this.state.dialogComponent?.props?.onClose){
                this.state.dialogComponent.props.onClose(code)
            }
            this.setState({ 
                dialogComponent: null,
                isShow: false
            })
            //AppNavigationInfo.resetColor();
        }
    }
    
    render(){
        const callRemoveDialog = this.__removeDialog.bind(this, 2)
        return (
            <Modal
                visible={this.state.isShow} 
                presentationStyle="overFullScreen" 
                animationType="fade" 
                transparent={true} 
                statusBarTranslucent={true}
                hardwareAccelerated={true}
                onRequestClose={callRemoveDialog}>
                {this.state.dialogComponent}
                <TouchableOpacity activeOpacity={1} style={styles.modalBg} onPress={callRemoveDialog} />{/* 点我关闭层 */}
            </Modal>
        )
    }
}
