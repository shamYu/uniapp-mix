<template>
	<view class="flowContent">
		<flow-quick-word ref="flowQuickWord" :kjyjArray="kjyjArray" @pReSetOpinion="reSetOpinion" :flowDefId="workflow.workflowDefId"></flow-quick-word>
		<view>
			<view class="table-list-ctn">
				<input v-if="false" name="nextProcessors" id="nextProcessors"/>
				<input v-if="false" name="copyReaderUsers" id="copyReaderUsers"/>
				<block>
					<ul class="opt-box users">
						<li>
							<h1>办理人：</h1>
							<i v-for="user in processorUsers" :key="user.userId">{{user.userName}}</i>
							<a href="javascript:;" @tap="selectProcessorUsers(freeflow.LCXX.userSelectMode,freeflow.LCXX.freeflowId)"></a>
						</li>
						<li>
							<h1>抄送人：</h1>
							<i v-for="user in copyReaderUsers" :key="user.userId">{{user.userName}}</i>
							<a href="javascript:;" @tap="selectCopyReaderUsers(freeflow.LCXX.freeflowId)"></a>
						</li>
					</ul>
				</block>
			</view>
			<view class="gap" style="background:#eef0f2;"></view>
			<view class="uni-list-cell uni-collapse listBg4">
				<view class="uni-list-cell-navigate uni-navigate-bottom" :class="isBLyj ? 'uni-active' : ''" style="border-bottom: 1upx solid #e2e2e7;" @click="trigerCollapse('blyj')">
					办理意见
				</view>
				<view class="uni-collapse-content" :class="isBLyj ? 'uni-active' : ''">
					<view class="tabs-opt">
						<block>
							<view v-if="freeflow.QZXX.canSign || freeflow.YJLX.length>0">
								<view class="uni-flex uni-row" v-if="freeflow.QZXX.canSign">
									<view class="flex-item">{{freeflow.QZXX.signDesc}}：</view>
									<radio-group class="uni-flex" name="gender">
										<label>
											<radio value="1" :checked="bean.signature == '1' ? true : false" v-model="bean.signature"/>{{freeflow.QZXX.agreeDesc}}</label>
										<label>
											<radio value="0" :checked="bean.signature == '0' ? true : false" v-model="bean.signature"/>{{freeflow.QZXX.noAgreeDesc}}</label>
									</radio-group>
								</view>
								<view class="uni-flex uni-row" v-if="freeflow.YJLX.length>1">
									<view class="flex-item">意见类型：</view>
									<radio-group class="uni-flex" name="gender">
										<label v-for="item in freeflow.YJLX" :key="item.typeCode">
											<radio :value="item.typeCode" :checked="bean.opinionType == item.typeCode ? true : false" v-model="bean.opinionType"/>{{item.typeName}}
										</label>
									</radio-group>
								</view>
							</view>
							<view class="h3">
								<textarea class="return-textarea" placeholder="请在此输入您的办理意见..." v-model="bean.opinion"/>
							</view>
							<view class="kjyj" @tap="showKjyj()">快捷常用语</view>
						</block>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="dg-nav">
				<view class="li" @tap="transition()">
					<view class="a">转交</view>
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
				isBLyj: true,
				freeflow: {
					QZXX: {
						canSign: false
					},
					YJLX: []
				},
				workflow: {
				},
				bean: {
					opinion:''
				},
				kjyjArray: [],
				processorUsers: [],
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
			this.loadFreeflowProBeforeInfo(e);
		},
		methods: {
			trigerCollapse(e) {
				if(e === 'blyj'){
					if(this.isBLyj){
						this.isBLyj = false;
					}else{
						this.isBLyj = true;
					}
				}
			},
			setDataSu (evt){//获取单选人员传过来的值
				let userType = evt.userType;
				if(userType === "processorUser"){
					this.processorUsers = evt.mdata;
					this.bean.nextProcessors = '';
					for(let item of evt.mdata){
						if(this.bean.nextProcessors!=''){
							this.bean.nextProcessors += ',';
						}
						this.bean.nextProcessors += item.userId;
					}
				}else{
					this.copyReaderUsers = evt.mdata;
					this.bean.copyReaderUsers = '';
					for(let item of evt.mdata){
						if(this.bean.copyReaderUsers!=''){
							this.bean.copyReaderUsers += ',';
						}
						this.bean.copyReaderUsers += item.userId;
					}
				}
			},
			selectProcessorUsers(mode,freeflowId){
				let url = "../common/selectUsers?mode="+mode+"&freeflowId="+freeflowId+"&userType=processorUser";
				this.$pdView.navigateTo(url).then(res=>{
					console.log(res);
				});
			},
			selectCopyReaderUsers(freeflowId){
				let url = "../common/selectUsers?mode=MULTI_MASTER&freeflowId="+freeflowId+"&userType=copyReaderUser";
				this.$pdView.navigateTo(url).then(res=>{
					console.log(res);
				});
			},
			loadFreeflowProBeforeInfo(e){
				this.$flowManageSvr.loadFreeflowProBeforeInfo(e.stepId,"TRANSITION").then(res=>{
					this.freeflow = res.data_json;

					//数据初始化
					if(this.freeflow.QZXX.canSign){//如果能签字，默认选择同意项
						this.bean.signature="1";
					}
					if(this.freeflow.YJLX.length>0){//有意见类型，默认选择第一项
						this.bean.opinionType = this.freeflow.YJLX[0].typeCode;
					}
					this.kjyjArray = this.freeflow.KJYJ;
					this.workflow.workflowDefId = this.freeflow.LCXX.freeflowDefId;
					this.$pdAction.closeWait();
				}).catch(error=>{
					this.$pdAction.closeWait();
					console.log(error);
				});
			},
			transition(){
				if(typeof(this.bean.nextProcessors)=="undefined"){
					this.$pdAction.toast("请选择办理人！",{icon:'none'});
					return false;
				}
				this.$pdAction.showWait("正在执行流转，请稍等！",false);
				this.$flowManageSvr.freeTransition(this.bean).then(res=>{
					this.$pdAction.closeWait();
					this.$pdAction.alert("转交成功",{title:"操作结果"}).then(res=>{
						this.$pdView.passValToPrePage({refresh:true},2);
					}).catch(error=>{
						this.$pdView.reLaunch("../../../tabBar/index/index");
					});
				}).catch(error=>{
					this.$pdAction.closeWait();
					this.$pdAction.toast("转交失败!"+error,{icon:'none'});
				});
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
