<template>
	<view class="flowContent">
		<flow-quick-word ref="flowQuickWord" :kjyjArray="kjyjArray" @pReSetOpinion="reSetOpinion" :flowDefId="workflow.workflowDefId"></flow-quick-word>
		<view>
			<view class="table-list-ctn">
				<input v-if="false" name="selectUsers" id="selectUsers" v-model="bean.selectUsers"/>
				<block>
					<ul class="opt-box users">
						<li>
							<h1>当前步骤：<span>{{workflow.stepName}}</span></h1>
						</li>
						<li>
							<h1>退回步骤：</h1>
							<p class="select-box">
								<picker @change="bindPickerChange" mode="selector" :value="index" :range="sendBackStepNames">
									<view class="uni-input">{{sendBackStepNames[index]}}（{{sendBackStepProcesserNames[index]}}）</view>
								</picker>
							</p>
						</li>
					</ul>
					<view class="gap" style="background:#eef0f2;"></view>
					<ul class="opt-box users">
						<li>
							<h1>退回人员：</h1>
							<i v-for="user in sendBackUsers" :key="user.userId">{{user.userName}}</i>
							<a href="javascript:;" @tap="selectSendBackUsers()"></a>
						</li>
					</ul>
				</block>
			</view>
			<view class="gap" style="background:#eef0f2;"></view>
			<view class="uni-list-cell uni-collapse listBg4">
				<view class="uni-list-cell-navigate uni-navigate-bottom" :class="isThyj ? 'uni-active' : ''" @click="trigerCollapse('thyj')">
					退回意见
				</view>
				<view class="uni-collapse-content" :class="isThyj ? 'uni-active' : ''">
					<view class="tabs-opt">
						<block>
							<view class="h3">
								<textarea class="return-textarea" placeholder="请在此输入您的退回意见..." v-model="bean.opinion"/>
							</view>
							<view class="kjyj" @tap="showKjyj()">快捷常用语</view>
						</block>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="dg-nav">
				<view class="li" @tap="sendBack()">
					<view class="a">退回</view>
				</view>
			</view>
		</view>
	</view>
	
</template>
<script>
	import flowQuickWord from '../../components/flow-quick-word.vue';
	import {FlowManageSvr} from '../../../../../common/powerapp/js/flowManageSvr.js';
	import {PdAction} from '../../../../../common/powerapp/js/pd.action.js';
	import {PdView} from '../../../../../common/powerapp/js/pd.view.js';
	//来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
	var  graceChecker = require("../../../../../common/graceChecker.js");
	export default {
		data() {
			return {
				isThyj: true,
				workflow: {
					yclInfo: {
						opinionType: []
					}
				},
				bean: {
					opinion:''
				},
				kjyjArray: [],
				sendBackUsers: [],
				sendBackSteps: [],
				sendBackStepIds: [],
				sendBackStepNames: [],
				sendBackStepProcesserNames: [],
				index: 0
			}
		},
		components:{
			FlowManageSvr,
			flowQuickWord
		},
		onLoad(e){
			this.bean = Object.assign(this.bean, e);
			this.$pdAction.showWait("正在加载中...");
			this.loadWorkflowProBeforeInfo(e);
		},
		methods: {
			trigerCollapse(e) {
				if(e === 'thyj'){
					if(this.isThyj){
						this.isThyj = false;
					}else{
						this.isThyj = true;
					}
				}
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value;
				this.bean.backStepIds = this.sendBackStepIds[this.index];
				this.bean.selectUsers = '';
				this.sendBackUsers = [];
				for(let item of this.sendBackSteps){
					if(item.stepId == this.bean.backStepIds){
						this.bean.selectUsers = item.stepProcesser; //重置退回人员ID
						this.sendBackUsers.push({userId:item.stepProcesse,userName:item.stepProcesserName});//重置退回人员姓名
					}
				}
				for(let step of this.sendBackSteps){
					this.sendBackStepIds.push(step.stepId);
					this.sendBackStepNames.push(step.stepName);
					this.sendBackStepProcesserNames.push(step.stepProcesserName);
				}
			},
			setDataSu (evt){//获取选择人员传过来的值
				let userType = evt.userType;
				if(userType === "sendBackUser"){
					this.sendBackUsers = evt.mdata;
					this.bean.selectUsers = '';
					for(let item of evt.mdata){
						if(this.bean.selectUsers!=''){
							this.bean.selectUsers += ',';
						}
						this.bean.selectUsers += item.userId;
					}
				}else{
					
				}
			},
			//选择退回人员
			selectSendBackUsers(){
				let url = "../common/selectUsers?mode=radio&userType=sendBackUser";
				this.$pdView.navigateTo(url).then(res=>{
					console.log(res);
				});
			},
			loadWorkflowProBeforeInfo(e){
				this.$flowManageSvr.loadWorkflowProBeforeInfo(e.stepId,"SENDBACK").then(res=>{
					this.workflow = res.data_json;
					this.sendBackSteps =this.workflow.yclInfo.sendBackSteps;
					for(let step of this.sendBackSteps){
						this.sendBackStepIds.push(step.stepId);
						this.sendBackStepNames.push(step.stepName);
						this.sendBackStepProcesserNames.push(step.stepProcesserName);
					}
					this.kjyjArray = this.workflow.yclInfo.kjyjData;
					//数据初始化
					let len = this.sendBackSteps.length;
					if(len > 0){
						let userId = this.sendBackSteps[len-1].stepProcesser;
						let userName = this.sendBackSteps[len-1].stepProcesserName;
						let stepId = this.sendBackSteps[len-1].stepId;
						this.bean.backStepIds = stepId;//设置默认退回步骤
						this.bean.selectUsers = userId; //设置默认退回人员ID
						this.sendBackUsers.push({userId:userId,userName:userName});//设置默认退回人员姓名
					}
					this.$pdAction.closeWait();
				}).catch(error=>{
					this.$pdAction.toast("获取数据失败！"+error,{icon:'none'});
					this.$pdAction.closeWait();
					console.log(error);
				});
			},
			sendBack(){
				//必填数据验证
				if(typeof(this.bean.backStepIds)=='undefined' || this.bean.backStepIds ==''){
					this.$pdAction.toast('请选择退回步骤！',{icon:'none'});
					return false;
				}
				if(typeof(this.bean.selectUsers)=='undefined' || this.bean.selectUsers ==''){
					this.$pdAction.toast('请选择退回人员！',{icon:'none'});
					return false;
				}
				if(typeof(this.bean.opinion)=='undefined' || this.bean.opinion ==''){
					this.$pdAction.toast('请填写退回意见！',{icon:'none'});
					return false;
				}
				this.$pdAction.showWait("正在执行退回，请稍等！",false);
				this.$flowManageSvr.workflowSendBack(this.bean).then(res=>{
					this.$pdAction.closeWait();
					this.$pdAction.alert("退回成功",{title:"操作结果"}).then(res=>{
						this.$pdView.passValToPrePage({refresh:true},2);
					}).catch(error=>{
						this.$pdView.reLaunch("../../../tabBar/index/index");
					});
				}).catch(error=>{
					this.$pdAction.closeWait();
					this.$pdAction.toast("退回失败!"+error,{icon:'none'});
				})
			},
			showKjyj(){
				this.$refs.flowQuickWord.isShowManage = true;
			},
			reSetOpinion(value){
				this.bean.opinion = value;
			}
		}
	}
</script>

<style>
	@import '../../css/flow.css';
	@import '../../../../../common/powerapp/css/table_lr.scss';
	page{
		background-color: #FFFFFF;
	}
</style>