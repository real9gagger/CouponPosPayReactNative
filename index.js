/**
 * @format
 */

import '@/common/Global';
import {AppRegistry} from 'react-native';
import {FastCss} from '@/common/FastCss';
import App from './App';
import {name as AppName} from './app.json';

//快速布局常用样式 合并到全局变量里
Object.assign(global, FastCss);

AppRegistry.registerComponent(AppName, () => App);
