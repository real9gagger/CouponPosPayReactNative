import { Component } from "react"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"

const styles = StyleSheet.create({
    containerBox: {
        display: "flex",
        flexDirection: "row", 
        alignItems: "center", 
        paddingVertical: 5,
        overflow: "hidden"
    }
})

//单选框
class RadioBox extends Component {
    render(){
        if(this.props.visible === false){
            return null
        }
        
        const circleSize1 = (+this.props.size || 20)
        const circleSize2 = (circleSize1 * 0.45)
        const outerStyle = {
            display: "flex",
            flexDirection: "row", 
            alignItems: "center", 
            justifyContent: "center",
            width: circleSize1,
            height: circleSize1,
            borderRadius: circleSize1,
            borderColor: (this.props.checked ? appMainColor : "#A0A0A0"),
            borderWidth: 1.75
        }
        const innerStyle = {
            width: circleSize2,
            height: circleSize2,
            borderRadius: circleSize2,
            backgroundColor: outerStyle.borderColor,
            opacity: (this.props.checked ? 1 : 0.5)
        }
        const labelStyle = {
            display: (this.props.label ? "flex" : "none"),
            fontSize: (circleSize1 * 0.8),
            marginLeft: 5
        }
        
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={this.props.onPress} style={[styles.containerBox, this.props.style]}>
                <View style={outerStyle}><View style={innerStyle}></View></View>
                <Text style={labelStyle} numberOfLines={1}>{this.props.label}</Text>
            </TouchableOpacity>
        )
    }
}

export default RadioBox