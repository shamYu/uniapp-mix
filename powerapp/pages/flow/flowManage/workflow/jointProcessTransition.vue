<template>
	<view class="flowContent">
		<flow-quick-word ref="flowQuickWord" :kjyjArray="kjyjArray" @pReSetOpinion="reSetOpinion" :flowDefId="workflow.workflowDefId"></flow-quick-word>
		<view>
			<view class="table-list-ctn">
				<input v-if="false" name="selectUsers" id="selectUsers" v-model="bean.selectUsers"/>
				<input v-if="false" name="selectHelpers" id="selectHelpers" v-model="bean.selectHelpers"/>
				<input v-if="false" name="selectReaders" id="selectReaders" v-model="bean.selectReaders"/>
				<block>
					<ul class="opt-box users">
						<li>
							<h1>&nbsp;&nbsp;&nbsp;&nbsp;办理人：</h1>
							<i v-for="user in processorUsers" :key="user.userId">{{user.userName}}</i>
							<a href="javascript:;" @tap="selectProcessorUsers()"></a>
						</li>
						<li>
							<h1>&nbsp;&nbsp;&nbsp;&nbsp;协办人：</h1>
							<i v-for="user in helperUsers" :key="user.userId">{{user.userName}}</i>
							<a href="javascript:;" @tap="selectHelperUsers()"></a>
						</li>
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
				<view class="uni-list-cell-navigate uni-navigate-bottom" :class="isClyj ? 'uni-active' : ''" @click="trigerCollapse('clyj')">
					处理意见
				</view>
				<view class="uni-collapse-content" :class="isClyj ? 'uni-active' : ''">
					<view class="tabs-opt">
						<block>
							<view v-if="workflow.yclInfo.opinionType.length>0">
									<view class="uni-flex uni-row" v-if="workflow.yclInfo.opinionType.length>1">
										<view class="flex-item">意见类型：</view>
										<radio-group class="uni-flex" name="gender">
											<label v-for="item in workflow.yclInfo.opinionType" :key="item.typeCode">
												<radio :value="item.typeCode" :checked="bean.opinionType == item.typeCode ? true : false" v-model="bean.opinionType"/>{{item.typeName}}
											</label>
										</radio-group>
									</view>
							</view>
							<view class="h3">
								<textarea class="return-textarea" placeholder="请在此输入您的处理意见..." v-model="bean.opinion"/>
							</view>
							<view class="kjyj" @tap="showKjyj()">快捷常用语</view>
							<view style="height:150upx;" v-if="workflow.yclInfo.canSendMsg">
								<checkbox-group>
									<label class="uni-list-cell uni-list-cell-pd">
										<view style="font-size: 34upx;">发送短信通知</view>
										<view>
											<checkbox value="true" :checked="bean.sendMsg == 'true' ? true : false" v-model="bean.sendMsg"/>
										</view>
									</label>
								</checkbox-group>
							</view>
						</block>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="dg-nav">
				<view class="li" @tap="jointProcessTran()">
					<view class="a">交办</view>
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
				processorUsers: [],
				helperUsers:[],
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
				if(e === 'clyj'){
					if(this.isClyj){
						this.isClyj = false;
					}else{
						this.isClyj = true;
					}
				}
				console.log(this.isClyj);
			},
			setDataSu (evt){//获取选择人员传过来的值
				let userType = evt.userType;
				if(userType === "processorUser"){
					this.processorUsers = evt.mdata;
					this.bean.selectUsers = '';
					for(let item of evt.mdata){
						if(this.bean.selectUsers!=''){
							this.bean.selectUsers += ',';
						}
						this.bean.selectUsers += item.userId;
					}
				}else if(userType === "helperUser"){
					this.helperUsers = evt.mdata;
					this.bean.selectHelpers = '';
					for(let item of evt.mdata){
						if(this.bean.selectHelpers!=''){
							this.bean.selectHelpers += ',';
						}
						this.bean.selectHelpers += item.userId;
					}
				}else if(userType === "copyReaderUser"){
					this.copyReaderUsers = evt.mdata;
					this.bean.selectReaders = '';
					for(let item of evt.mdata){
						if(this.bean.selectReaders!=''){
							this.bean.selectReaders += ',';
						}
						this.bean.selectReaders += item.userId;
					}
				}else{
					
				}
			},
			//选择办理人员
			selectProcessorUsers(){
				let url = "../common/selectUsers?mode="+this.workflow.stepProcessType+"&stepId="+this.bean.stepId+"&stepDefId="+this.workflow.stepDefId+"&userType=processorUser";
				this.$pdView.navigateTo(url).then(res=>{
					console.log(res);
				});
			},
			//选择协办人员
			selectHelperUsers(){
				let url = "../common/selectUsers?mode=MULTI_MASTER&stepId="+this.bean.stepId+"&stepDefId="+this.workflow.stepDefId+"&userType=helperUser";
				this.$pdView.navigateTo(url).then(res=>{
					console.log(res);
				});
			},
			//选择抄送人员
			selectCopyReaderUsers(){
				let url = "../common/selectUsers?mode=MULTI_MASTER&stepId="+this.bean.stepId+"&stepDefId="+this.workflow.stepDefId+"&userType=copyReaderUser";
				this.$pdView.navigateTo(url).then(res=>{
					console.log(res);
				});
			},
			loadWorkflowProBeforeInfo(e){
				this.$flowManageSvr.loadWorkflowProBeforeInfo(e.stepId,"JOINTTRAN").then(res=>{
					this.workflow = res.data_json;
					//===========数据初始化===========
					this.kjyjArray = this.workflow.yclInfo.kjyjData;
					//有意见类型，默认选择第一项
					if(this.workflow.yclInfo.opinionType.length>0){
						this.bean.opinionType = this.workflow.yclInfo.opinionType[0].typeCode;
					}
					this.$pdAction.closeWait();
				}).catch(error=>{
					this.$pdAction.toast("获取数据失败！"+error,{icon:'none'});
					this.$pdAction.closeWait();
					console.log(error);
				});
			},
			jointProcessTran(){
				//必填数据验证
				if(typeof(this.bean.selectUsers)=='undefined' || this.bean.selectUsers ==''){
					this.$pdAction.toast('请选择办理人！',{icon:'none'});
					return false;
				}
				if(typeof(this.bean.opinion)=='undefined' || this.bean.opinion ==''){
					this.$pdAction.toast('请填写处理意见！',{icon:'none'});
					return false;
				}
				this.$pdAction.showWait("正在执行交办，请稍等！",false);
				this.$flowManageSvr.workflowJointProcessTransition(this.bean).then(res=>{
					this.$pdAction.closeWait();
					this.$pdAction.alert("交办成功",{title:"操作结果"}).then(res=>{
						this.$pdView.passValToPrePage({refresh:true},2);
					}).catch(error=>{
						this.$pdView.reLaunch("../../../tabBar/index/index");
					});
				}).catch(error=>{
					this.$pdAction.closeWait();
					this.$pdAction.toast("交办失败!"+error,{icon:'none'});
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