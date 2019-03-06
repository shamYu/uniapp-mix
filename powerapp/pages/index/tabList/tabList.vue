<template>
	<view class="uni-tab-bar">
		<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
			<view v-for="(tab,index) in tabBars" :key="tab.id" :class="['swiper-tab-list',tabIndex==index ? 'active' : '']" :id="tab.id"
			 :data-current="index" @click="tapTab(index)">{{tab.name}}</view>
		</scroll-view>
		<swiper :current="tabIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item :key="0">
				<scroll-view class="list" scroll-y>
					<pd-list :lists="lists" @select="selectCellevt"></pd-list>
				</scroll-view>
			</swiper-item>
			
			<swiper-item :key="1">
				<scroll-view class="list" scroll-y  @scrolltolower="loadMore()">
					<pd-pullrefresh @setList="setList" ref="pullrefresh1"
					service-name="SEARCH_FEEDBACK_LIST"
					:service-param='serviceParam'
					:data-name="{count:'total_count',list:'data_array'}">
						<view class="fb-uni-list">
							<block v-for="(item,index) in list" :key="index">
								<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="toDetail(item.XH)">
									<view class="uni-triplex-row">
										<view class="uni-triplex-left">
											<text class="uni-title uni-ellipsis" v-cloak><b class="ptB"></b>{{item.QCONTENT}}</text>
											<text class="uni-text">{{item.FKRNAME}}</text>
											<text class="uni-text-small uni-ellipsis">{{item.CJSJ}}</text>
										</view>
									</view>
								</view>
							</block>
						</view>
					</pd-pullrefresh>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import PdList from '../personList/pd-list'
	import pdPullrefresh from '@/powerapp/components/pd-pullrefresh/pd-pullrefresh.vue'
	import {mixin_pullrefresh} from '@/powerapp/components/pd-pullrefresh/mixin'
	export default {
		components: {
			PdList,
			pdPullrefresh
		},
		mixins: [mixin_pullrefresh],
		onReachBottom() { // 上拉加载【用scrollView组件则使用scrolltolower】
		},
		onPullDownRefresh() { // 下拉刷新
			//this.$refs.pullrefresh1.refresh();
		},
		data() {
			return {
				scrollLeft: 0,
				tabIndex: 0,
				lists:[],
				tabBars: [{
					name: '人员信息',
					id: 'personInfm'
				}, {
					name: '问题反馈',
					id: 'problomFb'
				}],
				dataList: [],
				serviceParam:{
					mainField: 'QCONTENT',
					subField: 'FKRNAME',
					showCjsj: true,
					searchStr: '',
					orderWay: 'DESC',
					orderBy: 'CJSJ'
				}
			};
		},
		created (){
			this.$pdResource.service({
				data: {
					"service":"SEARCH_DEMO_LIST",
					pageSize : 20,
					orderBy : "CJSJ",
					orderWay : "DESC",
					P_CURRENT : 0
				}
			}).then(data=>{
				this.lists = data.data_array;	
			})
		},
		methods:{
			async tapTab(index) { //点击tab-bar
				this.dealPageChange(index);
			},
			async changeTab(e) {//滑动页面
				this.dealPageChange(e.detail.current);
				console.log(e.detail.current,"eee")
			},
			loadMore(){
				console.log("上拉加载")
				this.$refs.pullrefresh1.reachBottom();
			},
			dealPageChange (index){
				if (this.tabIndex === index) {
					return false;
				} else {
					/* let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft; */
					this.isClickChange = true;
					this.tabIndex = index;
				}
			},
			selectCellevt (item){
				let itemS = JSON.stringify(item)
				uni.navigateTo({
					url: '../personList/personDail/personDail?a='+itemS
				}) 
			},
			/* 问题详情页面跳转 */
			toDetail(XH) {
				this.$pdView.navigateTo('../../user/abute/feedBackView?XH=' + XH)
			}
		}
	}
</script>

<style lang="scss">
.uni-tab-bar{
	font-size: 30upx;
	color: #666;
}
.active{
	color:#333;
	font-weight: 700;
	padding-bottom: 26upx;
	border-bottom: 4upx solid #17bdcc;
}
.uni-title {
	font-size: 34upx;
	font-weight: 700;
}
.fb-uni-list{background: #fff;}
.uni-text,
.uni-text-small {
	font-size: 30upx;
	color: #a4a9b0;
}

.ptB {
	width: 20upx;
	height: 20upx;
	display: inline-block;
	background: #17bdcc;
	margin-right: 14upx;
	border-radius: 50%;
}
</style>
