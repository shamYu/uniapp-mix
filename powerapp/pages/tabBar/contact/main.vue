<template>
	<view>
		<!-- #ifndef MP -->
		<!-- 固定在顶部的导航栏 -->
		<uni-nav-bar fixed="true">
			<view class="tabs-btn">
				<button class="tab-bt" v-bind:class="{on:queryType == 'XMPX'}" @click='queryTabType("XMPX")'>姓名排序</button>
				<button class="tab-bt" v-bind:class="{on:queryType == 'ZZJG'}" @click='queryTabType("ZZJG")'>组织机构</button>
			 </view>
		 </uni-nav-bar>
		 <!-- 使用非原生导航栏后需要在页面顶部占位 -->
		 <!-- #ifdef APP-PLUS || H5 -->
		 <view class="pos-nav-app"></view>
		 <!-- #endif -->
		<!-- #endif -->
		<phone-name v-if="queryType == 'XMPX'"></phone-name>
		<frame-work v-if="queryType == 'ZZJG'"></frame-work>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar.vue'
	import phoneName from './contact'
	import frameWork from './zzjg'
	export default {
		name: 'main',
		data() {
			return {
				queryType: 'XMPX',
				contactType: 'primary',
				zzjgType: 'default'
			}
		},
		components: {
			uniNavBar,
			phoneName,
			frameWork
		},
		computed: {
            otherH() {
                return uni.upx2px(1134 / 14.5) + 'px';
            }
        },
		methods: {
			queryTabType(type) {
				this.queryType = type;
				if (type == 'XMPX') {
					this.contactType = 'primary';
					this.zzjgType = 'default'
				}
				if (type == 'ZZJG') {
					this.contactType = 'default';
					this.zzjgType = 'primary'
				}
			}
		}
	}
</script>

<style lang="scss">
	@import '../../../../common/powerapp/css/_var.scss';
	
</style>
