<template>
	<view class="flowContent">
		<flow-quick-word ref="flowQuickWord" :kjyjArray="kjyjArray" @pReSetOpinion="reSetOpinion" :flowDefId="workflow.workflowDefId"></flow-quick-word>
		<view>
			<view class="uni-list-cell uni-collapse listBg4">
				<view class="uni-list-cell-navigate uni-navigate-bottom" :class="isYdyj ? 'uni-active' : ''" @click="trigerCollapse('ydyj')">
					阅读意见
				</view>
				<view class="uni-collapse-content" :class="isYdyj ? 'uni-active' : ''">
					<view class="tabs-opt">
						<block>
							<view class="h3">
								<textarea class="return-textarea" placeholder="请在此输入您的阅读意见..." v-model="bean.opinion"/>
							</view>
							<view class="kjyj" @tap="showKjyj()">快捷常用语</view>
						</block>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="dg-nav">
				<view class="li" @tap="reader()">
					<view class="a">已阅</view>
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
				isYdyj: true,
				workflow: {
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
				if(e === 'ydyj'){
					if(this.isYdyj){
						this.isYdyj = false;
					}else{
						this.isYdyj = true;
					}
				}
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
			reader(){
				if(typeof(this.bean.opinion)=="undefined" || this.bean.opinion==''){
					this.$pdAction.toast("请填写阅读意见！",{icon:'none'});
					return false;
				}
				this.$pdAction.showWait("正在办结任务，请稍等！",false);
				this.$flowManageSvr.workflowReader(this.bean).then(res=>{
					this.$pdAction.closeWait();
					this.$pdAction.alert("已阅办结成功",{title:"提示"}).then(res=>{
						this.$pdView.passValToPrePage({refresh:true},2);
					}).catch(error=>{
						this.$pdView.reLaunch("../../../tabBar/index/index");
					});
				}).catch(error=>{
					this.$pdAction.closeWait();
					this.$pdAction.toast("已阅办结失败!"+error,{icon:'none'});
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