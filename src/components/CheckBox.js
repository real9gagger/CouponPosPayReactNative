import { Component } from "react"
import Svg, { Path, Rect } from "react-native-svg"
import { Animated, Easing, TouchableOpacity, Text, StyleSheet } from "react-native"

const styles = StyleSheet.create({
    containerStyle: {
        display: "flex",
        flexDirection: "row",
        paddingVertical: 5,
        overflow: "hidden"
    }
})

//自定义的勾选框按钮
class CheckBox extends Component {
    constructor(props) {
        super(props)
        this.oldStatus = false
    }
    
    render(){
        const isCheckChanged = (this.oldStatus !== this.props.checked)
        const scaleOut = (isCheckChanged ? new Animated.Value(0.5) : 1) //如果使用动画，则启动逐渐放大效果
        const svgSize = (+this.props.size || 20)
        const fillColor = (this.props.checked ? appMainColor : "#BBB")
        const aniStyle = {
            transform: [{ scale: scaleOut }],
            width: svgSize,
            height: svgSize
        }
        const labelStyle = {
            display: (this.props.label ? "flex" : "none"),
            fontSize: (svgSize * 0.8),
            marginLeft: 5,
            marginTop: -1
        }
        
        if(isCheckChanged){
            //启用动画效果
            Animated.timing(scaleOut, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
                easing: Easing.elastic(1)
            }).start()
            this.oldStatus = !!this.props.checked
        }
        
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={this.props.onPress} style={[styles.containerStyle, this.props.style]}>
                <Animated.View style={aniStyle}>
                    <Svg
                        viewBox="0 0 1024 1024" 
                        width={svgSize} 
                        height={svgSize} 
                        fill={fillColor}>
                        <Rect x="190" y="270" fill="#FFF" width="640" height="455" />
                        <Path d="M85.333333 170.24C85.333333 123.392 123.648 85.333333 170.24 85.333333h683.52C900.608 85.333333 938.666667 123.648 938.666667 170.24v683.52c0 46.890667-38.314667 84.906667-84.906667 84.906667H170.24C123.392 938.666667 85.333333 900.352 85.333333 853.76V170.24z m131.328 366.72l154.624 160.042667a41.813333 41.813333 0 0 0 59.733334 0.554666l376.277333-370.346666a20.778667 20.778667 0 0 0-0.213333-29.781334l-3.157334-3.114666a24.192 24.192 0 0 0-31.872-1.152l-338.304 281.813333c-18.346667 15.274667-48.213333 15.957333-66.944 1.621333l-114.432-87.722666a20.736 20.736 0 0 0-29.610666 3.925333l-8.533334 11.648a26.538667 26.538667 0 0 0 2.432 32.512z" />
                    </Svg>
                </Animated.View>
                <Text style={labelStyle} numberOfLines={1}>{this.props.label}</Text>
            </TouchableOpacity>
        )
    }
}

export default CheckBox