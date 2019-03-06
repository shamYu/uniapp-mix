<template>
    <view class="uni-status-bar" :class="{'uni-navbar-fixed':isFixed}" :style="style">
        <slot></slot>
    </view>
</template>

<script>
    export default {
		props:{
			/**
			 * 是否固定在顶部
			 */
			fixed: {
			    type: [Boolean, String],
			    default: false
			}
		},
        computed: {
			isFixed() {
				return String(this.fixed) === 'true'
			},
            style() {
                //#ifdef MP-WEIXIN
                var systemInfo = uni.getSystemInfoSync()
                return `height:${systemInfo.statusBarHeight}px`
                //#endif
                //#ifdef APP-PLUS
                return ''
                //#endif
            }
        }
    }
</script>

<style>
    .uni-status-bar {
        display: block;
        width: 100%;
        height: 20px;
        height: var(--status-bar-height);
    }
	.uni-status-bar.uni-navbar-fixed {
	    position: fixed;
	    z-index: 998;
		top:0;
	}
</style>
