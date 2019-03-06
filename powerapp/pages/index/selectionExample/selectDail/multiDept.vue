<template>
	<view>
		<uni-nav-bar class="nav_custom" fixed="true" left-icon="back" @click-left="back" title="部门选择">
			 <view class="btn_list">
				 <span class="icon_search" @click="showlist"></span>
				 &nbsp;
				 <span class="icon_add" @click="deletelist"></span>
			 </view>	 
		 </uni-nav-bar>
		 <view class="uni-list">
			 <view class="searchView">
				 <input type="text" placeholder="搜索" placeholder-style="text-align: center;" @input="onKeyInput">
			 </view>
			 <view>			 
				 <checkbox-group @change="checkboxChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="item in items" :key="item.value">
						<view><checkbox :value="item.value" :checked="item.checked" /></view>
						<view class="radioText">{{item.name}}</view>
					</label>
				</checkbox-group>
			 </view>
		 </view>
	</view>
</template>

<script>
	import uniNavBar from '../../../../../components/uni-nav-bar.vue'
	import uniIcon from '../../../../../components/uni-icon.vue'
	export default {
		components: {
			uniNavBar,
			uniIcon
		},
		data() {
			return {
				title: 'checkbox',
				stryItems: [{
						value: '开发一部',
						name: '开发一部'
					},
					{
						value: '44',
						name: '44'
					}
				],
				items:[]
			};
		},
		created (){
			this.items = this.stryItems;
			if(this.$pdStorage.get("md")){
				this.checkedStus (this.$pdStorage.get("md").split(","));
			}
		},
		onLoad() {
		},
		computed:{
			
		},
		methods:{
			onKeyInput: function(event) {//实时获取input输入的值  模糊搜索
				let inVal = event.detail.value;
				var arr = [];
				for(var i=0;i<this.stryItems.length;i++){
					//如果字符串中不包含目标字符会返回-1
					if(this.stryItems[i].value.indexOf(inVal)>=0){
						arr.push(this.stryItems[i]);
					}
				}
				this.items = arr;
			}, 
			back (){
				uni.navigateBack();
			},
			showlist (){
				this.$pdView.passValToPrePage({mdData:String(this.checkItem)},1)
			},
			deletelist (){
				for (var i = 0; i < this.items.length; i++) {
					let item = Object.assign(this.items[i],{checked: false})
					this.$set(this.items,i,item);//这样写选中实时刷新
				}
				this.checkItem = '';
			},
			checkboxChange: function (e) {
				this.checkItem = e.detail.value;	
				let values = e.detail.value;
				this.checkedStus(values);
			},
			checkedStus (values){
				console.log(values)
				let items = this.items;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					//items[i].checked = false;
					let item = Object.assign(this.items[i],{checked: false})
					this.$set(this.items,i,item);
					for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
						if (items[i].value == values[j]) {
							//items[i].checked = true;
							let item = Object.assign(this.items[i],{checked: true})
							this.$set(this.items,i,item);
							break
						}
					}
				}
			}
		}
	}
</script>

<style>
@import '../../../../../common/powerapp/css/table_lr.scss';
.uni-list{background: #fff;}
.radioText{
	text-align: left;
	font-size: 30upx;
	color: #666;
}
.icon_search,.icon_add{
	background: url(../../../../../static/powerapp/index/icon/showG.png);
	background-size: cover;
}
.icon_add{
	background: url(../../../../../static/powerapp/index/icon/delete.png);
	background-size: cover;
}
.uni-list-cell-pd {
	padding:22upx 30upx!important;
}
</style>
