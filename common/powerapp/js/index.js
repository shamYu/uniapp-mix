// powerapp-------------------------------------start
import Vue from 'vue'
// // 公用的js引入
import {PdView} from "./pd.view";
import {PdAction} from './pd.action';
import {PdStorage} from './pd.storage';
import {PdResource} from './pd.resource';
import {PdGlobal} from './pd.global';
import {PdDevice} from './pd.device';
import {PdUpdate} from './pd.update';
import {PdCache} from './pd.cache';
import {Log} from './log';
import {PdLogin} from './pd.login';
import {FlowManageSvr} from './flowManageSvr';
import {FlowBaseSvr} from './flowSvr';
// 公用的组件
import pdPrompt from '../../../powerapp/components/pd-prompt';

// // 公用js
Vue.prototype.$pdGlobal = PdGlobal;
Vue.prototype.$pdView = PdView;
Vue.prototype.$pdAction = PdAction;
Vue.prototype.$pdStorage = PdStorage;
Vue.prototype.$pdResource = PdResource;
Vue.prototype.$pdDevice = PdDevice;
Vue.prototype.$pdUpdate = PdUpdate;
Vue.prototype.$pdCache = PdCache;
Vue.prototype.$log = Log;
Vue.prototype.$pdLogin = PdLogin;
Vue.prototype.$flowManageSvr = FlowManageSvr;
Vue.prototype.$flowSvr = FlowBaseSvr;
// 公用组件
Vue.component('pd-prompt', pdPrompt)

export const appVue = Vue;
// powerapp-------------------------------------end