import { Component } from "react"
import { Text, TouchableOpacity, ActivityIndicator } from "react-native"
import LinearGradient from "react-native-linear-gradient"

const DEFAULT_LG_COLORS = [appLightColor, appMainColor]
const TOP_TO_BOTTOM = [{x:0.5, y:0}, {x:0.5, y:1}]
const LEFT_TO_RIGHT = [{x:0, y:0.5}, {x:1, y:0.5}]

//带渐变色的按钮
class GradientButton extends Component {
    constructor(props) {
        super(props)
        this.loadingStyle = {
            marginRight: 8
        }
    }
    
    render(){
        const isDisable = !!this.props.disable
        const boxStyle = {
            height: 44,
            borderRadius: 8,
            overflow: "hidden"
        }
        const innerStyle = {
            display: "flex",
            flexDirection: "row", 
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            flex: 1,
            paddingHorizontal: 10,
            opacity: (isDisable ? 0.6 : 1)
        }
        const textStyle = {
            color: "#FFF",
            textAlign: "center",
            fontSize: 16
        }
        const isStringText = (typeof this.props.children !== "object")
        
        if(Array.isArray(this.props.style)){
            this.props.style.forEach(vx => Object.assign(boxStyle, vx))
        } else if(this.props.style){
            Object.assign(boxStyle, this.props.style)
        }
        
        if(boxStyle.fontSize){
            textStyle.fontSize = boxStyle.fontSize
        }
        if(boxStyle.color){
            textStyle.color = boxStyle.color
        }
        
        return (<TouchableOpacity activeOpacity={isDisable ? 1 : 0.7} style={boxStyle} onPress={isDisable ? null : this.props.onPress}>
            <LinearGradient 
                style={innerStyle} 
                colors={this.props.lgColors || DEFAULT_LG_COLORS} 
                start={!this.props.lgToRight ? TOP_TO_BOTTOM[0] : LEFT_TO_RIGHT[0]}
                end={!this.props.lgToRight ? TOP_TO_BOTTOM[1] : LEFT_TO_RIGHT[1]}>
                {this.props.showLoading && <ActivityIndicator color={textStyle.color} style={this.loadingStyle} />}
                {isStringText ? <Text style={textStyle}>{this.props.children}</Text> : this.props.children}
            </LinearGradient>
        </TouchableOpacity>)
    }
}

export default GradientButton