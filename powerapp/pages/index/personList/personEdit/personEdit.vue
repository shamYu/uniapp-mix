<template>
    <view class="page">
		 <!-- #ifndef MP -->
		 <!-- 固定在顶部的导航栏 -->
		 <uni-nav-bar fixed="true" left-icon="back" @click-left="back" right-text="保存" @click-right="showMenu"
		  title="人员编辑"></uni-nav-bar>
		  <!-- 使用非原生导航栏后需要在页面顶部占位 -->
		  <!-- #ifdef APP-PLUS || H5 -->
		  <view class="pos-nav-app"></view>
		  <!-- #endif -->
		 <!-- #endif -->
		  <view>
		     <block v-for="(list,index) in lists" :key="index">
		         <view class="uni-list-cell uni-collapse" :class="'listBg'+index">
		             <view class="uni-list-cell-navigate uni-navigate-bottom" :class="list.show ? 'uni-active' : ''" @click="trigerCollapse(index)">
		                 {{list.title}}
		             </view>
		             <view class="uni-collapse-content" :class="list.show ? 'uni-active' : ''">
		 				<view v-if="list.type === 'swiper'">
		 					<view class="table-list-ctn" width="100%">
		 						<ul>
		 							<li>
		 								<span class="span-hd"><span class="mfill">*&nbsp;</span>姓名：</span>
		 								<span class="span-value"><input type="text" class="edit-form-input" placeholder="请输入姓名" v-model="bean.XM"></span>
		 							</li>
		 							<li>
		 								<span class="span-hd">专业：</span>
		 								<span class="span-value" @tap="actionSheetTap">
		 									<span class="uni-input">{{zydefult}}</span>
		 								</span>
		 							</li>
		 							<li>
		 								<span class="span-hd">生日：</span>
		 								<span class="span-value">
		 									<view class="uni-list-cell-db">
		 										<picker class="pickerView" mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
		 											<view class="uni-input">{{date}}</view>
		 										</picker>
		 									</view>
		 								</span>
		 							</li>
		 							<li>
		 								<span class="span-hd">行政区划：</span>
		 								<span class="span-value"><input type="text" class="edit-form-input" placeholder="请输入行政区划" v-model="bean.SHENG"></span>
		 							</li>
		 							<li>
		 								<span class="span-hd">办公电话：</span>
		 								<span class="span-value"><input type="text" class="edit-form-input" placeholder="请输入办公电话" v-model="bean.BGDH" /></span>
		 							</li>
		 							<li>
		 								<span class="span-hd">手机：</span>
		 								<span class="span-value"><input type="number" class="edit-form-input" placeholder="请输入手机号码" v-model="bean.MOBILE" /></span>
		 							</li>
		 							<li>
		 								<span class="span-hd">传真：</span>
		 								<span class="span-value"><input type="text" class="edit-form-input" placeholder="请输入传真" v-model="bean.FAX" /></span>
		 							</li>
		 							<li>
		 								<span class="span-hd">邮箱：</span>
		 								<span class="span-value"><input type="text" class="edit-form-input" placeholder="请输入邮箱" v-model="bean.EMAIL"/></span>
		 							</li>
		 							<li>
		 								<span class="span-hd">爱好：</span>
		 								<span class="span-value">
		 									<checkbox-group @change="checkboxChange">
		 										<label class="ckb-label" v-for="(item,index2) in checkboxItems" :key="index2">
		 											<view class="checkBoxL">
		 												<checkbox :value="item.name" :checked="item.checked"></checkbox>
		 											</view>
		 											<view class="checkBoxR">{{item.value}}</view>
		 										</label>
		 									</checkbox-group>
		 								</span>
		 							</li>
		 							<li>
		 								<span class="span-hd">是否有效：</span>
		 								<span class="span-value">
		 									<radio-group @change="radioChange">
		 										<label class="ckb-label" v-for="(item,index1) in radioItems" :key="index1">
		 											<view class="checkBoxL">
		 												<radio :id="item.name" :value="item.name" :checked="item.checked"></radio>
		 											</view>
		 											<view class="checkBoxR">
		 												<label class="label-2-text" :for="item.name">
		 													<text>{{item.value}}</text>
		 												</label>
		 											</view>
		 										</label>
		 									</radio-group>
		 								</span>
		 							</li>
		 							<li class="list-item-textarea">
		 								<span class="span-hd">备注：</span>
		 								<span class="span-value">
		 									<textarea class="uni-textarea" placeholder="备注..." v-model="bean.BZ"/>
		 								</span>
		 							</li>
		 						</ul>
		 					</view>
		 				</view>
		                 <view v-if="list.type === 'font'" class="page-pd">
		                     <!-- <view class="listTip">暂无科目数据</view> -->
		 					<view class="addTip" @click="addTipEvt">添加</view>
		 					<view class="selectTip" v-if="tipDatas.length>0" v-for="(items,num) in tipDatas" :key="num">
		 						<ul>
		 							<li>
		 								<span class="span-hd">科目：</span>
		 								<span @tap="tipSheetTap(num)" class="span-value">
		 									<!-- <span>{{tipDefult}}</span> -->
		 									<span>{{items.KMMC}}</span>
		 									<span class="iconfont icon-bottom"></span>
		 								</span>
		 							</li>
		 							<li>
		 								<span class="span-hd">学分（分）：</span>
		 								<span class="span-value">
		 									<!-- <input type="number" placeholder="输入学分" v-model="tipScope"/> -->
		 									<input type="number" placeholder="输入学分" v-model="items.XF"/>
		 								</span>
		 							</li>
		 							<li>
		 								<span class="span-hd">进修时间：</span>
		 								<span class="span-value">
		 									<view class="timeView">
		 										 <view class="uni-list-cell-db">
		 											<picker mode="date" :value="items.JXKSSJ" :start="startDate" :end="endDate" @change="startDateChange($event,num)">
		 												<!-- <view class="uni-input">{{sDate}}</view> -->
		 												<view class="uni-input">{{items.JXKSSJ}}</view>
		 											</picker>
		 										</view>
		 									</view>
		 									<view class="timeView">
		 										<view class="uni-list-cell-db">
		 											<picker mode="date" :value="items.JXJSSJ" :start="startDate" :end="endDate" @change="endDateChange($event,num)">
		 												<!-- <view class="uni-input">{{eDate}}</view> -->
		 												<view class="uni-input">{{items.JXJSSJ}}</view>
		 											</picker>
		 										</view>
		 									</view>
		 								</span>
		 							</li>
		 						</ul>
		 					</view>
		                 </view>
		                 <view v-if="list.type === 'list'">
		                     <view class="listTip" v-show="!isUpdate">暂无附件</view>
		 					
		 					<view v-show="isUpdate">
		 						<pd-uploader  :uploadConfig="uploadConfig" ></pd-uploader>
		 					</view>
		                 </view>
		             </view>
		         </view>
		     </block>
		 </view>
    </view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniIcon from '@/components/uni-icon.vue'
	import pdUploader from '@/powerapp/components/pd-uploader.vue'
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	export default {
		components: {
			uniNavBar,
			uniIcon,
			pdUploader
		},
		data() {
			const currentDate = this.getDate({
				format: true
			});
			return {
				sDate:currentDate,
				eDate:currentDate,
				tipScope:'',
				upParms:"",
				title: 'accordion',
				lists: [{
				        title: "基本信息",
				        type: 'swiper',
				        show: true
				    },
				    {
				        title: "附件(新增时需要先保存基本信息)",
				        type: 'list',
				        show: false
				    },
				    {
				        title: "选择科目(新增时需要先保存基本信息)",
				        type: 'font',
				        show: false
				    }
				],
				zySelect:["--选择专业--","python","Javascript"],
				zydefult:"--选择专业--",
				tipSelect:["--选择科目--","java","python","Javascript","php"],
				tipDefult:"--选择科目--",
				date: currentDate,
				checkboxItems: [
					{name: '1',value: '羽毛球'},
					{name: '2',value: '爬山'},
					{name: '3',value: '溜冰'}
				],
				radioItems: [
					{name: '是',value: '是'},
					{name: '否',value: '否'}
				],
				bean:{//保存的数据
					projects:[],
					projectsStr:[],
					FJXX:[],
					XM:'',
					ZY:'',
					BIRTHDAY:'',
					SHENG:'',
					BGDH:'',
					MOBILE:'',
					FAX:'',
					EMAIL:'',
					HOBBY:'',
					SFYX:'',
					BZ:''
				},
				delData:'',//去掉保存重复的数据
				//图片上传  start
				imageList: [],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				//图片上传  end
				uploadConfig:{
					APPBH: '' //必填
				},
				isUpdate:false,//继续上传图片
				tipDatas:[]
			};
		},
		created (){

		},
		onLoad() {
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
			addTipEvt (){//添加科目
				this.tipDatas.push({
					KMMC:'--选择科目--',
					XF:Number(0),
					JXKSSJ:this.sDate,
					JXJSSJ:this.sDate
				});
				
				console.log(this.tipDatas)
			},
			showMenu (){
				if(this.checkInformation()){
					return;
				}

				if(this.delData == this.bean.XM){
					uni.navigateTo({
						url:'../personList'
					})
					return;
				}
				if(this.tipDatas.length > 0){
					for(let i=0;i<this.tipDatas.length;i++){
						this.tipDatas[i].XF = Number(this.tipDatas[i].XF);
					}
				}
				
				this.bean.ZY = this.zydefult;
				this.bean.BIRTHDAY = this.date;
				this.bean.service = "DEMO_SAVE";
				this.bean.projects = this.tipDatas;
				this.bean.projectsStr = JSON.stringify(this.bean.projects);
				this.$pdResource.service({
					data:this.bean
				}).then(data=>{
					console.log(data,"保存数据")				
					this.$pdAction.alert("保存信息已提交，是否返回列表页面?",{
						confirmText:'继续完善',
						showCancel:true,
						cancelText:'返回列表'
					}).then((res) => {
						if(res == 'confirm'){
							//点击了继续上传
							this.uploadConfig.APPBH = data.data_key;
							console.log("继续上传",this.uploadConfig)
							this.isUpdate = true;
							this.delData = this.bean.XM;
						}
						if(res == 'cancel'){
							// 返回
							uni.navigateTo({
								url:'../personList'
							})
						}
					})	
				})
			},
			checkInformation (){//校验input
				if(this.bean.BGDH){
					var regu =/(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^1[3|4|5|7|8][\d]{9}$)/;
					var re = new RegExp(regu);
					if(re.test(this.bean.BGDH) == false){
						this.$pdAction.alert('请输入合理的电话号码(如:0755-2923256 或 2923256)');
						return true;
					}else{
						return false;
					}
				}
				
				if(this.bean.MOBILE){
					var regus = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
					var res = new RegExp(regus);
					if(res.test(this.bean.MOBILE) == false){
						this.$pdAction.alert('请输入合理手机号码(如:13502731773)');
						return true;
					}else{
						return false;
					}
				}
				
				if(this.bean.FAX){
					var rec = new RegExp(/(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)/);
					if(rec.test(this.bean.FAX) == false){
						this.$pdAction.alert('请输入合理传真号码(如:0755-2923256)');
						return true;
					}else{
						return false;
					}
				}
				
				if(this.bean.EMAIL){
					var rey = new RegExp(/^\w+([-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
					if(rey.test(this.bean.EMAIL) == false){
						this.$pdAction.alert('请输入合理邮箱(如:123456789@qq.com)');
						return true;
					}else{
						return false;
					}
				}
				
			},
			bindDateChange: function(e,num) {
				this.date = e.target.value;				
			},
			startDateChange (e,num){
				//this.sDate = e.target.value;
				this.tipDatas[num].JXKSSJ = e.target.value;
			},
			endDateChange (e,num){
				//this.eDate = e.target.value;
				this.tipDatas[num].JXJSSJ = e.target.value;
			},
			trigerCollapse(e) {
			    for (let i = 0, len = this.lists.length; i < len; ++i) {
			        if (e === i) {
			            this.lists[i].show = !this.lists[i].show;
			        } else {
			            this.lists[i].show = false;
			        }
			    }
			},
			actionSheetTap() {
				uni.showActionSheet({
					itemList: this.zySelect,
					success: (e) => {
						this.zydefult = this.zySelect[e.tapIndex];
						/* uni.showToast({
							title:"点击了第" + e.tapIndex + "个选项",
							icon:"none"
						}) */
					}
				})
			},
			tipSheetTap(num){
				uni.showActionSheet({
					itemList: this.tipSelect,
					success: (e) => {
						console.log(e,"eeeeee")
						this.tipDatas[num].KMMC = this.tipSelect[e.tapIndex];
						//this.tipDefult = this.tipSelect[e.tapIndex];
					}
				})
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
			checkboxChange: function(e) {//多选
				console.log(e.detail.value)//选中的值
				let rel = '@';
				let arr = e.detail.value;
				if(arr.length > 0){
					for(let i=0;i<arr.length;i++){
						rel += arr[i] + '@';
					}
				}
				this.bean.HOBBY = rel;
				/* var checked = e.target.value
				var changed = {}
				for (var i = 0; i < this.checkboxItems.length; i++) {
					if (checked.indexOf(this.checkboxItems[i].name) !== -1) {
						changed['checkboxItems[' + i + '].checked'] = true
					} else {
						changed['checkboxItems[' + i + '].checked'] = false
					}
				} */
			},
			radioChange: function(e) {//单选
				this.bean.SFYX = e.detail.value;
				console.log(e.detail.value)//选中的值
				/* var checked = e.target.value
				var changed = {}
				for (var i = 0; i < this.radioItems.length; i++) {
					if (checked.indexOf(this.radioItems[i].name) !== -1) {
						changed['radioItems[' + i + '].checked'] = true
					} else {
						changed['radioItems[' + i + '].checked'] = false
					}
				} */
			},
			chooseImage: async function() {
				if (this.imageList.length === 9) {
					let isContinue = await this.isFullImg();
					console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
					success: (res) => {
						console.log(res);
						this.imageList = this.imageList.concat(res.tempFilePaths);
					}
				})
			},
			isFullImg: function() {//清空图片
				return new Promise((res) => {
					uni.showModal({
						content: "已经有9张图片了,是否清空现有图片？",
						success: (e) => {
							if (e.confirm) {
								this.imageList = [];
								res(true);
							} else {
								res(false)
							}
						},
						fail: () => {
							res(false)
						}
					})
				})
			},
			previewImage: function(e) {//图片预览
				var current = e.target.dataset.src
				uni.previewImage({ //图片预览
					current: current,
					urls: this.imageList,
					indicator: "default"
				})
			}
		}
	}
</script>

<style lang="scss">
@import '../../../../../common/powerapp/css/table_lr.scss';
.editLayer{
	// position: relative;
}
.uni-list-cell-navigate.uni-active,.uni-list-cell{background: #fff;}
.uni-list-cell{margin-bottom: 20upx;}
.table-list-ctn{border-top: 1px solid #ddd;}
.table-list-ctn tr td:nth-child(2){
	padding: 0 22upx;
}
.listBg0 .uni-navigate-bottom{
	background: url(../../../../../static/powerapp/index/yytb/GZJJ.png) no-repeat;
    background-size: 54upx;
	padding-left: 100upx;
    background-position: 24upx 18upx;
}
.listBg1 .uni-navigate-bottom{
	background: url(../../../../../static/powerapp/index/yytb/GL.png) no-repeat;
	background-size: 54upx;
	padding-left: 100upx;
	background-position: 24upx 18upx;
}
.listBg2 .uni-navigate-bottom{
	background: url(../../../../../static/powerapp/index/yytb/GZJJ.png) no-repeat;
	background-size: 54upx;
	padding-left: 100upx;
	background-position: 24upx 18upx;
}
.listTip{
	width: 80%;
    margin: 0 auto;
    height: 70upx;
	line-height: 70upx;
    text-align: center;
	background: #f3f5f7;
    border: 1px solid #d7dce8;
	border-radius: 16upx;
	margin-bottom: 26upx;
	font-size: 30upx;
}
.mfill{color:red;}
.checkBoxL,.checkBoxR,.ckb-label{float: left;margin: 10upx 5upx;}
.ckb-label:first-child{margin-left:14upx;}
.uni-input,.edit-form-input{
	border-bottom:0;
	padding: 0;
	margin:14upx;
} 
.selectTip{
	padding: 10upx 30upx;
	font-size: 34upx;
	border-bottom: 2upx solid #ddd;
}
.selectTip>ul>li{
	width: 100%;
	height:60upx;
	line-height:60upx;
}

.selectTip .span-hd{
	color: #333;
    background: none;
    border-right: 0;	
}
.selectTip .timeView{
	float: left;
	width: 49%;
	height: 100%;
	line-height: 60upx;
	margin-right: 1%;
}
.addTip{
	position: absolute;
    width: 100upx;
    height: 60upx;
    background: #17bdcc;
    font-size: 30upx;
    line-height: 60upx;
    text-align: center;
    color: #fff;
    right: 20upx;
	top: 6upx;
}
.page-pd{
	width: 100%;
	min-height: 80upx;
	position: relative;
}
.span-value .iconfont{
	display: inline-block;
	margin-left: 30upx;
}
</style>
