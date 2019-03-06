<template>
	<view>
		<!-- #ifndef MP -->
		<!-- 固定在顶部的导航栏 -->
		<uni-nav-bar fixed="true" left-icon="back" @click-left="back"
		@click-right="clickRight" :right-icon="rightIcon" :right-text="rightText" :color="color" :title="title">
		</uni-nav-bar>
		 <!-- 使用非原生导航栏后需要在页面顶部占位 -->
		 <!-- #ifdef APP-PLUS || H5 -->
		 <view class="pos-nav-app"></view>
		 <!-- #endif -->
		<!-- #endif -->
		<view v-show="isShowAction">
			<view class="mask" v-show="isShowAction" @tap="changeAction()"></view>
			<ul class="sub-active-list" v-show="isShowAction">
				<li v-for="(item, index) in items" :key="index">
					<a href="javascript:;" @tap="openActionDetail(item)">{{item.DZMC}}</a>
				</li>
			</ul>
		</view>
		<view v-show="isShowMessage">
			<view class="mask" v-show="isShowMessage" @tap="hideOpinion()"></view>
			<view id="flowOpinionPop" class="mui-popover">
				<view class="layer" >
					<view class="hd">
						<i class="layer-close" @tap="hideOpinion()"></i>
						<ul class="step-info">
							<li v-show="!opInfo.isFreeflow">当前步骤：{{opInfo.stepName}}</li>
							<li>任务来源：{{opInfo.taskSource}}</li>
						</ul>
					</view>
					<view class="bd mui-scroll-wrapper" id="flowInfo">
					<view class="mui-scroll" >
						<ul class="step-list" >
							<li v-for="(item,index) in opInfo.opinions" :key="index">
								<h1><strong>{{item.clr}}</strong><span>{{item.clsj}}</span></h1>
								<p>{{item.clyj}}</p>
							</li>
						</ul>
					</view>
					</view>
					<button type="button" @tap="hideOpinion()" class="step-btn">阅知</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '../../../../components/uni-nav-bar.vue';
	import uniIcon from '../../../../components/uni-icon.vue';
	import {FlowBaseSvr} from '../../../../common/powerapp/js/flowSvr.js';
	export default {
		props:{
			title: {
				type: String,
				default: ''
			}
		},
		components:{
			uniNavBar,
			uniIcon
		},
		data() {
			return {
				rightIcon:['collection'],
				rightText: '',
				canRevokeStepId: '',
				isShowActionBtn: false,
				isShowAction: false,		//是否显示动作
				info: {
					Actions: []
				},
				items: [],
				xh: '',
				bzbh: '',
				color: "#FFFFFF",
				isShowMessage: false,		//是否选是上步骤处理信息
				opInfo: {}
			}
		},
		watch:{
			isShowAction(newVal){
				this.$emit("stop-scroll",newVal);
			},
			isShowMessage(newVal){
				this.$emit("stop-scroll",newVal);
			}

		},
		methods: {
			back (){
				uni.navigateBack();
			},
			// 导航右侧按钮文本的点击事件
			clickRight(type){
				switch(type){
					case '撤回':
					this.revoke();
					break;
					case 'collection'||'collection_fill':
						this.changeAttention(type);
					break;
					case 'more':
						this.changeAction();
					break;
				}
			},
			loadFlowPreData(xh, bzbh, isShowMessage){
				if(typeof(isShowMessage) != 'undefined'){
					this.isShowMessage = isShowMessage;
				}
				this.xh = xh;
				this.bzbh = bzbh;
				this.$flowSvr.loadFlowInfo(xh,bzbh).then(res=>{
					this.info = res.data_json;
					//设置任务关注状态
					if(this.info.SFGZ) {
						this.rightIcon = ['collection_fill']
					}		
					//判断是否显示撤回按钮
					if((typeof(bzbh) == 'undefined' || bzbh == 'undefined' || bzbh == '') && this.info.canRevokeStepId){
						this.canRevokeStepId = this.info.canRevokeStepId;
						this.rightText = '撤回';
					}
					
					if(typeof(bzbh) != 'undefined' && bzbh != 'undefined' && bzbh != '') {
						//加载动作
						if(this.info.Actions.length>0){//待办任务
							this.rightIcon.push('more')
							this.items = this.info.Actions;
						}
						//在子页面展示上步处理信息
						if(this.isShowMessage){//控制如果从reloadFlowPreData的加载进来的不显示
							this.opInfo = this.info.opinionInfo;
						}
					}
					
				}).catch(error=>{
					this.$pdAction.toast("获取流程办理准备数据失败!",{icon:'none'});
				});
			},
			changeAction(){
				this.isShowAction = !this.isShowAction;
			},
			changeAttention(type){
				let flag = type=='collection'?true:false;
				this.$flowSvr.updateAttention(this.info.LCSLBH, flag).then(res=>{
					this.rightIcon = flag?['collection_fill','more']:['collection','more'];
					if(flag) {
						this.$pdAction.toast("关注成功！",{icon:'none'});
					} else {
						this.$pdAction.toast("已取消关注！",{icon:'none'});
					}
				}).catch(error=>{
					this.$pdAction.toast("执行失败，请检查网络！",{icon:'none'});
				});
			},
			changeSubViewAction(){
				if(this.info.Actions.length>0){
					this.isShowAction = !this.isShowAction;
				}else{
					this.$pdAction.alert("暂不支持在移动设备中办理动作，请转到电脑端办理!",{title:"操作结果"}).then(res=>{
					});
				}
			},
			openActionDetail(item){
				let url = "/powerapp/pages/flow/"+item.YDDLJ+"?actionId="+item.DZGXBH+"&BZBH="+this.bzbh+"&XH="+this.xh;
				this.$pdView.navigateTo(url).then(res=>{
					console.log(res);
				});
			},
			hideOpinion(){
				this.isShowMessage = false;
			},
			revoke(){
				this.$pdAction.alert("是否确定要撤回该任务?", {
					title: "撤回提示",
					confirmText: '确定',
					showCancel: true,
					cancelText: '取消'
				}).then(res => {
					this.$flowSvr.workflowRevoke(this.canRevokeStepId).then(res=>{
						this.$pdAction.alert(res.data_json,{title:"操作结果"}).then(res=>{
							this.$pdView.passValToPrePage({refresh:true},2);
						}).catch(error=>{
							this.$pdView.reLaunch("../../../tabBar/index/index");
						});
					}).catch(error=>{
						this.$pdAction.toast("执行失败，请检查网络！",{icon:'none'});
					});
				});
				
			}
		}
	}
</script>

<style>
@import '../css/flow.css';
.btn_list{right:100upx;}
/*详情流转意见*/
#flowOpinionPop .layer{height: 920upx;}
#flowOpinionPop .bd.mui-scroll-wrapper{top:347upx;max-height: 452upx;margin: 0;padding: 0;}
#flowOpinionPop .step-btn{top:785upx;position: absolute;margin-left:-42.5%;left:50%}

.layer{width: 600upx; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); background: #fff; border-radius: 12upx; z-index: 1001;}
.layer .hd{background: url(~@/static/powerapp/flow/layer_topbg.png) no-repeat; background-size: 100% 100%; height: 347upx; position: relative; overflow: hidden;}
.layer .hd .layer-close{background: url(~@/static/powerapp/flow/ic_close.png) no-repeat center; background-size: 29upx 29upx; width: 84upx; height: 76upx; position: absolute; right: 0; top: 0;}
.step-info{margin: 80upx 60upx;}
.step-info li{color: white; font-size: 38upx; line-height: 2.4;}

.layer .bd{}
.step-list{border-left: 1px solid #ddd; margin: 0 36upx; padding-left: 48upx; position: relative;-webkit-overflow-scrolling: touch;}
.step-list li{padding: 24upx 0; position: relative;}
.step-list li:before{content: ''; background: url(~@/static/powerapp/flow/step_dot.png) no-repeat; width: 25upx; height: 25upx; background-size: contain; position: absolute; left: 0; top: 0; margin: 36upx 0 0 -61upx;}
.step-list li h1{overflow: hidden;line-height: 1.2;}
.step-list li h1 strong{font-size: 37upx; color: #111; float: left;}
.step-list li h1 span{font-size: 30upx; color: #999; float: right;}
.step-list li p{font-size: 35upx; color: #666; padding-top: 24upx;}
.step-list li + li{border-top: 1px solid #ddd;}

.step-btn{border: 1px solid #06baca; height: 88upx; font-size: 38upx; color: #06baca; border-radius: 12upx; width: 85%; margin: 32upx auto; display: block; background: #fff;}

.sub-active-list{width: 360upx; background: #ffffff; border-radius: 19upx; position: fixed; right: 5upx; top: 107upx; z-index: 1000; padding: 0 20upx;}
.sub-active-list li{padding: 24upx 0; border-bottom: 1px solid #e2e2e2;}
.sub-active-list li a{font-size: 37upx; color: #313131;display: block; height: 49upx; line-height: 49upx;}
.sub-active-list li:last-child{border-bottom: none;}
.sub-active-list li a.on{color: #457aff;}
.sub-active-list:before{content: ''; position: absolute; width: 0; height: 0; top: -18upx; right: 20upx; border-style: solid; border-width: 0 22upx 22upx 22upx; border-color:transparent transparent white transparent;}

</style>
