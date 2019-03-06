<template>
	<view class="flowContent">
		<flow-quick-word ref="flowQuickWord" :kjyjArray="kjyjArray" @pReSetOpinion="reSetOpinion" :flowDefId="workflow.workflowDefId"></flow-quick-word>
		<view>
			<view class="uni-list-cell uni-collapse listBg4">
				<view class="uni-list-cell-navigate uni-navigate-bottom" :class="isFkyj ? 'uni-active' : ''" @click="trigerCollapse('fkyj')">
					反馈意见
				</view>
				<view class="uni-collapse-content" :class="isFkyj ? 'uni-active' : ''">
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
								<textarea class="return-textarea" placeholder="请在此输入您的反馈意见..." v-model="bean.opinion"/>
							</view>
							<view class="kjyj" @tap="showKjyj()">快捷常用语</view>
						</block>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="dg-nav">
				<view class="li" @tap="feedback()">
					<view class="a">返回</view>
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
				isFkyj: true,
				workflow: {
					yclInfo: {
						opinionType: []
					}
				},
				bean: {
					opinion:''
				},
				kjyjArray: []
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
					if(this.isFkyj){
						this.isFkyj = false;
					}else{
						this.isFkyj = true;
					}
				}
				console.log(this.isFkyj);
			},
			loadWorkflowProBeforeInfo(e){
				this.$flowManageSvr.loadWorkflowProBeforeInfo(e.stepId,"FEEDBACK").then(res=>{
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
			feedback(){
				this.$pdAction.showWait("正在执行返回，请稍等！",false);
				this.$flowManageSvr.workflowFeedBack(this.bean).then(res=>{
					this.$pdAction.closeWait();
					this.$pdAction.alert("返回成功",{title:"操作结果"}).then(res=>{
						this.$pdView.passValToPrePage({refresh:true},2);
					}).catch(error=>{
						this.$pdView.reLaunch("../../../tabBar/index/index");
					});
				}).catch(error=>{
					this.$pdAction.closeWait();
					this.$pdAction.toast("返回失败!"+error,{icon:'none'});
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