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
				 <radio-group @change="radioChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
						<view>
							<radio :value="item.value" :checked="index === current" />
						</view>
						<view class="radioText">{{item.name}}</view>
					</label>
				</radio-group>
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
				stryItems: [{
						value: '开发一部',
						name: '开发一部'
					},
					{
						value: '44',
						name: '44'
					}
				],
				items:[],
				current: -1,
				checkItem:""
			};
		},
		created (){
			this.items = this.stryItems;
			this.checkedStus(this.$pdStorage.get("sd"));
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
				//跳转页面并返回上一页传值
				this.$pdView.passValToPrePage({sdData:String(this.checkItem)},1);
			},
			deletelist (){
				this.current = -1;
				this.checkItem = '';
			},
			 radioChange: function(evt) {
				this.checkItem = evt.target.value;
				this.checkedStus(evt.target.value);	
			},
			checkedStus (values){
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === values) {
						this.current = i;
						break;
					}
				}
			}
		}
	}
</script>

<style lang="scss">
@import '../../../../../common/powerapp/css/table_lr.scss';
.uni-list{
	background: #fff;
}
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
