import {Component} from "react"
import Svg, { Path, LinearGradient, Stop } from "react-native-svg"

const DEFAULT_SIZE = 28

//标签页首页主页图标
class TabIconHome extends Component {
    render(){
        return (
            <Svg viewBox="0 0 1024 1024" 
                width={DEFAULT_SIZE} 
                height={DEFAULT_SIZE} 
                fill={this.props.color || "url(#IconLgStops)"}>
                <LinearGradient id="IconLgStops">
                    <Stop stopColor="#0cf" offset="0" />
                    <Stop stopColor="#09f" offset="1" />
                </LinearGradient>
                <Path d="M919.2 419.2L531.2 141.6c-11.2-8-26.4-8-36.8 0L104 419.2c-12.8 8.8-6.4 28.8 9.6 28.8H192v432c0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16V640h192v240c0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16V448h78.4c15.2 0 21.6-20 8.8-28.8z" />
            </Svg>
        )
    }
}

//标签页首页我的图标
class TabIconMine extends Component {
    render(){
        return (
            <Svg viewBox="0 0 1024 1024" 
                width={DEFAULT_SIZE} 
                height={DEFAULT_SIZE} 
                fill={this.props.color || "url(#IconLgStops)"}>
                <LinearGradient id="IconLgStops">
                    <Stop stopColor="#0cf" offset="0" />
                    <Stop stopColor="#09f" offset="1" />
                </LinearGradient>
                <Path d="M519.850667 627.029333c352.213333 0 348.672 220.928 348.672 220.928 2.666667 20.053333-11.605333 36.309333-31.936 36.309334H203.093333c-20.309333 0-35.392-16.490667-31.936-36.309334 0 0-3.52-220.928 348.693334-220.928zM519.765333 149.333333h220.48v220.48c0 121.770667-98.709333 220.48-220.48 220.48-121.770667 0-220.48-98.709333-220.48-220.48C299.285333 248.042667 397.994667 149.333333 519.765333 149.333333z" />
            </Svg>
        )
    }
}

export { TabIconHome, TabIconMine }