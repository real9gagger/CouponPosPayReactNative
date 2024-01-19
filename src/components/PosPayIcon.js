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
//退格图标（支付键盘用）
const IconPayBackspace = (props) => {
    return (
        <Svg {...props}>
            <Path d="M742.912 416.256c0-13.824-8.704-20.48-8.704-20.48-9.216-9.216-20.992-9.728-20.992-9.728-14.848 0-24.064 9.728-24.064 9.728l-71.68 71.68-71.68-71.68s-8.704-9.728-24.064-9.728c0 0-11.776 0-20.992 9.728 0 0-8.704 6.656-8.704 20.48 0 0-2.048 12.8 8.704 24.064l71.68 72.192L501.248 583.68c-9.728 8.192-9.728 24.064-9.728 24.064 0 12.288 9.728 22.528 9.728 22.528 8.704 8.704 20.992 7.68 20.992 7.68 15.872 0 23.04-8.704 23.04-8.704l71.68-71.68 71.68 71.68s7.168 8.704 23.04 8.704c0 0 12.288 1.024 20.992-7.68 0 0 9.728-10.24 9.728-22.528 0 0 0-15.872-9.728-24.064l-70.144-71.68 71.68-72.192c11.264-10.752 8.704-23.552 8.704-23.552z m280.064 315.904V294.4c-4.096-123.392-123.392-126.464-123.392-126.464h-583.68c-15.872 0-24.576 8.704-24.576 8.704l-281.6 312.32C0.512 498.688 1.024 510.976 1.024 510.976c0 16.896 9.728 26.112 9.728 26.112l278.528 309.76c10.752 10.752 23.04 9.728 23.04 9.728h587.264c126.976-7.168 123.392-124.416 123.392-124.416z m-141.824 47.104H334.336L94.72 511.488l240.64-265.728 1.536-1.536h544.768s57.856 6.144 57.856 61.44v414.72c-0.512 0-2.048 58.88-58.368 58.88z" />
        </Svg>
    )
}
//收起键盘（支付键盘用）
const IconCollapseKeyboard = (props) => {
    return (
        <Svg {...props}>
            <Path d="M671.5648 787.6608a30.976 30.976 0 0 1 0 43.9808l-131.456 130.816c-3.84 3.84-8.4224 6.4512-13.312 7.8592a31.3088 31.3088 0 0 1-34.3296-6.6304l-131.4304-130.816a30.976 30.976 0 0 1 0-43.9808 31.36 31.36 0 0 1 44.1856 0l110.4384 109.9264 111.6928-111.1552a31.36 31.36 0 0 1 44.2112 0zM895.232 51.2C952.1408 51.2 998.4 97.2544 998.4 153.856v433.3824c0 56.576-46.2592 102.656-103.1424 102.656H128.768c-56.8832 0-103.1424-46.08-103.1424-102.656V153.8304C25.6 97.28 71.8592 51.2 128.7424 51.2H895.232z m0 62.208H128.768c-22.4256 0-40.6528 18.1248-40.6528 40.448v433.3824c0 22.2976 18.2272 40.448 40.6528 40.448H895.232c22.4256 0 40.6528-18.1504 40.6528-40.448V153.8304c0-22.272-18.2272-40.448-40.6528-40.448z" />
            <Path d="M243.0208 292.224H173.8496a18.944 18.944 0 0 1-18.9696-18.8928v-68.864a18.944 18.944 0 0 1 18.9696-18.8672h69.1712c10.496 0 18.9952 8.448 18.9952 18.8928v68.864a18.944 18.944 0 0 1-18.9952 18.8672z m151.808 0H325.632a18.944 18.944 0 0 1-18.9952-18.8928v-68.864a18.944 18.944 0 0 1 18.9952-18.8672h69.1712c10.496 0 18.9952 8.448 18.9952 18.8928v68.864a18.944 18.944 0 0 1-18.9952 18.8672z m151.7568 0h-69.1712a18.944 18.944 0 0 1-18.9952-18.8928v-68.864a18.944 18.944 0 0 1 18.9952-18.8672h69.1712c10.496 0 18.9696 8.448 18.9696 18.8928v68.864a18.944 18.944 0 0 1-18.9696 18.8672z m151.7824 0h-69.1968a18.944 18.944 0 0 1-18.9696-18.8928v-68.864a18.944 18.944 0 0 1 18.9696-18.8672h69.1968c10.496 0 18.9696 8.448 18.9696 18.8928v68.864a18.944 18.944 0 0 1-18.9696 18.8672z m151.7824 0h-69.1968a18.944 18.944 0 0 1-18.9696-18.8928v-68.864a18.944 18.944 0 0 1 18.9696-18.8672h69.1968c10.4704 0 18.944 8.448 18.944 18.8928v68.864a18.944 18.944 0 0 1-18.944 18.8672z m-607.1296 141.056H173.8496a18.944 18.944 0 0 1-18.9696-18.8672v-68.864a18.944 18.944 0 0 1 18.9696-18.8928h69.1712c10.496 0 18.9952 8.448 18.9952 18.8928v68.864a18.944 18.944 0 0 1-18.9952 18.8928z m151.808 0H325.632a18.944 18.944 0 0 1-18.9952-18.8672v-68.864a18.944 18.944 0 0 1 18.9952-18.8928h69.1712c10.496 0 18.9952 8.448 18.9952 18.8928v68.864a18.944 18.944 0 0 1-18.9952 18.8928z m151.7568 0h-69.1712a18.944 18.944 0 0 1-18.9952-18.8672v-68.864a18.944 18.944 0 0 1 18.9952-18.8928h69.1712c10.496 0 18.9696 8.448 18.9696 18.8928v68.864a18.944 18.944 0 0 1-18.9696 18.8928z m151.7824 0h-69.1968a18.944 18.944 0 0 1-18.9696-18.8672v-68.864a18.944 18.944 0 0 1 18.9696-18.8928h69.1968c10.496 0 18.9696 8.448 18.9696 18.8928v68.864a18.944 18.944 0 0 1-18.9696 18.8928z m151.7824 0h-69.1968a18.944 18.944 0 0 1-18.9696-18.8672v-68.864a18.944 18.944 0 0 1 18.9696-18.8928h69.1968c10.4704 0 18.944 8.448 18.944 18.8928v68.864a18.944 18.944 0 0 1-18.944 18.8928z m6.3232 123.5968H167.5264a12.672 12.672 0 0 1-12.6464-12.5952v-43.1104c0-6.912 5.6832-12.5952 12.6464-12.5952h688.9472c6.9376 0 12.6464 5.6832 12.6464 12.5952v43.1104c0 6.912-5.7088 12.5952-12.6464 12.5952z" />
        </Svg>
    )
}
//像字母 X 一样的清空图标：https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.7f9d3a81Wxw8B1&cid=42993
const IconDeleteX = (props) => {
    return (
        <Svg {...props}>
            <Path d="M240.448 168l2.346667 2.154667 289.92 289.941333 279.253333-279.253333a42.666667 42.666667 0 0 1 62.506667 58.026666l-2.133334 2.346667-279.296 279.210667 279.274667 279.253333a42.666667 42.666667 0 0 1-58.005333 62.528l-2.346667-2.176-279.253333-279.253333-289.92 289.962666a42.666667 42.666667 0 0 1-62.506667-58.005333l2.154667-2.346667 289.941333-289.962666-289.92-289.92a42.666667 42.666667 0 0 1 57.984-62.506667z" />
        </Svg>
    )
}
//销售图标
const IconSaleFlag = (props) => {
    return (
        <Svg {...props}>
            <Path d="M528.810667 42.24L986.453333 507.050667a128 128 0 0 1-0.682666 180.309333l-298.410667 298.410667a128 128 0 0 1-180.309333 0.682666L42.24 528.810667a128 128 0 0 1-38.058667-97.024l0.64-8.32L35.413333 148.48A128 128 0 0 1 148.48 35.413333L423.509333 4.778667a128 128 0 0 1 105.344 37.418666z m-95.914667 47.402667L157.866667 120.192a42.666667 42.666667 0 0 0-37.717334 37.717333l-30.549333 274.986667-0.256 5.546667a42.666667 42.666667 0 0 0 12.714667 29.568l464.810666 457.642666a42.666667 42.666667 0 0 0 60.16-0.213333l298.368-298.410667a42.666667 42.666667 0 0 0 0.213334-60.117333L468.053333 102.101333a42.666667 42.666667 0 0 0-35.114666-12.458666zM352.256 215.466667c75.264 0 136.277333 61.568 136.277333 137.002666 0 74.794667-62.08 136.064-137.045333 136.064-74.24 0.298667-135.765333-61.397333-136.021333-136.064A136.277333 136.277333 0 0 1 352.298667 215.466667z m0 81.066666c-31.274667 0-55.722667 24.533333-55.722667 55.808 0.128 29.909333 25.344 55.253333 54.784 55.125334 30.592 0 56.149333-25.173333 56.149334-54.997334 0-30.848-24.874667-55.936-55.168-55.936z" />
        </Svg>
    )
}
//退货图标
const IconReturnGoods = (props) => {
    return (
        <Svg {...props}>
            <Path d="M513.917603 77.982522c239.061174 0 434.656679 194.317104 434.656679 434.656679S754.257179 947.29588 513.917603 947.29588s-434.656679-194.317104-434.656679-434.656679 195.595506-434.656679 434.656679-434.656679m0-77.982522c-282.526841 0-511.360799 228.833958-511.360799 511.360799s228.833958 511.360799 511.360799 511.360799 511.360799-228.833958 511.360799-511.360799-228.833958-511.360799-511.360799-511.360799z" />
            <Path d="M630.252185 744.029963c-19.17603 0-52.414482 0-99.715356-1.278402-34.516854 0-65.198502-3.835206-89.48814-8.948814-23.011236-6.39201-42.187266-19.17603-58.806492-38.35206-7.670412-8.948814-15.340824-14.062422-20.454432-14.062422-11.505618 0-30.681648 25.56804-58.806492 75.425718L260.794007 717.183521c28.124844-44.74407 53.692884-74.147316 75.425718-85.652934v-153.40824h-74.147316v-53.692884h127.8402v212.214732l6.39201 6.39201c12.78402 15.340824 25.56804 25.56804 38.35206 33.238452 15.340824 7.670412 40.908864 12.78402 74.147316 14.062422 43.465668 1.278402 80.539326 1.278402 113.777778 1.278402h85.652934c28.124844-1.278402 51.13608-2.556804 66.476903-3.835206l-14.062421 57.52809H630.252185zM311.930087 240.339576c37.073658 29.403246 67.755306 58.806492 94.601748 86.931335l-42.187266 40.908864c-21.732834-28.124844-52.414482-58.806492-92.044944-90.766542l39.630462-37.073657zM507.525593 474.287141v125.283396c28.124844-5.113608 60.084894-12.78402 93.323346-23.011236l12.78402 52.414482c-46.022472 12.78402-103.550562 24.289638-171.305868 34.516854l-12.78402-49.857678c12.78402-5.113608 19.17603-12.78402 19.17603-23.011236V253.123596H728.689139V474.287141H507.525593z m166.19226-134.23221v-35.795256h-166.19226v35.795256h166.19226z m-166.19226 48.579276V423.151061h166.19226v-35.795256h-166.19226z m69.033708 94.601748c28.124844 15.340824 53.692884 31.96005 79.260924 48.579276 16.619226-15.340824 31.96005-31.96005 44.74407-48.579276l42.187266 31.96005c-14.062422 16.619226-28.124844 31.96005-44.74407 46.022472 25.56804 19.17603 48.579276 38.35206 69.033708 57.52809l-35.795256 43.465668c-49.857678-49.857678-111.220974-97.158552-186.646692-139.345818l31.96005-39.630462z" />
        </Svg>
    )
}
//重新打印图标（线条）
const IconPrinterStroke = (props) => {
    return (
        <Svg {...props}>
            <Path d="M768 608.384V832a85.333333 85.333333 0 0 1-85.333333 85.333333H341.333333a85.333333 85.333333 0 0 1-85.333333-85.333333v-223.616H170.666667a85.333333 85.333333 0 0 1-85.333334-85.333333V192a85.333333 85.333333 0 0 1 85.333334-85.333333h682.666666a85.333333 85.333333 0 0 1 85.333334 85.333333v331.093333a85.333333 85.333333 0 0 1-85.333334 85.333334l-85.333333-0.042667zM682.666667 512H341.333333v320h341.333334V512zM405.333333 256a42.666667 42.666667 0 0 1 0 85.333333H298.666667a42.666667 42.666667 0 1 1 0-85.333333h106.666666z m362.666667 267.050667h85.333333V192H170.666667v331.093333l85.333333-0.042666V448a21.333333 21.333333 0 0 1 21.333333-21.333333h469.333334a21.333333 21.333333 0 0 1 21.333333 21.333333v75.050667z" />
        </Svg>
    )
}
//小计图标（线条）：https://www.iconfont.cn/search/index?searchType=icon&q=%E5%90%88%E8%AE%A1&page=5&fromCollection=-1
const IconSubTotal = (props) => {
    return (
        <Svg {...props}>
            <Path d="M512 0C229.248 0 0 229.248 0 512s229.248 512 512 512 512-229.248 512-512S794.752 0 512 0z m0 85.333c235.648 0 426.667 191.019 426.667 426.667S747.648 938.667 512 938.667 85.333 747.648 85.333 512 276.352 85.333 512 85.333z" />
            <Path d="M689.45 266.539a42.667 42.667 0 0 1 7.254 55.978l-3.243 4.267-87.466 99.883h55.338a42.667 42.667 0 0 1 4.992 85.034l-4.992 0.299H554.667v85.333H640a42.667 42.667 0 0 1 4.992 85.035l-4.992 0.299h-85.333v42.666a42.667 42.667 0 0 1-85.035 4.992l-0.299-4.992v-42.666H384a42.667 42.667 0 0 1-4.992-85.035l4.992-0.299h85.333V512H362.667a42.667 42.667 0 0 1-4.992-85.035l4.992-0.298h55.296l-87.424-99.883a42.667 42.667 0 0 1 60.458-60.032l3.798 3.84L512 404.48l117.205-133.973a42.667 42.667 0 0 1 60.246-4.011z" />
        </Svg>
    )
}
//设置图标（线条）
const IconSystemSetting = (props) => {
    return (
        <Svg {...props}>
            <Path d="M634.424889 994.133333h-244.849778a267.406222 267.406222 0 0 1-231.310222-134.485333l-122.595556-213.873778a270.961778 270.961778 0 0 1 0-268.686222l122.595556-213.873778a267.576889 267.576889 0 0 1 231.310222-134.485333h244.707556a267.406222 267.406222 0 0 1 231.310222 134.485333l122.595555 213.873778a270.961778 270.961778 0 0 1 0 268.686222l-122.595555 213.873778a267.178667 267.178667 0 0 1-231.168 134.485333zM231.594667 817.038222a182.755556 182.755556 0 0 0 157.980444 91.875556h244.707556a182.584889 182.584889 0 0 0 157.980444-91.875556l122.567111-213.873778a185.400889 185.400889 0 0 0 0-183.608888l-122.595555-213.902223A182.755556 182.755556 0 0 0 634.311111 113.777778h-244.707555a182.584889 182.584889 0 0 0-157.980445 91.875555l-122.567111 213.902223a185.400889 185.400889 0 0 0 0 183.608888l122.595556 213.902223zM512 729.998222c-119.751111 0-217.201778-98.133333-217.201778-218.709333S392.248889 292.579556 512 292.579556s217.201778 98.133333 217.201778 218.709333S631.751111 729.998222 512 729.998222z m0-352.199111c-73.073778 0-132.579556 59.932444-132.579556 133.489778 0 73.557333 59.505778 133.489778 132.579556 133.489778 73.073778 0 132.579556-59.932444 132.579556-133.489778 0-73.557333-59.505778-133.489778-132.579556-133.489778z" />
        </Svg>
    )
}
//帮助图标（线条）：https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.52e73a81A6aO1r&cid=13665
const IconHelpStroke = (props) => {
    return (
        <Svg {...props}>
            <Path d="M983.678752 314.585575c-25.849513-60.781287-62.777388-115.474464-109.785575-162.482651s-101.701365-83.936062-162.482651-109.785575C648.433528 15.569591 581.663938 1.996101 512.998051 1.996101c-68.665887 0-135.435478 13.573489-198.412476 40.321248-60.781287 25.849513-115.474464 62.777388-162.482651 109.785575s-83.936062 101.701365-109.785575 162.482651C15.569591 377.562573 1.996101 444.332164 1.996101 512.998051c0 68.665887 13.573489 135.435478 40.321248 198.412475 25.849513 60.781287 62.777388 115.474464 109.785575 162.482651s101.701365 83.936062 162.482651 109.785575c62.976998 26.747758 129.746589 40.321248 198.412476 40.321248 68.665887 0 135.435478-13.573489 198.412475-40.321248 60.781287-25.849513 115.474464-62.777388 162.482651-109.785575s83.936062-101.701365 109.785575-162.482651c26.747758-62.976998 40.321248-129.746589 40.321248-198.412475 0-68.665887-13.573489-135.435478-40.321248-198.412476zM673.684211 894.752437c-51.00039 21.6577-105.094737 32.636257-160.68616 32.636257s-109.68577-10.978558-160.68616-32.636257c-49.403509-21.058869-93.816764-51.100195-131.9423-89.125926-38.125536-38.125536-68.067057-82.438986-89.125926-131.9423-21.6577-51.00039-32.636257-105.094737-32.636258-160.68616s10.978558-109.68577 32.636258-160.68616c21.058869-49.403509 51.100195-93.816764 89.125926-131.9423 38.125536-38.125536 82.438986-68.067057 131.9423-89.125926 51.00039-21.6577 105.094737-32.636257 160.68616-32.636258s109.68577 10.978558 160.68616 32.636258c49.403509 21.058869 93.816764 51.100195 131.9423 89.125926 38.125536 38.125536 68.067057 82.438986 89.125926 131.9423 21.6577 51.00039 32.636257 105.094737 32.636257 160.68616s-10.978558 109.68577-32.636257 160.68616c-21.058869 49.403509-51.100195 93.816764-89.125926 131.9423-38.125536 38.025731-82.538791 68.067057-131.9423 89.125926z" />
            <Path d="M476.868616 808.820273h74.554386c8.283821 0 14.97076-6.68694 14.97076-14.97076v-68.366472c0-8.283821-6.68694-14.97076-14.97076-14.97076h-74.554386c-8.283821 0-14.97076 6.68694-14.97076 14.97076v68.366472c0 8.283821 6.68694 14.97076 14.97076 14.97076zM687.557115 373.270955c-3.293567-51.299805-19.262378-90.922417-47.307602-117.869785-28.045224-26.947368-68.266667-41.119688-119.566472-42.217544h-0.998051c-58.585575 2.195712-104.096686 19.461988-135.235867 51.100195-31.039376 31.638207-47.906433 77.847953-50.102144 137.331774-0.299415 8.483431 6.487329 15.469786 14.97076 15.469785h65.272514c8.084211 0 14.77115-6.487329 14.970761-14.57154 1.896296-72.558285 30.440546-107.490058 90.024171-109.68577h1.297466c48.904483 2.095906 73.65614 26.947368 77.548538 77.947758 0 0.499025 0.099805 1.097856 0 1.596882-0.59883 26.548148-19.961014 59.0846-57.687329 96.810916-51.100195 48.904483-75.951657 93.118129-75.951657 135.036257v55.990643c0 8.283821 6.68694 14.97076 14.97076 14.970761h68.366472c8.283821 0 14.97076-6.68694 14.97076-14.970761v-65.272514c0-11.377778 7.8846-32.736062 45.211696-70.162963 52.497466-50.301754 79.145419-101.002729 79.145419-150.605848l0.099805-0.898246z" />
        </Svg>
    )
}
//电源关机图标（线条）:https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.11dc3a817IDQlj&cid=14830
const IconTurnOff = (props) => {
    return (
        <Svg {...props}>
            <Path d="M698.788571 208.342857a54.971429 54.971429 0 0 0 14.228572 75.085714C801.462857 346.285714 859.234286 449.542857 859.428571 566.262857A346.685714 346.685714 0 0 1 515.142857 914.285714C321.828571 915.988571 164.571429 759.782857 164.571429 566.857143c0-118.674286 59.508571-223.44 150.308571-286.102857a54.857143 54.857143 0 0 0 16.354286-72.582857A54.857143 54.857143 0 0 0 252.571429 190.411429C133.097143 272.902857 54.857143 410.8 54.857143 566.971429 54.925714 819.428571 259.6 1024 512 1024s457.142857-204.674286 457.142857-457.142857c0-153.942857-76.091429-290.102857-192.708571-372.937143a54.914286 54.914286 0 0 0-77.645715 14.422857z" />
            <Path d="M457.142857 0m54.857143 0l0 0q54.857143 0 54.857143 54.857143l0 475.428571q0 54.857143-54.857143 54.857143l0 0q-54.857143 0-54.857143-54.857143l0-475.428571q0-54.857143 54.857143-54.857143Z" />
        </Svg>
    )
}
/* ================================ 分割线 ================================ */
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
            case "pay-backspace": return IconPayBackspace(svgProps)
            case "collapse-keyboard": return IconCollapseKeyboard(svgProps)
            case "delete-x": return IconDeleteX(svgProps)
            case "sale-flag": return IconSaleFlag(svgProps)
            case "return-goods": return IconReturnGoods(svgProps)
            case "printer-stroke": return IconPrinterStroke(svgProps)
            case "sub-total": return IconSubTotal(svgProps)
            case "system-setting": return IconSystemSetting(svgProps)
            case "help-stroke": return IconHelpStroke(svgProps)
            case "turn-off": return IconTurnOff(svgProps)
            default: return null
        }
    }
}

export default PosPayIcon