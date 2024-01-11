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
import PosPayIcon from "@/components/PosPayIcon"
//import AppNavigationInfo from "@/modules/AppNavigationInfo"

const EVENT_ADD_DIALOG = "EVENT_ADD_DIALOG" //添加对话框
const EVENT_REMOVE_DIALOG = "EVENT_REMOVE_DIALOG" //移除对话框
const MODAL_MAX_WIDTH = (deviceDimensions.screenWidth >= 500 ? 400 : Math.round(deviceDimensions.screenWidth * 0.8))

const eventEmitter = DeviceEventEmitter || new NativeEventEmitter() // fix react native web does not support DeviceEventEmitter

const styles = StyleSheet.create({
    modalBg1: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        flex: 1
    },
    modalBg2: {
        flex: 1
    },
    dialogBox: {
        position: "absolute", 
        left: (deviceDimensions.screenWidth - MODAL_MAX_WIDTH) / 2,
        top: 30, //暂时设置这个值，下述代码会调整的
        zIndex: 1001,
        backgroundColor: "#fff",
        borderRadius: 8,
        width: MODAL_MAX_WIDTH, 
        overflow: "hidden"
    },
    dialogTitle: {
        textAlign: "center",
        fontSize: 18,
        color: "#666",
        paddingTop: 15,
        marginBottom: -10
    },
    dialogMsg: {
        textAlign: "center",
        fontSize: 18,
        color: "#000",
        paddingVertical: 30,
        paddingHorizontal: 15
    },
    noTitle: {
        display: "none"
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
    },
    notifyBox: {
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center",
        padding: 15,
    },
    notifyText: {
        fontSize: 18,
        color: "#000",
        flex: 1,
        paddingLeft: 10
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
            <View dialogName="alert" onClose={resolve}>
                <Text style={title ? styles.dialogTitle : styles.noTitle}>{title}</Text>
                <Text style={styles.dialogMsg}>{msg}</Text>
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
            <View dialogName="confirm" onClose={reject}>
                <Text style={title ? styles.dialogTitle : styles.noTitle}>{title}</Text>
                <Text style={styles.dialogMsg}>{msg}</Text>
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

export function showNotify(msg, type, duration){
    return new Promise(function (resolve, reject) {
        if((!msg) || (typeof msg !== "string")){
            reject(0)
        }
        
        if((typeof duration !== "number") || duration <= 0){
            duration = 3000
        }
        
        const iconInfo = {}
        switch(type){
            case "success": 
                iconInfo.name = "success-solid"
                iconInfo.color = "#03C988"
                iconInfo.bgcol = "#e5faf3"
                break
            case "error":
                iconInfo.name = "error-solid"
                iconInfo.color = "#FF6D60"
                iconInfo.bgcol = "#fff0ef"
                break
            case "warning":
                iconInfo.name = "warning-solid"
                iconInfo.color = "#FFC436"
                iconInfo.bgcol = "#fff9ea"
                break
            default: // info
                iconInfo.name = "info-solid"
                iconInfo.color = "#30A2FF"
                iconInfo.bgcol = "#eaf6ff"
                break
        }
        
        const onDialogPress = () => {
            eventEmitter.emit(EVENT_REMOVE_DIALOG, 1) //0-表示确认，1-点取消按钮关闭的，2-点返回键或者遮罩层关闭的
        }
        
        const notifyDialog = (
            <TouchableHighlight 
                dialogName="notify"
                underlayColor="#fff"
                onClose={resolve} 
                iconColor={iconInfo.color} 
                bgColor={iconInfo.bgcol}
                duration={duration}
                onPress={onDialogPress}>
                <View style={styles.notifyBox}>
                    <PosPayIcon name={iconInfo.name} color={iconInfo.color} size={30} />
                    <Text style={styles.notifyText}>{msg}</Text>
                </View>
            </TouchableHighlight>
        )
        
        eventEmitter.emit(EVENT_ADD_DIALOG, notifyDialog)
    })
}

export default class ModalProvider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShow: false,
            dialogComponent: null,
            dialogTop: { top: 250 }
        }
        this.addEvent = null
        this.removeEvent = null
        this.callRemoveDialog = this.__removeDialog.bind(this, 2)
        this.callOnViewLayout = this.__onViewLayout.bind(this)
        this.timerID = 0
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
        clearTimeout(this.timerID)
    }
    
    //设置隐藏
    __setHide(){
        this.setState({ isShow: false })
    }
    //设置显示
    __setShow(){
        this.setState({ isShow: true })
    }
    //添加对话框
    __addDialog(children){
        if(!this.state.isShow){
            this.setState({
                dialogComponent: children,
                isShow: true
            })
            //AppNavigationInfo.setColor(0xFF999999)
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
            if(this.timerID){
                clearTimeout(this.timerID)
                this.timerID = 0
            }
            //AppNavigationInfo.resetColor()
        }
    }
    //布局完成事件
    __onViewLayout(evt){
        if(this.state.isShow){
            this.setState({
                dialogTop: { top: (deviceDimensions.screenHeight - evt.nativeEvent.layout.height) / 2 }
            })
        }
    }
    //通知滑入滑出动画
    __startSlideAni(){
        let slideDown = null
        let drt = +this.state.dialogComponent.props.duration || 120000
        
        if(this.state.isShow){
            slideDown = new Animated.Value(-300)
            Animated.timing(slideDown, {
                toValue: 0,
                duration: 400, 
                useNativeDriver: true
            }).start(() => {
                this.timerID = setTimeout(this.__setHide.bind(this), drt) //几秒后自动关闭
            })
        } else {
            slideDown = new Animated.Value(0)
            Animated.timing(slideDown, {
                toValue: -300,
                duration: 400, 
                useNativeDriver: true
            }).start(() => {
                this.__removeDialog(1)
            })
        }
        
        return {
            transform: [{ translateY:slideDown }],
            backgroundColor: this.state.dialogComponent.props.bgColor,
            borderColor: this.state.dialogComponent.props.iconColor,
            borderWidth: 1,
            elevation: 15
        }
    }
    
    render(){
        if(!this.state.dialogComponent){
            return null
        }
        
        const isNotify = (this.state.dialogComponent.props.dialogName === "notify")
        const notifyStyle = (isNotify ? this.__startSlideAni() : null)

        return (
            <Modal
                visible={this.state.isShow} 
                presentationStyle="overFullScreen" 
                animationType="fade" 
                transparent={true} 
                statusBarTranslucent={true}
                hardwareAccelerated={true}
                onRequestClose={this.callRemoveDialog}>
                {!isNotify ? 
                    <View style={[styles.dialogBox, this.state.dialogTop]} onLayout={this.callOnViewLayout}>{this.state.dialogComponent}</View>
                :
                    <Animated.View style={[styles.dialogBox, notifyStyle]}>{this.state.dialogComponent}</Animated.View>
                }
                <TouchableOpacity style={isNotify ? styles.modalBg2 : styles.modalBg1} activeOpacity={1} onPress={this.callRemoveDialog} />{/* 点我关闭层 */}
            </Modal>
        )
    }
}
