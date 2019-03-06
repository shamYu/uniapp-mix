<template>
	<view class="segmented-control" :class="styleType" :style="wrapStyle">
		<view v-for="(item, index) in values" class="segmented-control-item" :class="styleType" :key="index" :style="index === currentIndex ? activeStyle : itemStyle" @click="onClick(index)">
			{{item}}
		</view>
	</view>
</template>

<script>import {PdGlobal} from '../common/powerapp/js/pd.global';
	export default {
		name: 'segmented-control',
		props: {
			current: {
				type: Number,
				default: 0
			},
			values: {
				type: Array,
				default () {
					return [];
				}
			},
			activeColor: {
				type: String,
				default: PdGlobal.BASECOLOR
			},
			activeTextColor:{
				type: String,
				default: "#fff"
			},
			styleType: {
				type: String,
				default: 'button'
			},
			wrapStyleCustom: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				currentIndex: this.current
			}
		},
		watch: {
			current(val) {
				if (val !== this.currentIndex) {
					this.currentIndex = val;
				}
			}
		},
		computed: {
			wrapStyle() {
				let styleString = '';
				switch (this.styleType) {
					case 'text':
						styleString = `border:0;`;
						break;
					default:
						styleString = `border-color: ${this.activeColor};${this.wrapStyleCustom}`;
						break;
				}
				return styleString;
			},
			itemStyle() {
				let styleString = '';
				switch (this.styleType) {
					case 'text':
						styleString = `color:#000;border-left:0;`;
						break;
					default:
						styleString = `color:${this.activeColor};border-color:${this.activeColor};`;
						break;
				}
				return styleString;
			},
			activeStyle() {
				let styleString = '';
				switch (this.styleType) {
					case 'text':
						styleString = `color:${this.activeColor};border-left:0;border-bottom-style:solid;`;
						break;
					default:
						styleString = `color:${this.activeTextColor};border-color:${this.activeColor};background-color:${this.activeColor}`;
						break;
				}
				return styleString;
			}
		},
		methods: {
			onClick(index) {
				if (this.currentIndex !== index) {
					this.currentIndex = index;
					this.$emit('clickItem', index);
				}
			}
		},
	}
</script>

<style>
	.segmented-control {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 75%;
		height: 60upx;
		line-height: 60upx;
		font-size: 32upx;
		border-radius: 18upx;
		box-sizing: border-box;
		margin: 0 auto;
		overflow: hidden;
	}

	.segmented-control.button {
		border: 2upx solid;
	}

	.segmented-control.text {
		border: 0;
		border-radius: 0upx;
	}


	.segmented-control-item {
		flex: 1;
		text-align: center;
		/* line-height: 60upx; */
		box-sizing: border-box;
		line-height: inherit;
		align-self: center;
	}

	.segmented-control-item.button {
		border-left: 1upx solid;
	}

	.segmented-control-item.text {
		border-left: 0;
	}

	.segmented-control-item:first-child {
		border-left-width: 0;
	}
</style>
