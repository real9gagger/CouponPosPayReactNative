/**
 * @format
 */

import '@/common/Global';
import {AppRegistry} from 'react-native';
import {FastCss} from '@/common/FastCss';
import {name as AppName} from './app.json';
import App from './App';
import commonRequest from '@/request/index';

//快速布局常用样式 合并到全局变量里
Object.assign(global, FastCss);

//通用 api 接口请求，全局使用。
global.$request = commonRequest;

AppRegistry.registerComponent(AppName, () => App);
