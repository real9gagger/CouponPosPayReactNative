import { Component } from "react"
import LinearGradient from "react-native-linear-gradient"

const LG_BAR_COLORS_BLUE = ["#99F2F1", "#5AB2FF"]
const LG_BAR_COLORS_RED = ["#F77676", "#FB2D2D"]
const LG_BAR_START = {x:0, y:0.5}
const LG_BAR_END = {x:1, y:0.5}

//我的柱状条控件
class MyHistogramBar extends Component {
    constructor(props) {
        super(props)
    }
    
    render(){
        if(this.props.visiable === false || !this.props.barWidth){
            return null
        }
        
        const barStyle = {
            position: "absolute",
            top: 0,
            bottom: 0,
            zIndex: 0,
            opacity: 0.6,
            width: Math.abs(this.props.barWidth)
        }
        
        if(this.props.barWidth >= 0){//上升的
            barStyle.left = 0
            
            return (<LinearGradient 
                style={barStyle} 
                colors={LG_BAR_COLORS_BLUE} 
                start={LG_BAR_START} 
                end={LG_BAR_END} 
            />)
        } else {
            barStyle.right = 0
            
            return (<LinearGradient 
                style={barStyle} 
                colors={LG_BAR_COLORS_RED} 
                start={LG_BAR_END} 
                end={LG_BAR_START}
            />)
        }
    }
}

export default MyHistogramBar