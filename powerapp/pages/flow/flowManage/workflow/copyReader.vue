<template>
	<view class="flowContent">
		<flow-quick-word ref="flowQuickWord" :kjyjArray="kjyjArray" @pReSetOpinion="reSetOpinion" :flowDefId="workflow.workflowDefId"></flow-quick-word>
		<view>
			<view class="table-list-ctn">
				<input v-if="false" name="copyReaderUsers" id="copyReaderUsers" v-model="bean.copyReaderUsers"/>
				<block>
					<ul class="opt-box users">
						<li>
							<h1>抄送人员：</h1>
							<i v-for="user in copyReaderUsers" :key="user.userId">{{user.userName}}</i>
							<a href="javascript:;" @tap="selectCopyReaderUsers()"></a>
						</li>
					</ul>
				</block>
			</view>
			<view class="gap" style="background:#eef0f2;"></view>
			<view class="uni-list-cell uni-collapse listBg4">
				<view class="uni-list-cell-navigate uni-navigate-bottom" :class="isCsyj ? 'uni-active' : ''" @click="trigerCollapse('csyj')">
					抄送意见
				</view>
				<view class="uni-collapse-content" :class="isCsyj ? 'uni-active' : ''">
					<view class="tabs-opt">
						<view class="h3">
							<textarea class="return-textarea" placeholder="请在此输入您的抄送意见..." v-model="bean.opinion"/>
						</view>
						<view class="kjyj" @tap="showKjyj()">快捷常用语</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="dg-nav">
				<view class="li" @tap="copyReader()">
					<view class="a">抄送</view>
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
				isCsyj: true,
				workflow: {
				},
				bean: {
					opinion:''
				},
				kjyjArray: [],
				copyReaderUsers: []
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
				if(e === 'csyj'){
					if(this.isCsyj){
						this.isCsyj = false;
					}else{
						this.isCsyj = true;
					}
				}
			},
			setDataSu (evt){//获取单选人员传过来的值
				let userType = evt.userType;
				if(userType === "copyReaderUser"){
					this.copyReaderUsers = evt.mdata;
					this.bean.copyReaderUsers = '';
					for(let item of evt.mdata){
						if(this.bean.copyReaderUsers!=''){
							this.bean.copyReaderUsers += ',';
						}
						this.bean.copyReaderUsers += item.userId;
					}
				}else{
					
				}
			},
			selectCopyReaderUsers(){
				let url = "../common/selectUsers?mode=MULTI_MASTER&userType=copyReaderUser";
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
			copyReader(){
				this.bean.copyReaderUsers = "SYSTEM";
				if(typeof(this.bean.copyReaderUsers)=="undefined" || this.bean.copyReaderUsers==''){
					this.$pdAction.toast("请选择抄送人员！",{icon:'none'});
					return false;
				}
				this.$pdAction.showWait("正在执行抄送，请稍等！",false);
				this.$flowManageSvr.workflowCopyReader(this.bean).then(res=>{
					this.$pdAction.closeWait();
					this.$pdAction.alert("抄送成功",{title:"提示"}).then(res=>{
						this.$pdView.passValToPrePage({refresh:true},2);
					}).catch(error=>{
						this.$pdView.reLaunch("../../../tabBar/index/index");
					});
				}).catch(error=>{
					this.$pdAction.closeWait();
					this.$pdAction.toast("抄送失败!"+error,{icon:'none'});
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