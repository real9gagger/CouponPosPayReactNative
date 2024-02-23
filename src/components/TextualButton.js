import { Component } from "react"
import { TouchableHighlight, TouchableOpacity, Text } from "react-native"

//可以点击并触发事件的文本型按钮（没有背景色和边框）
class TextualButton extends Component {
    render(){
        if(this.props.visible === false){
            return null
        }
        
        const boxStyle = { fontSize: 14 }
        const textStyle = { textAlign: "center" }
        const isStringText = (typeof this.props.children !== "object")
        
        if(this.props.style){
            if(Array.isArray(this.props.style)){
                this.props.style.forEach(vx => Object.assign(boxStyle, vx))
            } else if(this.props.style){
                Object.assign(boxStyle, this.props.style)
            }
        }
        
        if(isStringText){
            if(boxStyle.fontSize){
                textStyle.fontSize = boxStyle.fontSize
            }
            if(boxStyle.color){
                textStyle.color = boxStyle.color
            }
            if(boxStyle.lineHeight){
                textStyle.lineHeight = boxStyle.lineHeight
            }
            if(boxStyle.textAlign){
                textStyle.textAlign = boxStyle.textAlign
            }
        }
        
        if(this.props.underlayColor){
            return (
                <TouchableHighlight 
                    underlayColor={this.props.underlayColor}
                    onPress={this.props.onPress}
                    style={boxStyle}>{isStringText ? <Text style={textStyle}>{this.props.children}</Text> : this.props.children}</TouchableHighlight>
            )
        } else {
            return (
                <TouchableOpacity 
                    activeOpacity={this.props.activeOpacity || 0.3}
                    onPress={this.props.onPress}
                    style={boxStyle}>{isStringText ? <Text style={textStyle}>{this.props.children}</Text> : this.props.children}</TouchableOpacity>
            )
        }
    }
}

export default TextualButton