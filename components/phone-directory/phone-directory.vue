<template>
	<view class="phone-main" :style="{height: winHeight + 'px'}">
		<view class="phone-main-search">
			<navigator :url="'phone-search?phones=' + phonesEscape" hover-class="none">
				<input disabled="false" class="phone-main-input" type="text" placeholder="请输入要搜索的联系人"/>
			</navigator>
		</view>
		<view class="phoneDirectory">
			<phone-list 
			:phones="phones" 
			:letter="letter"
			:scrollAnimationOFF="scrollAnimationOFF" 
			@change="handlePhoneListIndex"
			@reset="handleReset"
			@handleClick="handleClick"
			>
			</phone-list>
			<phone-alphabet 
			:phones="phones"
			:phoneListIndex="phoneListIndex"
			@change="handleDatasetKey" 
			@scrollAnimationOFF="handleScrollAnimationOFF"
			@reset="handleReset"
			>
			</phone-alphabet>
		</view>
	</view>
</template>

<script>
	import phoneList from './phone-list.vue'
	import phoneAlphabet from './phone-alphabet.vue'
	
	export default {
		name:"phone-directory",
		components:{
			phoneList,
			phoneAlphabet
		},
		props:{
			phones:Object,
			default:false
		},
		data () {
			return {
				winHeight:0,
				letter : 'A',
				scrollAnimationOFF:true,
				phoneListIndex:'A',
				reset:true
			}
		},
		computed:{
			phonesEscape () {
				return escape(JSON.stringify(this.phones))
			}
		},
		mounted () {
			let windowHeight = uni.getSystemInfoSync().windowHeight
			
			// #ifndef APP-PLUS
			this.winHeight = windowHeight
			//#endif
			
			//#ifdef APP-PLUS
			this.winHeight = windowHeight - 56
			//#endif
			
 			if(!this.phones){
				uni.showToast({
					title: '没有数据',
					icon:"none",
					mask: false,
					duration: 1500
				})
			}
		},
		methods:{
			handleClick (e) {
				this.$emit('paramClick',e)
			},
			handleDatasetKey (val) {
				this.letter = val
			},
			handleScrollAnimationOFF (val) {
				this.scrollAnimationOFF = val
			},
			handlePhoneListIndex(val){
				if(this.reset){
					this.phoneListIndex = val
				}
			},
			handleReset (val){
				if(val){
					this.letter = ''
				}
				this.reset = val
			}
			
		}
	}
</script>

<style>
.phone-main{
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
.phoneDirectory{
	display: flex;
	flex-direction: row;
}
.phone-main-search{
	background-color: #fff;
	padding: 10upx 20upx;
	border-bottom: 1px solid #e5e5e5;
}

.phone-main-input{
	font-size:28upx;
	border: 1px solid #e5e5e5;
	border-radius: 3px;
	padding: 10upx 20upx 10upx 20upx;
}
</style>
