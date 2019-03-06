<template>
    <view>
        <view class="uni-padding-wrap">
            <view class="page-section swiper">
                <view class="page-section-spacing">
					<swiper circular="true" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" style="height: 400upx;width: 100%;">
					    <swiper-item v-for="(img,key) in imgUrls" :key="key">
					        <image :src="img" style="height: 400upx;width: 100%;" />
					    </swiper-item>
					</swiper>
                </view>
            </view>
        </view>
        <view class="swiper-list">
            <view class="uni-list-cell uni-list-cell-pd">
                <view class="uni-list-cell-db">指示点</view>
                <switch :checked="indicatorDots" @change="changeIndicatorDots" />
            </view>
            <view class="uni-list-cell uni-list-cell-pd">
                <view class="uni-list-cell-db">自动播放</view>
                <switch :checked="autoplay" @change="changeAutoplay" />
            </view>
        </view>
        <view class="uni-padding-wrap" style="padding-left: 24upx;">
            <view class="uni-common-mt">
                <text>幻灯片切换时长(ms)</text>
                <text class="info">{{duration}}</text>
            </view>
            <slider @change="durationChange" :value="duration" min="500" max="2000" />
            <view class="uni-common-mt">
                <text>自动播放间隔时长(ms)</text>
                <text class="info">{{interval}}</text>
            </view>
            <slider @change="intervalChange" :value="interval" min="2000" max="10000" />
        </view>
    </view>
</template>

<script>
	export default {
		data() {
			return {
				background: ['color1', 'color2', 'color3'],
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				imgUrls: [
				    '../../../../static/powerapp/index/slider/cbd.jpg',
				    '../../../../static/powerapp/index/slider/muwu.jpg',
				    '../../../../static/powerapp/index/slider/shuijiao.jpg',
					'../../../../static/powerapp/index/slider/yuantiao.jpg'
				]
			}
		},
		methods: {
			changeIndicatorDots(e) {
				this.indicatorDots = !this.indicatorDots
			},
			changeAutoplay(e) {
				this.autoplay = !this.autoplay
			},
			intervalChange(e) {
				this.interval = e.target.value
			},
			durationChange(e) {
				this.duration = e.target.value
			}
		}
	}
</script>

<style lang="scss">
	.swiper-item{
		width: 100%;
		height: 100%;
		background: #fff;
		color:#333;
		padding:0;
	}
	.uni-padding-wrap{
		width: 100%;
		padding: 0;
	}
	uni-image,.hl-icon{
		width:100%;
		height:100%;
	}
</style>
