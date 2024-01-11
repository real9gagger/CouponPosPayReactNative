/**
 * @format
 */

import '@/common/Global';
import {AppRegistry} from 'react-native';
import {FastCss} from '@/common/FastCss';
import {showAlert,showConfirm,showNotify} from '@/common/Modals';
import {name as AppName} from './app.json';
import App from './App';
import commonRequest from '@/request/index';

//快速布局常用样式 合并到全局变量里
Object.assign(global, FastCss);

//通用 api 接口请求，全局使用。
global.$request = commonRequest;

//通用弹窗函数。$toast 已在 @/common/Global 里定义
global.$alert = showAlert;
global.$confirm = showConfirm;
global.$notify = showNotify;

AppRegistry.registerComponent(AppName, () => App);
