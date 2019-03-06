<template>
	<view style="height:100%;">
		<uni-nav-bar v-if="!isSearch" left-icon="back" @click-left="back" :color="color" right-icon="search" fixed="true"
		 @click-right="switchSearch">
			<uni-segmented-control :current="current" :values="items" v-on:clickItem="onClickItem" :styleType="styleType"
			 :activeColor="activeColor" :activeTextColor="activeTextColor" :wrapStyleCustom="wrapStyleCustom"></uni-segmented-control>
		</uni-nav-bar>
		<uni-nav-bar v-else color="#333333" fixed="true" @click-left="showCity" right-text="取消" @click-right="cancelSearch"
		 :color="color">
			<view class="input-view search-view">
				<div class="search-box">
					<input type="text" confirm-type="search" class="search-txt" value="" placeholder="搜索" v-model="searchKey" @input="confirm" />
				</div>
			</view>
		</uni-nav-bar>
		<view class="uni-tab-bar" style="padding-top: 98upx;">
			<scroll-view id="tab-bar" class="uni-swiper-tab" style="height: 90upx;" scroll-x :scroll-left="scrollLeft">
				<view v-for="(flow,index) in flowType" :key="flow.id" class="swiper-tab-list" :class="tabIndex==index ? 'active' : ''"
				 :id="flow.id" :data-current="index" @tap="tapTab(index,flow.id)">{{flow.name}}</view>
			</scroll-view>
			<swiper :current="tabIndex" class="swiper-box" duration="300" @change="changeTab" style="padding-top: 95upx;">
				<swiper-item v-for="(tasks,index1) in taskList" :key="index1">
					<scroll-view class="list" scroll-y @scrolltolower="loadMore(index1)">
						<div class="result-list" v-for="(task,index2) in tasks.data" :key="index2" @tap="goDetail(task)">
							<dt>{{task.BT}}</dt>
							<dd v-if="current == 0">
								<i class="tips" :style="{backgroundColor:task.YSZ ? task.YSZ : '#339966'}">{{task.LCJC}}</i>
								<p><span>开始时间：{{task.BZKSSJ}}</span><span v-if="task.JJCD!=''">紧急程度：{{task.JJCD}}</span></p>
								<p><span>办结期限：{{task.RWQX}}</span><span>{{task.SFCS}}</span></p>
							</dd>
							<dd v-else>
								<i class="tips" :style="{backgroundColor:task.YSZ ? task.YSZ : '#339966'}">{{task.LCJC}}</i>
								<p><span>发起人：{{task.LCFQR}}/{{task.LCKSSJ}}</span></p>
								<p><span>办理时间：{{task.BZJSSJ}}</span><span>流程状态：{{task.ZT}}</span></p>
								<p v-if="task.LCBJSJ!=''"><span>任务结束时间：{{task.LCBJSJ}}</span></p>
							</dd>
						</div>
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
	import uniLoadMore from '../../../components/uni-load-more.vue';
	import uniSegmentedControl from '../../../components/uni-segmented-control.vue';
	import {
		PdResource
	} from '../../../common/powerapp/js/pd.resource.js';
	import {
		util
	} from '../../../common/util.js';
	import uniNavBar from '../../../components/uni-nav-bar.vue';
	import uniIcon from '../../../components/uni-icon.vue';

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
				isLoadMore: false,
				type: "DB",
				isPullDownRefresh: false
			}
		},
		onLoad(option) {
			this.queryFlowType();
		},
		onPullDownRefresh() {
			this.isPullDownRefresh = true;
			this.taskList = [];
			this.flowType = [];
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
			setDataVal(e) {
				if (e.refresh) {
					this.taskList = [];
					this.flowType = [];
					this.queryFlowType();
				}
			},
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}
				if (index === 0) {
					this.taskType = "QUERY_UNDERWAY_TASK_LIST";
					this.type = "DB";
				} else {
					this.taskType = "QUERY_FINISH_TASK_LIST";
					this.type = "YB";
				}
				this.taskList = [];
				//this.flowLxdm = "ALL";
				this.pageNo = 1;
				this.isLoadMore = false;
				this.queryTaskList();
			},
			goDetail(task) {
				let url = "";
				if (task.LXDM == 'SW') {
					url = '/powerapp/pages/flow/sw/swDetail?LXDM=' + task.LXDM + '&XH=' + task.XH + "&BZBH=" + task.BZBH + "&TYPE=" +
						this.type;
				} else if (task.LXDM == 'QJ') {
					url = '/powerapp/pages/flow/qjsq/qjsqDetail?LXDM=' + task.LXDM + '&XH=' + task.XH + "&BZBH=" + task.BZBH +
						"&TYPE=" + this.type;
				} else {

				}
				this.$pdView.navigateTo(url).then(res => {
					console.log(res);
				});
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
				this.pageNo++;
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
				for (let i = 0, length = this.flowType.length; i < length; i++) {
					let flow = this.flowType[i];
					if (this.tabIndex == flow.index) {
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
			async tapTab(index, id) { //点击tab-bar
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
				console.log(this.flowLxdm);
				this.pageNo = 1;
				this.isLoadMore = false;
				this.queryTaskList();
			},
			confirm(e) {
				this.searchKey = e.detail.value;
				this.taskList = [];
				this.pageNo = 1;
				this.isLoadMore = false;
				this.queryTaskList();
			},
			queryFlowType() {
				this.$pdResource.service({
					data: {
						service: "QUERY_FLOW_TYPE"
					}
				}).then(res => {
					let flowTypes = res.data_json;
					this.flowType.push({
						name: "全部",
						id: "ALL",
						index: 0
					});
					for (let i = 0; i < flowTypes.length; i++) {
						let taskFlowType = {
							name: flowTypes[i].LCMC,
							id: flowTypes[i].LXDM,
							index: i + 1
						}
						this.flowType.push(taskFlowType);
					}
					this.queryTaskList();
				});
			},
			queryTaskList() {
				let lxdm = "";
				if (this.flowLxdm != "ALL") lxdm = this.flowLxdm;
				this.$pdResource.service({
					data: {
						service: this.taskType,
						searchKey: this.searchKey,
						queryType: lxdm,
						P_CURRENT: this.pageNo
					}
				}).then(res => {
					let datas = res.data_array;
					this.totalPage = (res.total_count % this.pageSize == 0 ? res.total_count / this.pageSize : Math.floor(res.total_count /
						this.pageSize) + 1);
					let flowTypes = this.flowType;
					for (let i = 0, length = flowTypes.length; i < length; i++) {
						let taskItem = {
							loadingType: 0,
							data: []
						};
						let flow = flowTypes[i];
						if (this.tabIndex == flow.index) {
							if (this.type == 'YB') { //已办任务中 办理时间格式化
								for (let taskData of datas) {
									taskData.BZJSSJ = this.formatDate(taskData.BZJSSJ);
								}
							}
							taskItem.data = datas; //获取数据后加载到对应的集合中
							if (typeof this.taskList[flow.index] != "undefined" && this.taskList[this.tabIndex].data.length == 0) {
								for (let j = 0, length = datas.length; j < length; j++) {
									this.taskList[this.tabIndex].data.push(datas[j]);
								}
							} else {
								//上拉刷新时附加数据，否则直接将数据添加进去，使用push才能实时同步数据到页面显示。
								if (typeof this.taskList[flow.index] != "undefined" && this.taskList[this.tabIndex].data.length > 0 && this.isLoadMore) {
									for (let j = 0, length = datas.length; j < length; j++) {
										this.taskList[this.tabIndex].data.push(datas[j]);
									}
								} else {
									this.taskList.push(taskItem);
								}
							}
						} else {
							if (typeof this.taskList[flow.index] == "undefined") {
								this.taskList.push(taskItem);
							}
						}
						//分页处理，当数据全部加载后，设置无法再次上拉加载
						if (this.pageNo >= this.totalPage) {
							if (typeof(this.taskList[this.tabIndex]) != "undefined") {
								this.taskList[this.tabIndex].loadingType = 2;
							} else {}
						}
					}
					if (this.isPullDownRefresh) {
						uni.stopPullDownRefresh();
						this.isPullDownRefresh = false;
					}
				})
			},
			formatDate(time) {
				var date = new Date(time.replace(/-/g,'/'));
				var _format = function(number) {
					return (number < 10 ? ('0' + number) : number);
				};
				return date.getFullYear() + '-' + _format(date.getMonth() + 1) + '-' + _format(date.getDay()) + ' ' +
					_format(date.getHours()) + ':' + _format(date.getMinutes());
			}
		}
	}
</script>

<style>
	@import './css/flow.css';

	page {
		background-color: #FFFFFF;
	}

	.active {
		color: #007AFF;
	}

	.uni-swiper-tab {
		position: fixed;
		top: 92upx;
		z-index: 9999;
	}

	/* #ifdef APP-PLUS */
	.uni-swiper-tab {
		line-height: 132upx;
	}

	/* #endif */
</style>
