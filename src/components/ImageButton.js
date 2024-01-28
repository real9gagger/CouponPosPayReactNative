import { Component } from "react"
import { TouchableOpacity, Image } from "react-native"

//可以点击并触发事件的图片型按钮
class ImageButton extends Component {
    render(){
        if(this.props.visible === false){
            return null
        }
        
        return (
            <TouchableOpacity 
                activeOpacity={this.props.activeOpacity || 0.75}
                onPress={this.props.onPress}
                style={this.props.style}><Image style={whF} onError={this.props.onError} source={this.props.source} resizeMode="contain" /></TouchableOpacity>
        )
    }
}

export default ImageButton