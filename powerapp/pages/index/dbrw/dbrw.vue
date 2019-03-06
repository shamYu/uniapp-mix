<template>
	<view class="uni-tab-bar">
		<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
			<view v-for="(tab,index) in tabBars" :key="tab.id" :class="['swiper-tab-list',tabIndex==index ? 'active' : '']" :id="tab.id"
			 :data-current="index" @click="tapTab(index)">{{tab.name}}</view>
		</scroll-view>
		<swiper :current="tabIndex" class="swiper-box" duration="300">
			<swiper-item :key="0">
				<scroll-view class="list" scroll-y>
					全部
				</scroll-view>
			</swiper-item>
			
			<swiper-item :key="1">
				<scroll-view class="list" scroll-y>
					请假申请
				</scroll-view>
			</swiper-item>
			
			<swiper-item :key="2">
				<scroll-view class="list" scroll-y>
					收文
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollLeft: 0,
				tabIndex: 0,
				tabBars: [{
					name: '全部',
					id: 'all'
				}, {
					name: '请假申请',
					id: 'altforLeave'
				}, {
					name: '收文',
					id: 'receipt'
				}]
			};
		},
		methods:{
			async tapTab(index) { //点击tab-bar
				if (this.tabIndex === index) {
					return false;
				} else {
					this.isClickChange = true;
					this.tabIndex = index;
				}
			},
		}
	}
</script>

<style>

</style>
