<template>
	<view>
		<block class="mui-content">
			<view class="startFlowDiv" v-for="(item,index) in flowList" :key="index" @tap="openStartFlow(item)">
				{{item.LCMC}}
			</view>
			<view class="noData" v-if="flowList.length==0">当前没有任何可以发起的流程！</view>
		</block>
	</view>
</template>

<script>
	import {FlowBaseSvr} from '../../../../common/powerapp/js/flowSvr.js';
	import {PdAction} from '../../../../common/powerapp/js/pd.action.js';
	export default {
			data() {
				return {
					flowList : []
				};
			},
			onLoad(){
				this.$pdAction.showWait("正在加载中...");
				this.loadFlowList();
			},
			methods:{
				loadFlowList(){
					this.$flowSvr.queryCanStartFlow().then(res=>{
						this.flowList = res.data_json;
						this.$pdAction.closeWait();
					}).catch(error=>{
						this.$pdAction.toast("获取数据失败"+error,{icon:'none'});
						this.$pdAction.closeWait();
					});
				},
				openStartFlow(item){
					let url = "";
					if(item.LXDM == 'SW'){
						url = '/powerapp/pages/flow/sw/swStart?LXDM='+item.LXDM+'&XH='+item.XH+"&BZBH="+item.BZBH+"&TYPE=YB&LCBH="+item.LCBH+"&SFZYLC="+item.SFZYLC;
					}else if(item.LXDM == 'QJ'){
						url = '/powerapp/pages/flow/qjsq/qjsqStart?LXDM='+item.LXDM+'&XH='+item.XH+"&BZBH="+item.BZBH+"&TYPE=YB&LCBH="+item.LCBH+"&SFZYLC="+item.SFZYLC;
					}else{
						
					}
					this.$pdView.navigateTo(url).then(res=>{
					});
				}
			}
		}
</script>

<style>
	@import '../css/flow.css';
	page{
		background:#ffffff;
	}
</style>
