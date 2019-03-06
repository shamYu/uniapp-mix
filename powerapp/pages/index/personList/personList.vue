<template>
	<view class="page">
		<!-- #ifndef MP -->
		<!-- 固定在顶部的导航栏 -->
		<uni-nav-bar fixed="true" left-icon="back" @click-left="back" :title="title">
			 <view class="searchInpt"  v-show="calBool">
				 <input class="input" confrim-type="search" placeholder="请输入搜索条件..." @input="onKeyInput">
			</view>
			<template slot="right">
				<view v-show="!calBool" class="unb-icon-list">
					 <span class="icon_search" @click="searchlist"></span>
					 &nbsp;
					 <span class="icon_add" @click="addlist"></span>
				</view>
				<view v-show="calBool" class="cancelBtn" @click="calcelSeach">取消</view>
			</template>
		 </uni-nav-bar>
		 <!-- 使用非原生导航栏后需要在页面顶部占位 -->
		 <!-- #ifdef APP-PLUS || H5 -->
		 <view class="pos-nav-app"></view>
		 <!-- #endif -->
		<!-- #endif -->
		
		 <pd-pullrefresh @setList="setList" ref="pullrefresh1"
		 service-name="SEARCH_DEMO_LIST"
		 :service-param='serviceParam'
		 :data-name="{count:'total_count',list:'data_array'}">
			<pd-list :lists="list" @select="selectCellevt"></pd-list>
		 </pd-pullrefresh>
	</view>
</template>

<script>
	import uniNavBar from '../../../../components/uni-nav-bar.vue'
	import pdPullrefresh from '@/powerapp/components/pd-pullrefresh/pd-pullrefresh.vue';
	import {mixin_pullrefresh} from '@/powerapp/components/pd-pullrefresh/mixin'
	import PdList from './pd-list'
	export default {
		components: {
			uniNavBar,
			pdPullrefresh,
			PdList
		},
		mixins:[mixin_pullrefresh],
		onReachBottom() { // 上拉加载
			this.$refs.pullrefresh1.reachBottom();
		},
		onPullDownRefresh(){ // 下拉刷新
			console.log('下拉刷新')
			this.$refs.pullrefresh1.refresh();
		},
		data() {
			return {
				serviceParam:{orderBy : "CJSJ",orderWay : "DESC"},
				calBool:false,
				title:'人员列表'
			};
		},
		computed:{
			
		},
		methods:{
			onKeyInput: function(event) {//实时获取input输入的值  模糊搜索
				let inVal = event.detail.value;
				this.serviceParam = {searchStr: inVal,orderBy : "CJSJ",orderWay : "DESC"}
			},
			back (){
				uni.navigateBack();
			},
			searchlist (){
				this.title = '';
				this.calBool = true;
			},
			addlist (){
				uni.navigateTo({
					url: 'personEdit/personEdit'
				}) 
			},
			calcelSeach (){//取消搜索框
				this.title = '人员列表';
				this.calBool = false;
			},
			selectCellevt (item){
				let itemS = JSON.stringify(item)
				uni.navigateTo({
					url: 'personDail/personDail?a='+itemS
					//url: 'personDail/personDail?a='+item.NAME+'&b='+item.VALUE+'&c='+item.TIME
				}) 
			}
		}
	}
</script>

<style lang="scss">
@import '../../../../common/powerapp/css/table_lr.scss';
.uni-list{
	background: #fff;
	position:relative;
	top:0;
}
.icon_add,.icon_search{
	width:40upx;
	height:40upx;
}
.icon_search{
	background: url(../../../../static/powerapp/index/icon/search.png);
	background-size: cover;
}
.uni-title{
	font-size: 34upx;
	font-weight: 700;
}
.uni-text,.uni-text-small{
	font-size: 30upx;
	color: #a4a9b0;
}
.ptB{
	width: 20upx;
    height: 20upx;
    display: inline-block;
    background: #17bdcc;
    margin-right: 14upx;
    border-radius: 50%;
}
.icon_add{
	background: url(../../../../static/powerapp/index/icon/add.png);
	background-size: cover;
}
.icon_add,.icon_search{
	margin-left:0;
	margin-right:8px;
}
.searchInpt{
	width: 100%;
	height:52upx;
	z-index: 100;
	background: #17bdcc;
	display:flex;
	align-items: center;
	.input{
		flex:1;
		background: #fff;
		height:52upx;
		line-height: 52upx;
		border-radius:52upx;
		padding:0 10upx;
		font-size:32upx;
		color:#333;
	}
}
.searchInpt div{width: 100%;}
.cancelBtn{
	display:flex;
	align-items: center;
	text-align: center;
	font-size:32upx;
	padding-left:10upx;
	padding-right:12upx;
}

</style>
