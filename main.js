import {appVue} from './common/powerapp/js/index.js'
import App from './App'

// 组件，框架常用组件
import pageHead from './components/page-head'
import pageFoot from './components/page-foot'

import store from './store'
appVue.config.productionTip = false

appVue.prototype.$store = store
appVue.prototype.$backgroundAudioData = {
	playing: false,
	playTime: 0,
	formatedPlayTime: '00:00:00'
}

console.log(appVue.prototype)
appVue.component('page-head', pageHead)
appVue.component('page-foot', pageFoot)


App.mpType = 'app'

const app = new appVue({
	store,
	...App
})
app.$mount()
