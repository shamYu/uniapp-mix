<template>
	<!-- 滚动视图view替换为scroll-view -->
	<view class="personCon">
		<!-- 页面内容 -->
		<view class="headPho_bg">
			<view class="headViewp">
				<image class="headPortrait" src="../../../../static/powerapp/user/images/boy.png"></image>
				<p class="systemTest">{{userName}}</p>
			</view>			
		</view>
		
		<view class="main-box">
			<ul class="mine-menu">
				<li class="mine-menuItem0">
					<navigator url="../../user/personInform/personInform">
						<text>个人信息</text>
					</navigator>				
				</li>
				<li class="mine-menuItem1">
					<navigator url="../../user/changePassword/changePassword">
						<text>修改密码</text>
					</navigator>
					</li>
				<li class="mine-menuItem2">
					<navigator url="../../user/setting/setting">
						<text>设置</text>
					</navigator>
				</li>
				<li class="mine-menuItem3">
					<navigator url="../../user/abute/abute">
						<text>关于</text>
					</navigator>
				</li>
			</ul>
		</view>
		
		<view class="safeExit_btn" v-if='!$pdGlobal.ISSUB' @tap="exit">安全退出</view>
	</view>
</template>

<script>
	import {mapMutations} from 'vuex'
	export default {
		onLoad (option){
			// 此处后台获取数据【option为上一个页面传递数据】
		},
		data () {
			return {
				msg: 'hello world',
				userName:''
			}
		},
		mounted() {
			this.userName = this.$pdCache.getCurrUserInfo().YHMC;
		},
		computed:{ // 计算属性
		},
		methods: { // 方法
			...mapMutations(['logout']),
			exit(){
				this.$pdAction.alert('退出后不会删除任何历史数据，下次登录依然可以使用本帐号。',{
					title:'退出登陆'
				}).then(confirm=>{
					if (confirm=='confirm'){
						this.$pdAction.showWait('正在退出');
						this.logout();
						this.$pdView.reLaunch('/powerapp/pages/login/login?exit=true')
						this.$pdAction.closeWait()
					}
				})
			}
		}
	}
</script>

<style lang="scss">
// @import "/common/css/_var.scss";
.personCon{width:100%;height:100%;}
.headPho_bg{
	background: url(../../../../static/powerapp/user/images/ic_BG_01.png) no-repeat center;
    background-size: cover;
    height: 45%;
    position: relative;
}
.headViewp{
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	text-align: center;
}
.headPortrait{
	width:200upx;
	height: 200upx;
}
.systemTest{
	color: #fff;
    font-size: 32upx;
}

.mine-menu{
	background: #fff;
    margin: 25upx 0;
}
.mine-menu li{
	position: relative;
    padding: 30upx 80upx;
    border-bottom: 2upx solid #e5e5e5;
    background-position: 6upx center;
    background-repeat: no-repeat; 
	font-size: 36upx;
	color:#000;
}
.mine-menu li.mine-menuItem0{
	background: url(../../../../static/powerapp/user/images/icon_user.png) no-repeat center;
	background-position-x: 20upx;
	background-size: 44upx;
}
.mine-menu li.mine-menuItem1{
	background: url(../../../../static/powerapp/user/images/icon-lock.png) no-repeat center;
	background-position-x: 20upx;
	background-size: 44upx;
}
.mine-menu li.mine-menuItem2{
	background: url(../../../../static/powerapp/user/images/icon-setting.png) no-repeat center;
	background-position-x: 20upx;
	background-size: 44upx;
}
.mine-menu li.mine-menuItem3{
	background: url(../../../../static/powerapp/user/images/icon-info.png) no-repeat center;
	background-position-x: 20upx;
	background-size: 44upx;
}

.safeExit_btn{
	width: 100%;
	height:84upx;
	background: #fff;
	text-align: center;
	line-height: 84upx;
	font-size: 36upx;
	color: skyblue;
}
</style>
