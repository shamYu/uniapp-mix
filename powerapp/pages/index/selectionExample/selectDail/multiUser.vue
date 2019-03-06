<template>
	<view class="page">
		<uni-nav-bar class="nav_custom" fixed="true" left-icon="back" @click-left="back" title="人员选择">
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
			     <block v-for="(list,index) in lists" :key="index">
			         <view class="uni-list-cell uni-collapse" :class="'listBg'+index">
			             <view class="uni-list-cell-navigate uni-navigate-bottom" :class="list.show ? 'uni-active' : ''" @click="trigerCollapse(index)">
			                 {{list.title}}
			             </view>
			             <view class="uni-collapse-content" :class="list.show ? 'uni-active' : ''">
			 				<view v-if="list.type === 'swiper'">
			 					<ul class="muneFirst">
									<li class="muneFirLi" :class="{'active':item.checked}"  v-for="(item,index1) in nameList" :key="index1" @click="lisigleEvt(item,index1)">{{item.name}}</li>
								</ul>
			 				</view>
			                 <view v-if="list.type === 'font'" class="page-pd">
			                     <view class="listTip">暂未配置人员</view>
			                 </view>
			             </view>
			         </view>
			     </block>
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
				title: 'accordion',
				nameListS:[
					{name:"张三"},
					{name:"李四"},
					{name:"莫大大"},
					{name:"系统管理员"}
				],
				nameList:"",
				checkItem:[],
				lists: [{
				        title: "开发一部",
				        type: 'swiper',
				        show: true
				    },
				    {
				        title: "44",
				        type: 'font',
				        show: false
				    }
				]
			};
		},
		created (){
			this.nameList = this.nameListS;
			let muser = this.$pdStorage.get("mu");
			if(muser){
				muser = muser.split(',');
				this.checkItem = muser;
				for(let i=0;i<this.nameList.length;i++){
					for(let j=0;j<muser.length;j++){
						if(muser[j] == this.nameList[i].name){
							this.$set(this.nameList[i],'checked',true);
							break;
						}
					}
				}
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
				for(var i=0;i<this.nameListS.length;i++){
					//如果字符串中不包含目标字符会返回-1
					if(this.nameListS[i].name.indexOf(inVal)>=0){
						arr.push(this.nameListS[i]);
					}
				}
				this.nameList = arr;
			}, 
			back (){
				uni.navigateBack();
			},
			showlist (){
				//跳转页面并传值
				//跳转页面并返回上一页传值
				this.$pdView.passValToPrePage({muData:String(this.checkItem)},1);
			},
			deletelist (){
				for(var i=0;i<this.nameList.length;i++){
					this.nameList[i].checked = false;
				}
				this.checkItem = [];
			},
			trigerCollapse(e) {
			    for (let i = 0, len = this.lists.length; i < len; ++i) {
			        if (e === i) {
			            this.lists[i].show = !this.lists[i].show;
			        } else {
			            this.lists[i].show = false;
			        }
			    }
			},
			lisigleEvt (item,index){
				let checked;
				if (item.checked!=undefined){
					checked = !item.checked;					
				}else{
					checked = true;
				}
				this.$set(item,'checked',checked)
				if(item.checked == true){
					this.checkItem.push(item.name)
				}else{
					let index = this.checkItem.indexOf(item.name);
					if (index > -1) {
						this.checkItem.splice(index, 1);
					}
				}
			}
		}
	}
</script>

<style>
@import '../../../../../common/powerapp/css/table_lr.scss';
.uni-list-cell-navigate.uni-active,.uni-list-cell{background: #fff;}
.uni-list-cell{margin-bottom: 20upx;}
.icon_search,.icon_add{
	background: url(../../../../../static/powerapp/index/icon/showG.png);
	background-size: cover;
}
.icon_add{
	background: url(../../../../../static/powerapp/index/icon/delete.png);
	background-size: cover;
}

.listBg0 .uni-navigate-bottom,.listBg1 .uni-navigate-bottom{
	background: url(../../../../../static/powerapp/index/icon/titIco.png) no-repeat;
    background-size: 54upx;
	padding-left: 100upx;
    background-position: 24upx 18upx;
}

.muneFirst li{
	width:28%;
	margin-left:4%;
	height:60upx;
	float:left;
	border:1px solid #ddd;
	text-align:center;
	line-height:60upx;
	margin-bottom:20upx;
	color:#666;
	font-size:30upx;
}
.listTip{
	width:100%;
	height:80upx;
	line-height:80upx;
	text-align:center;
	color:#666;
	font-size:30upx;
	border-top:1px solid #ddd;
}
.active{
	border-color: #06baca!important;
    color: #06baca!important;
}
</style>
