import { Component } from "react"
import { View, Text, Modal, Animated, Easing, StyleSheet, TouchableOpacity } from "react-native"
import Svg, { Path } from "react-native-svg"

const START_BG_INDEX = 0
const END_BG_INDEX = 100
const START_TRANS_Y = 600 /* 建议等于屏幕高度 */
const END_TRANS_Y = 50
const ANIMATION_DURATION = 300

const styles = StyleSheet.create({
    popupTitleBox:{//标题框
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 15
    },
    popupTopLine: {//小横线
        borderTopColor: "#ccc",
        borderTopWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 15
    },
    popupBottomTips: {//底部小提示
        textAlign: "center",
        color: "#999",
        paddingVertical: 15,
        fontSize: 12,
        borderTopColor: "#ccc",
        borderTopWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 15
    }
})

class PopupX extends Component {
    state = {
        isShowing: false
    }
    
    __getBgColorWithAnimation(isFadeIn){
        const bgFadeIn = new Animated.Value(START_BG_INDEX) //背景色渐显
        
        setTimeout(function(){
            Animated.timing(bgFadeIn, {
                toValue: END_BG_INDEX,
                duration: ANIMATION_DURATION,
                useNativeDriver: false
            }).start() //启用背景色【渐显、渐隐】动画效果
        }, 0) //延迟一点时间，让 “return” 先执行
        
        return bgFadeIn.interpolate({
            inputRange: [START_BG_INDEX, END_BG_INDEX],
            outputRange: (isFadeIn ? ["#00000000",  "#00000088"] : ["#00000088",  "#00000000"]) //是否渐显
        })
    }
    
    __getTranslateWithAnimation(isSlideUp){
        const tySlideUp = new Animated.Value(isSlideUp ? START_TRANS_Y : END_TRANS_Y) //是否向上滑出
        
        setTimeout(function(){
            Animated.timing(tySlideUp, {
                toValue: (isSlideUp ? END_TRANS_Y : START_TRANS_Y),
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
                easing: Easing.elastic(1)
            }).start() //启用向上【滑出、滑入】动画效果
        }, 0) //延迟一点时间，让 “return” 先执行
        
        return [{ translateY: tySlideUp }]
    }
    
    render() {
        const isFirstShow = (this.state.isShowing !== true && this.props.showMe === true) //首次显示
        const isFirstHide = (this.state.isShowing === true && this.props.showMe !== true) //显示后隐藏
        const containerBox = {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
            backgroundColor: "#00000088"
        }
        const contentBox = {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "#fff",
            paddingBottom: END_TRANS_Y, //底部留白空间
            transform: [{ translateY: END_TRANS_Y }]
        }
        
        if(isFirstShow){
            containerBox.backgroundColor = this.__getBgColorWithAnimation(true)
            contentBox.transform = this.__getTranslateWithAnimation(true)
            this.state.isShowing = true
        } else if(isFirstHide){
            containerBox.backgroundColor = this.__getBgColorWithAnimation(false)
            contentBox.transform = this.__getTranslateWithAnimation(false)
            setTimeout(() => this.setState({ isShowing: false }), ANIMATION_DURATION) //等动画执行完成后再隐藏弹窗
        }
        
        return (
            <Modal 
                visible={this.state.isShowing} 
                presentationStyle="overFullScreen" 
                animationType="none" 
                transparent={true} 
                statusBarTranslucent={true}
                hardwareAccelerated={true}
                onRequestClose={this.props.onClose}>
                <Animated.View style={containerBox}>
                    <TouchableOpacity activeOpacity={1} style={fxG1} onPress={this.props.onClose}>{/* 点我关闭层 */}</TouchableOpacity>
                    <Animated.View style={contentBox}>
                        <View style={styles.popupTitleBox}>
                            <Text style={[fs18, fxG1, fwB]}>{this.props.title}</Text>
                            <Svg viewBox="0 0 32 32" fill="#999" width={22} height={22} onPress={this.props.onClose}>
                                <Path d="M24.416 6.4l1.184 1.184-8.384 8.416 8.384 8.384-1.184 1.216-8.416-8.416-8.384 8.416-1.216-1.216 8.416-8.384-8.416-8.416 1.216-1.184 8.384 8.384z" />
                            </Svg>
                        </View>
                        <View style={styles.popupTopLine}>{/* 小横线 */}</View>
                        {this.props.children}
                        {this.props.tips && <Text style={styles.popupBottomTips}>{this.props.tips}</Text>}
                    </Animated.View>
                </Animated.View>
            </Modal>
        )
    }
}

export default PopupX