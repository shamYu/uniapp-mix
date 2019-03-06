<template>
	<!-- 滚动视图view替换为scroll-view -->
	<view>
		<!-- 页面内容 -->
		<text>{{msg}}</text>
		<image src="../../static/c1.png"></image>
	</view>
</template>

<script>
	export default {
		onLoad (option){
			// 此处后台获取数据【option为上一个页面传递数据】
		},
		data () {
			return {
				msg: 'hello world'
			}
		},
		computed:{ // 计算属性
			
		},
		methods: { // 方法
			
		}
	}
</script>

<style lang="scss">
// @import "/common/css/_var.scss";
</style>
