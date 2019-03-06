<template>
	<view>
		<!-- 基本信息 -->
		<view class="list-item">
			<view class="collapse-item dg-fold-icon1" @click="toggle_1">基本信息</view>
			<view v-show="collspan_1">
				<view class="table-list-ctn" width="100%">
					<ul>
						<li class="li-textarea">
							<span class="span-hd uni-textarea">
								问题描述：
							</span>
							<span class="span-value uni-textarea">
								{{feedBack.WTMS}}
							</span>
						</li>
						<li>
							<span class="span-hd">
								期望解决时间：
							</span>
							<span class="span-value">
								{{feedBack.EXPECTT}}
							</span>
						</li>

						<li>
							<span class="span-hd">
								提交人：
							</span>
							<span class="span-value">
								{{feedBack.FKRNAME}}
							</span>
						</li>
						<li>
							<span class="span-hd">
								联系电话：
							</span>
							<span class="span-value">
								{{feedBack.PHONE}}
							</span>
						</li>
						<li>
							<span class="span-hd">
								邮箱：
							</span>
							<span class="span-value">
								{{feedBack.EMAIL}}
							</span>
						</li>
						<li>
							<span class="span-hd">
								QQ号码：
							</span>
							<span class="span-value">
								{{feedBack.QQ}}
							</span>
						</li>
						<li>
							<span class="span-hd">
								状态：
							</span>
							<span class="span-value">
								{{feedBack.STATUS}}
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
			<view class="collapse-item dg-fold-icon2" @click="toggle_2">问题截图</view>
			<view v-show="collspan_2">
				<!-- <view class="uni-uploader__files">
					<block v-for="(item,index) in feedbackFJXX" :key="index">
						<view class="uni-uploader__file">
							<image class="uni-uploader__img" style="width: 100%; height: 100%;" :src="item.PATH" :data-src="item.PATH" @tap="previewImage"></image>
						</view>
					</block>
				</view> -->
				<pd-uploader  :readOnly="true" :fileArray="fileArray"></pd-uploader>
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
	import pdUploader from '@/powerapp/components/pd-uploader.vue'
	export default {
		data() {
			return {
				XH: '',
				toastOp: {
					icon: 'none',
					duration: 1000
				},
				feedBack: {},
				feedbackFJXX: [],
				imageList:[],
				collspan_1: true,
				collspan_2: true,
				disabled: true,
				localImage: [] ,//用来装已下载的附件信息,
				uploadNum:1,
				length:0,
				fileArray:[]  //附件预览 {WJMC:'',WJBH:''}  文件名称,文件编号。
			}
		},
		components:{
			pdUploader
		},
		onLoad(params) {
			// 获取参数
			this.XH = params.XH;
			this.getDetail()
		},
		methods: {
			getDetail() {
				this.$pdAction.showWait("加载数据...");
				this.$pdResource.service({
					data: {
						service: 'SEARCH_FEEDBACK_DETAIL',
						XH: this.XH
					}
				}).then((res) => {
					this.feedBack = res.data_object || {};
					this.length = res.data_files.length;
					if(this.length && this.length > 0){
						res.data_files.forEach((item) => {
							let obj = {
								WJMC:item.WDMC,     
								WJBH:item.WDBH
							}
							this.fileArray.push(obj)
						})
					}
					if(this.length == 0){
						this.$pdAction.closeWait();
					}
				}, (e) => {
					if (e.error_msg == undefined) {
						this.$pdAction.toast(e.resData.data, this.toastOp);
						return
					}
					this.$pdAction.toast(e.error_msg, this.toastOp);
				})
			},
			toggle_1() {
				this.collspan_1 = !this.collspan_1;
			},
			toggle_2() {
				this.collspan_2 = !this.collspan_2;
			}
		}
	}
</script>

<style>
	@import '../../../../common/powerapp/css/table_lr.scss';

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
	.apx-list {
		background: white;
		padding: 20upx;
	}

	.apx-list li {
		padding: 28upx;
		display: flex;
		background: #eee;
		border: 1px solid #F5F2F0;
		border-radius: 10upx;
		margin-bottom: 20upx;
	}

	.apx-list image {
		width: 100upx;
		height: 100upx;
		margin-right: 20upx;
	}

	.apx-list>li>.flex-item-V {
		display: flex;
		flex-direction: column;
		height: 100upx;
	}

	.apx-list>li>.flex-item-V>text {
		line-height: 50upx;
		color: #9c9898;
		font-size: 32upx;
	}

	.apx-list>li>.flex-item-V>.img-name {
		font-weight: bold;
		width: 520upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* 问题描述 */
	.table-list-ctn>ul>.li-textarea {
		height: 200upx;
		line-height: 200upx;
	}

	.table-list-ctn ul li .uni-textarea {
		height: 100%;
	}

	.span-value {
		background: white;
	}
</style>
