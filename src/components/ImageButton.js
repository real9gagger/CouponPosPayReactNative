import { Component } from "react"
import { TouchableOpacity, Image } from "react-native"

//可以点击并触发事件的图片型按钮
class ImageButton extends Component {
    render(){
        return (
            <TouchableOpacity 
                activeOpacity={this.props.activeOpacity || 0.75}
                onPress={this.props.onPress}
                style={this.props.style}><Image style={whF} source={this.props.source} /></TouchableOpacity>
        )
    }
}

export default ImageButton