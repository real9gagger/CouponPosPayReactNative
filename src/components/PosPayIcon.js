import {Component} from "react"
import Svg, { Path } from "react-native-svg"

//WiFi已连接的图标
const IconWiFiConnected = (props) => {
    return (
        <Svg {...props}>
            <Path d="M512 810.24c-12.074667 0-21.12-2.986667-30.165333-12.074667s-12.074667-18.090667-12.074667-30.165333c0-6.016 0-12.074667 2.986667-15.104s3.029333-9.045333 9.088-15.061333l6.016-6.058667c3.029333-2.986667 3.029333-2.986667 9.045333-2.986667 3.029333-2.986667 3.029333-2.986667 9.088-2.986666 15.061333-3.072 27.136 2.986667 36.181333 12.032 2.986667 2.986667 9.045333 9.045333 9.045334 15.061333 2.986667 3.029333 2.986667 9.088 2.986666 15.104 0 12.074667-2.986667 21.12-12.032 30.165333s-18.090667 12.074667-30.165333 12.074667zM632.661333 689.578667c-12.032 0-21.12-3.029333-30.165333-12.074667-51.285333-51.285333-129.706667-51.285333-180.992 0-18.133333 18.090667-42.24 18.090667-60.373333 0-18.090667-18.133333-18.090667-42.24 0-60.373333 84.48-84.48 217.258667-84.48 301.738666 0 18.090667 18.133333 18.090667 42.24 0 60.373333-9.088 9.045333-18.133333 12.074667-30.208 12.074667z" />
            <Path d="M753.365333 568.874667c-12.074667 0-21.12-2.986667-30.165333-12.074667a296.832 296.832 0 0 0-422.4 0c-18.090667 18.133333-42.24 18.133333-60.330667 0s-18.090667-42.24 0-60.330667a382.421333 382.421333 0 0 1 543.061334 0c18.090667 18.090667 18.090667 42.24 0 60.330667-9.045333 9.045333-18.090667 12.074667-30.165334 12.074667z" />
            <Path d="M874.026667 448.213333c-12.074667 0-21.12-3.029333-30.165334-12.074666a467.968 467.968 0 0 0-663.722666 0c-18.090667 18.090667-42.24 18.090667-60.330667 0s-18.133333-42.24 0-60.330667a553.557333 553.557333 0 0 1 784.384 0c18.133333 18.090667 18.133333 42.24 0 60.330667-9.045333 9.045333-18.090667 12.074667-30.165333 12.074666z" />
        </Svg>
    )
}
//消息图标
const IconMessageCircle = (props) => {
    return (
        <Svg {...props}>
            <Path d="M207.36 476.16a66.56 64 0 1 0 133.12 0 66.56 64 0 1 0-133.12 0Z" />
            <Path d="M455.68 476.16a66.56 64 0 1 0 133.12 0 66.56 64 0 1 0-133.12 0Z" />
            <Path d="M701.44 476.16a66.56 64 0 1 0 133.12 0 66.56 64 0 1 0-133.12 0Z" />
            <Path d="M893.44 983.04L670.72 870.4c-51.2 15.36-104.96 20.48-158.72 20.48-281.6 0-512-194.56-512-432.64C0 220.16 230.4 25.6 512 25.6s512 194.56 512 432.64c0 133.12-69.12 253.44-189.44 337.92l58.88 186.88z m-217.6-168.96l130.56 66.56-33.28-107.52 20.48-12.8c112.64-71.68 179.2-181.76 179.2-302.08C972.8 248.32 765.44 76.8 512 76.8S51.2 248.32 51.2 458.24s207.36 381.44 460.8 381.44c51.2 0 99.84-7.68 145.92-20.48l17.92-5.12z" />
        </Svg>
    )
}
//向右的双箭头
const IconRightDoubleArrow = (props) => {
    return (
        <Svg {...props}>
            <Path d="M556.8 535.893333L170.666667 149.76c-13.226667-13.226667-13.226667-34.986667 0-48.213333 13.226667-13.226667 34.986667-13.226667 48.213333 0l386.133333 386.133333c13.226667 13.226667 13.226667 34.986667 0 48.213333-13.226667 13.226667-34.986667 13.226667-48.213333 0z" />
            <Path d="M170.666667 873.813333l386.133333-386.133333c13.226667-13.226667 34.986667-13.226667 48.213333 0 13.226667 13.226667 13.226667 34.986667 0 48.213333l-386.133333 386.133334c-13.226667 13.226667-34.986667 13.226667-48.213333 0a33.493333 33.493333 0 0 1 0-48.213334z" />
            <Path d="M825.173333 536.32l-386.133333-386.133333c-13.226667-13.226667-13.226667-34.986667 0-48.213334 13.226667-13.226667 34.986667-13.226667 48.213333 0l386.133334 386.133334c13.226667 13.226667 13.226667 34.986667 0 48.213333a33.493333 33.493333 0 0 1-48.213334 0z" />
            <Path d="M439.04 874.24l386.133333-386.133333c13.226667-13.226667 34.986667-13.226667 48.213334 0 13.226667 13.226667 13.226667 34.986667 0 48.213333l-386.133334 386.133333c-13.226667 13.226667-34.986667 13.226667-48.213333 0-13.226667-13.226667-13.226667-34.56 0-48.213333z" />
        </Svg>
    )
}
//加号、放大
const IconZoomPlus = (props) => {
    //参见：https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.34c13a81XdzlNq&cid=4135
    return (
        <Svg {...props}>
            <Path d="M896 469.333333H554.666667V128a42.666667 42.666667 0 0 0-85.333334 0v341.333333H128a42.666667 42.666667 0 0 0 0 85.333334h341.333333v341.333333a42.666667 42.666667 0 0 0 85.333334 0V554.666667h341.333333a42.666667 42.666667 0 0 0 0-85.333334z" />
        </Svg>
    )
}
//减号，缩小
const IconZoomMinus = (props) => {
    return (
        <Svg {...props}>
            <Path d="M896 469.333333H128a42.666667 42.666667 0 0 0 0 85.333334h768a42.666667 42.666667 0 0 0 0-85.333334z"  />
        </Svg>
    )
}
//我的位置
const IconMyLocation = (props) => {
    return (
        <Svg {...props}>
            <Path d="M955.762005 324.560549C852.258155 78.416352 568.697746-37.129497 322.553549 66.374353S-39.136497 453.438611 64.51071 699.582808s387.064259 361.690046 633.208456 258.042839c179.339773-75.405852 296.032479-251.01834 296.032479-445.553968 0-64.51071-12.902142-128.304634-37.98964-187.51113z m-164.00056 467.344253c-154.538989 154.538989-404.9839 154.395632-559.52289-0.143357S77.699566 386.777544 232.238555 232.238555s404.9839-154.395632 559.52289 0.143357c74.115638 74.115638 115.832563 174.752345 115.832563 279.689767 0.286714 104.937421-41.430211 205.717486-115.832563 279.833123z" />
            <Path d="M993.608288 510.351393v-25.660927c0-13.762285-11.181856-24.944141-24.944141-24.944141H777.139017c-13.762285 0-24.944141 11.181856-25.087498 24.944141V510.351393c0 13.762285 11.181856 24.944141 24.944141 24.944141h191.52513c13.905642 0 25.087498-11.181856 25.087498-24.944141zM271.51841 523.396892v-25.660927c0-13.762285-11.181856-24.944141-24.944141-24.944141H55.192496c-13.762285 0-24.944141 11.181856-24.944141 24.944141v25.660927c0 13.762285 11.181856 24.944141 24.944141 24.944141H246.574269c13.762285 0 24.944141-11.181856 24.944141-24.944141zM499.026179 993.751645H524.687106c13.762285 0 24.944141-11.181856 24.944141-24.944141V777.282374c0-13.762285-11.181856-24.944141-24.944141-24.944141h-25.660927c-13.762285 0-24.944141 11.181856-24.944141 24.944141v191.381773c0.143357 13.762285 11.181856 24.944141 24.944141 25.087498zM499.026179 271.661767H524.687106c13.762285 0 24.944141-11.181856 24.944141-24.944141V55.335853c0-13.762285-11.181856-24.944141-24.944141-24.944141h-25.660927c-13.762285 0-24.944141 11.181856-24.944141 24.944141v191.381773c0.143357 13.762285 11.181856 24.944141 24.944141 24.944141zM581.743245 482.540109c-16.342713-38.706426-60.926781-56.912782-99.633207-40.570068-38.706426 16.342713-56.912782 60.926781-40.570069 99.633207 16.342713 38.706426 60.926781 56.912782 99.633208 40.570069 28.241355-11.898642 46.591068-39.423212 46.591068-70.101638 0-10.178356-2.007-20.213356-6.021-29.53157z" />
        </Svg>
    )
}
//实心成功图标：https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.3d393a81H4DoVJ&cid=16957
const IconSuccessSolid = (props) => {
    return (
        <Svg {...props}>
            <Path d="M512 85.333333c235.637333 0 426.666667 191.029333 426.666667 426.666667S747.637333 938.666667 512 938.666667 85.333333 747.637333 85.333333 512 276.362667 85.333333 512 85.333333z m182.613333 297.354667a32 32 0 0 0-45.258666 0.032L458.922667 573.44l-84.341334-83.989333a32 32 0 0 0-45.162666 45.344l106.986666 106.549333a32 32 0 0 0 45.226667-0.064l213.013333-213.333333a32 32 0 0 0-0.032-45.258667z" />
        </Svg>
    )
}
//实心错误图标：https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.3d393a81H4DoVJ&cid=16957
const IconErrorSolid = (props) => {
    return (
        <Svg {...props}>
            <Path d="M512 85.333333c235.637333 0 426.666667 191.029333 426.666667 426.666667S747.637333 938.666667 512 938.666667 85.333333 747.637333 85.333333 512 276.362667 85.333333 512 85.333333z m-86.474667 296.96a30.570667 30.570667 0 1 0-43.232 43.232L468.768 512l-86.474667 86.474667a30.570667 30.570667 0 1 0 43.232 43.232L512 555.232l86.474667 86.474667a30.570667 30.570667 0 1 0 43.232-43.232L555.232 512l86.474667-86.474667a30.570667 30.570667 0 1 0-43.232-43.232L512 468.768z" />
        </Svg>
    )
}
//实心警告图标：https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.3d393a81H4DoVJ&cid=16957
const IconWarningSolid = (props) => {
    return (
        <Svg {...props}>
            <Path d="M512 85.333333c235.637333 0 426.666667 191.029333 426.666667 426.666667S747.637333 938.666667 512 938.666667 85.333333 747.637333 85.333333 512 276.362667 85.333333 512 85.333333z m0 544a42.666667 42.666667 0 1 0 0 85.333334 42.666667 42.666667 0 0 0 0-85.333334z m0-362.666666a42.666667 42.666667 0 0 0-42.666667 42.666666v234.666667a42.666667 42.666667 0 1 0 85.333334 0V309.333333a42.666667 42.666667 0 0 0-42.666667-42.666666z" />
        </Svg>
    )
}
//实心信息图标：https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.7fae3a816miYON&cid=614
const IconInfoSolid = (props) => {
    return (
        <Svg {...props}>
            <Path d="M512.002558 65.290005c-246.698658 0-446.712041 200.045105-446.712041 446.712041 0 246.714008 200.013383 446.706925 446.712041 446.706925 246.687402 0 446.705901-199.992917 446.705901-446.706925C958.70846 265.335111 758.68996 65.290005 512.002558 65.290005L512.002558 65.290005zM522.936585 223.141126c40.130999 0 72.597435 32.534997 72.597435 72.576969 0 40.135092-32.467459 72.627111-72.597435 72.627111-40.040948 0-72.599482-32.492018-72.599482-72.627111C450.331987 255.676124 482.895637 223.141126 522.936585 223.141126L522.936585 223.141126zM651.998009 771.279185 408.894226 771.279185l0-31.853475 30.442336-11.247158c17.041118-6.261611 28.384467-22.556739 28.384467-40.662095L467.721029 515.793396c0-18.137079-11.339256-34.400484-28.384467-40.634466l-30.442336-11.272741 0-32.53909 184.250374 0 0 256.172427c0 18.101263 11.341303 34.400484 28.41619 40.658002l30.438243 11.251252L651.999033 771.279185 651.998009 771.279185zM651.998009 771.279185" />
        </Svg>
    )
}
//像字母 X 一样的关闭图标：https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.43bc3a81A8JWbc&cid=4491
const IconCloseX = (props) => {
    return (
        <Svg {...props}>
            <Path d="M544.448 499.2l284.576-284.576a32 32 0 0 0-45.248-45.248L499.2 453.952 214.624 169.376a32 32 0 0 0-45.248 45.248l284.576 284.576-284.576 284.576a32 32 0 0 0 45.248 45.248l284.576-284.576 284.576 284.576a31.904 31.904 0 0 0 45.248 0 32 32 0 0 0 0-45.248L544.448 499.2z" />
        </Svg>
    )
}
//像字母 V 一样的勾选图标：https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.5c553a81OQl1JC&cid=2825
const IconCheckV = (props) => {
    return (
        <Svg {...props}>
            <Path d="M1002.81 144.43a64 64 0 0 0-90.38 4.76L381.56 739l-272.3-272.3a64 64 0 0 0-90.51 90.51l320 320A64 64 0 0 0 384 896h1.68a64 64 0 0 0 45.89-21.16l576-640a64 64 0 0 0-4.76-90.41z" />
        </Svg>
    )
}
//登录账号图标：https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.58e33a81Xb26Ef&cid=38468
const IconLoginAccount = (props) => {
    return (
        <Svg {...props}>
            <Path d="M407.61 578.87c-174.46 0-304.73 113.04-304.73 277.2v17.69c0 85.81 139.6 85.81 316.37 85.81h187.73c169.75 0 316.37 0 316.37-85.81v-17.69c0-164.16-130.28-277.2-304.73-277.2H407.61zM503.71 535.67c138.19 0 250.63-105.81 250.63-235.94 0-130.06-112.44-235.86-250.63-235.86-138.11 0-250.56 105.81-250.56 235.86 0 130.13 112.45 235.94 250.56 235.94z" />
        </Svg>
    )
}
//登录密码图标（锁头）：https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.58e33a81Xb26Ef&cid=38468
const IconLoginLock = (props) => {
    return (
        <Svg {...props}>
            <Path d="M776.86 376.04c-22.05 0-40.16-16.24-43.91-37.98-18.08-104.98-109.79-185.1-219.84-185.1s-201.76 80.13-219.84 185.1c-3.74 21.73-21.85 37.98-43.91 37.98-27.05 0-48.82-24.04-44.44-50.73 24.3-148.16 153.25-261.58 308.19-261.58S796.99 177.15 821.3 325.31c4.38 26.69-17.39 50.73-44.44 50.73zM850.18 418.32H180.33c-37.98 0-68.76 30.79-68.76 68.76v403.71c0 37.98 30.79 68.76 68.76 68.76h665.36c37.97 0 68.75-30.77 68.77-68.74l0.19-408c0.02-35.61-28.85-64.49-64.47-64.49zM557.73 762.56c0 24.64-19.97 44.62-44.62 44.62-24.64 0-44.62-19.97-44.62-44.62v-89.23c0-24.64 19.97-44.62 44.62-44.62 24.64 0 44.62 19.98 44.62 44.62v89.23z" />
        </Svg>
    )
}
//小眼睛睁开图标（用于查看密码）：https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.4fd53a81Drc081&cid=22664
const IconEyeOpen = (props) => {
    return (
        <Svg {...props}>
            <Path d="M512 836.266667C230.4 836.266667 74.666667 533.333333 68.266667 520.533333c-4.266667-8.533333-4.266667-19.2 0-29.866666 6.4-12.8 164.266667-315.733333 443.733333-315.733334 281.6 0 437.333333 305.066667 443.733333 317.866667 4.266667 8.533333 4.266667 19.2 0 29.866667-6.4 10.666667-162.133333 313.6-443.733333 313.6zM132.266667 505.6c34.133333 57.6 170.666667 266.666667 379.733333 266.666667s345.6-209.066667 379.733333-266.666667c-34.133333-57.6-170.666667-266.666667-379.733333-266.666667S166.4 448 132.266667 505.6z" />
            <Path d="M512 650.666667c-76.8 0-138.666667-61.866667-138.666667-138.666667s61.866667-138.666667 138.666667-138.666667 138.666667 61.866667 138.666667 138.666667-61.866667 138.666667-138.666667 138.666667z m0-213.333334c-40.533333 0-74.666667 34.133333-74.666667 74.666667s34.133333 74.666667 74.666667 74.666667 74.666667-34.133333 74.666667-74.666667-34.133333-74.666667-74.666667-74.666667z" />
        </Svg>
    )
}
//小眼睛闭眼图标（用于隐藏密码）：https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.4fd53a81Drc081&cid=22664
const IconEyeClose = (props) => {
    return (
        <Svg {...props}>
            <Path d="M955.733333 492.8c-6.4-12.8-162.133333-317.866667-443.733333-317.866667-23.466667 0-46.933333 2.133333-70.4 6.4-17.066667 4.266667-29.866667 19.2-25.6 36.266667 4.266667 17.066667 19.2 29.866667 36.266667 25.6 19.2-4.266667 38.4-4.266667 57.6-4.266667 209.066667 0 345.6 209.066667 379.733333 266.666667-10.666667 19.2-32 53.333333-64 91.733333-10.666667 12.8-8.533333 34.133333 4.266667 44.8 6.4 4.266667 12.8 6.4 21.333333 6.4s19.2-4.266667 25.6-10.666666c51.2-61.866667 78.933333-115.2 78.933333-117.333334 6.4-8.533333 6.4-19.2 0-27.733333zM215.466667 125.866667c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l91.733333 91.733333C138.666667 354.133333 72.533333 484.266667 68.266667 490.666667c-4.266667 8.533333-4.266667 19.2 0 29.866666 6.4 12.8 162.133333 315.733333 443.733333 315.733334 83.2 0 164.266667-27.733333 241.066667-81.066667l96 96c6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333c12.8-12.8 12.8-32 0-44.8L215.466667 125.866667z m243.2 334.933333l104.533333 104.533333c-12.8 12.8-32 21.333333-51.2 21.333334-40.533333 0-74.666667-34.133333-74.666667-74.666667 0-19.2 8.533333-38.4 21.333334-51.2zM512 772.266667c-209.066667 0-345.6-209.066667-379.733333-266.666667 21.333333-36.266667 81.066667-130.133333 174.933333-196.266667l104.533333 104.533334c-25.6 25.6-38.4 59.733333-38.4 96 0 76.8 61.866667 138.666667 138.666667 138.666666 36.266667 0 70.4-14.933333 96-38.4l98.133333 98.133334c-61.866667 42.666667-128 64-194.133333 64z" />
        </Svg>
    )
}

//转换成 svg 的属性
function getSvgProps(props){
    const svgProps = {
        height: (props.size || 16),
        width: (props.size || 16),
        fill: (props.color || "#666"),
        onPress: props.onPress,
        viewBox: "0 0 1024 1024"
    }
    
    if(props.offset){
        if(props.offset > 0){
            svgProps.style = { marginLeft: props.offset }
        } else {
            svgProps.style = { marginRight: -props.offset }
        }
    }
    
    return svgProps
}

//APP字体图标集。为了避免APP大小太大，不建议使用第三方组件的图标
//请到 【https://www.iconfont.cn】 搜索需要的图标
class PosPayIcon extends Component {
    render(){
        if(this.props.visible === false){
            return null
        }
        
        const svgProps = getSvgProps(this.props)
        
        switch(this.props.name){
            case "wifi-connected": return IconWiFiConnected(svgProps)
            case "message-circle": return IconMessageCircle(svgProps)
            case "right-double-arrow": return IconRightDoubleArrow(svgProps)
            case "zoom-plus": return IconZoomPlus(svgProps)
            case "zoom-minus": return IconZoomMinus(svgProps)
            case "my-location": return IconMyLocation(svgProps)
            case "success-solid": return IconSuccessSolid(svgProps)
            case "error-solid": return IconErrorSolid(svgProps)
            case "warning-solid": return IconWarningSolid(svgProps)
            case "info-solid": return IconInfoSolid(svgProps)
            case "close-x": return IconCloseX(svgProps)
            case "check-v": return IconCheckV(svgProps)
            case "login-account": return IconLoginAccount(svgProps)
            case "login-lock": return IconLoginLock(svgProps)
            case "eye-open": return IconEyeOpen(svgProps)
            case "eye-close": return IconEyeClose(svgProps)
            
            default: return null
        }
    }
}

export default PosPayIcon