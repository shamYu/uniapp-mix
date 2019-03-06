<template>
	<view>
		<uni-nav-bar class="nav_custom" fixed="true" left-icon="back" @click-left="back" title="污染源选择">
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
				stryItems: [{value: '第1个污染源',name: '第1个污染源'},
					{value: '第2个污染源',name: '第2个污染源'},
					{value: '第3个污染源',name: '第3个污染源'},
					{value: '第4个污染源',name: '第4个污染源'},
					{value: '第5个污染源',name: '第5个污染源'},
					{value: '第6个污染源',name: '第6个污染源'},
					{value: '第7个污染源',name: '第7个污染源'},
					{value: '第8个污染源',name: '第8个污染源'},
					{value: '第9个污染源',name: '第9个污染源'},
					{value: '第10个污染源',name: '第10个污染源'},
					{value: '第11个污染源',name: '第11个污染源'},
					{value: '第12个污染源',name: '第12个污染源'},
					{value: '第13个污染源',name: '第13个污染源'},
					{value: '第14个污染源',name: '第14个污染源'},
					{value: '第15个污染源',name: '第15个污染源'},
				],
				items:[],
				current: -1,
				checkItem:""
			};
		},
		created (){
			this.items = this.stryItems;
			this.checkedStus(this.$pdStorage.get("sw"));
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
				this.$pdView.passValToPrePage({swData:String(this.checkItem)},1)
			},
			deletelist (){
				console.log("删除")
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
	position: absolute;
    left: 100upx;
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
