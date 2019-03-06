<template>
	<view class="flowContent">
		<flow-quick-word ref="flowQuickWord" :kjyjArray="kjyjArray" @pReSetOpinion="reSetOpinion" :flowDefId="workflow.workflowDefId"></flow-quick-word>
		<view>
			<view class="table-list-ctn">
				<input v-if="false" name="selectUsers" id="selectUsers" v-model="bean.selectUsers"/>
				<block>
					<ul class="opt-box users">
						<li>
							<h1>转办人员：</h1>
							<i v-for="user in turnDealUsers" :key="user.userId">{{user.userName}}</i>
							<a href="javascript:;" @tap="selectTurnDealUsers()"></a>
						</li>
					</ul>
				</block>
			</view>
			<view class="gap" style="background:#eef0f2;"></view>
			<view class="uni-list-cell uni-collapse listBg4">
				<view class="uni-list-cell-navigate uni-navigate-bottom" :class="isClyj ? 'uni-active' : ''" @click="trigerCollapse('clyj')">
					处理意见
				</view>
				<view class="uni-collapse-content" :class="isClyj ? 'uni-active' : ''">
					<view class="tabs-opt">
						<block>
							<view class="h3">
								<textarea class="return-textarea" placeholder="请在此输入您的转办意见..." v-model="bean.opinion"/>
							</view>
							<view class="kjyj" @tap="showKjyj()">快捷常用语</view>
						</block>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="dg-nav">
				<view class="li" @tap="turnDeal()">
					<view class="a">转办</view>
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
				isClyj: true,
				workflow: {
					yclInfo: {
						opinionType: []
					}
				},
				bean: {
					opinion:''
				},
				kjyjArray: [],
				turnDealUsers: []
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
				if(e === 'clyj'){
					if(this.isClyj){
						this.isClyj = false;
					}else{
						this.isClyj = true;
					}
				}
			},
			setDataSu (evt){//获取选择人员传过来的值
				let userType = evt.userType;
				if(userType === "turnDealUser"){
					this.turnDealUsers = evt.mdata;
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
			//选择转办人员
			selectTurnDealUsers(){
				let url = "../common/selectUsers?mode=radio&userType=turnDealUser";
				this.$pdView.navigateTo(url).then(res=>{
					console.log(res);
				});
			},
			loadWorkflowProBeforeInfo(e){
				this.$flowManageSvr.loadWorkflowProBeforeInfo(e.stepId).then(res=>{
					this.workflow = res.data_json;
					this.kjyjArray = this.workflow.yclInfo.kjyjData;
					this.$pdAction.closeWait();
				}).catch(error=>{
					this.$pdAction.toast("获取数据失败！"+error,{icon:'none'});
					this.$pdAction.closeWait();
					console.log(error);
				});
			},
			turnDeal(){
				//必填数据验证
				if(typeof(this.bean.selectUsers)=='undefined' || this.bean.selectUsers ==''){
					this.$pdAction.toast('请选择转办人！',{icon:'none'});
					return false;
				}
				if(typeof(this.bean.opinion)=='undefined' || this.bean.opinion ==''){
					this.$pdAction.toast('请填写转办意见！',{icon:'none'});
					return false;
				}
				this.$pdAction.showWait("正在执行转办，请稍等！",false);
				this.$flowManageSvr.workflowTurnDeal(this.bean).then(res=>{
					this.$pdAction.closeWait();
					this.$pdAction.alert("已转办成功",{title:"操作结果"}).then(res=>{
						this.$pdView.passValToPrePage({refresh:true},2);
					}).catch(error=>{
						this.$pdView.reLaunch("../../../tabBar/index/index");
					});
				}).catch(error=>{
					this.$pdAction.closeWait();
					this.$pdAction.toast("已转办失败!"+error,{icon:'none'});
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