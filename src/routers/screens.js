import IndexIndex from "@/pages/index/index";
import IndexSplash from "@/pages/index/splash";
import IndexHome from "@/pages/index/home";
import MineIndex from "@/pages/mine/index";
import MineLanguage from "@/pages/mine/language";
import MineAccount from "@/pages/mine/account";
import LoginIndex from "@/pages/login/index";
import TestIndex from "@/pages/test/index";

//非Tabs页面的顶部导航栏全局配置
const defaultScreenOptions = {
	// 自定义标题栏的样式。
	headerStyle: {
		// 背景颜色
		backgroundColor: "#fff",
		// 去掉标题栏底部阴影效果
		elevation: 0
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

//无标题页样式选项
const noHeaderOptions = {
	headerShown: false, // 是否显示标题
    animationEnabled: false
};

//首页底部标签栏列表
const PosPayTabList = [
    {
        name: "主页",
        component: IndexHome,
        options: noHeaderOptions
    },
    {
        name: "个人中心",
        component: MineIndex,
        options: noHeaderOptions
    }
];

//路由页面列表
const PosPayRouterList = [
    {
        name: "启动屏",
        component: IndexSplash,
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
        name: "语言设置",
        component: MineLanguage,
        i18nTitle: "language.header",
        options: {...defaultScreenOptions}
    },
    {
        name: "应用首页",
        component: IndexIndex,
        options: noHeaderOptions,
        params: { enabledDrawer: true } //是否启用抽屉（仅 “应用首页” 有这个功能，其他页面不必设置）
    },
    {
        name: "测试中心",
        component: TestIndex,
        options: noHeaderOptions
    }
];

export { 
    defaultScreenOptions,
    noHeaderOptions,
    PosPayTabList,
    PosPayRouterList
};