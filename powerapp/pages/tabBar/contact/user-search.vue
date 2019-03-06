<template>
	<view class="serach">
		<view class="content" :style="{'border-radius':radius+'px'}">
			<view class="content-box" :class="{'center':mode === 2}">
				<!-- <text class="icon icon-serach">&#xe61c;</text> -->
				<image class="img-size" src="../../../../static/search-al.png" mode=""></image>
				<input class="input" :class="{'center':!active && mode === 2}" @input="change" :focus="isFocus" placeholder="搜索联系人"
				 v-model="inputVal" @focus="focus" @blur="blur" />
				<!-- <view v-if="!active && mode === 2" class="input sub" @click="getFocus">请输入搜索内容</view> -->
				<text v-if="isDelShow" class="icon icon-del" @click="clear">&#xe644;</text>
			</view>
			<view v-show="(active&&show&&button === 'inside')||(isDelShow && button === 'inside')" class="serachBtn" @click="search">
				搜索
			</view>
		</view>
		<view v-if="button === 'outside'" class="button" :class="{'active':show||active}" @click="search">
			<!-- <uni-icon type="mic-filled" color="#999999" size="25"></uni-icon> -->
			<image class="img-size" src="../../../../static/icon-voice.png" mode="" @tap="startRecognize"></image>
		</view>
	</view>
</template>

<script>
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	export default {
		components: {
			uniIcon
		},
		props: {
			mode: {
				value: Number,
				default: 1
			},
			button: {
				value: String,
				default: 'outside'
			},
			show: {
				value: Boolean,
				default: true
			},
			radius: {
				value: String,
				default: 60
			}
		},
		data() {
			return {
				active: false,
				inputVal: '',
				searchName: '取消',
				isDelShow: false,
				isFocus: false,
				toastOp: {
					icon: 'none',
					duration: 1000
				}
			};
		},
		methods: {
			focus() {
				this.active = true;
			},
			blur() {
				this.isFocus = false;
				if (!this.inputVal) {
					this.active = false;
				}
			},
			clear() {
				this.inputVal = '';
				this.active = false;
				this.$emit('search', '');
			},
			getFocus() {
				this.isFocus = true;
			},
			search() {
				if (!this.inputVal) return;
				this.$emit('search', this.inputVal);
			},
			change(e) {
				if (!this.inputVal) return;
				this.$emit('input', e.detail.value)
			},
			startRecognize() {
				var options = {};
				options.engine = 'baidu';
				// #ifdef APP-PLUS
				plus.speech.startRecognize(options, (s) => {
					this.inputVal += s;
					this.inputVal = this.inputVal.slice(0,this.inputVal.length - 1);
				}, (e) => {
					this.$pdAction.toast("语音识别失败",this.toastOp);
				});
				// #endif
				// #ifdef H5 
					this.$pdAction.toast("当前版本不支持语音搜索",this.toastOp);
				// #endif

			}
		},
		watch: {
			inputVal(newVal) {
				if (newVal) {
					this.searchName = '搜索';
					this.isDelShow = true;
					this.$emit('input', this.inputVal);
				} else {
					this.searchName = '取消';
					this.isDelShow = false;
					this.$emit('input', this.inputVal);
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.serach {
		display: flex;
		width: 100%;
		border-bottom: 1px #f5f5f5 solid;
		box-sizing: border-box;
		padding: 15upx;
		font-size: $uni-font-size-base;
		background: #fff;

		.content {
			display: flex;
			align-items: center;
			width: 100%;
			height: 60upx;
			background: #fff;
			overflow: hidden;
			transition: all 0.2s linear;
			border-radius: 30px;

			.content-box {
				width: 100%;
				display: flex;
				align-items: center;

				&.center {
					justify-content: center;
				}

				.icon {
					padding: 0 15upx;

					&.icon-del {
						font-size: 38upx;
					}
				}

				.input {
					width: 100%;
					max-width: 100%;
					line-height: 60upx;
					height: 60upx;
					transition: all 0.2s linear;

					&.center {
						width: 200upx;
					}

					&.sub {
						// position: absolute;
						width: auto;
						color: grey;
					}
				}
			}

			.serachBtn {
				height: 100%;
				flex-shrink: 0;
				padding: 0 30upx;
				background: $uni-color-success;
				line-height: 60upx;
				color: #fff;
				border-left: 1px #ccc solid;
				transition: all 0.3s;
			}
		}

		.button {
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			flex-shrink: 0;
			width: 0;
			transition: all 0.2s linear;
			white-space: nowrap;
			overflow: hidden;

			&.active {
				padding-left: 15upx;
				width: 100upx;
			}
		}
	}

	@font-face {
		font-family: 'iconfont';
		src: url('//at.alicdn.com/t/font_989023_efq0mtli526.ttf') format('truetype');
	}

	.icon {
		font-family: iconfont;
		font-size: 32upx;
		font-style: normal;
		color: #999;
	}

	.img-size {
		width: 50upx;
		height: 50upx;
	}
</style>
