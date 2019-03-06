<template>
	<view class="footer">
		<view class="dg-nav">
			<view class="li" v-for="(item,index) in footerNav" :key="index" @tap="openDetail(item.src,item.isCheck,item.param)">
				<view class="a">{{item.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {PdResource} from '../../../../common/powerapp/js/pd.resource.js';
	import {PdView} from '../../../../common/powerapp/js/pd.view.js';
	import {FlowBaseSvr} from '../../../../common/powerapp/js/flowSvr.js';
	export default {
		data() {
			return {
				footerNav:[],
				now_page_index:0,
			};
		},
		methods:{
			change_nav(index){
				this.now_page_index = index;
			},
			loadFlowInfo(xh, bzbh){
				this.$flowSvr.loadFlowInfo(xh,bzbh).then(res=>{
					let isShowFreeFlowBtn = res.data_json.isFreeflow;
					if(isShowFreeFlowBtn){//自由流办理按钮
						this.footerNav.push({name: "转交",src: "flowManage/freeflow/transition",isCheck: true,param: {stepId: bzbh}});
						if(typeof res.data_json.isFirstStep != "undefined" && !res.data_json.isFirstStep){
							this.footerNav.push({name: "退回",src: "flowManage/freeflow/sendBack",isCheck: false,param: {stepId: bzbh}});
						}
						this.footerNav.push({name: "结束",src: "flowManage/freeflow/finish",isCheck: true,param: {stepId: bzbh}});
					}else{//固定流办理按钮
						if(typeof bzbh != "undefined" && bzbh != ''){
							let flowBtn = res.data_json.flowBtn;
							if(!flowBtn.canReaded && flowBtn.canTransition){
								this.footerNav.push({name: "转交",src: "flowManage/workflow/transition",isCheck: true,param: {stepId: bzbh}});
							}
							if(flowBtn.canTurnDeal){
								this.footerNav.push({name: "转办",src: "flowManage/workflow/turnDeal",isCheck: true,param: {stepId: bzbh}});
							}
							if(flowBtn.canReaded){
								this.footerNav.push({name: "已阅",src: "flowManage/workflow/reader",isCheck: false,param: {stepId: bzbh}});
							}
							//会签相关按钮
							if(flowBtn.canCountersign){
								this.footerNav.push({name: "会签",src: "flowManage/workflow/counterSign",isCheck: true,param: {stepId: bzbh}});
							}
							if(flowBtn.canFeedback){
								this.footerNav.push({name: "返回",src: "flowManage/workflow/feedback",isCheck: false,param: {stepId: bzbh}});
							}
							if(flowBtn.canEndorse){
								this.footerNav.push({name: "加签",src: "flowManage/workflow/endorse",isCheck: false,param: {stepId: bzbh}});
							}
							//会办相关按钮
							if(flowBtn.canJointProcess){
								this.footerNav.push({name: "会办",src: "flowManage/workflow/jointProcess",isCheck: true,param: {stepId: bzbh}});
							}
							if(flowBtn.canJointProcessFeedback){
								this.footerNav.push({name: "返回",src: "flowManage/workflow/jointProcessFeedback",isCheck: false,param: {stepId: bzbh}});
							}
							if(flowBtn.canJointProcessTransition){
								this.footerNav.push({name: "交办",src: "flowManage/workflow/jointProcessTransition",isCheck: false,param: {stepId: bzbh}});
							}
							
							if(flowBtn.canSingleFinish || flowBtn.canCountersignFinish || flowBtn.canJointProcessFinish){
								this.footerNav.push({name: "完毕",src: "flowManage/workflow/singleFinish",isCheck: false,param: {stepId: bzbh}});
							}
							if(flowBtn.canFinish){
								this.footerNav.push({name: "结束",src: "flowManage/workflow/finish",isCheck: true,param: {stepId: bzbh}});
							}
							if(flowBtn.canSendback){
								this.footerNav.push({name: "退回",src: "flowManage/workflow/sendBack",isCheck: false,param: {stepId: bzbh}});
							}
							if(flowBtn.canCopyReader){
								this.footerNav.push({name: "抄送",src: "flowManage/workflow/copyReader",isCheck: false,param: {stepId: bzbh}});
							}
						}
					}
				})
			},
			openDetail(src,isCheck,param){
				let url = "../"+src+"?stepId="+param.stepId;
				this.$pdView.navigateTo(url).then(res=>{
					console.log(res);
				});
			}
		},
		computed:{
			footer_nav(){
				console.log(this.footerNav)
				return this.footerNav
			},
			now_index(){
				return this.now_page_index;
			}
		}
	}
</script>

<style>
	@import '../css/flow.css';
</style>
