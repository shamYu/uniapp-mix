<template>
	<view>
		<phone-search-list :phones="phones" @paramClick="paramClick"></phone-search-list>
	</view>		
</template>

<script>
	
	import phoneSearchList from '@/components/phone-directory/phone-search-list.vue'
	
	export default {
		name:"phone-search",
		components:{
			phoneSearchList
		},
		data() {
			return {
				phones:null,
			}
		},
		onLoad (option) {
			this.phones = JSON.parse(unescape(option.phones))
		},
		methods:{
			paramClick (e) {
				console.log(e)
			}
		}
	}
</script>

<style>
	
</style>
