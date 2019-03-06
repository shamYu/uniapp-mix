<template>
	<view class="page">
		<uni-nav-bar class="nav_custom" fixed="true" left-icon="back" color="#fff" @click-left="back" title="反馈问题">
			<view class="btn_list" v-show="!showSearch">
				<span class="iconfont icon-search" @click="showSearch = true"></span>
				&nbsp;
				<span class="iconfont icon-add" @click="editFeedBack"></span>
			</view>
			<view class="searchInpt" v-show="showSearch">
				<input type="text" placeholder="请输入搜索条件..." @input="searchList">
				<span class="cancelBtn" @click="cancel">取消</span>
			</view>
		</uni-nav-bar>
		<!-- #ifdef APP-PLUS || H5 -->
		<view class="pos-nav-app"></view>
		<!-- #endif -->
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
	</view>

</template>

<script>
	import uniNavBar from '../../../../components/uni-nav-bar.vue'
	import pdPullrefresh from '@/powerapp/components/pd-pullrefresh/pd-pullrefresh.vue';
	import {mixin_pullrefresh} from '@/powerapp/components/pd-pullrefresh/mixin'
	export default {
		components: {
			uniNavBar,
			pdPullrefresh
		},
		mixins: [mixin_pullrefresh],
		onReachBottom() { // 上拉加载
			this.$refs.pullrefresh1.reachBottom();
		},
		onPullDownRefresh() { // 下拉刷新
			this.$refs.pullrefresh1.refresh();
		},
		data() {
			return {
				showSearch: false,
				searchStr: '',
				toastOp: {
					icon: 'none',
					duration: 1000
				},
				dataList: [],
				serviceParam:{
					mainField: 'QCONTENT',
					subField: 'FKRNAME',
					showCjsj: true,
					searchStr: '',
					orderWay: 'DESC',
					orderBy: 'CJSJ'
				}
			}
		},
		created() {
		},
		methods: {
			searchList(e) {
				this.serviceParam = Object.assign({},this.serviceParam,{
					searchStr: e.detail.value
				});
				this.$refs.pullrefresh1.load()
			},
			cancel() {
				this.showSearch = false;
				this.searchStr = '';
			},
			back() {
				this.$pdView.back();
			},
			/* 问题详情页面跳转 */
			toDetail(XH) {
				this.$pdView.navigateTo('./feedBackView?XH=' + XH)
			},
			/* 新增问题 */
			editFeedBack() {
				this.$pdView.navigateTo('./feedBackEdit')
			}
		}
	}
</script>

<style lang="scss">
	@import '../../../../common/powerapp/css/table_lr.scss';

	.fb-uni-list {
		position: relative;
		background: #fff;
	}
	.uni-title {
		font-size: 34upx;
		font-weight: 700;
	}

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

	.iconfont{
		font-size: 54upx;
	}

	.searchInpt {
		width: 90%;
		height: 60upx;
		line-height: 60upx;
		position: absolute;
		/* #ifdef APP-PLUS */
			top: 40%;
		/* #endif */
		/* #ifdef H5 */
			top: 20%;
		/* #endif */
		left: 10%;
		z-index: 100;
		background: #17bdcc;
	}

	.searchInpt input {
		width: 75%;
		height: 100%;
		background: #fff;
		color: #333 !important;
		font-size: 30upx;
		padding: 0 20upx !important;
		border-radius: 20upx;
	}

	.searchInpt div {
		width: 100%;
	}

	.cancelBtn {
		display: inline-block;
		width: 30%;
		color: #fff;
		position: absolute;
		right: -100upx;
		/* #ifdef H5 */
			top: 0;
		/* #endif */
		/* #ifdef APP-PLUS */
			top: -18%;
		/* #endif */
		/* #ifdef MP-WEIXIN */
			top: -18%;
		/* #endif */
		font-size: 34upx;
	}
	uni-input div{
		width: 100%;
	}
</style>
