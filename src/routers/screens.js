import IndexIndex from "@/pages/index/index";
import IndexSplash from "@/pages/index/splash";
import MineAccount from "@/pages/mine/account";
import MineHelps from "@/pages/mine/helps";
import SettingIndex from "@/pages/setting/index";
import SettingLanguage from "@/pages/setting/language";
import LoginIndex from "@/pages/login/index";
import TestIndex from "@/pages/test/index";
import TestDevinfo from "@/pages/test/devinfo";

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
        options: noHeaderOptions,
        params: { enabledDrawer: true, enabledTabbar: true } //是否启用抽屉，是否显示底部标签栏（仅 “应用首页” 有这个功能，其他页面不必设置）
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
    }
];

export { 
    defaultScreenOptions,
    PosPayRouterList
};