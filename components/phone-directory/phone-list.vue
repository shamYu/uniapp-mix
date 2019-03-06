<template>
	<view style="width: 95%;">
		<scroll-view class="scroll-list"
		:scroll-top="1"
		scroll-y="true"
		:scroll-with-animation="scrollAnimationOFF" 
		:scroll-into-view="scrollViewId" 
		:style="{height:winHeight + 'px'}" 
		@scroll="handleScroll">
			<view class="phone-list">
				<view class="list-item" 
				v-for="(item, key) of phones" 
				:key="key" 
				:id="key">
					<view class="list-item-title">{{key}}</view>
					<view class="list-item-phone" 
					@click="handleClick(item)"
					hover-class="commonly-hover" 
					:hover-start-time="20" 
					:hover-stay-time="70" 
					v-for="innerItem in item"
					:key="innerItem.id"
					:data-name="innerItem.name"
					:data-id="innerItem.id"
					:data-phoneNumber="innerItem.phoneNumber"
					>
					{{innerItem.name}}
					</view>
				</view>
			</view>
			<view class="no-list" v-if="Object.keys(phones).length == 0">
				暂无联系人
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:"phone-list",
		props:{
			phones:Object,
			letter:String,
			scrollAnimationOFF:Boolean
		},
		data () {
			return {
				winHeight:0,
				scrollTop:0,
				letterDetails:[],
				timer:null
			}
		},
		computed:{
			scrollViewId () {
				return this.letter
			}
		},
		mounted(){
			// #ifndef APP-PLUS
			this.winHeight = uni.getSystemInfoSync().windowHeight - 49.50
			//#endif
			
			//#ifdef APP-PLUS
			this.winHeight = uni.getSystemInfoSync().windowHeight - 100
			//#endif

		},
		methods:{
			handleClick (e) {
				this.$emit('handleClick',e[0])
			},
			handleScroll (e){
				if(this.letterDetails.length === 0){
					let view = uni.createSelectorQuery().selectAll('.list-item')
					view.boundingClientRect(data=>{
						let top = data[0].top
						data.forEach((item,index)=>{
							item.top = item.top - top
							item.bottom  = item.bottom - top
							this.letterDetails.push({
								id:item.id,
								top:item.top,
								bottom:item.bottom
							})
						})
					}).exec()	
				}
				
				const scrollTop = e.detail.scrollTop
				this.letterDetails.some((item,index)=>{
					if(scrollTop>=item.top && scrollTop <= item.bottom - 5){
						this.$emit('change',item.id)
						this.$emit('reset',true)
						return true
					}
				})
			}
		}
			
	}
</script>

<style>
	
	.commonly-hover{
		background-color: #eee;
	}
	
	.scroll-list{
		flex: 1;
		height: 100vh;
		overflow-y: hidden;
	}

	.phone-list{
		display: flex;
		background-color: #fff;
		flex-direction:column;
		position:relative;
		width: 100%;
	}
	
	.list-item {
		
	}
	
	.list-item >.list-item-phone{
		font-weight: normal;
	}
	
	.list-item-title{
		background-color: #eee;
	}
	
	.list-item-title,.list-item-phone{
		width: 100%;
		height: 92upx;
		line-height: 92upx;
		font-size: 32upx;
		font-weight: bold;
		padding: 0 20upx;
		border-bottom: 1px solid #e5e5e5;
	}
	.no-list {
    text-align: center;
    font-size: 40upx;
    height: 500upx;
    line-height: 500upx;
	color: #acacac;
}
	

</style>
