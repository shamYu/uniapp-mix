<template>
	<view>
		<view class="search-bar">
			<div class="input-bar">
				<div class="input-block">
					<input type="text" confirm-type="search" class="input-txt" value="" placeholder="搜索" v-model="searchKey" @confirm="confirm"/>
				</div>
			</div>
			<span class="slide-btn" @tap="showMore()"></span>
			<!-- 搜索提示 -->
			<div class="search-tips" v-if="isShow">
				<span>创建时间：</span>
				<a href="javascript:;" class="times" :class="type == 'ALL' ? 'on' : ''" @tap="fireQuery('ALL')">全部</a>
				<a href="javascript:;" class="times" :class="type == 'week' ? 'on' : ''" @tap="fireQuery('week')">一周前</a>
				<a href="javascript:;" class="times" :class="type == 'month' ? 'on' : ''" @tap="fireQuery('month')">一个月前</a>
				<a href="javascript:;" class="times" :class="type == 'year' ? 'on' : ''" @tap="fireQuery('year')">一年前</a>
			</div>
		</view>
		<view style="position: absolute;width:100%;" :style="{'top': top}">
			<pd-pullrefresh @setList="setList" ref="pullrefresh1"
			service-name="QUERY_FLOW_LIST"
			:service-param='serviceParam'
			:data-name="{count:'total_count',list:'data_array'}">
				<div class="result-list" v-for="(item,index) in list" :key="index" @tap="openDetail(item)">
					<dt>{{item.BT}}</dt>
					<dd>
						<i class="tips" :style="{backgroundColor:item.YSZ ? item.YSZ : '#339966'}">{{item.LCJC}}</i>
						<p><span>请假类型：{{item.QJLX}}</span><span></span></p>
						<p><span>申请时间：{{item.SQSJ}}</span></p>
					</dd>
				</div>
			</pd-pullrefresh>
		</view>
	</view>
</template>

<script>
	import pdPullrefresh from '@/powerapp/components/pd-pullrefresh/pd-pullrefresh.vue';
	import {mixin_pullrefresh} from '@/powerapp/components/pd-pullrefresh/mixin';
	export default {
			mixins:[mixin_pullrefresh],
			onReachBottom() { // 上拉加载
				this.$refs.pullrefresh1.reachBottom();
			},
			onPullDownRefresh(){ // 下拉刷新
				this.$refs.pullrefresh1.refresh();
			},
			components:{
				pdPullrefresh
			},
			data() {
				return {
					searchKey : '',
					queryDate: '',
					isShow: false,
					top: '95upx',
					type: 'ALL',
					serviceParam:{"searchKey": this.searchKey,"queryDate": this.queryDate,"queryType":'QJ'}
				};
			},
			onLoad(e) {
				
			},
			methods:{
				showMore(){
					this.isShow = !this.isShow;
					if(this.isShow){
						this.top = "185upx";
					}else{
						this.top = "95upx";
					}
				},
				confirm(e){
					this.searchKey = e.detail.value
					this.serviceParam = {"searchKey": this.searchKey,"queryDate": this.queryDate,"queryType":'QJ'};
					this.$refs.pullrefresh1.reachBottom();
				},
				fireQuery(type){
					this.type = type;
					this.queryDate = this.getTheDate(type);
					this.serviceParam = {"searchKey": this.searchKey,"queryDate": this.queryDate,"queryType":'QJ'};
					this.$refs.pullrefresh1.reachBottom();
				},
				getTheDate(type){
					var today = new Date();
					var theDate;
					if(type=='week'){
						today.setTime(today.getTime()-6*24*3600*1000);
						theDate = this.formatDate(today,'yyyy-MM-dd');
						 
					}else if(type=='month'){
						today.setTime(today.getTime()-30*24*3600*1000);
						theDate = this.formatDate(today,'yyyy-MM-dd');
					}else if(type=='year'){
						today.setTime(today.getTime()-365*24*3600*1000);
						theDate = this.formatDate(today,'yyyy-MM-dd');
					}
					return theDate;
				},
				formatDate(date,format){
					var o = {
						"M+" : date.getMonth()+1, //month
						"d+" : date.getDate(),    //day
						"h+" : date.getHours(),   //hour
						"m+" : date.getMinutes(), //minute
						"s+" : date.getSeconds(), //second
						"q+" : Math.floor((date.getMonth()+3)/3),  //quarter
						"S" : date.getMilliseconds() //millisecond
						}
					if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
					(date.getFullYear()+"").substr(4 - RegExp.$1.length));
					for(var k in o)if(new RegExp("("+ k +")").test(format))
					format = format.replace(RegExp.$1,
					RegExp.$1.length==1 ? o[k] :
					("00"+ o[k]).substr((""+ o[k]).length));
					return format;
				},
				openDetail(item){
					let url = '/powerapp/pages/flow/qjsq/qjsqDetail?LXDM='+item.LXDM+'&XH='+item.XH+"&BZBH="+item.BZBH+"&TYPE=YB";
					this.$pdView.navigateTo(url).then(res=>{
						console.log(res);
					});
				}
			}
		}
</script>

<style lang="scss">
@import '../css/flow.css';
@import '../../../../common/powerapp/css/_mixin.scss';
</style>
