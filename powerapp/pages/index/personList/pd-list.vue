<template>
	<view class="uni-list">
	    <block v-for="(item,index) in lists" :key="index">
	        <view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="selectCellevt(item)">
	            <view class="uni-triplex-row">
	                <view class="uni-triplex-left">
	                    <text class="uni-title uni-ellipsis"><b class="ptB"></b>{{item.XM}}</text>
	                    <text class="uni-text">{{item.MOBILE}}</text>
	                    <text class="uni-text-small uni-ellipsis">{{item.XGSJ}}</text>
	                </view>
	            </view>
	        </view>
	    </block>
	</view>
</template>

<script>
	export default {
		name: "PdList",
		props: {
			lists: {
				type:Array,
				default(){
					return []
				}
			}
		},
		data(){
			return {
			}
		},
		computed: {
			
		},

		methods: {
			selectCellevt(item){
				this.$emit("select",item);
			}
		}
	}
</script>
<style lang="scss">
	@import '../../../../common/powerapp/css/table_lr.scss';
	.uni-list{
		position: absolute;
		top:0upx;
		background: #fff;
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
</style>
