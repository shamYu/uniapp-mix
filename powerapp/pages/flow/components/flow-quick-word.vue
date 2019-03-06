<template>
	<view v-if="isShowManage">
		<view class="mask" style="top:0upx;" v-if="isShowManage" @tap="hideKjyj()"></view>
		<view class="layer lay2 mui-popover" id="opinionPopover">
			<view class="hd">
				<i class="layer-close" @tap="hideKjyj()"></i>
			</view>
			<view class="bd mui-scroll-wrapper">
				<view class="mui-scroll">
				<ul class="mui-table-view">
					 <li class="mui-table-view-cell" v-for="(item,index) in kjyjArray" :key="index" @tap="reSetOpinion(item.value)">{{item.value}}</li>
					 <li class="mui-table-view-cell noData" style="border-bottom: 0upx;font-size: 30upx;margin: 0;" v-if="kjyjArray.length==0">没有任何数据，请在【管理】中录入！</li>
				</ul>
				</view>
			</view>
			<button type="button" class="step-btn" @tap="openManage()" >管理</button>
		</view>
	</view>
</template>

<script>
	import {PdView} from '../../../../common/powerapp/js/pd.view.js';
	import {PdAction} from '../../../../common/powerapp/js/pd.action.js';
	export default {
		props:{
			kjyjArray: {
				type: Array,
				default: null
			},
			flowDefId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				isShowManage: false
			}
		},
		methods: {
			hideKjyj(){
				this.isShowManage = false;
			},
			reSetOpinion(value){
				this.$emit("pReSetOpinion",value);
				this.hideKjyj();
			},
			openManage(){
				let url = "../common/kjyjManage?flowDefId="+this.flowDefId;
				this.$pdView.navigateTo(url).then(res=>{
					console.log(res);
				});
			}
		}
	}
</script>

<style>
@import '../css/flow.css';
#opinionPopover{
	height:850upx;	
}

#opinionPopover.mui-popover .mui-scroll-wrapper{margin-bottom:90upx;}
#opinionPopover.mui-popover .mui-scroll-wrapper .mui-scroll{padding:10upx;}
#opinionPopover.mui-popover .mui-scroll-wrapper .mui-scroll a{display:block;color:#000000;border-bottom:1px dashed #1E82D2;min-height:85upx;line-height: 85upx;}
#opinionPopover.mui-popover .mui-scroll-wrapper .mui-scroll a:active{background:#1E82D2;color:#FFFFFF;}


.layer{width: 600upx; position: absolute; top: 45%; left: 50%; transform: translate(-50%,-50%); background: #fff; border-radius: 12upx; z-index: 1001;}
.layer .hd{background: url(~@/static/powerapp/flow/layer_topbg.png) no-repeat; background-size: 100% 100%; height: 347upx; position: relative; overflow: hidden;}
.layer .hd .layer-close{background: url(~@/static/powerapp/flow/ic_close.png) no-repeat center; background-size: 29upx 29upx; width: 84upx; height: 76upx; position: absolute; right: 0; top: 0;}

/* 5常用语管理 */
.layer.lay2 .hd{background-image: url(~@/static/powerapp/flow/layer_topbg2.png); height: 200upx;}
.layer.lay2 .bd{top:200upx;height: 650upx;padding: 0;margin: 0;}
.layer.lay2 .mui-scroll{padding: 0;margin: 0;box-shadow: none;}
.layer.lay2 .mui-table-view{background-color: #FFFFFF;}
.layer.lay2 .hd .layer-close{background-image: url(~@/static/powerapp/flow/ic_guanbi.png);}
.layer.lay2 .step-btn{background: #06baca; color: white;top: 710upx;position: absolute;margin-left:-42.5%;left:50%}
.layer.lay2 .mui-table-view-cell:after {right: 15px;}
.layer.lay2 .mui-table-view li{
	font-size: 38upx;
	color: #111;
	line-height: 70upx;
	height: 70upx;
	border-bottom: 1upx solid #DDDDDD;
	margin-left: 30upx;
	margin-right: 30upx;
}
.step-btn{border: 1px solid #06baca; height: 88upx; font-size: 38upx; color: #06baca; border-radius: 12upx; width: 85%; margin: 32upx auto; display: block; background: #fff;}

</style>
