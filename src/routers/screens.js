import { StyleSheet } from "react-native";
import IndexIndex from "@/pages/index/index";
import IndexSplash from "@/pages/index/splash";
import IndexTextInputer from "@/pages/index/textInputer";
import IndexTransactionSuccess from "@/pages/index/transactionSuccess";
import MineAccount from "@/pages/mine/account";
import MineHelps from "@/pages/mine/helps";
import SettingIndex from "@/pages/setting/index";
import SettingLanguage from "@/pages/setting/language";
import SettingMoney from "@/pages/setting/money";
import SettingPrint from "@/pages/setting/print";
import SettingCurrency from "@/pages/setting/currency";
import SettingCustomerDisplay from "@/pages/setting/customerDisplay";
import SettingTaxRate from "@/pages/setting/taxRate";
import LoginIndex from "@/pages/login/index";
import TestIndex from "@/pages/test/index";
import TestDevinfo from "@/pages/test/devinfo";
import TestAboutSoftware from "@/pages/test/aboutSoftware";
import TestSupportPayment from "@/pages/test/supportPayment";
import TestPospayIcons from "@/pages/test/pospayIcons";
import CouponIndex from "@/pages/coupon/index";
import CouponAdds from "@/pages/coupon/adds";
import OrderPrintPreview from "@/pages/order/printPreview";
import OrderIndex from "@/pages/order/index";
import OrderDetails from "@/pages/order/details";
import OrderStatistics from "@/pages/order/statistics";
import OrderPrinting from "@/pages/order/printing";
import OrderRefund from "@/pages/order/refund";
import OrderRefundConfirm from "@/pages/order/refundConfirm";

//非Tabs页面的顶部导航栏全局配置
const defaultScreenOptions = {
    // 自定义标题栏的样式。
    headerStyle: {
        // 背景颜色
        backgroundColor: "#fff",
        // 去掉标题栏底部阴影效果
        elevation: 0,
        //底部边框宽度
        borderBottomWidth: StyleSheet.hairlineWidth,
        //底部边框颜色
        borderBottomColor: "#eee"
    },
    headerTitleStyle: {
        //标题字体大小
        fontSize: 20
    },
    // 控制是否显示页面的标题栏。
    headerShown: true,
    // 设置标题栏文本颜色。
    headerTintColor: "#000",
    // 设置标题文本的对齐方式
    headerTitleAlign: "left",
    // 页面标题（如果显示 Header，则会显示此标题）
    title: ""
};

//无标题无动画屏选项
const noHeaderOptions = {
    headerShown: false, // 是否显示标题
    animationEnabled: false //是否启用切换动画
};

//无标题屏选项
const noHeaderOnly = {
    headerShown: false, // 是否显示标题
    animationEnabled: true //是否启用切换动画
};

//路由页面列表
const PosPayRouterList = [
    {
        name: "启动屏",
        component: IndexSplash,
        options: noHeaderOptions
    },
    {
        name: "应用首页",
        component: IndexIndex,
        options: noHeaderOptions
    },
    {
        name: "登录页",
        component: LoginIndex,
        options: noHeaderOptions
    },
    {
        name: "我的账户",
        component: MineAccount,
        i18nTitle: "account.header",
        options: {...defaultScreenOptions}
    },
    {
        name: "帮助页",
        component: MineHelps,
        i18nTitle: "drawer.helps",
        options: {...defaultScreenOptions}
    },
    {
        name: "语言设置",
        component: SettingLanguage,
        i18nTitle: "language.header",
        options: {...defaultScreenOptions}
    },
    {
        name: "金额设置",
        component: SettingMoney,
        i18nTitle: "money.header",
        options: {...defaultScreenOptions}
    },
    {
        name: "打印设置",
        component: SettingPrint,
        i18nTitle: "print.header",
        options: {...defaultScreenOptions}
    },
    {
        name: "货币设置",
        component: SettingCurrency,
        i18nTitle: "currency.header",
        options: {...defaultScreenOptions}
    },
    {
        name: "顾客屏幕",
        component: SettingCustomerDisplay,
        i18nTitle: "customer.display",
        options: {...defaultScreenOptions}
    },
    {
        name: "税率设置",
        component: SettingTaxRate,
        i18nTitle: "tax.rate",
        options: {...defaultScreenOptions}
    },
    {
        name: "设置页",
        component: SettingIndex,
        i18nTitle: "setting",
        options: {...defaultScreenOptions}
    },
    {
        name: "测试中心",
        component: TestIndex,
        i18nTitle: "test.centre",
        options: {...defaultScreenOptions}
    },
    {
        name: "设备信息",
        component: TestDevinfo,
        i18nTitle: "test.devinfo",
        options: {...defaultScreenOptions}
    },
    {
        name: "关于软件",
        component: TestAboutSoftware,
        i18nTitle: "about.software",
        options: {...defaultScreenOptions}
    },
    {
        name: "支付合作商",
        component: TestSupportPayment,
        i18nTitle: "payment.supports",
        options: {...defaultScreenOptions}
    },
    {
        name: "软件图标",
        component: TestPospayIcons,
        i18nTitle: "app.icons",
        options: {...defaultScreenOptions}
    },
    {
        name: "订单列表",
        component: OrderIndex,
        i18nTitle: "drawer.sale",
        options: {...defaultScreenOptions}
    },
    {
        name: "订单详情",
        component: OrderDetails,
        i18nTitle: "order.details",
        options: {...defaultScreenOptions}
    },
    {
        name: "订单统计",
        component: OrderStatistics,
        i18nTitle: "statistics",
        options: {...defaultScreenOptions}
    },
    {
        name: "订单打印",
        component: OrderPrinting,
        i18nTitle: "print",
        options: {...defaultScreenOptions}
    },
    {
        name: "订单退款",
        component: OrderRefund,
        i18nTitle: "drawer.returns",
        options: {...defaultScreenOptions}
    },
    {
        name: "优惠券录入",
        component: CouponAdds,
        i18nTitle: "coupon.adds",
        options: {...defaultScreenOptions}
    },
    {
        name: "支付成功",
        component: IndexTransactionSuccess,
        options: noHeaderOnly
    },
    {
        name: "优惠券查询",
        component: CouponIndex,
        options: noHeaderOnly
    },
    {
        name: "打印预览",
        component: OrderPrintPreview,
        options: noHeaderOnly
    },
    {
        name: "退款确认",
        component: OrderRefundConfirm,
        options: noHeaderOnly
    },
    {
        name: "文本输入器",
        component: IndexTextInputer,
        options: noHeaderOnly
    },
];

export {
    defaultScreenOptions,
    PosPayRouterList
};