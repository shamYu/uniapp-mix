import Vue from 'vue'
import Vuex from 'vuex'
import {PdStorage} from '../common/powerapp/js/pd.storage.js';
import {PdAction} from '../common/powerapp/js/pd.storage.js';
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		loginNum: 0 // 登录次数
	},
	mutations: {
		login(state, options) { // 登录
			PdStorage.setToken(options);
			state.hasLogin = true;
		},
		logout(state) { // 退出
			// PdStorage.removeToken();
			state.hasLogin = false;
			state.loginNum = 0;
		},
		resetLoginNum(state, value=0){
			state.loginNum = value;
		}
	}
})

export default store
