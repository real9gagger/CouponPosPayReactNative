import { Component } from "react"
import Svg, { Circle, Polyline } from "react-native-svg"
import { Animated, Easing } from "react-native"

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

//circle tick 带有动画效果的打钩，钩被圆圈包围。
class CircleTick extends Component {
    constructor(props) {
        super(props)
        this.svgCircleRef = null
        this.svgPolylineRef = null
        this.herAnimation = null
        this.circleStyle = {}
        
        this.callSetCircleDashOffset = this.__setCircleDashOffset.bind(this)
        this.callSetPolylineDashOffset = this.__setPolylineDashOffset.bind(this)
        this.callGetCircleRef = this.__getCircleRef.bind(this)
        this.callGetPolylineRef = this.__getPolylineRef.bind(this)
    }
    
    __getPolylineRef(ref){
        this.svgPolylineRef = ref
    }
    
    __getCircleRef(ref){
        this.svgCircleRef = ref
    }
    
    __setPolylineDashOffset(evt){
        if(this.svgPolylineRef){
            this.svgPolylineRef.setNativeProps({ strokeDashoffset: evt.value })
        }
    }
    
    __setCircleDashOffset(evt){
        if(this.svgCircleRef){
            this.svgCircleRef.setNativeProps({ strokeDashoffset: evt.value })
        }
    }
    
    __resetAnimations(){
        if(this.herAnimation){
            this.herAnimation.stop()
            this.herAnimation = null
        }
    }
    
    componentWillUnmount(){
        this.__resetAnimations()
    }
    
    render(){
        
        this.__resetAnimations() //停止动画
        
        if(this.props.progressing !== 1 && this.props.progressing !== 2){ //进展情况。0-无状态，1-正在处理中...，2-处理完成
            return null
        }
        
        const strokeColor = (this.props.color || appMainColor)
        
        if(this.props.progressing === 1) {//正在处理，启动类似正在加载的动画效果
            const loopingAV = new Animated.Value(0)
            const fadeinAV = new Animated.Value(0)
            
            this.circleStyle.transform = [
                { translateX: 100 }, /* 设置 transform origin！viewBox 宽度一半 */
                { translateY: 100 }, /* 设置 transform origin！viewBox 高度一半 */
                { rotateZ: loopingAV.interpolate({
                    inputRange: [0, 360],
                    outputRange: ["0deg", "360deg"]
                })},
                { translateX: -100 }, /* 设置 transform origin！viewBox 宽度一半的负值 */
                { translateY: -100 }, /* 设置 transform origin！viewBox 高度一半的负值 */
            ]
            this.circleStyle.opacity = fadeinAV //渐渐显示动画
            
            this.herAnimation = Animated.parallel([
                Animated.timing(fadeinAV, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true
                }), //淡入动画
                Animated.loop(
                    Animated.timing(loopingAV, {
                        toValue: 360,
                        duration: 500,
                        useNativeDriver: true,
                        easing: Easing.linear
                    })
                ) //正在加载动画
            ])
            
            this.herAnimation.start()
        } else {//处理完成，显示打钩动画效果
            const circlingAV = new Animated.Value(400)
            const circlingListenerID = circlingAV.addListener(this.callSetCircleDashOffset)
            
            const tickingAV = new Animated.Value(400)
            const tickingListenerID = tickingAV.addListener(this.callSetPolylineDashOffset)
            
            this.herAnimation = Animated.sequence([
                Animated.timing(circlingAV, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true
                }),
                Animated.timing(tickingAV, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true
                })
            ])
            
            this.herAnimation.start(() => {
                circlingAV.removeListener(circlingListenerID)
                tickingAV.removeListener(tickingListenerID)
            })
        }
        
        return (
            <Svg
                viewBox="0 0 200 200" 
                width={this.props.size} 
                height={this.props.size}
                style={this.props.style}
                fill="none">
                <AnimatedCircle style={this.circleStyle}
                    stroke="#EEE"
                    cx="100"
                    cy="100"
                    r="90"
                    strokeWidth="10"
                    fill="none" />
                <AnimatedCircle stroke={strokeColor} ref={this.callGetCircleRef} style={this.circleStyle}
                    cx="100"
                    cy="100"
                    r="90"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="600"
                    strokeDashoffset="400"
                    fill="none" />
                <Polyline stroke={strokeColor} ref={this.callGetPolylineRef}
                    points="50,95 90,130 150,70" 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    strokeDasharray="400"
                    strokeDashoffset="400" />
            </Svg>)
    }
}

export default CircleTick