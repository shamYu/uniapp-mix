<template>
	<view>
		<view class="search">
			<input 
			@input="handleInput"
			class="search-input" 
			type="text" 
			focus  
			placeholder="请输入要搜索的联系人"
			/>
		</view>
		<view class="search-main" v-if="keyword">
			<view class="search-main-errtitle" v-if="hasNoData">无搜索结果</view>
			<view class="search-main-title"
			hover-class="hover" 
			@click="handleClick(item)"
			:hover-start-time="20" 
			:hover-stay-time="70" 
			v-for="item of list" 
			:key="item.id"
			:data-name="item.name"
			:data-id="item.id"
			:data-phoneNumber="item.phoneNumber">
				{{item.name}}
			</view>
		</view>
	</view>		
</template>

<script>
	export default {
		name:"phone-search-list",
		props:{
			phones:Object
		},
		data() {
			return {
				keyword:'',
				list:[],
				timer:null
			}
		},
		computed:{
			hasNoData () {
				return !this.list.length
			}
		},
		watch:{
			keyword () {
				if(this.timer) {
					clearTimeout(this.timer)
				}
				if(!this.keyword){
					this.list = []
					return
				}
				this.timer = setTimeout(()=>{
					const result = []
					for (let i in this.phones){
						this.phones[i].forEach((item)=>{
							if(item.spell.indexOf(this.keyword) > -1||item.name.indexOf(this.keyword) > -1){
								result.push(item)
							}
						})
					}
					this.list = result
				},100)
			}
		},
		methods:{
			handleInput (e) {
				this.keyword = e.detail.value
			},
			handleClick (e) {
				this.$emit('paramClick',e)
			}
		}
	}
</script>

<style>
	.hover{
		background-color: #eee;
	}
	.search{
		background-color: #fff;
		padding: 10upx 20upx;
		border-bottom: 1px solid #e5e5e5;
	}

	.search-input{
		font-size:28upx;
		border: 1px solid #e5e5e5;
		border-radius: 3px;
		padding: 10upx 20upx 10upx 20upx;
	}
	
	.search-main{
		height: 100%;
		padding-bottom: 20upx;
		background-color:#fff;
		overflow: hidden;
	}
	
	.search-main-errtitle,.search-main-title{
		width: 100%;
		height: 92upx;
		line-height: 92upx;
		font-size: 32upx;
		padding: 0 20upx;
		border-bottom: 1px solid #e5e5e5;
	}

</style>
