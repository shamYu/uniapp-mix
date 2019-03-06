<template>
	<view >
		<view style="background: white;">
			<view  v-for="(child,index) in cate.children" :key="index" v-if="cate.children.length>0" style="margin-top:4upx;">
				<text >{{child.deptName}}</text>
				<organization-cloak :cate="child"></organization-cloak>
			</view>
			<view  class="md-li" v-for="(user,index) in cate.users" :key="index" @click="toContactInfo(user)">
				<text href="javascript:;">
					<text class="md-li-letter" :style="{background: user.COLOR}">{{user.YHMCFIRST}}</text>
					<text class="">{{user.YHMC}}</text>
				</text>
			</view>
			<view  v-show="cate.count == 0" style="padding-left: 0;">
				<view class="no-data"  style="">没有数据</view>
			</view>
		</view>
	</view>
</template>

<script>
	import organizationCloak from './organization-cloak'
	export default {
		props: ['cate'],
		methods:{
			/* 跳转到联系人详情 */
			toContactInfo (user){
				uni.navigateTo({
					url:'./contactInfo?option='+JSON.stringify(user)
				})
			},
			/* 因为不支持filter，只能改变数组,增加两个属性,实现效果*/	
			filters(arr){
				if(arr.users.length <= 0){
					return [];
				}
				let newArr = [];
				arr.users.map((item) => {
					item.YHMCFIRST = item.YHMC.substring(0,1);
					item.COLOR = this.randomColor();
					newArr.push(item)
				})
				return newArr;
			},
			randomColor() {
				var colors = ['#19d892', '#ffbb2a', '#ff8e2a', '#2abbff', '#8967cd', '#b98b62', '#ffb787', '#87a9ff', '#ff97ab',
					'#67dea7'
				];
				return colors[Math.floor(Math.random() * colors.length)];
			}
		},
		created(){
			this.cate.users = this.filters(this.cate);
		},
		watch:{
			cate(val){
				this.cate.users = this.filters(val);
			}
		},
		components:{
			organizationCloak
		}
	}
</script>

<style>
	.md-li{
		padding: 12upx;
		border-bottom: 2upx solid #E2E2E2;
		font-size: 32upx;
		margin-left: 60upx;
	}
	.md-li-letter{
		display: inline-block;
		margin-right: 30upx;
		border-radius: 50%;
		width: 50upx;
		color:white;
		text-align: center;
		padding: 18upx;
	}
	.no-data{
		font-size: 32upx;
		color:red;
		text-align: center;
		padding: 18upx;
	}
</style>
