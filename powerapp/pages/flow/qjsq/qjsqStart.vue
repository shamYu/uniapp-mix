<template>
	<view class="page">
		<!-- #ifndef MP -->
		<!-- 固定在顶部的导航栏 -->
		<uni-nav-bar fixed="true" left-icon="back" color="#ffffff" @click-left="back" @click-right="save" right-text="保存"
		 title="请假申请信息"></uni-nav-bar>
		<!-- 使用非原生导航栏后需要在页面顶部占位 -->
		<!-- #ifdef APP-PLUS || H5 -->
		<view class="pos-nav-app"></view>
		<!-- #endif -->
		<!-- #endif -->

		<view>
			<block>
				<view class="uni-list-cell uni-collapse listBg1">
					<view class="uni-list-cell-navigate uni-navigate-bottom" :class="isJbxx ? 'uni-active' : ''" @click="trigerCollapse('jbxx')">
						基本信息
					</view>
					<view class="uni-collapse-content" :class="isJbxx ? 'uni-active' : ''">
						<form @submit="save">
							<view class="table-list-ctn" width="100%">
								<ul>
									<li>
										<span class="span-hd"><span class="mfill">*&nbsp;</span>请假人：</span>
										<span class="uni-input">{{bean.QJR}}</span>
									</li>
									<li>
										<span class="span-hd"><span class="mfill">*&nbsp;</span>请假类型：</span>
										<span class="span-value" @tap="showSinglePicker">
											<span class="uni-input">{{TZLXMC ? TZLXMC : '请选择请假类型'}}</span>
										</span>
									</li>
									<li>
										<span class="span-hd"><span class="mfill">*&nbsp;</span>请假开始时间：</span>
										<span class="span-value">
											<view class="uni-list-cell-db">
												<picker class="pickerView" mode="date" :start="startDate" :end="endDate" @change="bindDateChangeStart">
													<view class="uni-input">{{bean.QJSJKS ? bean.QJSJKS : '请选择请假开始时间'}}</view>
												</picker>
											</view>
										</span>
									</li>
									<li>
										<span class="span-hd"><span class="mfill">*&nbsp;</span>请假结束时间：</span>
										<span class="span-value">
											<view class="uni-list-cell-db">
												<picker class="pickerView" mode="date" :start="startDate" :end="endDate" @change="bindDateChangeEnd">
													<view class="uni-input">{{bean.QJSJJS ? bean.QJSJJS : '请选择请假结束时间'}}</view>
												</picker>
											</view>
										</span>
									</li>
									<li style="height:190upx;">
										<span class="span-hd"><span class="mfill">*&nbsp;</span>请假原因：</span>
										<span class="span-value">
											<view class="uni-textarea">
												<textarea placeholder="请假原因..." v-model="bean.TZCXJB" />
												</view>
										</span>
									</li>
									<li style="height:190upx;">
										<span class="span-hd">备注：</span>
										<span class="span-value">
											<view class="uni-textarea">
												<textarea placeholder="备注..." v-model="bean.BZ"/>
											</view>
										</span>
									</li>
								</ul>
							</view>
						</form>
	                </view>
	            </view>
	        </block>
	    </view>
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
    </view>
</template>

<script>
	import uniNavBar from '../../../../components/uni-nav-bar.vue'
	import uniIcon from '../../../../components/uni-icon.vue'
	import mpvuePicker from '../../../../components/mpvue-picker/mpvuePicker.vue';
	import {PdCache} from '../../../../common/powerapp/js/pd.cache.js';
	import {PdResource} from '../../../../common/powerapp/js/pd.resource.js';
	import {PdAction} from '../../../../common/powerapp/js/pd.action.js';
	import {PdView} from '../../../../common/powerapp/js/pd.view.js';
	//来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
	var  graceChecker = require("../../../../common/graceChecker.js");
	export default {
		components: {
			uniNavBar,
			uniIcon,
			mpvuePicker
		},
		data() {
			const currentDate = this.getDate({
				format: true
			});
			return {
				isJbxx: true,
				bean: {
					QJSJKS: '',
					QJSJJS: '',
					QJR: ''
				},
				pickerSingleArray: [],
				cityPickerValueDefault: [0, 0, 1],
				themeColor: '#007AFF',
				pickerText: '',
				mode: '',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray:[],
				TZLXMC: '',
				param: {}
			};
		},
		onLoad(e) {
			this.param = e;
			let dmj = this.$pdCache.getGgdmzBydmj("QJLX");
			for(let dmz of dmj){
				this.pickerSingleArray.push({label: dmz.DMNR,	value: dmz.DM});
			}
			this.bean.QJR = this.$pdCache.getCurrUserInfo().YHMC;
		},
		computed:{
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods:{
			back (){
				uni.navigateBack();
			},
			bindDateChangeStart: function(e) {
				this.bean.QJSJKS = e.target.value;
			},
			bindDateChangeEnd: function(e) {
				this.bean.QJSJJS = e.target.value;
			},
			trigerCollapse(e) {
			    if(e === 'jbxx'){
			    	if(this.isJbxx){
			    		this.isJbxx = false;
			    	}else{
			    		this.isJbxx = true;
			    	}
			    }
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;

				return `${year}-${month}-${day}`;
			},
			// 单列
			showSinglePicker() {
				this.pickerValueArray = this.pickerSingleArray;
				this.mode = 'selector';
				this.deepLength = 1;
				this.pickerValueDefault = [0];
				this.$refs.mpvuePicker.show();
			},
			onCancel(e) {
				console.log(e)
			},
			onConfirm(e) {
				this.bean.TZLXDM = e.value[0];
				this.TZLXMC = e.label;
			},
			onBackPress() {
				if (this.$refs.mpvuePicker.showPicker) {
					this.$refs.mpvuePicker.pickerCancel();
					return true;
				}
			},
			onUnload() {
				if (this.$refs.mpvuePicker.showPicker) {
					this.$refs.mpvuePicker.pickerCancel();
				}
			},
			save (e){
				//将下列代码加入到对应的检查位置
				//定义表单规则
				var rule = [
					{name:"QJR", checkType : "notnull", checkRule:"",  errorMsg:"请填写姓名"},
					{name:"TZLXDM", checkType : "notnull", checkRule:"",  errorMsg:"请选择请假类型"},
					{name:"QJSJKS", checkType : "notnull", checkRule:"",  errorMsg:"请选择请假开始时间"},
					{name:"QJSJJS", checkType : "notnull", checkRule:"",  errorMsg:"请选择请假结束时间"},
					{name:"TZCXJB", checkType : "notnull", checkRule:"",  errorMsg:"请填写请假原因"}
				];
				//进行表单检查
				var formData = this.bean;
				var checkRes = graceChecker.check(formData, rule);
				if(checkRes){
					//验证时间合法性
					var d1 = new Date(this.bean.QJSJKS.replace(/-/g,'/'));
					var d2 = new Date(this.bean.QJSJJS.replace(/-/g,'/'));
					if(d1>d2){
						this.$pdAction.alert("开始时间不能大于结束时间！",{title:"操作结果"}).then(res=>{
						});
						return false;
					}else{
						let business = {
							"dwmc":"[" + this.bean.QJR + "]的请假申请"
						}
						this.$pdResource.service({
							data: {
								service: 'SAVE_START_FLOW',
								table: 'T_DEMO_QJLC',
								primaryKey: 'XH',
								bean: JSON.stringify(this.bean),
								flowType: this.param.LCBH,
								businessInfo: JSON.stringify(business),
								sfzylc: this.param.SFZYLC
							}
						}).then(res=>{
							let returnData = res.data_json;
							this.bean.XH = returnData.XH ? returnData.XH : '';
							this.bean.BZBH = returnData.BZBH ? returnData.BZBH : '';
							if(returnData.XH && returnData.BZBH){
								this.$pdAction.alert("流程发起成功，是否马上办理?",
									{title:"操作结果",confirmText:'马上办理',showCancel:true,cancelText:'继续修改'},
								).then(res=>{
									//点击马上处理跳转到办理页面
									if(res === 'confirm'){
										this.gotoDetail();
									}
								});
							}else{
								this.$pdAction.alert("保存成功",{title:"操作结果"}).then(res=>{
									this.gotoDetail();
								});
							}
						}).catch(error=>{
							this.$pdAction.toast("保存失败。"+error,{icon:'none'});
						});
					}
				}else{
					this.$pdAction.toast(graceChecker.error,{icon:'none'});
				}
			},
			gotoDetail(){
				let url = '/powerapp/pages/flow/qjsq/qjsqDetail?LXDM='+this.param.LXDM+'&XH='+this.bean.XH+"&BZBH="+this.bean.BZBH+"&TYPE=DB";
				this.$pdView.navigateTo(url).then(res=>{
					console.log(res);
				});
			}
		}
	}
</script>

<style lang="scss">
@import '../css/flow.css';
@import '../../../../common/powerapp/css/table_lr.scss';
</style>
