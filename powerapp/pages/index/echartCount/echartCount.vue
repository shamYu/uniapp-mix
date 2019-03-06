<template>
	<view class="container">
		<view class="canvasView">
			<view class="title">折线图</view>
			<mpvue-echarts :echarts="echarts" :onInit="lineInit" canvasId="line" ref="lineChart" />
		</view>
		<view class="canvasView">
			<view class="canvas-bar">
				<view class="title">柱状图</view>
			</view>
			<mpvue-echarts :echarts="echarts" :onInit="barInit" canvasId="bar" ref="barChart" />
		</view>
		<view class="canvasView">
			<view class="canvas-bar">
				<view class="title">饼图</view>
			</view>
			<mpvue-echarts :echarts="echarts" :onInit="pieInit" canvasId="pie" ref="pieChart" />
		</view>
	</view>
</template>

<script>
	import * as echarts from '../../../../components/echarts/echarts.simple.min.js';
	import mpvueEcharts from '../../../../components/mpvue-echarts/src/echarts.vue';

	const cityList = [{
		value: 55,
		name: '北京'
	}, {
		value: 38,
		name: '上海'
	}, {
		value: 20,
		name: '广州'
	},{
		value: 20,
		name: '武汉'
	},{
		value: 10,
		name: '杭州'
	}];

	let pieOption = {
		animation: false,
		backgroundColor: '#fff',
		color: ['#78B4FF','#F66BC7','#2BCBA7','#FF8896','#79C628','#6C93EE'],
		series: [{
			label: {
				normal: {
					fontSize: 14
				}
			},
			type: 'pie',
			center: ['50%', '50%'],
			radius: [0, '60%'],
			data: [],
			itemStyle: {
				emphasis: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 2, 2, 0.3)'
				}
			}
		}]
	};

	let lineOption = {
		color: ['#78B4FF','#F66BC7','#2BCBA7','#FF8896','#79C628','#6C93EE'],
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		legend: {
			data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
		},
		xAxis: [{
			type: 'category',
			data: ['周一','周二','周三','周四','周五','周六','周日']
		}],
		yAxis: [{
			type: 'value'
		}],
		series: [
			{
				name:'邮件营销',
				type:'line',
				stack: '总量',
				data:[120, 132, 101, 134, 90, 230, 210]
			},
			{
				name:'联盟广告',
				type:'line',
				stack: '总量',
				data:[220, 182, 191, 234, 290, 330, 310]
			},
			{
				name:'视频广告',
				type:'line',
				stack: '总量',
				data:[150, 232, 201, 154, 190, 330, 410]
			},
			{
				name:'直接访问',
				type:'line',
				stack: '总量',
				data:[320, 332, 301, 334, 390, 330, 320]
			},
			{
				name:'搜索引擎',
				type:'line',
				stack: '总量',
				data:[820, 932, 901, 934, 1290, 1330, 1320]
			}
		]
	};
	
	let barOption = {
			color: ['#78B4FF','#F66BC7','#2BCBA7','#FF8896','#79C628','#6C93EE'],
			tooltip : {
				trigger: 'axis',
				axisPointer : {            // 坐标轴指示器，坐标轴触发有效
					type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			legend: {
				data: ['直接访问', '邮件营销','联盟广告','视频广告','搜索引擎']
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis:  {
				type: 'category',
				data: ['周一','周二','周三','周四','周五','周六','周日']
				
			},
			yAxis: {
				type: 'value'
			},
			series: [
				{
					name: '直接访问',
					type: 'bar',
					stack: '总量',
					data: [320, 302, 301, 334, 390, 330, 320]
				},
				{
					name: '邮件营销',
					type: 'bar',
					stack: '总量',
					data: [120, 132, 101, 134, 90, 230, 210]
				},
				{
					name: '联盟广告',
					type: 'bar',
					stack: '总量',
					data: [220, 182, 191, 234, 290, 330, 310]
				},
				{
					name: '视频广告',
					type: 'bar',
					stack: '总量',
					data: [150, 212, 201, 154, 190, 330, 410]
				},
				{
					name: '搜索引擎',
					type: 'bar',
					stack: '总量',
					data: [820, 832, 901, 934, 1290, 1330, 1320]
				}
			]
		};
	export default {
		data() {
			return {
				echarts: echarts,
				updateStatus: false
			}
		},
		onLoad() {
			pieOption.series[0].data = cityList.slice(0);
		},
		computed:{
			
		},
		methods: {
			goBrowser() {
				// #ifdef APP-PLUS
				plus.runtime.openURL('https://github.com/F-loat/mpvue-echarts');
				// #endif
				// #ifdef MP-WEIXIN
				uni.showModal({
					content: '请复制链接在浏览器里打开',
					showCancel: false
				})
				// #endif
			},
			pieInit(canvas, width, height) {
				let pieChart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(pieChart)

				pieChart.setOption(pieOption)
				return pieChart
			},
			lineInit(canvas, width, height) {
				let lineChart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(lineChart)

				lineChart.setOption(lineOption)
				return lineChart
			},
			barInit (canvas, width, height){
				let barChart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(barChart)
				
				barChart.setOption(barOption)
				return barChart
			}
		},
		components: {
			mpvueEcharts
		}
	}
</script>

<style lang="scss">
	page,
	view {
		display: flex;
		/* uni-app默认使用flex布局。因为flex布局有利于跨更多平台，尤其是采用原生渲染的平台。如不了解flex布局，请参考http://www.w3.org/TR/css3-flexbox/。若不需要flex布局可删除本行*/
	}

	page {
		min-height: 100%;
	}

	.page-section-title {
		padding: 0 30upx;
	}

	.title {
		margin-left: 30upx;
		color: #333;
		font-size: 36upx;
	}

	.container {
		padding-bottom: 30upx;
		box-sizing: border-box;
	}

	.container,
	.canvasView {
		flex: 1;
		flex-direction: column;
		
	}
	.canvasView{
		background: #fff;
		min-height: 500upx;
		margin-bottom: 20upx;
	}
	.navigate {
		color: #007AFF;
	}
	
	.canvas-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.update-btn {
		margin-right: 30upx;
	}
</style>
