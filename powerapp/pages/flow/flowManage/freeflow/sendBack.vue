<template>
	<view class="flowContent">
		<view class="uni-list-cell uni-collapse listBg4">
			<view class="uni-list-cell-navigate uni-navigate-bottom" :class="isBack ? 'uni-active' : ''" @click="trigerCollapse('back')">
				退回人员
			</view>
			<view class="uni-collapse-content" :class="isBack ? 'uni-active' : ''">
				<checkbox-group @change="checkboxChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="user in freeflow.FBZCLR" :key="user.userId">
						<view style="font-size: 34upx;">{{user.userName}}</view>
						<view>
							<checkbox :value="user.userId" checked="true" />
						</view>
					</label>
				</checkbox-group>
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
	import {FlowManageSvr} from '../../../../../common/powerapp/js/flowManageSvr.js';
	import {PdAction} from '../../../../../common/powerapp/js/pd.action.js';
	import {PdView} from '../../../../../common/powerapp/js/pd.view.js';
	//来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
	var  graceChecker = require("../../../../../common/graceChecker.js");
	export default {
		data() {
			return {
				isBack: true,
				freeflow: {
					FBZCLR: []
				},
				workflow: {
					
				},
				bean: {
					
				},
				kjyjArray: []
			}
		},
		components:{
			FlowManageSvr
		},
		onLoad(e){
			this.bean = e;
			this.$pdAction.showWait("正在加载中...");
			this.loadFreeflowProBeforeInfo(e);
		},
		methods: {
			trigerCollapse(e) {
				console.log(e);
				if(e === 'back'){
					if(this.isBack){
						this.isBack = false;
					}else{
						this.isBack = true;
					}
				}
			},
			loadFreeflowProBeforeInfo(e){
				this.$flowManageSvr.loadFreeflowProBeforeInfo(e.stepId,"SENDBACK").then(res=>{
					this.freeflow = res.data_json;
					
					this.setSendBackUsers(this.freeflow.FBZCLR);
					
					this.kjyjArray = this.freeflow.KJYJ;
					this.workflow.workflowDefId = this.freeflow.LCXX.freeflowDefId;
					this.$pdAction.closeWait();
				}).catch(error=>{
					this.$pdAction.toast("退回失败！"+error,{icon:'none'});
					this.$pdAction.closeWait();
					console.log(error);
				});
			},
			checkboxChange: function (e) {
				var items = this.freeflow.FBZCLR,
					values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					items[i].checked = false;
					for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
						if (items[i].value == values[j]) {
							items[i].checked = true;
							break
						}
					}
				}
			},
			setSendBackUsers(userlist){
				let processor = "";
				for(let i = 0, length = userlist.length; i < length; i++){
					let user = userlist[i];
					if(processor!=''){
						processor += ',';
					}
					processor += user.userId;
				}
				this.bean.nextProcessors = processor;
			},
			sendBack(){
				if(typeof(this.bean.nextProcessors)=="undefined" || this.bean.nextProcessors ==''){
					this.$pdAction.toast("请选择退回人员！",{icon:'none'});
					return false;
				}
				this.$pdAction.showWait("正在执行退回操作，请稍等！",false);
				this.$flowManageSvr.freeSendBack(this.bean).then(res=>{
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
			}
		}
	}
</script>

<style>
	@import '../../css/flow.css';
	
	page{
		background-color: #FFFFFF;
	}
</style>
