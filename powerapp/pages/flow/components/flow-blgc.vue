<template>
	<view class="uni-list-cell uni-collapse listBg3" style="background-color: #FFFFFF;">
		<view class="uni-list-cell-navigate uni-navigate-bottom" :class="isBlgc ? 'uni-active' : ''" style="border-bottom: 1upx solid #e2e2e7;" @click="trigerCollapseBlgc('blgc')">
		    办理过程
		</view>
		<view class="uni-collapse-content" :class="isBlgc ? 'uni-active' : ''">
			<ul class="axis-box">
				<li v-for="(item,index) in blgcInfo" :key="index">
					<h1>{{item.CLBM}}&nbsp;{{item.STEP==''?'':'('+item.STEP+')'}}</h1>
					<h2>
						<div class="axis-msg">
							<p><img :src="item.CLSJ==''? '../../../../static/powerapp/flow/icon_curTag.png':'../../../../static/powerapp/flow/icon_ok.png'" /><strong>办理人：{{item.CJR}}</strong><i>{{item.CLSJ}}</i></p>
							<p><em v-if="item.CLSJ!=''">{{item.CLYJ}}</em></p>
						</div>
					</h2>
				</li>
			</ul>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			blgcLength: {
				type: Number,
				default: 0
			},
			blgcInfo: {
				type: Array
			}
		},
		data() {
			return {
				isBlgc: true
			};
		},
		methods: {
			trigerCollapseBlgc(e) {
				if(e === 'blgc'){
					if(this.isBlgc){
						this.isBlgc = false;
					}else{
						this.isBlgc = true;
					}
				}
			}
		}
	}
</script>

<style>
@import '../css/flow.css';

.axis-box{margin: 24upx 0; background: url(~@/static/powerapp/flow/axis_dotline.png) repeat-y 44upx top; -webkit-background-size: 48upx 24upx; background-size: 48upx 24upx;}
.axis-box li{padding: 16upx 30upx 0 0; margin-top: 53upx;}
.axis-box li:first-child{margin-top: 0;}
.axis-box li h1{color: #a4a4a4; font-size: 30upx; margin-bottom: 16upx; padding-left: 126upx;}
.axis-box li h2{position: relative; padding-left: 126upx;}
.axis-msg{background: #f0f8ff; padding: 16upx; border-radius: 14upx; position: relative;}
.axis-msg p{ margin-top: 24upx; overflow: hidden;}
.axis-msg p:first-child{margin-top: 0;}
.axis-msg p img{width: 40upx; height: 40upx; float: left; margin-right: 16upx;}
.axis-msg p strong{color: black; font-size: 28upx; float: left; margin-top: 4upx;}
.axis-msg p i{color: #b0b3c5; font-size: 28upx; float: right;}
.axis-msg p em{line-height:120%;color: #8aa1b5; font-size: 28upx;}
.axis-box li h2:before{content: ''; position: absolute; left: 44upx; top: 50%; background: url(~@/static/powerapp/flow/axis_dot.png) no-repeat; -webkit-background-size: contain; background-size: contain; width: 48upx; height: 54upx; -webkit-transform: translateY(-50%); transform: translateY(-50%);}
.axis-msg:before{content: ''; position: absolute; left: -18upx; top: 50%; width: 0; height: 0; border-style: solid; border-width: 22upx 22upx 22upx 0; border-color:transparent #f0f8ff transparent transparent; -webkit-transform: translateY(-50%); transform: translateY(-50%);} 
.axis-msg p b{color: #457aff; font-size: 28upx; padding: 32upx 0; display: block;}
.axis-box li.active h2:before{content: ''; background: url(~@/static/powerapp/flow/axis_doting.png) no-repeat; -webkit-background-size: contain; background-size: contain; -webkit-animation: spinner 1s linear infinite; -webkit-transform-origin: top;}

</style>
