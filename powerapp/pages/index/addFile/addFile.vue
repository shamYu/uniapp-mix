<template>
	<view class="page">
		<uni-nav-bar class="nav_custom" fixed="true" left-icon="back" @click-left="back" right-text="保存" @click-right="saveData"
		 title="首页应用定制"></uni-nav-bar>
		
		<view class="pageContent">
			<view class="pageDeail">
				<view class="custom-titie">
					<b class="bT"></b>我的定制
				</view>
				<view>
					<scroll-view>
						<!-- 页面内容 -->
						<view class="uni-padding-wrap">
							<view class="page-section swiper">
								<view class="page-section-spacing">
									<pd-swiper other-class="swiper">
										<swiper-item v-if="list.length > 0">							
											<view class="swiper-item uni-bg-red">
												<pd-del :list="list" @select="deleteApp" :max='8' :min='-1'></pd-del>
											</view>                       
										</swiper-item>
										<swiper-item v-if="list.length > 8">
											<view class="swiper-item uni-bg-green">
												<pd-del :list="list" @select="deleteApp" :max='16' :min='7'></pd-del>
											</view>
										</swiper-item>
										<swiper-item v-if="list.length > 16">
											<view class="swiper-item uni-bg-blue">
												<pd-del :list="list" @select="deleteApp" :max='24' :min='15'></pd-del>
											</view>
										</swiper-item>
									</pd-swiper>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>

			<view class="dzAPPview">
				<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
					<view v-for="(tab,index) in tabBars" :key="tab.id" :class="['swiper-tab-list',tabIndex==index ? 'active' : '']" :id="tab.id"
					 :data-current="index" @click="tapTab(index)">{{tab.name}}</view>
				</scroll-view>
				 <!-- <scroll-view scroll-y="true" class="scroll-Y"> -->
					<swiper id="scollPosition" :current="tabIndex" class="swiper-box" duration="300" @change="changeTab">
						<swiper-item :key="0">
							<scroll-view id="scollPosition" class="list" scroll-y @scroll="clearNum(0)" :scroll-top="numb">
								<view class="pageDeail" id="lcslID">
									<view class="custom-titie">
										<b class="bT"></b>流程示例
									</view>
									<view class="doAPPlc">
										<pd-add :list="lcList" @select="addApp"></pd-add>
									</view>
								</view>
								<view class="pageDeail" id="kfslID">
									<view class="custom-titie">
										<b class="bT"></b>开发示例
									</view>
									<view class="doAPPlc kfslSty">
										<pd-add :list="kfList" @select="addApp"></pd-add>
									</view>
								</view>
								<view class="pageDeail" id="yqljID">
									<view class="custom-titie">
										<b class="bT"></b>友情链接
									</view>
									<view class="doAPPlc yqljSty">
										<pd-add :list="yqList" @select="addApp"></pd-add>
									</view>
								</view>
								<view class="pageDeail" id="dsfID">
									<view class="custom-titie">
										<b class="bT"></b>第三方应用
									</view>
									<view class="doAPPlc sySty">
										<pd-add :list="syList" @select="addApp"></pd-add>
									</view>
								</view>
							</scroll-view>
						</swiper-item>
						<swiper-item :key="1">
							<scroll-view class="list" scroll-y @scroll="clearNum(1)" :scroll-top="numkf">
								<view class="pageDeail" id="lcslID">
									<view class="custom-titie">
										<b class="bT"></b>流程示例
									</view>
									<view class="doAPPlc">
										<pd-add :list="lcList" @select="addApp"></pd-add>
									</view>
								</view>
								<view class="pageDeail" id="kfslID">
									<view class="custom-titie">
										<b class="bT"></b>开发示例
									</view>
									<view class="doAPPlc kfslSty">
										<pd-add :list="kfList" @select="addApp"></pd-add>
									</view>
								</view>
								<view class="pageDeail" id="yqljID">
									<view class="custom-titie">
										<b class="bT"></b>友情链接
									</view>
									<view class="doAPPlc yqljSty">
										<pd-add :list="yqList" @select="addApp"></pd-add>
									</view>
								</view>
								<view class="pageDeail" id="dsfID">
									<view class="custom-titie">
										<b class="bT"></b>第三方应用
									</view>
									<view class="doAPPlc sySty">
										<pd-add :list="syList" @select="addApp"></pd-add>
									</view>
								</view>
							</scroll-view>
						</swiper-item>
						<swiper-item :key="2">
							<scroll-view class="list" :class="tabNum==2?'threeAct':''" scroll-y @touchstart='clearTop(2)' @scroll="clearNum(2)" :scroll-top="numyq">
								<view class="pageDeail" id="lcslID">
									<view class="custom-titie">
										<b class="bT"></b>流程示例
									</view>
									<view class="doAPPlc">
										<pd-add :list="lcList" @select="addApp"></pd-add>
									</view>
								</view>
								<view class="pageDeail" id="kfslID">
									<view class="custom-titie">
										<b class="bT"></b>开发示例
									</view>
									<view class="doAPPlc kfslSty">
										<pd-add :list="kfList" @select="addApp"></pd-add>
									</view>
								</view>
								<view class="pageDeail" id="yqljID">
									<view class="custom-titie">
										<b class="bT"></b>友情链接
									</view>
									<view class="doAPPlc yqljSty">
										<pd-add :list="yqList" @select="addApp"></pd-add>
									</view>
								</view>
								<view class="pageDeail" id="dsfID">
									<view class="custom-titie">
										<b class="bT"></b>第三方应用
									</view>
									<view class="doAPPlc sySty">
										<pd-add :list="syList" @select="addApp"></pd-add>
									</view>
								</view>
							</scroll-view>
						</swiper-item>
						<swiper-item :key="3">
							<scroll-view class="list" scroll-y :class="tabNum==3?'fourAct':''" @touchstart='clearTop(3)' @scroll="clearNum(3)" :scroll-top="numdsf">
								<view class="pageDeail" id="lcslID">
									<view class="custom-titie">
										<b class="bT"></b>流程示例
									</view>
									<view class="doAPPlc">
										<pd-add :list="lcList" @select="addApp"></pd-add>
									</view>
								</view>
								<view class="pageDeail" id="kfslID">
									<view class="custom-titie">
										<b class="bT"></b>开发示例
									</view>
									<view class="doAPPlc kfslSty">
										<pd-add :list="kfList" @select="addApp"></pd-add>
									</view>
								</view>
								<view class="pageDeail" id="yqljID">
									<view class="custom-titie">
										<b class="bT"></b>友情链接
									</view>
									<view class="doAPPlc yqljSty">
										<pd-add :list="yqList" @select="addApp"></pd-add>
									</view>
								</view>
								<view class="pageDeail" id="dsfID">
									<view class="custom-titie">
										<b class="bT"></b>第三方应用
									</view>
									<view class="doAPPlc sySty">
										<pd-add :list="syList" @select="addApp"></pd-add>
									</view>
								</view>
							</scroll-view>
						</swiper-item>
					</swiper>
				<!-- </scroll-view> -->
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '../../../../components/uni-nav-bar.vue'
	import uniIcon from '../../../../components/uni-icon.vue'
	import PdSwiper from '../../../components/pd-swiper.vue'
	import PdDel from './del'
	import PdAdd from './add'
	import {PdCache} from '../../../../common/powerapp/js/pd.cache.js';
	import {PdStorage} from '../../../../common/powerapp/js/pd.storage.js';
	import {PdAction} from '../../../../common/powerapp/js/pd.action.js';
	export default {
		components: {
			uniNavBar,
			uniIcon,
			PdSwiper,
			PdDel,
			PdAdd
		},
		data() {
			/* let list = [
				{name:"待办任务",value:"DBRW.png",urls:"../../flow/flowListMain"},
				{name:"人员列表",value:"RYLB.png",urls:"../../index/personList/personList"},
				{name:"选项卡列表",value:"xxk.png",urls:"../../index/tabList/tabList"},
				{name:"选择示例",value:"xzsl.png",urls:"../../index/selectionExample/selectionExample"},
				{name:"侧滑示例",value:"dz_ico21.png",urls:"../../index/sideslipEm/sideslipEm"},
				{name:"图形统计",value:"TXTJ.png",urls:"../../index/echartCount/echartCount"},
				{name:"分享示例",value:"FXSL.png",urls:"../../index/shareEmp/shareEmp"},
				{name:"扫一扫",value:"SYS.png",urls:"../../index/scan/scan"},
				{name:"消息推送",value:"dz_ico4.png",urls:"../../index/messagePush/messagePush"},
				{name:"地图点位示例",value:"DTDW.png",urls:"../../index/mapPointEmp/mapPointEmp"},
				{name:"地图搜索示例",value:"DTSS.png",urls:"../../index/mapSearchEmp/mapSearchEmp"},
				{name:"综合办公",value:"SJZX.png",urls:""},
				{name:"打开微信",value:"WX.png",urls:""},
				{name:"打开QQ",value:"qq.png",urls:""},
				{name:"图片轮播",value:"SWCX.png",urls:"../../index/pictureCarousel/pictureCarousel"},
				{name:"图片查看",value:"RWFQ.png",urls:"../../index/pictureView/pictureView"},
				{name:"任务发起",value:"RWFQ.png",urls:"../../flow/task/startTaskList"},
				{name:"关注任务库",value:"GZRW.png",urls:"../../flow/task/gzTaskList"},
				{name:"百度",value:"BD.png",urls:"../../index/webLink/baidu"},
				{name:"新浪网",value:"XL.png",urls:"../../index/webLink/sina"},
				{name:"环保部",value:"HBB.png",urls:"../../index/webLink/hbb"},
				{name:"中国天气",value:"ZGTQ.png",urls:"../../index/webLink/chinaWheather"},
			] */
			/* let lcList = [
				{name:"待办任务",value:"DBRW.png",urls:"../../flow/flowListMain",bool:false},
				{name:"任务发起",value:"RWFQ.png",urls:"../../flow/task/startTaskList",bool:false},
				{name:"关注任务库",value:"GZRW.png",urls:"../../flow/task/gzTaskList",bool:false},
				{name:"请假查询",value:"QJCX.png",urls:"../../flow/qjsq/qjsqQueryList",bool:false},
				{name:"收文查询",value:"SWCX.png",urls:"../../flow/sw/swQueryList",bool:false}
			]
			let kfList = [
				{name:"人员列表",value:"RYLB.png",urls:"../../index/personList/personList",bool:false},
				{name:"选项卡列表",value:"xxk.png",urls:"../../index/tabList/tabList",bool:false},
				{name:"选择示例",value:"xzsl.png",urls:"../../index/selectionExample/selectionExample",bool:false},
				{name:"侧滑示例",value:"dz_ico21.png",urls:"../../index/sideslipEm/sideslipEm",bool:false},
				{name:"图形统计",value:"TXTJ.png",urls:"../../index/echartCount/echartCount",bool:false},
				{name:"分享示例",value:"FXSL.png",urls:"../../index/shareEmp/shareEmp",bool:false},
				{name:"扫一扫",value:"SYS.png",urls:"../../index/scan/scan",bool:false},
				{name:"消息推送",value:"dz_ico4.png",urls:"../../index/messagePush/messagePush",bool:false},
				{name:"地图点位示例",value:"DTDW.png",urls:"../../index/mapPointEmp/mapPointEmp",bool:false},
				{name:"地图搜索示例",value:"DTSS.png",urls:"../../index/mapSearchEmp/mapSearchEmp",bool:false}
			]
			
			let yqList = [
				{name:"百度",value:"BD.png",urls:"../../index/webLink/baidu",bool:false},
				{name:"新浪网",value:"XL.png",urls:"../../index/webLink/sina",bool:false},
				{name:"环保部",value:"HBB.png",urls:"../../index/webLink/hbb",bool:false},
				{name:"中国天气",value:"ZGTQ.png",urls:"../../index/webLink/chinaWheather",bool:false}
			]
			let syList = [
				{name:"综合办公",value:"SJZX.png",urls:"",bool:false},
				{name:"打开微信",value:"WX.png",urls:"",bool:false},
				{name:"打开QQ",value:"qq.png",urls:"",bool:false}
			] */
			return {
				list:[],
				/* 动态滚动到指定位置  start */
				tabNum:0,
				numb:1,
				numkf:1,
				numyq:1,
				numdsf:1,
				/* 动态滚动到指定位置  end */
				lcList:[],//流程示例数据
				kfList:[],//开发流程
				yqList:[],//友情链接
				syList:[],//第三方应用
				/* 侧滑参数  start */
				scrollLeft: 0,
				tabIndex: 0,
				lists:[],
				tabBars: [
					{name: '流程示例',id: 'lcsl'}, 
					{name: '开发示例',id: 'kfsl'},
					{name: '友情链接',id: 'yqlj'},
					{name: '第三方应用',id: 'dsfyy'}
				],
				/* 侧滑参数  end */
				/* 初始化下方定制的APP列表 */
				lxArr:[],//保存定制应用的种类
				apps:[],//存入定制应用的所有app
				myApps:[]//已定制的app
			}
		},
		onLoad() {
			//从缓存获取我定制的Apps，如果没有定制，则显示首页默认的Apps
			this.getMydz();
			this.getDZappData();
			
		},
		methods: {
			getMydz (){//获取已定制的app
				let myDzApps =  PdStorage.getObject("myDzAppsArray");//我定制的APP
				if(myDzApps.length>0){
					this.myApps = myDzApps;
				}else{
					this.myApps = PdCache.getDefaultIndexApps();
				}
				this.list = this.myApps;
			},
			getDZappData (){//获取定制所有app
				let configArray = PdStorage.getObject("configArray");
				for(var i = 0 ; i < configArray.length; i++){
					if(configArray[i].XH != 'index'){
						this.lxArr.push(configArray[i]);
						this.apps[configArray[i].XH] = PdCache.getAppsBydm(configArray[i].XH);
					}
				}				
				this.lcList = this.apps.lcsl;
				this.kfList = this.apps.kfsl;
				this.yqList = this.apps.yqlj;
				this.syList = this.apps.dsfyy;
				
				this.judgeAppType(this.lcList);
				this.judgeAppType(this.kfList);
				this.judgeAppType(this.yqList);
				this.judgeAppType(this.syList);
			},
			judgeAppType (obj){//判断是否为已定制APP
				for(let i=0;i<obj.length;i++){
					for(let j=0;j<this.list.length;j++){
						if(obj[i].XH == this.list[j].XH){
							this.$set(obj[i],'BOOL',true);
							break;
						}
					}
				}
			},
			back (){
				uni.navigateBack();
			},
			saveData (){//保存定制的数据
				console.log(this.list,"保存")
				let appIds = "";
				for(let i=0;i<this.list.length;i++){
					appIds += appIds==''?this.list[i].XH:','+this.list[i].XH;
				}
				this.$pdResource.service({
					data:{
						"service":'SAVE_DZAPP',
						"appIds":appIds
					}
				}).then(data=>{
					console.log(data,"保存数据");
					PdAction.toast(data.message);
					//更新我的定制APP缓存
					PdStorage.set("myDzAppsArray",this.list);
					this.$pdView.passValToPrePage({muData:"跳转成功"},1);
				})
			},
			deleteApp (item){//删除app
				this.dealDelDzapp(this.lcList,item);
				this.dealDelDzapp(this.kfList,item);
				this.dealDelDzapp(this.yqList,item);
				this.dealDelDzapp(this.syList,item);
			},
			dealDelDzapp (obj,item){//从我的定制里面删除app
				for(let i=0;i<obj.length;i++){
					if(obj[i].XH == item.XH){
						this.$set(obj[i],'BOOL',false);
						for(let j=0;j<this.list.length;j++){
							if(this.list[j].XH == item.XH && this.list.length>1){
								this.list.splice(j,1);
								return;
							}
						}
						return;
					}
				}
			},
			addApp (item){//添加app
				if(item.BOOL){
					for(let i=0;i<this.list.length;i++){
						if(this.list[i].XH == item.XH && this.list.length>1){
							this.list.splice(i,1);
						}
					}
				}else{
					this.list.push(item);
				}
				this.$set(item,'BOOL',!item.BOOL);//改变数据里面的某值
			},
			async tapTab(index) { //点击tab-bar				
				this.dealPageChange(index);
				this.tabNum = index;
				this.numb = 1;
				this.numkf = 1;
				this.numyq = 1;
				this.numdsf = 1;
			},
			clearNum (index){
				let res = this.getDomHeight();
				if(index == 0){
					this.numb = 0
				}
				if(index == 1){
					this.numkf = res[0]+1;
				} 
				if(index == 2){
					this.numyq = res[0] + res[1];
				} 
				if(index == 3){
					this.numdsf = res[0] + res[1] + res[2];
				} 
			},
			clearTop (num){//清除class样式
				this.tabNum = 0;
			},
			getDomHeight (){
				uni.createSelectorQuery().select('#lcslID').boundingClientRect((rects)=>{
				    this.lc = Number(rects.height);
				}).exec(); 
				uni.createSelectorQuery().select('#kfslID').boundingClientRect((rects)=>{
				    this.kf = Number(rects.height);
				}).exec();
				uni.createSelectorQuery().select('#yqljID').boundingClientRect((rects)=>{
				    this.yq = Number(rects.height);
				}).exec();
				uni.createSelectorQuery().select('#dsfID').boundingClientRect((rects)=>{
				    this.dsf = Number(rects.height);
				}).exec();
				return [this.lc,this.kf,this.yq,this.dsf];
			},
			async changeTab(e) {//滑动页面
				this.dealPageChange(e.detail.current);
				this.tabNum = e.detail.current;
				this.numb = 1;
				this.numkf = 1;
				this.numyq = 1;
				this.numdsf = 1;
			},
			dealPageChange (index){
				if (this.tabIndex === index) {
					return false;
				} else {
					this.tabIndex = index;
				}
			}
		}
	}
</script>

<style lang="scss">
	.page{
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.pageContent{
		position: relative;
		width: 100%;
		height: 100%;
		top:116upx;
		left: 0;
	}
	.pageDeail{
		padding: 20upx;
		background: #fff;
	}
	.custom-titie{
		width: 100%;
		height: 60upx;
		line-height: 60upx;
		color: #333;
		font-weight: 700;
		font-size: 34upx;
	}
	.custom-titie .bT{
		display: inline-block;
		float: left;
		width: 20upx;
		height: 50upx;
		background: #17bdcc;
		margin-top: 5upx;
		margin-right: 10upx;
	}
	
	.swiper-item{
		width: 100%;
		height: 100%;
		background: #fff;
		color:#333;
		padding: 30upx 0;
	}
	.uni-padding-wrap{
		width: 100%;
		padding: 0;
	}
	
	.swiper{
		height: 372upx;
	}
	.dzAPPview{
		background: #fff;
		margin-top: 20upx;
	}
	.dzAPPview .list{
		height: 650upx
	}
	.dzAPPview .swiper-tab-list{
		color:#333;
		font-size: 34upx;
		font-weight: 700;
	}
	.active{
		color:#17bdcc!important;
		padding-bottom: 26upx;
		border-bottom: 8upx solid #17bdcc;
	}
	 .swiper-box{
		height: 1600upx;
	} 
	.doAPPlc{
		width: 100%;
		min-height: 310upx;
		padding-top:30upx; 
	}
	.kfslSty{
		min-height: 620upx;
	}
	.yqljSty{
		min-height: 120upx;
	}
	.sySty{
		min-height: 146upx;
	}
	
	.threeAct{
		position: absolute;
		top:-148upx;
	}
	.fourAct{
		position: absolute;
		top:-384upx;
	}
</style>
