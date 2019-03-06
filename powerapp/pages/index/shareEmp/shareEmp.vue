<template>
	<view class="page">
		<view class="shareLayer">
			<view class="shareRow">
				<span class="srName">分享标题</span>
				<input class="srValue" type="text" placeholder="分享标题" v-model="title" />
			</view>
			<view class="shareRow">
				<span class="srName">内容描述</span>
				<input class="srValue" type="text" placeholder="分享内容" v-model="contant"/>
			</view>
			<view class="shareRow">
				<span class="srName">分享链接</span>
				<input class="srValue" type="text" v-model="shareUrl" placeholder="分享链接" />
			</view>
			<view class="view-btns">
				<button class="btn" type="primary" @click="shareHref">分享链接</button>
				<button class="btn" type="primary" @click="shareScreenShot">截屏分享</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {PdDevice} from '../../../../common/powerapp/js/pd.device.js';
	export default {
		data() {
			return {
				title:"分享示例测试",
				contant:"我是分享内容",
				shareUrl:"http://www.html5plus.org/doc/zh_cn/share.html"
			};
		},
		methods: {
			shareHref (){
				let msg={extra:{scene:''}};//微信分享场景，仅微信分享平台有效
				msg.href = this.shareUrl;
				msg.title = this.title;
				msg.content = this.contant;
				PdDevice.shareSystem(msg);
			},
			shareScreenShot (){
				PdDevice.shareScreenShot();
			}
		},
		computed: {
			
		}
	}
</script>

<style lang="scss">
.shareRow{
	width: 100%;
	height: 80upx;
	line-height: 80upx;
	border-bottom: 1px solid #ddd;
	padding-left: 20upx;
	background: #fff;
	font-size: 30upx;
	color:#333;
	display: flex;
    flex-direction: row;
}
.shareRow .srName{
	/* display: block;
	float: left;
	width: 30%;
	height: 100%;
	text-align: left; */
	flex: 1;
	text-align: center;
}
.shareRow .srValue{
	/* display: block;
	float: left;
	width: 70%;
	height: 100%;
	text-align: left; */
	flex: 2;
	height: 100%;
}
.view-btns{
	width: 100%;
	padding: 30upx 0;
	overflow: hidden;
	background: #fff;
}
.view-btns .btn{
	width: 30%;
	float: left;
	margin-left: 12%;
	border-radius: 10upx;
}
</style>
