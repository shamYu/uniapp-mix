<template>
	<view class="uni-page has-fixed-bottom" style="background:#eef0f2;" :class="{'overflow-hidden':is_overflow_hidden}">
		<flow-header-nav ref="flowHeaderNav" :title="title" @stop-scroll="stopScroll"></flow-header-nav>
		<view class="gap" style="background:#eef0f2;"></view>
		<view style="background-color: #FFFFFF;" class="uni-collapse listBg1">
			<view class="uni-list-cell-navigate uni-navigate-bottom" :class="isJbxx ? 'uni-active' : ''" @click="trigerCollapse('jbxx')">
				基本信息
			</view>
			<view class="uni-collapse-content" :class="isJbxx ? 'uni-active' : ''" >
				<block>
					<view class="table-list-ctn">
						<ul>
							<li>
								<span class="span-hd">请假人：</span>
								<span class="span-value">{{jbxxInfo.QJR}}</span>
							</li>
							<li>
								<span class="span-hd">请假类型：</span>
								<span class="span-value">{{jbxxInfo.QJLXMC}}</span>
							</li>
							<li>
								<span class="span-hd">请假开始时间：</span>
								<span class="span-value">{{jbxxInfo.QJSJKS_format}}</span>
							</li>
							<li>
								<span class="span-hd">请假结束时间：</span>
								<span class="span-value">{{jbxxInfo.QJSJJS_format}}</span>
							</li>
							<li>
								<span class="span-hd">请假原因：</span>
								<span class="span-value">{{jbxxInfo.QJYY}}</span>
							</li>
							<li>
								<span class="span-hd">备注：</span>
								<span class="span-value">{{jbxxInfo.BZ}}</span>
							</li>
						</ul>
					</view>
				</block>
			</view>
		</view>
		<view class="gap" style="background:#eef0f2;"></view>
		<flow-blgc :blgcInfo="blgcInfo" :blgcLength="blgcLength"></flow-blgc>
		<flow-footer-nav style="position:fixed;bottom: 0upx;" ref="flowFooterNav" v-if="isFooter"></flow-footer-nav>
	</view>
	
</template>
<script>
	import flowBlgc from '../components/flow-blgc.vue';
	import flowHeaderNav from '../components/flow-header-nav.vue';
	import flowFooterNav from '../components/flow-footer-nav.vue';
	import uniNavBar from '../../../../components/uni-nav-bar.vue';
	import uniIcon from '../../../../components/uni-icon.vue';
	import {FlowBaseSvr} from '../../../../common/powerapp/js/flowSvr.js';
	//来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
	var  graceChecker = require("../../../../common/graceChecker.js");
	import {mixin_scroll} from "@/powerapp/pages/flow/components/mixin_scroll.js";
	export default {
		mixins:[mixin_scroll],
		data() {
			return {
				isJbxx: true,
				jbxxInfo: {
				},
				blgcInfo: [],
				blgcLength: 0,
				isFooter: true,
				title: '请假申请详情',
				param: {}
			}
		},
		components:{
			uniNavBar,
			uniIcon,
			flowBlgc,
			flowHeaderNav,
			flowFooterNav
		},
		onLoad(e){
			this.$pdAction.showWait("正在加载中...");
			this.param = e;
			if(e.TYPE == 'YB'){
				this.initDetail(e,false);
			}else{
				this.initDetail(e,true);
			}
		},
		methods: {
			trigerCollapse(e) {
				if(e === 'jbxx'){
					if(this.isJbxx){
						this.isJbxx = false;
					}else{
						this.isJbxx = true;
					}
				}
			},
			setDataVal(e){
				if(e.refresh){
					this.initDetail(this.param,false);
				}
			},
			initDetail(e,isShowMessage){
				this.$flowSvr.queryFlowDetail(e.LXDM,e.XH).then(res=>{
					this.$pdAction.closeWait();
					this.jbxxInfo = res.data_json.JBXX;
					this.jbxxInfo.QJLXMC = this.formatDmjbh(this.jbxxInfo.QJLX);
					this.jbxxInfo.QJSJKS_format = this.formatDate(this.jbxxInfo.QJSJKS);
					this.jbxxInfo.QJSJJS_format = this.formatDate(this.jbxxInfo.QJSJJS);
					this.blgcInfo = res.data_json.BLGC;
					this.blgcLength = res.data_json.BLGC.length;
					this.$refs.flowHeaderNav.loadFlowPreData(res.data_json.JBXX.XH, e.BZBH,isShowMessage);	//加载头部导航栏数据
					if(this.$refs.flowHeaderNav.isShowAction){		//加载数据时，当动作标签打开后，关闭标签
						this.$refs.flowHeaderNav.changeAction();
					}
					if(e.TYPE === "DB"){
						this.isFooter = true;
						if(this.$refs.flowFooterNav.footerNav.length > 0){		//加载数据时，当底部导航栏有数据时，清除数据
							this.$refs.flowFooterNav.footerNav = [];
						}
						this.$refs.flowFooterNav.loadFlowInfo(res.data_json.JBXX.XH, e.BZBH);//加载底部导航栏数据
					}else{
						this.isFooter = false;
					}
				})
			},
			formatDmjbh(dm){
				let dmj = this.$pdCache.getGgdmzBydmj("QJLX");
				let dmnr = "";
				for(let dmz of dmj){
					if(dm === dmz.DM){
						dmnr = dmz.DMNR;
						break;
					}
				}
				return dmnr;
			},
			formatDate(time) {
				var date = new Date(time.replace(/-/g,'/'));
				var _format = function (number) {
					return (number < 10 ? ('0' + number) : number);
				};
				return date.getFullYear() + '-' + _format(date.getMonth() + 1) + '-' + _format(date.getDate());
			}
		}
	}
</script>

<style>
	@import '../css/flow.css';
	@import '../../../../common/powerapp/css/table_lr.scss';
	.uni-list-cell::after,.uni-list:after{
		display:none;
	}
	.uni-list{
		position:relative;
		top:0;
	}
	.table-list-ctn{
		border-top:0;
	}
	.span-value{
		padding-left: 14upx;
	}
</style>
