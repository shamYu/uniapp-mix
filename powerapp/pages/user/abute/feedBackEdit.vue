<template>
	<view class="uni-scroll">
		<!-- 基本信息 -->
		<view class="list-item">
			<view class="collapse-item dg-fold-icon1" @click="toggle_1">基本信息</view>
			<view v-show="collspan_1">
				<view class="table-list-ctn" width="100%">
					<ul>
						<li class="li-textarea">
							<span class="span-hd">
								<font class="starred">*</font>问题描述：
							</span>
							<span class="span-value">
								<textarea class="uni-input uni-textarea" v-model="feedBack.WTMS" placeholder="请输入问题描述..." placeholder-style="color:#999;" />
								</span>
						</li>
						<li>
							<span class="span-hd">
								<font class="starred">*</font>期望解决时间：
							</span>
							<span class="span-value">
									<input type="text" placeholder="请填写期望解决时间" disabled="true" @click="onShowDatePicker"  v-model="feedBack.EXPECTT"  placeholder-style="color:#999;"  />
									<pd-datepick v-model="showPicker" type="yyyy-MM-dd" @selected="onSelected" ></pd-datepick>
							</span>
						</li>

						<li>
							<span class="span-hd">
								<font class="starred">*</font>提交人：
							</span>
							<span class="span-value">
								<input type="text" placeholder="请填写提交人"  v-model="feedBack.FKRNAME"  placeholder-style="color:#999;"  />
							</span>
						</li>
						<li>
							<span class="span-hd">
								联系电话：
							</span>
							<span class="span-value">
								<input  type="number" placeholder="请填写联系电话"  placeholder-style="color:#999;" v-model="feedBack.PHONE" />
							</span>
						</li>
						<li>
							<span class="span-hd">
								邮箱：
							</span>
							<span class="span-value">
								<input  type="text" placeholder="请输入邮箱"  placeholder-style="color:#999;" v-model="feedBack.EMAIL" />
							</span>
						</li>
						<li>
							<span class="span-hd">
								QQ号码：
							</span>
							<span class="span-value">
								<input  type="number" placeholder="请输入联系QQ"  placeholder-style="color:#999;" v-model="feedBack.QQ" />
							</span>
						</li>
					</ul>
				</view>
			</view>
			<view class="uni-collapse-cell__title-arrow" v-show="!collspan_1" @click="toggle_1">
				<text class="iconfont icon-bottom"></text>
			</view>
			<view class="uni-collapse-cell__title-arrow" v-show="collspan_1" @click="toggle_1">
				<text class="iconfont icon-top"></text>
			</view>
		</view>
		<!-- 问题截图 -->
		<view class="list-item">
			<view class="collapse-item dg-fold-icon2" @click="toggle_2">问题截图(需要先保存基本信息)</view>
			<view v-show="collspan_2">
				<ul class="apx-list">
					<li v-for="(item,index) in feedbackFJXX" :key="index" @click="openFile(item.WDBH,item.WDLJ);">
						<image src="../../../../static/fileicons/file_icon_pic.png" v-if="item.WDHZ == 'jpg' || item.WDHZ == 'png' || item.WDHZ == 'jpeg' || item.WDHZ == 'gif' || item.WDHZ == 'bmp'"></image>
						<image src="../../../../static/fileicons/file_unknow.png" v-else></image>
						<view class="flex-item-V">
							<text class="img-name">{{item.WDMC}}</text>
							<text>{{item.WDDX}}</text>
						</view>
					</li>
					<view v-if="!isUpdate">
						<view class="listTip">暂无附件</view>
					</view>
					<view  v-if="isUpdate">
						<pd-uploader  :uploadConfig="uploadConfig" ></pd-uploader>
					</view>
				</ul>
			</view>
			<view class="uni-collapse-cell__title-arrow" v-show="!collspan_2" @click="toggle_2">
					<text class="iconfont icon-bottom"></text>
			</view>
			<view class="uni-collapse-cell__title-arrow" v-show="collspan_2" @click="toggle_2">
					<text class="iconfont icon-top"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '../../../../components/uni-nav-bar.vue'
	import pdUploader from '@/powerapp/components/pd-uploader.vue'
	import pdDatepick  from '@/powerapp/components/pd-datePick.vue'
	export default {
		data() {
			return {
				showPicker:false,
				XH: '',
				toastOp: {
					icon: 'none',
					duration: 1000
				},
				feedBack: {
					WTMS:'',
					EXPECTT:'',
					FKRNAME:'',
					PHONE:'',
					EMAIL:'',
					QQ:''
				},
				feedbackFJXX: [],
				collspan_1: true,
				collspan_2: true,
				disabled: false,
				isSubmit : false ,//是否提交过表单,
				isUpdate : false,   //是否需要上传图片
				imageList: [],
				uploadConfig:{
					APPBH: '', //必填
					WDSX: 'RYXX',
					ZLX: 'pic'
				},
				currentDate:this.getcurrentDate()
			}
		},
		components: {
			uniNavBar,
			pdUploader,
			pdDatepick
		},
		onLoad() {
			this.getCurrentInfo();//获取当前登录用户
			console.log(this.currentDate)
		},
		onNavigationBarButtonTap() {
			this.save();
		},
		methods: {
			getCurrentInfo(){
				let userid = this.$pdLogin.getUser().userid;
				let user = this.$pdCache.getYhxxByYhid(userid);
				this.feedBack.FKRNAME = user.YHMC;
				this.feedBack.PHONE = user.YHSJ;
				/* 查询上一次提交人 */
				this.$pdResource.service({data:{
					service:'SEARCH_FEEDBACK_FKR'
				}}).then((res) => {
					this.feedBack.QQ = res.data_object.QQ;
					this.feedBack.EMAIL = res.data_object.EMAIL;
				},(e) => {
					if(e.error_msg == undefined){
						this.$pdAction.toast(e.resData.data,this.toastOp);
						return
					}
					this.$pdAction.toast(e.error_msg,this.toastOp);
				})
			},
			toggle_1() {
				this.collspan_1 = !this.collspan_1;
			},
			toggle_2() {
				this.collspan_2 = !this.collspan_2;
			},
			/* 打开附件 */
			openFile(WTBH, WTLJ) {

			},
			//保存
			save() {
				/* 验证必填 */
				let invalid = this.invalided();
				if(!invalid){
					return
				}
				var dependedVal=this.feedBack.EXPECTT;
				//根据日期字符串转换成日期
				var regEx = new RegExp("\\-","gi");
				dependedVal=dependedVal.replace(regEx,"/");
				var selectDate=Date.parse(dependedVal);
				var curDate = new Date().getTime();  
				if(selectDate <= curDate){
					this.$pdAction.alert("期望解决日期不能小于等于当天，请重新选择!")
					return;
				}
				this.feedBack.service = 'FEEDBACK_SAVE';
				this.$pdAction.showWait("正在加载数据...")
				this.$pdResource.service({
					data:this.feedBack
				}).then((res) => {
					this.$pdAction.closeWait();
					this.feedBack.XH = res.data_key;
					let obj = {
						APPBH  : res.data_key
					}
					this.uploadConfig = Object.assign(this.uploadConfig,obj);
					this.$pdAction.alert("反馈信息已提交，是否返回列表页面?",{
						confirmText:'上传图片',
						showCancel:true,
						cancelText:'马上返回'
					}).then((res) => {
						if(res == 'confirm'){
							//点击了继续上传
							this.isUpdate = true;
						}
						if(res == 'cancel'){
							// 返回
							uni.navigateTo({
								url:'./feedBackList'
							})
						}
					})
				},(e) => {
					this.$pdAction.closeWait();
					if(e.error_msg == undefined){
						this.$pdAction.toast(e.resData.data,this.toastOp);
						return
					}
					this.$pdAction.toast(e.error_msg,this.toastOp);
				})
			},
			/* 验证表单必填项 */
			invalided(){
				if(this.feedBack.WTMS == ''){
					this.$pdAction.toast("请输入问题描述",this.toastOp);
					return false
				}
				if(this.feedBack.EXPECTT == ''){
					this.$pdAction.toast("请选择期望解决日期",this.toastOp);
					return false
				}
				if(this.feedBack.FKRNAME == ''){
					this.$pdAction.toast("请填写提交人",this.toastOp);
					return false
				}
				if(this.feedBack.PHONE != '' && !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.feedBack.PHONE))){
					this.$pdAction.toast("手机号码有误，请重填",this.toastOp);
					return false;
				}	
// 				if(this.feedBack.EMAIL != '' && !(/^([a-zA-Z0-9.-])+\@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/.test(this.feedBack.EMAIL))){
// 					this.$pdAction.toast("邮箱格式不正确,请重填",this.toastOp);
// 					return false;
// 				}
				return true;
			},
			back(){
				uni.navigateBack();
			},
			/* 选择日期 */
			bindDateChange(e){
				this.feedBack.EXPECTT = e.target.value;
			},
			  onShowDatePicker(){//显示
                this.showPicker = true;
            },
            onSelected(data) {//选择
				this.feedBack.EXPECTT = data.value
            },
			//获取当前时间
			getcurrentDate(){
				var y = new Date().getFullYear();
				var M = Number(new Date().getMonth() + 1) >= 10 ? Number(new Date().getMonth() + 1) : '0'+Number(new Date().getMonth() + 1);
				var d = new Date().getDate() >= 10 ? new Date().getDate() : '0'+new Date().getDate();
				var h =  new Date().getHours() >= 10 ? new Date().getHours() : '0'+new Date().getHours();
				var m = new Date().getMinutes() >= 10 ? new Date().getMinutes() : '0' + new Date().getMinutes();
				var s = new Date().getSeconds() >= 10 ? new Date().getSeconds() : '0' + new Date().getSeconds();
				console.log(y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s)
				return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
				
			}
		}
	}
</script>

<style>
	@import '../../../../common/powerapp/css/table_lr.scss';
	.uni-scroll{
		width: 100%;
		overflow-x: hidden;
		overflow-y: auto;
		height: 100%;
	}
	.list-item {
		position: relative;
		margin-bottom: 20upx;
	}
	
	.collapse-item {
		position: relative;
		padding: 20upx;
		border-bottom: 2upx solid #E2E2E2;
		font-size: 32upx;
		background: white;
	}
	
	.collapse-item.on {
		background: white;
	}
	
	.uni-collapse-cell__title-arrow {
		position: absolute;
		right: 20upx;
		top: 20upx;
	}
	
	.img-size {
		width: 40upx;
		height: 40upx;
	}
	
	.dg-fold-icon1 {
		background: white url(../../../../static/icon_fold_tag1.png) no-repeat 30upx center;
		background-size: 60upx 60upx;
		padding-left: 100upx;
	}
	
	.dg-fold-icon2 {
		background: white url(../../../../static/icon_fold_tag2.png) no-repeat 30upx center;
		background-size: 60upx 60upx;
		padding-left: 100upx;
	}
	/* 附件 */
	.apx-list{
		background: white;
		padding: 20upx;
	}
	.apx-list li{
		padding: 28upx;
		display: flex;
		background: #eee;
		border: 1px solid #F5F2F0;
		border-radius: 10upx;
		margin-bottom: 20upx;
	}
	.apx-list image{
		width: 100upx;
		height: 100upx;
		margin-right: 20upx;
	}
	.apx-list>li>.flex-item-V{
		display: flex;
		flex-direction: column;
		height: 100upx;
	}
	.apx-list>li>.flex-item-V>text{
		line-height: 50upx;
		color: #9c9898;
		font-size: 32upx;
	}
	.apx-list>li>.flex-item-V>.img-name{
		font-weight: bold;
		width: 520upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	/* 基本信息textarea */	
	.table-list-ctn>ul>.li-textarea{
		height: 200upx;
		line-height: 200upx;
	}
	.table-list-ctn ul li .uni-textarea{
		height: 100%;
		padding: 0 0 0 24upx;
	}
	.span-value{
		background: white;
	}
	.span-value input{
		padding: 0 24upx;
	}
</style>
