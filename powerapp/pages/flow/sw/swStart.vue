<template>
	<view class="page">
		<!-- #ifndef MP -->
		<!-- 固定在顶部的导航栏 -->
		<uni-nav-bar fixed="true" left-icon="back" color="#ffffff" @click-left="back" @click-right="save" right-text="保存"
		 title="收文发起"></uni-nav-bar>
		<!-- #ifdef APP-PLUS || H5 -->
		<view class="pos-nav-app"></view>
		<!-- #endif -->
		<!-- #endif -->
		<view>
			<block>
				<view class="uni-list-cell uni-collapse listBg1" style="background:#FFFFFF;">
					<view class="uni-list-cell-navigate uni-navigate-bottom" :class="isJbxx ? 'uni-active' : ''" @click="trigerCollapse('jbxx')">
						基本信息
					</view>
					<view class="uni-collapse-content" :class="isJbxx ? 'uni-active' : ''">
						<form @submit="save">
							<view class="table-list-ctn" width="100%">
								<ul>
									<li>
										<span class="span-hd"><span class="mfill">*&nbsp;</span>来文单位：</span>
										<span class="span-value"><input class="uni-input" type="text" v-model="bean.LWDW" name="LWDW" placeholder="请输入来文单位"></span>
									</li>
									<li>
										<span class="span-hd"><span class="mfill">*&nbsp;</span>收文日期：</span>
										<span class="span-value">
											<view class="uni-list-cell-db">
												<picker class="pickerView" mode="date" :start="startDate" :end="endDate" @change="bindDateChangeSwrq">
													<view class="uni-input">{{bean.SWRQ ? bean.SWRQ : '请输入收文日期'}}</view>
												</picker>
											</view>
										</span>
									</li>
									<li>
										<span class="span-hd"><span class="mfill">*&nbsp;</span>办结期限：</span>
										<span class="span-value">
											<view class="uni-list-cell-db">
												<picker class="pickerView" mode="date" :start="startDate" :end="endDate" @change="bindDateChangeBjqx">
													<view class="uni-input">{{bean.BJQX ? bean.BJQX : '请输入办结期限'}}</view>
												</picker>
											</view>
										</span>
									</li>
									<li>
										<span class="span-hd"><span class="mfill">*&nbsp;</span>来文类型：</span>
										<span class="span-value" @tap="showSinglePicker('LWLX')">
											<span class="uni-input">{{LWLXMC ? LWLXMC : '请选择来文类型'}}</span>
										</span>
									</li>
									<li>
										<span class="span-hd"><span class="mfill">*&nbsp;</span>来文文种：</span>
										<span class="span-value" @tap="showSinglePicker('LWWZ')">
											<span class="uni-input">{{LWWZMC ? LWWZMC : '请选择来文文种'}}</span>
										</span>
									</li>
									<li>
										<span class="span-hd">密级：</span>
										<span class="span-value" @tap="showSinglePicker('MJ')">
											<span class="uni-input">{{MJMC ? MJMC : '请选择密级'}}</span>
										</span>
									</li>
									<li>
										<span class="span-hd">紧急程度：</span>
										<span class="span-value" @tap="showSinglePicker('JJCD')">
											<span class="uni-input">{{JJCDMC ? JJCDMC : '请选择紧急程度'}}</span>
										</span>
									</li>
									<li>
										<span class="span-hd">来文文号：</span>
										<span class="span-value"><input class="uni-input" type="text" v-model="bean.LWWH" name="LWWH" placeholder="请输入来文文号"></span>
									</li>
									<li>
										<span class="span-hd"><span class="mfill">*&nbsp;</span>来文标题：</span>
										<span class="span-value"><input class="uni-input" type="text" v-model="bean.LWBT" name="LWBT" placeholder="请输入来文标题"></span>
									</li>
									<li style="height:190upx;">
										<span class="span-hd">拟办意见：</span>
										<span class="span-value">
											<view class="uni-textarea">
												<textarea placeholder="拟办意见..." v-model="bean.NBYJ" />
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
        			<view class="gap" style="background:#eef0f2;"></view>
        			<view class="uni-collapse listBg2" style="background:#FFFFFF;">
        				<view class="uni-list-cell-navigate uni-navigate-bottom" :class="isFile ? 'uni-active' : ''" @click="trigerCollapse('file')">附件</view>
        				<view class="uni-collapse-content" :class="isFile ? 'uni-active' : ''">
        					<ul class="apx-list">
        						<li v-for="(item,index) in FJXX" :key="index" @click="openFile(item.WDBH,item.WDLJ);">
        							<img :src="filetype(item.WDHZ)" />
        							<h1>{{item.WDMC}}</h1>
        							<p style="float: left;">{{item.WDDX}}</p>
        						</li>
        						<view v-if="FJXX.length == 0">
        							<view class="listTip">暂无附件</view>
        						</view>
        						<view  v-if="isUpdate">
        							<pd-uploader  :uploadConfig="uploadConfig" ></pd-uploader>
        						</view>
        					</ul>
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
	import pdUploader from '@/powerapp/components/pd-uploader.vue';
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
			mpvuePicker,
			pdUploader
		},
		data() {
			const currentDate = this.getDate({
				format: true
			});
			return {
				isJbxx: true,
				isFile: true,
				bean: {
					SWRQ: '',
					BJQX: ''
				},
				pickerSingleArray: [],
				cityPickerValueDefault: [0, 0, 1],
				themeColor: '#007AFF',
				pickerText: '',
				mode: '',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray:[],
				type: '',
				LWLXMC: '',
				LWWZMC: '',
				MJMC: '',
				JJCDMC: '',
				param: {},
				FJXX: [],
				isUpdate : false,   //是否需要上传图片
				uploadConfig:{
					APPBH: '', //必填
					WDSX: 'SWFJ',
					ZLX: 'SWFJ'
				}
			};
		},
		onLoad(e) {
			this.param = e;
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
			bindDateChangeSwrq: function(e) {
				this.bean.SWRQ = e.target.value;
			},
			bindDateChangeBjqx: function(e) {
				this.bean.BJQX = e.target.value;
			},
			trigerCollapse(e) {
			    if(e === 'jbxx'){
			    	if(this.isJbxx){
			    		this.isJbxx = false;
			    	}else{
			    		this.isJbxx = true;
			    	}
			    }else if(e === 'file'){
					if(this.isFile){
						this.isFile = false;
					}else{
						this.isFile = true;
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
			showSinglePicker(type) {
				this.type = type;
				let dmj = this.$pdCache.getGgdmzBydmj(type);
				this.pickerSingleArray = [];
				let index = 0;
				for(let i = 0,len = dmj.length;i < len; i ++){		//往选择组件里面塞入公共代码集数据，并且根据当前数据默认显示组件开打后的位置
					let dmz = dmj[i];
					let dm = dmz.DM;
					if(this.type == 'LWLX'){
						if(dm == this.bean.LWLX){
							index = i;
						}
					}else if(this.type == 'LWWZ'){
						if(dm == this.bean.XTXH){
							index = i;
						}
					}else if(this.type == 'MJ'){
						if(dm == this.bean.MJ){
							index = i;
						}
					}else if(this.type == 'JJCD'){
						if(dm == this.bean.JJCD){
							index = i;
						}
					}else{
						
					}
					this.pickerSingleArray.push({label: dmz.DMNR,	value: dm});
				}
				this.pickerValueArray = this.pickerSingleArray;
				this.mode = 'selector';
				this.deepLength = 1;
				this.pickerValueDefault = [index];	//默认值
				this.$refs.mpvuePicker.show();
			},
			onCancel(e) {
				console.log(e)
			},
			onConfirm(e) {
				if(this.type == 'LWLX'){
					this.bean.LWLX = e.value[0];
					this.LWLXMC = e.label;
				}else if(this.type == 'LWWZ'){
					this.bean.XTXH = e.value[0];
					this.LWWZMC = e.label;
				}else if(this.type == 'MJ'){
					this.bean.MJ = e.value[0];
					this.MJMC = e.label;
				}else if(this.type == 'JJCD'){
					this.bean.JJCD = e.value[0];
					this.JJCDMC = e.label;
				}else{
					
				}
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
			filetype(fjhz) {
				var type = '';
				if (fjhz.lastIndexOf('.') > -1) {
					type = fjhz.substring(fjhz.lastIndexOf(".")).toLowerCase();
				} else {
					type = '.' + fjhz.toLowerCase();
				}
				if ('.doc' == type || '.docx' == type) {
					return "../../../../../static/fileicons/file_icon_doc.png";
				} else if ('.xlsx' == type || '.xls' == type) {
					return "../../../../../static/fileicons/file_icon_xls.png";
				} else if ('.pptx' == type || '.ppt' == type) {
					return "../../../../../static/fileicons/file_icon_ppt.png";
				} else if ('.pdf' == type) {
					return "../../../../../static/fileicons/file_icon_pdf.png";
				} else if ('.txt' == type) {
					return "../../../../../static/fileicons/file_icon_txt.png";
				} else if ('.rar' == type || '.zip' == type || '.gz' == type || '.7z' == type) {
					return "../../../../../static/fileicons/file_icon_ysb.png";
				} else if ('.jpg' == type || '.png' == type || '.jpeg' == type || '.gif' == type || '.bmp' == type) {
					return "../../../../../static/fileicons/file_icon_pic.png";
				} else if ('.avi' == type || '.mp4' == type || '.wmv' == type || '.mov' == type) {
					return "../../../../../static/fileicons/file_icon_video.png";
				} else {
					return "../../../../../static/fileicons/file_unknow.png";
				}
			},
			/* 打开附件 */
			openFile(WTBH, WTLJ) {
			
			},
			save (e){
				this.$pdAction.showWait("保存中...");
				//将下列代码加入到对应的检查位置
				//定义表单规则
				var rule = [
					{name:"LWDW", checkType : "notnull", checkRule:"",  errorMsg:"请输入来文单位"},
					{name:"SWRQ", checkType : "notnull", checkRule:"",  errorMsg:"请选择收文日期"},
					{name:"BJQX", checkType : "notnull", checkRule:"",  errorMsg:"请选择办结期限"},
					{name:"LWLX", checkType : "notnull", checkRule:"",  errorMsg:"请选择来文类型"},
					{name:"XTXH", checkType : "notnull", checkRule:"",  errorMsg:"请选择来文文种"},
					{name:"LWBT", checkType : "notnull", checkRule:"",  errorMsg:"请输入来文标题"}
				];
				//进行表单检查
				var formData = this.bean;
				var checkRes = graceChecker.check(formData, rule);
				if(checkRes){
					let business = {
						"dwmc":this.bean.LWBT,
						"dwbh":this.bean.JJCD
					}
					this.$pdResource.service({
						data: {
							service: 'SAVE_START_FLOW',
							table: 'T_DEMO_SWGL',
							primaryKey: 'XH',
							bean: JSON.stringify(this.bean),
							flowType: this.param.LCBH,
							businessInfo: JSON.stringify(business),
							sfzylc: this.param.SFZYLC
						}
					}).then(res=>{
						this.$pdAction.closeWait();
						let returnData = res.data_json;
						if(returnData.XH && returnData.BZBH){
							this.bean.XH = returnData.XH;
							this.bean.BZBH = returnData.BZBH;
							if(this.bean.XH  != '' && this.bean.XH != null){
								this.isUpdate = true;
								let obj = {
									APPBH: this.bean.XH
								}
								this.uploadConfig = Object.assign(this.uploadConfig,obj);
							}
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
				}else{
					this.$pdAction.toast(graceChecker.error,{icon:'none'});
				}
			},
			gotoDetail(){
				let url = '/powerapp/pages/flow/sw/swDetail?LXDM='+this.param.LXDM+'&XH='+this.bean.XH+"&BZBH="+this.bean.BZBH+"&TYPE=DB";
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

.apx-list {
	padding: 24upx 32upx;
}

.apx-list li {
	background: #f3f5f7;
	border: 1px solid #d7dce8;
	padding: 32upx;
	overflow: hidden;
	border-radius: 19upx;
	margin-top: 16upx;
}

.apx-list li:first-child {
	margin-top: 0;
}

.apx-list li img {
	float: left;
	width: 96upx;
	height: 96upx;
	margin-right: 24upx;
}

.apx-list li h1 {
	color: #87919e;
	font-size: 35upx;
	padding-top: 8upx;
}

.apx-list li p {
	color: #b5b9bf;
	font-size: 33upx;
	padding-top: 16upx;
}

.apx-list li.noData {
	color: #ff761b;
	text-align: center;
	font-size: 35upx;
}
</style>
