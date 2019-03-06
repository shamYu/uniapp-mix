<template>
	<view>
		<!-- 滚动视图view替换为scroll-view -->
		<scroll-view>
			<!-- 页面内容 -->
			<view class="uni-padding-wrap">
				<view class="page-section swiper">
					<view class="page-section-spacing">
						<pd-swiper other-class="swiper">
							<swiper-item v-if="list.length > 0">							
								<view class="swiper-item uni-bg-red">
									<view class="testBtn" v-for="(item,index) in list" :key="index" v-if="index < 8" @tap="openUrl(item)">
										 <image class="hl-icon" :src="'../../../../static/powerapp/index/yytb/'+item.TBYSHLJ"></image> 
										<text class="menuIcon">{{item.YYMC}}</text>
									</view> 
								</view>                       
							</swiper-item>
							<swiper-item v-if="list.length > 8">
								<view class="swiper-item uni-bg-green">
									<view class="testBtn" v-for="(item,index) in list" :key="index" v-if="index > 7 && index < 16" @tap="openUrl(item)">
										<image class="hl-icon" :src="'../../../../static/powerapp/index/yytb/'+item.TBYSHLJ"></image>
										<text class="menuIcon">{{item.YYMC}}</text>
									</view> 
								</view>
							</swiper-item>
							<swiper-item v-if="list.length > 16">
								<view class="swiper-item uni-bg-blue">
									<view class="testBtn" v-for="(item,index) in list" :key="index" v-if="index > 15 && index < 24" @tap="openUrl(item)">
										<image class="hl-icon" :src="'../../../../static/powerapp/index/yytb/'+item.TBYSHLJ"></image>
										<text class="menuIcon">{{item.YYMC}}</text>
									</view> 
								</view>
							</swiper-item>
							<swiper-item v-if="list.length > 24">
								<view class="swiper-item uni-bg-blue">
									<view class="testBtn" v-for="(item,index) in list" :key="index" v-if="index > 23 && index < 32" @tap="openUrl(item)">
										<image class="hl-icon" :src="'../../../../static/powerapp/index/yytb/'+item.TBYSHLJ"></image>
										<text class="menuIcon">{{item.YYMC}}</text>
									</view> 
								</view>
							</swiper-item>
						</pd-swiper>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="uni-padding-wrap task-lst" style="padding-bottom: 90upx;">
			<view class="hd">- 待办任务 -</view>
			<view class="bd">
				<block>
					<ul>
						<li v-for="(item,index) in taskList" :key="index" @tap="openDetail(item)">
							<h1>{{item.BT}}</h1>
							<p>【{{item.LCMC}}】&emsp;任务期限：{{item.RWQX}}&emsp;<i v-show="item.SFCS=='已超时'">已超时</i></p>
						</li>
						<li style="padding: 0;" v-show="taskLength > 5">
							<a href="javasrcpt:void(0);" class="read-more" @tap="readMore()">查看更多</a>
						</li>
					</ul>
				</block>
			</view>
			<view v-show="taskLength == 0" class="firstNoData"></view>
		</view>
	</view>
</template>

<script>
	import uniBadge from "../../../../components/uni-badge.vue";
	import PdSwiper from '../../../components/pd-swiper.vue';
	export default {
		components:{
			PdSwiper,
			uniBadge
		},
		onLoad (option){
			// 此处后台获取数据【option为上一个页面传递数据】
 			this.loadBaseData();
 			this.loadAppDatas();
		},
		onPullDownRefresh() {
			setTimeout(() => {
				this.loadBaseData();
				uni.stopPullDownRefresh();
			}, 300);
		},
		data () {
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
			    {name:"请假查询",value:"QJCX.png",urls:"../../flow/qjsq/qjsqQueryList"},
				{name:"收文查询",value:"SWCX.png",urls:"../../flow/sw/swQueryList"},
				{name:"关注任务库",value:"GZRW.png",urls:"../../flow/task/gzTaskList"},
				{name:"百度",value:"BD.png",urls:"../../index/webLink/baidu"},
				{name:"新浪网",value:"XL.png",urls:"../../index/webLink/sina"},
				{name:"环保部",value:"HBB.png",urls:"../../index/webLink/hbb"},
				{name:"中国天气",value:"ZGTQ.png",urls:"../../index/webLink/chinaWheather"},
				{name:"添加应用",value:"add.png",urls:"../../index/addFile/addFile"}
			] */
			return {
				msg: 'hello world',
				indicatorDots: true,
				list:[],
				dealList:'',
				taskList: [],
				taskLength : 0
			}
		},
		created (){
			
		},
		computed:{ // 计算属性
			
		},
		methods: { // 方法
			setDataVal (e){
				this.loadAppDatas();
			},
			loadAppDatas (){//加载定制APP数据
				let myApps = [];
				let myDzApps =  this.$pdStorage.get("myDzAppsArray");
				if(myDzApps.length > 0){
					myApps = myDzApps;
				}else{
					myApps.push(this.$pdCache.getDefaultIndexApps())//清完数据为空
				}
				//这里可能要判断是否允许定制APP
				if(true){
					var dzUrl = '../../index/addFile/addFile';
					var dzApp = {
						'YYMC':'添加应用',//应用名称
						'TBLX':'MUI',//图标类型
						'TBYSHLJ':'add.png',//图标样式或路径
						'MUITBYS':'#CCCCCC',//MUI图标颜色
						'FWDZ':dzUrl //访问地址
					}
					myApps.push(dzApp);
				}
				this.list = myApps;
			},
			loadBaseData(){
				this.$pdResource.service({
					data : {
						service: 'QUERY_UNDERWAY_TASK_LIST'
					}
				}).then(res=>{
					let list = res.data_array;
					this.taskLength = list.length;
					for(let i = 0,len = list.length; i < len; i ++){
						this.taskList.push(list[i]);
						if(i == 4){		//只显示最新的5条数据
							break;
						}
					}
				});
			},
			openDetail(task){
				let url = "";
				if(task.LXDM == 'SW'){
					url = '/powerapp/pages/flow/sw/swDetail?LXDM='+task.LXDM+'&XH='+task.XH+"&BZBH="+task.BZBH+"&TYPE=DB";
				}else if(task.LXDM == 'QJ'){
					url = '/powerapp/pages/flow/qjsq/qjsqDetail?LXDM='+task.LXDM+'&XH='+task.XH+"&BZBH="+task.BZBH+"&TYPE=DB";
				}else{
					
				}
				this.$pdView.navigateTo(url).then(res=>{
					console.log(res);
				});
			},
			readMore(){
				let url = "/powerapp/pages/flow/flowListMain";
				this.$pdView.navigateTo(url).then(res=>{
					console.log(res);
				});
			},
			openUrl(item){
				if(item.YYLX=='WBYY'||item.YYLX=='YSYY'){
					this.openApplication(item)
				}else{
					this.$pdView.navigateTo(item.FWDZ)
				}
			},
			openApplication (txt){
				 let config = {
					url: txt.FWDZ,
					extras: (!txt.ZJCS || txt.ZJCS.replace(/(^\s*)|(\s*$)/g, "") == '') ? {} : eval("("+txt.ZJCS+")") //扩展参数,对象形式
				};
				let appInfo = this.$pdCache.getAppById(txt.XH);
				console.log('外部应用开启中......')
				if(txt.YYLX=='WBYY'){//如果是外部应用，则直接调用API打开第三方应用
					this.$pdDevice.launchApplication({
						pname:appInfo.ANDROID_BM||"",
						action:config.url,
						param:config.extras,
						aDownUrl:appInfo.ANDROID_XZDZ||"",
						iDownUrl:appInfo.IOS_XZDZ||""
					});
				}else if(txt.YYLX=='YSYY'){//如果是原生应用（适用于利用插件直接调用的集成方式）
					this.$pdDevice.openAndroidApp({
						pname:appInfo.ANDROID_BM||"",
						activity:config.url,
						param:config.extras
					});
				}
			}
		}
	}
</script>

<style lang="scss">
// @import "/common/css/_var.scss";
	.swiper-item{
		width: 100%;
		height: 100%;
		background: #fff;
		color:#333;
		padding:0;
	}
	.uni-padding-wrap{
		width: 100%;
		padding: 0;
	}
	.hl-icon{
		width:70upx;
		height:70upx;
	}
	.menuIcon{
		display: block;
		font-size: 28upx;
		margin-top:10upx;
	}
	.testBtn {
		width: 25%;
		text-align: center;
		height: 45%;
		float: left;
		display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
	}
	.swiper{
		height: 372upx;
	}
	
	.firstNoData{background:url(~@/static/powerapp/flow/firstPageNoData.png) no-repeat center;margin:0 auto;width:702upx;height:654upx;background-size:contain;z-index:1000;}
	.read-more{display: block;height: 90upx;color: #457aff;font-size: 25upx;text-align: center;line-height: 90upx;}
	.read-more:active{background-color: #f7f7f7;}
	
	.task-lst{background: #fff; border-top: 10upx solid #eee; border-bottom: 1px solid #eee;}
	.task-lst .hd{font-size: 37upx; color: #06baca; text-align: center; height: 90upx; line-height: 90upx; border-bottom: 1px solid #ddd;}
	.task-lst .bd ul li{padding: 24upx 32upx;}
	.task-lst .bd ul li h1{font-size: 29upx; color: #666; line-height: 1.5;}
	.task-lst .bd ul li p i{display: inline-block; margin-left: 15upx; background: #f34e42; font-size: 20upx; color: white; padding: 0 12upx; height: 41upx; line-height: 41upx; border-radius: 300px 300px 300px 0;}
	.task-lst .bd ul li p{font-size: 25upx; color: #666; line-height: 1.5; padding-top: 24upx;}
	.task-lst .bd ul li + li{border-top: 1px solid #ddd;}
</style>
