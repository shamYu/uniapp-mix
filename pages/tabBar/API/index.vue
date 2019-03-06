<template>
	<!-- 滚动视图view替换为scroll-view -->
	<view>
		<view class="uni-tab-bar">
			 <navigator url="component" hover-class="navigator-hover">
                    <button type="default">组件</button>
             </navigator>
			 <navigator url="API" hover-class="navigator-hover">
			 	<button type="default">接口</button>
			 </navigator>
			 <navigator url="template" hover-class="navigator-hover">
			 <button type="default">模板</button>
			 </navigator>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ApiIndex',
		onLoad (option){
			// 此处后台获取数据【option为上一个页面传递数据】
		},
		data () {
			return {
				tabIndex: 0,
				tabBars: [{
						name: '接口',
						id: 'API'
					}, {
						name: '模板',
						id: 'template'
					}
				]
			}
		},
		computed:{ // 计算属性
			
		},
		methods: { // 方法
			tapTab(e){
				
			}
		}
	}
</script>

<style lang="scss">
// @import "/common/css/_var.scss";
</style>
