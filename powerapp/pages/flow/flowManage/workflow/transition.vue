<template>
	<view class="flowContent">
		<flow-quick-word ref="flowQuickWord" :kjyjArray="kjyjArray" @pReSetOpinion="reSetOpinion" :flowDefId="workflow.workflowDefId"></flow-quick-word>
		<view>
			<view class="table-list-ctn">
				<!--下一办理步骤，用#号分开多个-->
				<input v-if="false" name="selectSteps" id="selectSteps" v-model="bean.selectSteps"/>
				<!--办理人，不同步骤的办理人用@号分开，办理人之间用#号隔开-->
				<input v-if="false" name="selectUsers" id="selectUsers" v-model="bean.selectUsers"/>
				<!--协办人员，不同步骤的协办人员用@号分开，协办人员之间用#号隔开-->
				<input v-if="false" name="selectHelpers" id="selectHelpers" v-model="bean.selectHelpers"/>
				<!--抄送人员，不同步骤的抄送人员用@号分开，抄送人员之间用#号隔开-->
				<input v-if="false" name="selectReaders" id="selectReaders" v-model="bean.selectReaders"/>
				<block>
					<ul class="opt-box users">
						<li>
							<h1>当前步骤：<span>{{workflow.stepName}}</span></h1>
						</li>
						<li>
							<h1>下一步骤：</h1>
							<view style="width:90%;word-break: break-all;word-wrap: break-word;line-height: 90upx;">
								<radio-group class="uni-flex" name="type" v-if="stepSelectType == 'radio' && isShowStep">
									<label v-for="step in nextSteps" :key="step.stepDefId" @tap="selectNextStep(step)">
										<radio :value="step.stepDefId" :checked="nextStep == step.stepDefId? true : false" v-model="nextStep"/>{{step.stepName}}
									</label>
								</radio-group>
								<checkbox-group class="uni-flex" name="type" v-if="stepSelectType == 'checkbox' && isShowStep">
									<label v-for="step in nextSteps" :key="step.stepDefId" @tap="selectNextStep(step)">
										<checkbox :value="step.stepDefId" :checked="nextStep == step.stepDefId? true : false" v-model="nextStep"/>{{step.stepName}}
									</label>
								</checkbox-group>
								<!--自定义流转功能-->
								<picker v-if="workflow.yclInfo.canUserDefine" @change="changeSelectStep" mode="selector" :value="index" :range="allSteps">
									<view class="uni-input">{{allSteps[index]}}</view>
								</picker>
							</view>
						</li>
						<!--步骤单选情况-->
						<li v-if="stepSelectType == 'radio'">
							<h1>办理人：</h1>
							<i v-for="user in processorUsers" :key="user.userId">{{user.userName}}</i>
							<a href="javascript:;" @tap="selectProcessorUsers()"></a>
						</li>
						<!--步骤多选情况-->
						<li v-for="(step,index1) in nextSteps" :key="index1" v-if="stepSelectType == 'checkbox' && showBzblr[step.stepDefId]">
							<h1 ng-cloak>[{{step.stepName}}]办理人：</h1>
							<i v-for="(user,index2) in stepUsers[step.stepDefId]" :key="index2">{{user.userName}}</i>
							<a href="javascript:;" @tap="selectStepUsers(step)"></a>
						</li>
						<li>
							<h1>传阅人：</h1>
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
							<view v-if="workflow.yclInfo.canSignature || workflow.yclInfo.opinionType.length>0" style="font-size:38upx!important;margin-bottom:24upx;">
								<view class="uni-flex uni-row" v-if="workflow.yclInfo.canSignature">
									<view class="flex-item">{{workflow.yclInfo.signData.signatureDesc}}：</view>
									<radio-group class="uni-flex" name="type" style="padding-bottom:12upx;">
										<label>
											<radio value="1" :checked="bean.signature == '1' ? true : false" v-model="bean.signature"/>{{workflow.yclInfo.signData.agreeDesc}}
										</label>
										<label>
											<radio value="0" :checked="bean.signature == '0' ? true : false" v-model="bean.signature"/>{{workflow.yclInfo.signData.noAgreeDesc}}
										</label>
									</radio-group>
								</view>
								<view class="uni-flex uni-row" v-if="workflow.yclInfo.opinionType.length>1">
									<view class="flex-item">意见类型：</view>
									<radio-group class="uni-flex" name="gender" style="padding-bottom:12upx;">
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
	let  graceChecker = require("../../../../../common/graceChecker.js");
	export default {
		data() {
			return {
				isClyj: true,
				workflow: {
					yclInfo: {
						opinionType: [],
						signData: {
							
						}
					}
				},
				bean: {
					opinion:''
				},
				kjyjArray: [],
				showBzblr: {},
				stepUsers: {},
				isShowStep: true,
				stepSelectType: "radio",
				index: 0,
				allSteps: [],
				allStepIds: [],
				procType: "",
				nextStep: "",
				nextSteps: [],
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
			setDataSu (evt){//获取单选人员传过来的值
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
					this.setDefaultOpinion();//设置默认处理意见
				}else if(userType === "stepUser"){
					this.stepUsers[evt.stepDefId] = evt.mdata;
					this.setDefaultOpinion();//设置默认处理意见
				}else if(userType === "copyReaderUser"){
					this.copyReaderUsers = evt.mdata;
					this.bean.selectReaders = '';
					for(let item of evt.mdata){
						if(this.bean.selectReaders!=''){
							this.bean.selectReaders += ',';
						}
						this.bean.selectReaders += item.userId;
					}
					this.setDefaultOpinion();//设置默认处理意见
				}else{
					
				}
			},
			selectProcessorUsers(){
				var currentSelectStepId = this.bean.selectSteps;
				console.log(currentSelectStepId);
				if(typeof(currentSelectStepId)=='undefined' || currentSelectStepId ==''){
					this.$pdAction.toast("请先选择下一步骤!",{icon:'none'});
					return false;
				}
				let url = "../common/selectUsers?mode="+this.procType+"&stepId="+this.bean.stepId+"&stepDefId="+currentSelectStepId+"&userType=processorUser";
				this.$pdView.navigateTo(url).then(res=>{
					console.log(res);
				});
			},
			selectStepUsers(step){
				let url = "../common/selectUsers?mode="+this.procType+"&stepId="+this.bean.stepId+"&stepDefId="+step.stepDefId+"&userType=stepUser";
				this.$pdView.navigateTo(url).then(res=>{
					console.log(res);
				});
			},
			selectCopyReaderUsers(){
				let url = "../common/selectUsers?mode=MULTI_MASTER&userType=copyReaderUser";
				this.$pdView.navigateTo(url).then(res=>{
					console.log(res);
				});
			},
			selectNextStep(step){
				//如果步骤是单选类型，即不能分支
				if(this.stepSelectType =="radio"){
					//重新设置选择的步骤
					this.bean.selectSteps = step.stepDefId;
					//设置下一步骤的处理类型
					this.procType = step.procType;
					//重新设置步骤的默认处理人
					this.bean.selectUsers = "";
					this.processorUsers = [];
					//设置默认办理人
					if(step.defaultUser.length>0){
						let userIds = '';
						for(let user in step.defaultUser){
							userIds += userIds==''?user.userId:'#'+user.userId;
						}
						this.bean.selectUsers = userIds;
						this.processorUsers = step.defaultUser;
						this.setDefaultOpinion();//设置默认处理意见
					}
				}else{
					//流程步骤分支处理逻辑
					setTimeout(function(){
						if(step.stepDefId == this.nextStep){//选中步骤时
							//向bean.selectSteps添加该步骤
							if(typeof(this.bean.selectSteps)=='undefined' || this.bean.selectSteps ==''){
								this.bean.selectSteps = step.stepDefId;
							}else{
								this.bean.selectSteps += '#' + step.stepDefId;
							}
							this.showBzblr[step.stepDefId] = true;//展示该步骤对应的办理人选择区域
							this.stepUsers[step.stepDefId] = step.defaultUser;//设置步骤对应的默认办理人
						}else{//取消步骤选择时
							//移除bean.selectSteps中该步骤编号
							let newSteps = "";
							let steps = this.bean.selectSteps.split("#");
							for(let i=0,n=steps.length;i<n;i++){
								if(steps[i]!=step.stepDefId){
									newSteps += newSteps == ""?steps[i]:"#"+steps[i];
								}
							}
							this.bean.selectSteps = newSteps;//重置所选择的步骤
							this.showBzblr[step.stepDefId] = false;//隐藏该步骤对应的办理人选择区域
							this.stepUsers[step.stepDefId] = [];//清空步骤办理人
						}
						this.setDefaultOpinion();//设置默认处理意见
						//this.$apply();
					},250);
				}
			},
			changeSelectStep(e){
				this.index = e.target.value;
				this.myStepId = this.allStepIds[this.index];
				let selectStepId = this.myStepId;
				//如果步骤是单选类型，即不能分支
				if(this.stepSelectType =="radio"){
					if(selectStepId != ''){
						this.nextSteps = [];
						//重新设置选择的步骤
						this.bean.selectSteps = selectStepId;
						//重新设置步骤的默认处理人
						this.bean.selectUsers = "";
						this.processorUsers = [];
						//设置下一步骤的处理类型
						for(let step of this.workflow.yclInfo.allSteps){
							if(step.stepDefId == selectStepId){
								this.procType = step.procType;
							}
						}
					}else{
						this.nextSteps = this.workflow.yclInfo.nextSteps;
						for(let step of this.workflow.yclInfo.allSteps){
							if(step.stepDefId == selectStepId){
								this.procType = step.procType;
							}
						}
					}
				}else{
					//流程步骤分支处理逻辑
					if(selectStepId != ''){
						this.nextSteps = [];
						this.bean.selectSteps = selectStepId;//重新设置选择的步骤
						//办理人相关数据处理
						for(let step of this.workflow.yclInfo.allSteps){
							if(step.stepDefId == selectStepId){
								this.nextSteps.push(step);
								this.showBzblr[step.stepDefId] = true;
							}else{
								this.showBzblr[step.stepDefId] = false;
								this.stepUsers[step.stepDefId] = [];
							}
						}
						this.isShowStep = false;//隐藏步骤复选区
					}else{
						this.isShowStep = true;
						this.nextSteps = this.workflow.yclInfo.nextSteps;
					}
				}
				this.bean.opinion = '';
			},
			loadWorkflowProBeforeInfo(e){
				this.$flowManageSvr.loadWorkflowProBeforeInfo(e.stepId,"TRANSITION").then(res=>{
					this.workflow = res.data_json;
					//====转交页面相关数据初始化===========
					this.kjyjArray = this.workflow.yclInfo.kjyjData;
					//步骤是否允许分支
					if(this.workflow.yclInfo.canSplit){
						this.stepSelectType ="checkbox";
					}
					//如果只有一个步骤，那么默认选中该步骤及设置该步骤默认办理人
					this.nextSteps = this.workflow.yclInfo.nextSteps;
					let nextSteps = this.nextSteps;
					if(nextSteps.length==1){
						//选中当前唯一步骤
						this.nextStep = nextSteps[0].stepDefId;
						this.bean.selectSteps = nextSteps[0].stepDefId;
						//设置当前唯一步骤的处理类型
						this.procType = nextSteps[0].procType;
						//设置默认办理人
						if(nextSteps[0].defaultUser.length>0){
							let userIds = '';
							for(let user of nextSteps[0].defaultUser){
								userIds += userIds==''?user.userId:'#'+user.userId;
							}
							this.bean.selectUsers = userIds;
							this.processorUsers = nextSteps[0].defaultUser;
							this.setDefaultOpinion();//设置默认处理意见
						}
					}
					if(this.workflow.yclInfo.canUserDefine){
						for(let item of this.workflow.yclInfo.allSteps){
							this.allStepIds.push(item.stepDefId);
							this.allSteps.push(item.stepName);
						}
					}
					//如果允许签字，默认选择同意项
					if(this.workflow.yclInfo.canSignature){
						this.bean.signature = "1";
					}
					//有意见类型，默认选择第一项
					if(this.workflow.yclInfo.opinionType.length>0){
						this.bean.opinionType = this.workflow.yclInfo.opinionType[0].typeCode;
						this.bean.signFlag= this.workflow.yclInfo.opinionType[0].typeSignFlag;
					}
					/* if(signType=='2'){ //金格签章需要初始化
						flowSignSvr.initSign('test','');
					} */
					this.$pdAction.closeWait();
				}).catch(error=>{
					this.$pdAction.toast("获取数据失败！"+error,{icon:'none'});
					this.$pdAction.closeWait();
				});
			},
			//设置默认处理意见
			setDefaultOpinion(){
				let oldOpinon = this.bean.opinion||"";//获取当前处理意见，如果意见为空或为系统标准意见才重置
				if(oldOpinon=='' || (oldOpinon.indexOf('请')==0 && (oldOpinon.indexOf('办理')>1 || oldOpinon.indexOf('共阅')>1))){
					let optionyj='',userNames = '',userNameCs = '';
					//获取办理人
					if(this.stepSelectType == "radio"){ //步骤单选情况
						if(this.processorUsers!=null && this.processorUsers != undefined){
							for(let item of this.processorUsers){
								if(userNames!=''){
									userNames += '，';
								}
								userNames += item.userName;
							}
						}
					}else{//步骤出现分支的情况
						let steps = this.bean.selectSteps.split("#");
						(function(){
							for(let i=0,n=steps.length;i<n;i++){
								for(let j=0,k=this.stepUsers[steps[i]].length;j<k;j++){
									if(userNames!=''){
										userNames += '，';
									}
									userNames += this.stepUsers[steps[i]][j].userName;
								}
							}
						})()
					}
					//获取传阅人
					if(this.copyReaderUsers!=null && this.copyReaderUsers != undefined){
						for(let item of this.copyReaderUsers){
							if(userNameCs!=''){
								userNameCs += '，';
							}
							userNameCs += item.userName;
						}
					}
					if(userNames !=''){
						optionyj = '请'+userNames+'办理';
					}
					if(userNameCs !=''){
						if(userNames !=''){
							optionyj += '，';
						}
						optionyj += '请'+userNameCs+'共阅';
					}
					this.bean.opinion = optionyj;
				}
			},
			transition(){
				//验证步骤是否选择了
				if(typeof(this.bean.selectSteps)=='undefined' || this.bean.selectSteps ==''){
					this.$pdAction.toast('请选择下一步骤！',{icon:'none'});
					return false;
				}
				//验证步骤的办理人是否选择了
				if(this.stepSelectType == "radio"){ //步骤单选情况
					if(typeof(this.bean.selectUsers)=='undefined' || this.bean.selectUsers ==''){
						this.$pdAction.toast('请选择转办人！',{icon:'none'});
						return false;
					}
				}else{ //步骤多选情况,判断this.stepUsers[step.stepDefId]是否有值
					let stepUsers = "";
					let steps = this.bean.selectSteps.split("#");
					for(let i=0,n=steps.length;i<n;i++){
						if(this.stepUsers[steps[i]].length==0){
							let stepName = document.querySelector("#BZ_"+steps[i]).nextElementSibling.textContent;
							this.$pdAction.toast('请为['+stepName+']步骤设置办理人！',{icon:'none'});
							return false;
						}else{
							//构建各步骤的办理人,向this.bean.selectUsers添加数据
							let userIds = "";
							for(let j=0,k=this.stepUsers[steps[i]].length;j<k;j++){
								userIds += userIds == ""?this.stepUsers[steps[i]][j].userId:"#"+this.stepUsers[steps[i]][j].userId;
							}
							stepUsers += stepUsers== ""?userIds:"@"+userIds;
						}
					}
					this.bean.selectUsers = stepUsers; //向this.bean.selectUsers添加数据
				}
				
				//验证是否填写处理意见
				if(typeof(this.bean.opinion)=="undefined" || this.bean.opinion == ''){
					this.$pdAction.toast("请先填写您的意见，再进行转交!",{icon:'none'});
					return false;
				}
				
				//验证是否允许签字并执行了签字操作
				if(this.bean.signFlag=='1') { //需要签字
					if(typeof(this.bean.signature)=="undefined" || this.bean.signature == '' || this.bean.signature == null){ //是否已经签字
						this.$pdAction.toast('请先签字,然后再转交！',{icon:'none'});
						return false;
					}
				}
				this.$pdAction.showWait("正在执行转交，请稍等！",false);
				this.$flowManageSvr.workflowTransition(this.bean).then(res=>{
					this.$pdAction.closeWait();
					this.$pdAction.alert("转交成功",{title:"操作结果"}).then(res=>{
						this.$pdView.passValToPrePage({refresh:true},2);
					}).catch(error=>{
						this.$pdView.reLaunch("../../../tabBar/index/index");
					});
				}).catch(error=>{
					this.$pdAction.closeWait();
					this.$pdAction.toast("转交失败!"+error,{icon:'none'});
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