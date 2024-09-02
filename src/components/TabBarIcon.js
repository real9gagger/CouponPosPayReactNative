import { Component } from "react"
import { Text } from "react-native";
import Svg, { Path, LinearGradient, Stop } from "react-native-svg"

const DEFAULT_SIZE = 28
const redDotStyle = {
    position: "absolute",
    right: -6,
    top: 0,
    zIndex: 8,
    color: "#f00",
    fontSize: 8
};

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

//店铺图标
class TabIconShop extends Component {
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
                <Path d="M783.36 560.64c-60.928 0-113.664-37.376-135.68-90.112-22.016 52.736-74.752 90.112-135.68 90.112s-113.664-37.376-135.68-90.112C354.304 523.264 302.08 560.64 240.64 560.64c-81.408 0-146.944-65.536-146.944-146.432 0-29.184 8.704-56.32 23.552-79.36 18.432-49.152 54.272-138.752 89.6-179.712 0 0 22.528-20.48 45.056-22.528h520.192c22.528 2.048 45.056 22.528 45.056 22.528 34.816 41.472 71.168 130.56 89.6 179.712 14.848 23.04 23.552 50.176 23.552 79.36 0 80.896-65.536 146.432-146.944 146.432z m-39.424-259.072H291.328c-15.36 0-28.16 12.8-28.16 28.16s12.8 28.16 28.16 28.16h452.608c15.36 0 28.16-12.8 28.16-28.16s-12.8-28.16-28.16-28.16z m-367.104 233.984c27.136 46.08 77.824 77.312 135.168 77.312s108.032-31.232 135.168-77.312c27.136 45.568 77.312 76.288 134.144 76.288 19.968 0 38.912-3.584 56.32-10.24v223.744c0 36.864-30.208 67.072-67.584 67.072H253.952c-37.376 0-67.584-30.208-67.584-67.072v-223.744c17.408 6.656 36.352 10.24 56.32 10.24 57.344 0 107.008-30.72 134.144-76.288z" />
                {this.props.isShowRedDot ? <Text style={redDotStyle}>●</Text> : null}
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

export { TabIconHome, TabIconShop, TabIconMine }