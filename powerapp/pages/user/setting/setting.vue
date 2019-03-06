<template>
	<view class="uni-list">
		<view class="uni-list-cell uni-list-cell-pd" @tap="clear">
			<view class="uni-list-cell-db">清除应用缓存</view>
			<uni-icon color="#bbb" size="20" type="arrowright"></uni-icon>
		</view>
			<view class="uni-list-cell uni-list-cell-pd" @tap="settingForWhite">
				<view class="uni-list-cell-db">服务、白名单设置</view>
				<uni-icon color="#bbb" size="20" type="arrowright"></uni-icon>
			</view>
		<view class="uni-list-cell uni-list-cell-pd">
			<view class="uni-list-cell-db">显示工作台</view>
			<switch checked />
		</view>
	</view>
</template>

<script>
	import uniIcon from '../../../../components/uni-icon.vue'

	export default {
		data() {
			return {

			};
		},
		components: {
			uniIcon
		},
		methods: {
			clear() {
				this.$pdAction.alert('清楚缓存要重启应用,是否继续?', {
					showCancel: true,
					title: '系统消息'
				}).then(confirm => {
					if (confirm == 'confirm') {
						this.$pdStorage.clear();
						this.$pdDevice.quit();
						this.$pdDevice.restart();
					}
				})
			},
			settingForWhite(){
				uni.navigateTo({
					url:'../setting/serverSeting'
				})
			}
		}
		
	}
</script>

<style lang="scss">
	.uni-list-cell-db {
		font-size: 30upx;
	}
</style>
