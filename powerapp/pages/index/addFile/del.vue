<template>
	<view>
	    <view class="testBtn" v-for="(item,index) in list" :key="index" v-if="index > min && index < max" @click="delApp(item)">
	    	<span class="del-icon"></span>
	    	<image class="hl-icon" :src="'../../../../static/powerapp/index/yytb/'+item.TBYSHLJ"></image>
	    	<text class="menuIcon">{{item.YYMC}}</text>
	    </view> 
	</view>
</template>

<script>
	export default {
		name: "PdDel",
		props: {
			list: {
				type:Array,
				default(){
					return []
				}
			},
			min:0,
			max:0
		},
		data(){
			return {
			}
		},
		created (){
			console.log(this.max);
		},
		computed: {
			
		},

		methods: {
			delApp(item){
				this.$emit("select",item);
			}
		}
	}
</script>
<style lang="scss">
	.hl-icon{
		width:70upx;
		height:70upx;
	}
	.menuIcon{
		display: block;
		font-size: 28upx;
	}
	.testBtn {
		position: relative;
		width: 25%;
		text-align: center;
		height: 45%;
		float: left;
		margin-bottom: 40upx;
	}
	.del-icon{
		display: inline-block;
		width: 36upx;
		height: 36upx;
		background: url(../../../../static/powerapp/index/icon/ic_dele.png) no-repeat;
		background-size: 36upx;
		position: absolute;
		top: -18upx;
		right: 18upx;
	}
</style>

