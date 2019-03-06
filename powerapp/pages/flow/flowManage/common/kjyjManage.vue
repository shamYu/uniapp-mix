<template>
	<view>
		<uni-nav-bar class="nav_custom" fixed="true" left-icon="back" @click-left="back" title="快捷语句管理">
			<view class="btn_list">
				<span class="icon_add" @click="addManage"></span>
			</view>
		</uni-nav-bar>
		<prompt ref="prompt" @onConfirm="onConfirm" @onCancel="onCancel" title="新增操作" btn_cancel="取消" btn_certain="保存" :text="promptText"></prompt>
		<block>
			<view style="padding-top: 92upx;">
				<view class="op-list" style="display: flex;" v-for="(item,index) in kjyjArray" :key="index">
					<view class="list-input">
						<input type="text" :id="item.codeId" :value="item.value" @confirm="updateKjyj($event,item.codeId)" />
					</view>
					<view class="delete" @tap="deleteKjyj(item.codeId)"></view>
				</view>
			</view>
			<view style="padding-top: 20upx;" v-if="kjyjArray.length==0" class="noData">未查询到任何数据，请点击右上角新增！</view>
		</block>
	</view>
</template>

<script>
	import uniNavBar from '../../../../../components/uni-nav-bar.vue';
	import uniIcon from '../../../../../components/uni-icon.vue';
	import {
		PdAction
	} from '../../../../../common/powerapp/js/pd.action.js';
	import {
		FlowManageSvr
	} from '../../../../../common/powerapp/js/flowManageSvr.js';
	import prompt from '../../components/prompt.vue';
	export default {
		components: {
			uniNavBar,
			uniIcon,
			prompt
		},
		data() {
			return {
				kjyjArray: [],
				param: {},
				promptText: '请输入您的快捷常用语：'
			};
		},
		onLoad(e) {
			this.param = e;
			this.$pdAction.showWait("正在加载中...");
			this.loadKjyjManage();
		},
		methods: {
			loadKjyjManage() {
				this.$flowManageSvr.kjyjManage(this.param.flowDefId).then(res => {
					this.kjyjArray = res.data_json.kjyjArray;
					this.$pdAction.closeWait();
				}).catch(error => {
					this.$pdAction.toast("获取数据失败!" + error, {
						icon: 'none'
					});
					this.$pdAction.closeWait();
				});
			},
			updateKjyj(e, codeId) {
				let value = e.detail.value;
				if (value == '') {
					this.$pdAction.toast("请填写快捷语句!" + error, {
						icon: 'none'
					});
					return false;
				}
				this.$flowManageSvr.kjyjManage(this.param.flowDefId, codeId, value, 'UPDATE').then(res => {
					this.$pdAction.toast("保存成功!", {
						icon: 'none'
					});
					this.kjyjArray = res.data_json.kjyjArray;
				}).catch(error => {
					this.$pdAction.toast("保存失败!", {
						icon: 'none'
					});
				});
			},
			deleteKjyj(codeId) {
				this.$pdAction.alert("是否确定要删除该项记录?", {
					title: "操作提示",
					confirmText: '是',
					showCancel: true,
					cancelText: '否'
				}).then(res => {
					this.$flowManageSvr.kjyjManage(this.param.flowDefId, codeId, '', 'DELETE').then(res => {
						this.$pdAction.toast("删除成功!", {
							icon: 'none'
						});
						this.kjyjArray = res.data_json.kjyjArray;
					}).catch(error => {
						this.$pdAction.toast("删除失败!", {
							icon: 'none'
						});
					});
				});
			},
			back() {
				uni.navigateBack();
			},
			addManage: function() {
				this.$refs.prompt.show();
			},
			onConfirm: function(e) {
				let _cost = e;
				if (_cost != '') {
					this.$refs.prompt.hide();
					this.$flowManageSvr.kjyjManage(this.param.flowDefId, '', _cost, 'INSERT').then(res => {
						this.$pdAction.toast("新增成功!", {
							icon: 'none'
						});
						this.kjyjArray = res.data_json.kjyjArray;
					}).catch(error => {
						this.$pdAction.toast("新增失败!", {
							icon: 'none'
						});
					});
				} else {}
			},
			onCancel: function() {
				this.$refs.prompt.hide();
				this.$refs.prompt.cost = '';
			}
		}
	}
</script>

<style>
	@import '../../css/flow.css';
	@import '../../../../../common/powerapp/css/table_lr.scss';

	page {
		background: #ffffff;
	}

	.icon_add {
		background: url(../../../../../static/powerapp/index/icon/add.png);
		background-size: cover;
	}

	.op-list {
		border-bottom: 1px solid #C6CBD1;
	}

	.op-list .list-input {
		width: 90%;
		line-height: 100upx;
		height: 100upx;
	}

	.op-list .list-input input {
		line-height: 100upx;
		height: 100upx;
		margin-left: 15upx;
		margin-right: 15upx;
		font-size: 30upx;
	}

	.op-list .delete {
		width: 10%;
		display: block;
		width: 83upx;
		height: 100upx;
		background-repeat: no-repeat;
		background-position: center;
		background-size: 35upx 37upx;
		background-image: url(~@/static/powerapp/flow/ic_delete.png);
	}
</style>
