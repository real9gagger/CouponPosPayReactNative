// 统一 api 接口

/**************【必读】***************
【注】：
    __RM__ 指 Request Method，如果 URL 尾部不带则默认 GET。
    详情请参考同目录下的 ./index.js 文件下的 commonRequest 函数。

【接口文档 :::: 】
************************************/

export default {
    sendValidCode: '/auth/sendValidCode?__RM__=POST_FU', //发送短信验证码
    loginWithPassword: '/auth/login?__RM__=POST', //用户名 + 密码登录
    getPostInfo: '/pos/pos/getPostInfo', //商户账户获取商户详情
    savePosAppOrder: '/order/order/savePosAppOrder?__RM__=POST', //保存订单信息
    getPosAppOrderList: '/order/order/getPosAppOrderList', //获取订单列表
    posAppRefund: '/order/order/posAppRefund', //订单退款
    getOrderStatistics: '/order/order/getPosAppStatisticalDetail', //订单统计接口
}
