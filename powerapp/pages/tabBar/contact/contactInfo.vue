<template>
	<view class="mui-content">
			<view class="imgArea">
				<view class="imgBox">
					<image  :src="xbImg" />
					<view>{{person.YHMC}}</view>
				</view>
			</view>
		    <view class="detail">
		    	<view class="group">
		    		<text>所在部门</text>
		        	<view>{{person.BMMC}}</view>
		    	</view>
		    	<view class="group">
			        <text>用户手机</text>
			        <view >{{person.YHSJ}}</view>
			        	<view class="phone-img">
							<image  :src="msgImg" v-if="person.YHSJ" @click="sendMessage(person.YHSJ);"/>
			        	    <image  :src="tellImg" v-if="person.YHSJ"  @click="call(person.YHSJ);"/>
						</view>
		        </view>
		        <view class="group">
			       	<text>办公电话</text>
			        <view >{{person.BGDH}}</view>
						<view class="phone-img">
						    <image  :src="tellImg" v-if="person.BGDH"  @click="call(person.BGDH);"/>
						</view>
		    	</view>
		    	<view class="group">
		    		<text>性别</text>
		        	<view >{{person.XB}}</view>
		    	</view>
		    	<view class="group">
		    		<text>职务</text>
		        	<view >{{person.YHZW}}</view>
		    	</view>
		    	<view class="group">
		    		<text>称谓</text>
		        	<view v-bind:text="person.YHCW"></view>
		    	</view>
		    	<view class="group">
			       <text>内网邮箱</text>
			        <view>{{person.NWYX}}</view>
		    	</view>
		    	<view class="group">
			       <text>外网邮箱</text>
			        <view>{{person.WWYX}}</view>
		    	</view>
		    </view>
		</view>
</template>

<script>
	export default {
		name : 'contactInfo',
		data () {
			return {
				xbImg : '../../../../static/user-photo.png',
				msgImg: '../../../../static/ic_mail.png',
				tellImg : '../../../../static/ic_tell.png',
				person : {
					
				}
			}
		},
		onLoad (options) {
			this.person = JSON.parse(options.option);
		},
		mounted () {
			if(this.person.XB == '男'){
				this.xbImg = '../../../../static/boy.png'
			}
			if(this.person.XB == '女'){
				this.xbImg = '../../../../static/girl.png'
			}
		},
		methods : {
			call (number){
				this.$pdDevice.call(number,true);
			},
			sendMessage (number){
				this.$pdDevice.sendMessage({acceptArr:[number],message:'nihao,利好'})
			}
		}
	}
	
</script>

<style>

/****************联系人详情页面样式******************/
.imgArea{
	position: relative;
	background: url(../../../../static/lxr_bg.png) no-repeat;
    background-size: 100% 100%;
    height: 300upx;
    overflow: hidden;
}
.imgBox image{display: block; width: 150upx; height: 150upx; background-size: contain; margin: 10upx auto;margin-top: 60upx;}
.imgBox view{font-size: 30upx; color: white; text-align: center;}
.detail{
	background-color: #fff;
	padding : 0 0.322061rem;
}
.detail .group{
	border-bottom: 1px solid #E8E8E8;
	height: 100upx;
	position: relative;
	padding: 10upx;
}
.group text{
	color: #777;
	display: inline-block;
	margin-bottom: 10upx;
}
.group view {
	font-size: 30upx;
}
.phone-img {
	position: absolute;
	right: 10upx;
	top: 15upx;
}
.phone-img image{
	display: inline-block;
	width: 80upx;
	height: 80upx;
}
.phone-img image+image{
	margin-left: 20upx;
}
</style>
