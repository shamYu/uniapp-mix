<template>
	<view class="uni-page has-fixed-bottom" style="background:#eef0f2;" :class="{'overflow-hidden':is_overflow_hidden}">
		<flow-header-nav ref="flowHeaderNav" @stop-scroll="stopScroll" :title="title"></flow-header-nav>
		<view class="gap" style="background:#eef0f2;"></view>
		<view class="uni-list informaion-list">
			<view style="background-color: #FFFFFF;" class="uni-collapse listBg1">
				<view class="uni-list-cell-navigate uni-navigate-bottom" :class="isJbxx ? 'uni-active' : ''" @click="trigerCollapse('jbxx')">
					基本信息
				</view>
				<view class="uni-collapse-content" :class="isJbxx ? 'uni-active' : ''" >
					<block>
						<view class="table-list-ctn">
							<ul>
								<li>
									<span class="span-hd">来文单位：</span>
									<span class="span-value">{{jbxxInfo.LWDW}}</span>
								</li>
								<li>
									<span class="span-hd">收文日期：</span>
									<span class="span-value">{{jbxxInfo.SWRQ}}</span>
								</li>
								<li v-if="jbxxInfo.BJQX != ''">
									<span class="span-hd">办结期限：</span>
									<span class="span-value">{{jbxxInfo.BJQX}}</span>
								</li>
								<li>
									<span class="span-hd">来文类型：</span>
									<span class="span-value">{{jbxxInfo.LWLXMC}}</span>
								</li>
								<li>	
									<span class="span-hd">来文文种：</span>
									<span class="span-value">{{jbxxInfo.LWWZMC}}</span>
								</li>
								<li>
									<span class="span-hd">密级：</span>
									<span class="span-value">{{jbxxInfo.MJMC}}</span>
								</li>
								<li>
									<span class="span-hd">紧急程度：</span>
									<span class="span-value">{{jbxxInfo.JJCDMC}}</span>
								</li>
								<li>
									<span class="span-hd">来文文号：</span>
									<span class="span-value">{{jbxxInfo.LWWH}}</span>
								</li>
								<li>
									<span class="span-hd">来文标题：</span>
									<span class="span-value">{{jbxxInfo.LWBT}}</span>
								</li>
								<li>
									<span class="span-hd">拟办意见：</span>
									<span class="span-value">{{jbxxInfo.NBYJ}}</span>
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
			<flow-file :fileInfo="fileInfo"></flow-file>
			<view class="gap" style="background:#eef0f2;"></view>
			<flow-blgc :blgcInfo="blgcInfo" :blgcLength="blgcLength"></flow-blgc>
		</view>
		<flow-footer-nav style="position:fixed;bottom: 0upx;" ref="flowFooterNav" v-if="isFooter"></flow-footer-nav>
	</view>
</template>
<script>
	import flowBlgc from '../components/flow-blgc.vue';
	import flowFile from '../components/flow-file.vue';
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
				blgcLength:0,
				fileInfo: [],
				isFooter: true,
				title: '收文详情',
				param: {}
			}
		},
		onNavigationBarButtonTap(e) {
			console.log(e);
		},
		components:{
			uniIcon,
			flowBlgc,
			flowFile,
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
					this.jbxxInfo.LWLXMC = this.formatDmjbh("LWLX",this.jbxxInfo.LWLX);
					this.jbxxInfo.LWWZMC = this.formatDmjbh("LWWZ",this.jbxxInfo.LWWZ);
					this.jbxxInfo.MJMC = this.formatDmjbh("MJ",this.jbxxInfo.MJ);
					this.jbxxInfo.JJCDMC = this.formatDmjbh("JJCD",this.jbxxInfo.JJCD);
					this.blgcInfo = res.data_json.BLGC;
					this.blgcLength = res.data_json.BLGC.length;
					this.fileInfo = res.data_json.FJXX;
					this.$refs.flowHeaderNav.loadFlowPreData(res.data_json.JBXX.XH, e.BZBH,isShowMessage);
					if(this.$refs.flowHeaderNav.isShowAction){		//加载数据时，当动作标签打开后，关闭标签
						this.$refs.flowHeaderNav.changeAction();
					}
					if(e.TYPE === "DB"){
						this.isFooter = true;
						if(this.$refs.flowFooterNav.footerNav.length > 0){		//加载数据时，当底部导航栏有数据时，清除数据
							this.$refs.flowFooterNav.footerNav = [];
						}
						this.$refs.flowFooterNav.loadFlowInfo(res.data_json.JBXX.XH, e.BZBH);
					}else{
						this.isFooter = false;
					}
				})
			},
			formatDmjbh(dmjbh,dm){
				let dmj = this.$pdCache.getGgdmzBydmj(dmjbh);
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
				var date = new Date(time);
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
