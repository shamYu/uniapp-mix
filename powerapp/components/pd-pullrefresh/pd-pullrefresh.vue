<template>
	<view class='pd-pullrefresh'>
		<view class='pd-pullresh-box'>
			<slot></slot>
		</view>
		<view v-if='count===0' class='empty-data'>
			<text>暂无数据</text>
		</view>
		<view class="load-more" :style="loadMoreStyle">
			<view class="loading-img" v-show="loadingType === 1 && showImage">
				<view class="load1">
					<view :style="{background:color}"></view>
					<view :style="{background:color}"></view>
					<view :style="{background:color}"></view>
					<view :style="{background:color}"></view>
				</view>
				<view class="load2">
					<view :style="{background:color}"></view>
					<view :style="{background:color}"></view>
					<view :style="{background:color}"></view>
					<view :style="{background:color}"></view>
				</view>
				<view class="load3">
					<view :style="{background:color}"></view>
					<view :style="{background:color}"></view>
					<view :style="{background:color}"></view>
					<view :style="{background:color}"></view>
				</view>
			</view>
			<text v-if='count!==0' class="loading-text" :style="{color:color}">{{loadingType === 0 ? contentText.contentdown : (loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore)}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "pd-pullrefresh",
		created(){
			this.load();
		},
		destoryed(){
			this.loadingType = 0;
		},
		props: {
			serviceUrl:{// 后端地址【作为url传入】
				type:String
			},
			serviceName:{// 服务名称【作为service传入】
				type:String
			},
			serviceParam:{// 服务传递参数
				type:Object,
				default(){
					return {}
				}
			},
			serviceParamName:{// 请求参数数据名称
				type:Object,
				default(){
					return {}
				}
			},
			dataName:{ // 返回数据名称
				type:Object,
				default(){
					return {}
				}
			},
			showImage: {
				type: Boolean,
				default: true
			},
			color: {
				type: String,
				default: "#777777"
			},
			contentText: {
				type: Object,
				default () {
					return {
						contentdown: "上拉显示更多",
						contentrefresh: "正在加载数据...",
						contentnomore: "没有更多数据了"
					};
				}
			},
			loadMoreStyle: {
				type: String,
				default: ""
			}
		},
		data(){
			return {
				data:{},
				list:[],
				count: '',
				loadingType:0 // 上拉的状态：0-loading前；1-loading中；2-没有更多了
			}
		},
		computed: {
			getServiceParam() {
				return Object.assign({
					pageSize : 20,
					orderBy : "CJSJ",
					orderWay : "DESC",
					P_CURRENT : 1 // 第一页
				}, this.serviceParam)
			},
			getServiceName(){
				return Object.assign({
					pageSize : 'pageSize',
					orderBy : "orderBy",
					orderWay : "orderWay",
					P_CURRENT : 'P_CURRENT' // 第几页; 1表示第一页
				}, this.serviceParamName)
			},
			getDataName(){
				return Object.assign({
					count : 'total_count',
					list : "item"
				}, this.dataName)
			}
		},
		watch:{
			serviceUrl(){
				this.load();
			},
			serviceName(){
				this.load()
			},
			serviceParam(){// 列表固定参数改变，数据刷新
				console.log('固定参数改变，刷新数据')
				this.load()
			}
		},
		methods: {
			load(type = ''){//
				this.loadingType = 0;
				if(this.serviceUrl==''&&this.serviceName==''){
					this.$pdAction.toast('serviceUrl和serviceName二选一',{icon:'none'})
				}
				let d = {data:this.getServiceParam};
				if(this.serviceUrl){
					d.url = this.serviceUrl;
				}else{
					
					Object.assign(d.data,{
						service: this.serviceName
					})
				}
				this.data = d;
				this.loadData(true,type)
			},
			stopRefresh(type){
				if(type=='refresh'){
					this.$pdAction.toast('刷新成功')
					uni.stopPullDownRefresh();// 停止下拉刷新
				}
			},
			loadData(isFirst,type = ''){//加载获取后台数据
			    if(isFirst){
					this.data.data[this.getServiceName.P_CURRENT]=1
				}else{
					this.data.data[this.getServiceName.P_CURRENT]+=1
				}
				this.$pdResource.service(this.data).then(data=>{
					this.count= data[this.getDataName.count];
					let list = data[this.getDataName.list];
					if(isFirst){
						console.log('------')
						console.log(type)
						this.stopRefresh(type)
						this.list = list;
					}else{
						this.list = this.list.concat(list);
					}
					this.$emit('setList',this.list)
					if(list.length<this.getServiceParam[this.getServiceName.pageSize]||this.count == this.list.length){//没有更多了
						this.loadingType = 2;
						return;
					}
					this.loadingType = 0;
				}).catch(e=>{
					this.stopRefresh(type)
					console.log(e)
				})
			},
			reachBottom() { //上拉加载
				if (this.loadingType !== 0) {
					return;
				}
				this.loadingType = 1;
				this.loadData();
			},
			refresh(){ // 下拉刷新
				this.load('refresh')
			}
		}
	}
</script>
<style lang="scss">
	@import '../../../common/powerapp/css/_var.scss';
	@import '../../../common/powerapp/css/_mixin.scss';
	.pd-pullrefresh{
		display:flex;
		flex-direction: column;
	}
	.pd-pullresh-box{
		position:relative;
	}
	.load-more,.empty-data{
		display: flex;
		flex-direction: row;
		color:$pd-color-two;
		font-size:$pd-font-size;
		height: 80upx;
		align-items: center;
		justify-content: center;
	}
	.loading-img {
		height: 24px;
		width: 24px;
		margin-right: 10px;
	}
	.loading-text {
		font-size: $pd-font-size;
		color: $pd-color-two;
	}
	.loading-img>view {
		position: absolute;
	}
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px;
	}
	.load2 {
		transform: rotate(30deg);
	}
	.load3 {
		transform: rotate(60deg);
	}
	.loading-img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #777;
		position: absolute;
		opacity: 0.2;
		transform-origin: 50%;
		-webkit-animation: load 1.56s ease infinite;
	}
	.loading-img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px;
	}
	.loading-img>view view:nth-child(2) {
		-webkit-transform: rotate(180deg);
		top: 11px;
		right: 0px;
	}
	.loading-img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px;
	}
	.loading-img>view view:nth-child(4) {
		top: 11px;
		left: 0px;
	}
	.load1 view:nth-child(1) {
		animation-delay: 0s;
	}
	.load2 view:nth-child(1) {
		animation-delay: 0.13s;
	}
	.load3 view:nth-child(1) {
		animation-delay: 0.26s;
	}
	.load1 view:nth-child(2) {
		animation-delay: 0.39s;
	}
	.load2 view:nth-child(2) {
		animation-delay: 0.52s;
	}
	.load3 view:nth-child(2) {
		animation-delay: 0.65s;
	}
	.load1 view:nth-child(3) {
		animation-delay: 0.78s;
	}
	.load2 view:nth-child(3) {
		animation-delay: 0.91s;
	}
	.load3 view:nth-child(3) {
		animation-delay: 1.04s;
	}
	.load1 view:nth-child(4) {
		animation-delay: 1.17s;
	}
	.load2 view:nth-child(4) {
		animation-delay: 1.30s;
	}
	.load3 view:nth-child(4) {
		animation-delay: 1.43s;
	}
	@-webkit-keyframes load {
		0% {
			opacity: 1;
		}
	
		100% {
			opacity: 0.2;
		}
	}
</style>
