<template>
	<view>
		<uni-nav-bar v-if="!isSearch" left-icon="back" @click-left="back" :color="color" right-icon="search" @click-right="switchSearch">
			<uni-segmented-control :current="current" :values="items" v-on:clickItem="onClickItem" :styleType="styleType"
			 :activeColor="activeColor" :activeTextColor="activeTextColor" :wrapStyleCustom="wrapStyleCustom"></uni-segmented-control>
		</uni-nav-bar>
		<uni-nav-bar v-else color="#333333" fixed="false" @click-left="showCity" right-text="取消" @click-right="cancelSearch" :color="color">
			<view class="input-view" style="margin-top: 23upx;">
				<uni-icon type="search" size="22" color="#666666"></uni-icon>
				<input confirm-type="search" @confirm="confirm" style="float: right;line-height: 30upx;height: 30upx;" class="input" type="text" placeholder="搜索" />
			</view>
		</uni-nav-bar>
		<view class="uni-tab-bar">
			<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
				<view v-for="(flow,index) in flowType" :key="flow.id" :class="['swiper-tab-list',tabIndex==index ? 'active' : '']" :id="flow.id"
				 :data-current="index" @click="tapTab(index,flow.id)">{{flow.name}}</view>
			</scroll-view>
			<swiper :current="tabIndex" class="swiper-box" duration="300" @change="changeTab" style="height: 1000upx;">
				<swiper-item v-for="(tasks,index1) in taskList" :key="index1">
					<scroll-view class="list" scroll-y @scrolltolower="loadMore(index1)">
						<view class="uni-media-list dl" v-for="(task,index2) in tasks.data" :key="index2" @click="goDetail(task.LXDM,task.XH)">
							<view class="uni-media-list-text-top dt">{{task.BT}}</view>
							<view class="uni-media-list-text-bottom dd">
								<view class="tips" :style="{backgroundColor:task.YSZ ? task.YSZ : '#339966'}">{{task.LCJC}}</view>
								<view v-if="current == 0" class="uni-media-list-text-bottom">
									<view class="uni-media-list-text-bottom uni-ellipsis p">开始时间：{{task.BZKSSJ}}<view v-show="task.JJCD != ''">{{task.JJCD}}</view></view>
									<view class="uni-media-list-text-bottom uni-ellipsis p">办结期限：{{task.RWQX}}&nbsp;&nbsp;{{task.SFCS}}</view>
								</view>
								<view v-else class="uni-media-list-text-bottom">
									<view class="uni-media-list-text-bottom uni-ellipsis p">发起人：{{task.LCFQR}}/{{task.LCKSSJ}}</view>
									<view class="uni-media-list-text-bottom uni-ellipsis p">办理时间：{{task.BZJSSJ | formatDate}}&nbsp;&nbsp;流程状态：{{task.ZT}}</view>
									<view v-if="task.LCBJSJ != ''" class="uni-media-list-text-bottom uni-ellipsis p">任务结束时间：{{task.LCBJSJ}}</view>
								</view>
							</view>
						</view>
						<view class="uni-tab-bar-loading">
							<uni-load-more :loadingType="tasks.loadingType" :contentText="loadingText" :loadMoreStyle="loadMoreStyle"></uni-load-more>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '../../../../components/uni-load-more.vue';
	import uniSegmentedControl from '../../../../components/uni-segmented-control.vue';
	import {PdResource} from '../../../../common/powerapp/js/pd.resource.js';
	import {util} from '../../../../common/util.js';
	import uniNavBar from '../../../../components/uni-nav-bar.vue'
	import uniIcon from '../../../../components/uni-icon.vue'

	export default {
		components: {
			uniSegmentedControl,
			uniLoadMore,
			uniNavBar,
			uniIcon
		},
		data() {
			return {
				items: [
					'待办任务',
					'已办任务'
				],
				current: 0,
				isSearch: false,
				color: "#FFFFFF",
				activeColor: '#FFFFFF',
				activeTextColor: "#17bdcc",
				wrapStyleCustom: "margin-top:15upx;",
				loadMoreStyle: "background-color: #F2F2F2;",
				styleType: 'button',
				styleIndex: 0,
				colorIndex: 0,
				searchKey: "",
				taskType: "QUERY_UNDERWAY_TASK_LIST",
				loadingText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 0,
				taskList: [],
				flowType: [],
				flowLxdm: "ALL",
				pageNo: 1,
				totalCount: 0,
				totalPage: 0,
				pageSize: 15,
				isLoadMore: false
			}
		},
		filters: {
			formatDate(time) {
				var date = new Date(time);
				var _format = function (number) {
					return (number < 10 ? ('0' + number) : number);
				};
				return date.getFullYear() + '-' + _format(date.getMonth() + 1) + '-' + _format(date.getDay()) + ' ' +
					_format(date.getHours()) + ':' + _format(date.getMinutes());
			}
		},
		onLoad(option) {
			this.queryFlowType();
		},
		methods: {
			switchSearch() {
				this.isSearch = true;
			},
			cancelSearch() {
				this.isSearch = false;
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}
				if(index === 0){
					this.taskType = "QUERY_UNDERWAY_TASK_LIST";
				}else{
					this.taskType = "QUERY_FINISH_TASK_LIST";
				}
				this.taskList = [];
				this.flowLxdm = "ALL";
				this.pageNo = 1;
				this.isLoadMore = false;
				this.queryTaskList();
			},
			goDetail(lxdm,xh) {
				let url = "";
				if(lxdm == 'SW'){
					url = '/powerapp/pages/flow/sw/swDetail?LXDM='+lxdm+'&XH='+xh
				}else if(lxdm == 'QJ'){
					url = '/powerapp/pages/flow/qjsq/qjsqDetail?LXDM='+lxdm+'&XH='+xh
				}else{
					
				}
				uni.navigateTo({
					url: url
				})
			},
			loadMore(e) {
				this.taskList[e].loadingType = 1;
				this.isLoadMore = true;
				setTimeout(() => {
					this.addData(e);
				}, 1200);
			},
			addData(e) {
				if (this.pageNo >= this.totalPage) {
					this.taskList[e].loadingType = 2;
					return;
				}
				this.pageNo ++;
				this.queryTaskList();
				this.taskList[e].loadingType = 1;
			},
			async changeTab(e) {
				let index = e.detail.current;
				if (this.isClickChange) {
					this.tabIndex = index;
					this.isClickChange = false;
					return;
				}
				let tabBar = await this.getElSize("tab-bar"),
				tabBarScrollLeft = tabBar.scrollLeft;
				this.isClickChange = false;
				this.tabIndex = index; //一旦访问data就会出问题
				for(let i = 0, length = this.flowType.length; i < length; i ++){
					let flow = this.flowType[i];
					if(this.tabIndex == flow.index){
						this.flowLxdm = flow.id;
						break;
					}
				}
				this.pageNo = 1;
				this.isLoadMore = false;
				this.queryTaskList();
			},
			getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select('#' + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				});
			},
			async tapTab(index,id) { //点击tab-bar
				if (this.tabIndex === index) {
					return false;
				} else {
					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.isClickChange = true;
					this.tabIndex = index;
				}
				this.flowLxdm = id;
				this.pageNo = 1;
				this.isLoadMore = false;
				this.queryTaskList();
			},
			confirm(e){
				this.searchKey = e.detail.value;
				this.taskList = [];
				this.pageNo = 1;
				this.isLoadMore = false;
				this.queryTaskList();
			},
			queryFlowType(){
				this.$pdResource.service({
					data: {
						service: "QUERY_FLOW_TYPE",
						version: "1",
						userId: "SYSTEM",
						password: "PURE4"
					}
				}).then(res=>{
					let flowTypes = res.data_json;
					this.flowType.push({
						name: "全部",
						id: "ALL",
						index: 0
					});
					for(let i = 0; i < flowTypes.length; i ++){
						let taskFlowType = {
							name: flowTypes[i].LCMC,
							id: flowTypes[i].LXDM,
							index: i+1
						}
						this.flowType.push(taskFlowType);
					}
					this.queryTaskList();
				});
			},
			queryTaskList(){
				let lxdm = "";
				if(this.flowLxdm != "ALL")lxdm = this.flowLxdm;
				this.$pdResource.service({
					data: {
						service: this.taskType,
						version: "1",
						userId: "SYSTEM",
						password: "PURE4",
						searchKey: this.searchKey,
						queryType: lxdm,
						P_CURRENT: this.pageNo
					}
				}).then(res=>{
					let datas = res.data_array;
					this.totalPage = (res.total_count % this.pageSize == 0 ? res.total_count / this.pageSize : Math.floor(res.total_count / this.pageSize) + 1);
					let flowTypes = this.flowType;
					for(let i = 0, length = flowTypes.length; i < length; i ++){
						let taskItem =  {
							loadingType: 0,
							data: []
						};
						let flow = flowTypes[i];
						if(this.tabIndex == flow.index){
							taskItem.data = datas;
							if(typeof this.taskList[flow.index] != "undefined" && this.taskList[this.tabIndex].data.length == 0){
								for(let j = 0, length = datas.length; j < length; j ++){
									this.taskList[this.tabIndex].data.push(datas[j]);
								}
							}else{
								if(typeof this.taskList[flow.index] != "undefined" && this.taskList[this.tabIndex].data.length > 0 && this.isLoadMore){
									for(let j = 0, length = datas.length; j < length; j ++){
										this.taskList[this.tabIndex].data.push(datas[j]);
									}
								}else{
									this.taskList.push(taskItem);
								}
							}
						}else{
							if(typeof this.taskList[flow.index] == "undefined"){
								this.taskList.push(taskItem);
							}
						}
						if(this.pageNo >= this.totalPage){
							this.taskList[this.tabIndex].loadingType = 2;
						}
					}
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
	
	.tips{
		width: 100upx; 
		height: 100upx; 
		border-radius: 50%; 
		color: #fff; 
		font-size: 35upx; 
		line-height: 100upx; 
		text-align: center; 
		position: absolute;
		margin-top: 50upx;
		-webkit-transform: translateY(-50%); 
		transform: translateY(-50%);
	}
	
	.dl{
		outline: 1upx solid #e0e0e0;
	}
	
	.dt{
		width: 300upx;
		color: black; 
		font-size: 35upx; 
		font-weight: 500;
		line-height: 1.2; 
		padding-bottom: 10upx;
		position: absolute;
	}
	
	.dd{
		margin-top: 60upx;
	}
	
	.p{
		padding: 10upx 0; 
		margin-left: 120upx;
	}

	/* .content {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 300upx;
		text-align: center;
	}

	.color-tag {
		width: 50upx;
		height: 50upx;
	} */
</style>
