<template>
	<view>
	    <view class="testBtn" v-for="(item,index) in list" :key="index" @click="addApp(item)">
	    	<span class="del-icon" v-if="item.BOOL"></span>
			<span class="add-icon" v-if="!item.BOOL"></span>
	    	<image class="hl-icon" :src="'../../../../static/powerapp/index/yytb/'+item.TBYSHLJ"></image>
	    	<text class="menuIcon">{{item.YYMC}}</text>
	    </view> 
	</view>
</template>

<script>
	export default {
		name: "PdAdd",
		props: {
			list: {
				type:Array,
				default(){
					return []
				}
			}
		},
		data(){
			return {
				chgStus:false
			}
		},
		created (){
			console.log(this.max);
		},
		computed: {
			
		},

		methods: {
			addApp(item){
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
	.add-icon{
		display: inline-block;
		width: 36upx;
		height: 36upx;
		background: url(../../../../static/powerapp/index/icon/ic_add.png) no-repeat;
		background-size: 36upx;
		position: absolute;
		top: -18upx;
		right: 18upx;
	}
</style>


