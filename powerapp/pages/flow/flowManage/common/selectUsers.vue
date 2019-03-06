<template>
	<view class="page">
		<uni-nav-bar class="nav_custom" fixed="true" left-icon="back" @click-left="back" title="人员选择">
			<view class="btn_list">
				<span class="icon_search" @click="showlist"></span>
				&nbsp;
				<span class="icon_add" @click="deletelist"></span>
			</view>	 
		</uni-nav-bar>
		<view class="uni-list search-list">
			<view class="searchView">
				<input type="text" v-model="searchKey" placeholder="搜索" placeholder-style="text-align: center;" @input="onKeyInput">
			</view>
			<view class="uni-padding-wrap" style="background-color: #FFFFFF;">
				<view class="segmented-control text" style="border:0;">
				 	<view v-for="(item, index) in tabItems" class="segmented-control-item text" :key="index" :style="index === currentIndex ? activeStyle : itemStyle" @click="clickItem(index,item.id)">
				 		{{item.name}} 
				 	</view>
				</view>
			</view>
			<view v-if="(tabMode=='ALL' || tabMode=='LCDY') && tabType == 'LCDY'">
				<block v-for="(role,index) in roleUsers" :key="index">
				    <view class="uni-list-cell uni-collapse" v-if="role.searchShow != undefined ? role.searchShow : true" :class="'listBg'+index">
				        <view @tap="checkAll(role.JSBH)" class="checkAll" :class="role.isCheckAll ? 'on' : ''" v-if="inputType=='checkbox'" style="float: right;margin-right: 50upx;">全选</view>
						<view class="uni-list-cell-navigate uni-navigate-bottom" :class="role.show ? 'uni-active' : ''" @click="trigerCollapseLcdy(index,'LCDY')">
				            {{role.JSMC}}
				        </view>
				        <view class="uni-collapse-content" :class="role.show ? 'uni-active' : ''">
							<view v-if="role.type === 'swiper'">
								<ul class="muneFirst">
									<li v-for="(item,index1) in role.JSYH" v-if="item.searchShow != undefined ? item.searchShow : true" :key="index1" @click="lisigleEvt(index1,item,'LCDY')" :class="{'on':item.checked}">{{item.userName}}</li>
								</ul>
							</view>
							<view v-if="role.type === 'font'" class="page-pd">
								<view class="listTip">未查询到任何数据!</view>
							</view>
				        </view>
				    </view>
				</block>
				<view class="uni-list-cell uni-collapse" v-if="roleUsers.length == 0">
					<view class="page-pd">
						<view class="listTip">未查询到任何数据!</view>
					</view>
				</view>
			</view>
			<view v-if="(tabMode=='ALL' || tabMode=='BMYHZ') && tabType == 'BMRY'">
				<block v-for="(list,index) in deptLists" :key="index">
			        <view class="uni-list-cell uni-collapse" v-if="list.searchShow != undefined ? list.searchShow : true" :class="'listBg'+index">
						<view @tap="checkAll(list.id)" class="checkAll" :class="list.isCheckAll ? 'on' : ''" v-if="inputType=='checkbox'" style="float: right;margin-right: 50upx;">全选</view>
			            <view class="uni-list-cell-navigate uni-navigate-bottom" :class="list.show ? 'uni-active' : ''" @click="trigerCollapseBmry(index,'BMRY')">
			                {{list.title}}
			            </view>
			            <view class="uni-collapse-content" :class="list.show ? 'uni-active' : ''">
			 				<view v-if="list.type === 'swiper'">
			 					<ul class="muneFirst" v-for="(user,index2) in userLists" :key="index2">
									<li v-for="(item,index1) in user.users" v-if="(item.searchShow != undefined ? item.searchShow : true) && (list.id == user.deptId)" :key="index1" @click="lisigleEvt(index1,item,'BMRY')" :class="{'on':item.checked}">{{item.YHMC}}</li>
								</ul>
			 				</view>
							<view v-if="list.type === 'font'" class="page-pd">
								<view class="listTip">暂未配置人员</view>
							</view>
			            </view>
			        </view>
			    </block>
				<view class="uni-list-cell uni-collapse" v-if="deptLists.length == 0">
					<view class="page-pd">
						<view class="listTip">暂未配置人员</view>
					</view>
				</view>
			</view>
			<view v-if="(tabMode=='ALL' || tabMode=='BMYHZ') && tabType == 'ZDYZ'">
				<block v-for="(group,index) in customUsers" :key="index">
				    <view class="uni-list-cell uni-collapse" v-if="group.searchShow != undefined ? group.searchShow : true" :class="'listBg'+index">
						<view @tap="checkAll(group.groupId)" class="checkAll" :class="group.isCheckAll ? 'on' : ''" v-if="inputType=='checkbox'" style="float: right;margin-right: 50upx;">全选</view>
				        <view class="uni-list-cell-navigate uni-navigate-bottom" :class="group.show ? 'uni-active' : ''" @click="trigerCollapseZdyz(index,'ZDYZ')">
				            {{group.groupName}}
				        </view>
				        <view class="uni-collapse-content" :class="group.show ? 'uni-active' : ''">
							<view v-if="group.type === 'swiper'">
								<ul class="muneFirst">
									<li v-for="(item,index1) in group.users" v-if="item.searchShow != undefined ? item.searchShow : true" :key="index1" @click="lisigleEvt(index1,item,'ZDYZ')" :class="{'on':item.checked}">{{item.userName}}</li>
								</ul>
							</view>
							<view v-if="group.type === 'font'" class="page-pd">
								<view class="listTip">未查询到任何数据!</view>
							</view>
				        </view>
				    </view>
				</block>
				<view class="uni-list-cell uni-collapse" v-if="customUsers.length == 0">
					<view class="page-pd">
						<view class="listTip">未查询到任何数据!</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from '../../../../../components/uni-segmented-control.vue';
	import uniNavBar from '../../../../../components/uni-nav-bar.vue';
	import uniIcon from '../../../../../components/uni-icon.vue';
	import {FlowManageSvr} from '../../../../../common/powerapp/js/flowManageSvr.js';
	import {PdStorage} from '../../../../../common/powerapp/js/pd.storage.js';
	import {PdCache} from '../../../../../common/powerapp/js/pd.cache.js';
	import {PdAction} from '../../../../../common/powerapp/js/pd.action.js';
	export default {
		components: {
			uniNavBar,
			uniIcon,
			uniSegmentedControl
		},
		data() {
			return {
				title: 'accordion',
				searchKey: '',
				userLists:[],
				nameList:"",
				actIndex:-1,
				checkItem:[],
				deptUsers: [],
				tabMode: "BMYHZ",
				selectedNum: 0,
				items: [],
				selected: {},
				inputType: "radio",	//多选或单选 radio为单选  checkbox为多选
				workflowUsers: {},	//流程用户数据
				roleUsers: [],		
				customUsers: [],
				deptLists: [],
				tabItems: [],
				activeStyle: "color:#17bdcc;border-left:0;border-bottom-style:solid;",
				itemStyle: "color:#000;border-left:0;",
				currentIndex: 0,
				userType: '',
				stepDefId: '',
				tabType: '',
				isChangeTab: false
			};
		},
		created (){
			this.deptUsers = this.$pdCache.getTwoLZzjgTree();
			for(let dept of this.deptUsers){
				this.deptLists.push({
					id: dept.deptId,
					title: dept.deptName,
					type: dept.users.length == 0 ? 'font' : 'swiper',
					show: dept.users.length == 0 ? false : true,
					isCheckAll: false
				});
				this.userLists.push({
					deptId: dept.deptId,
					users: dept.users
				});
			}
		},
		onLoad(e) {
			this.$pdAction.showWait("正在加载数据...");
			this.inputType = (e.mode=='SINGLE_MASTER'||e.mode=='radio')?'radio':'checkbox';
			//如果freeflowId或 stepId或stepDefId为空时，只加载显示部门人员和自定义用户组)
			if(typeof(e.freeflowId)!='undefined' || (typeof(e.stepId)!='undefined' && typeof(e.stepDefId)!='undefined')){
				this.tabMode = "ALL";
			}
			this.queryUsers(e);
			if(this.tabMode == "ALL" || this.tabMode=="LCDY"){
				this.tabItems.push({id: "LCDY",name: "流程定义"});
				this.tabType = "LCDY";
			}
			if(this.tabMode == "ALL" || this.tabMode=="BMYHZ"){
				this.tabItems.push({id: "BMRY",name: "部门人员"});
				this.tabItems.push({id: "ZDYZ",name: "自定义组"});
				if(this.tabType == null || this.tabType == ''){
					this.tabType = "BMRY";
				}
			}
			this.userType = e.userType;
			this.stepDefId = typeof e.stepDefId != 'undefined' ? e.stepDefId : '';
		},
		computed:{
			
		},
		methods:{
			//加载用户方法
			queryUsers(e){
				this.$flowManageSvr.queryUsers(e.freeflowId,e.stepId,e.stepDefId,"false").then(res=>{
					this.workflowUsers = res.data_json;
					this.roleUsers = this.workflowUsers.roleUsers;
					this.customUsers = this.workflowUsers.customUsers;
					if(this.roleUsers.length != 0){
						for (let role of this.roleUsers) {
							if(role != null){
								role.type = "swiper";
								role.show = true;
								role.isCheckAll = false;
							}else{
								role.type = "font";
								role.show = false;
								role.isCheckAll = false;
							}
						}
					}
					console.log(this.roleUsers);
					if(this.customUsers.length != 0){
						for (let group of this.customUsers) {
							if(group != null){
								group.type = "swiper";
								group.show = true;
								group.isCheckAll = false;
							}else{
								group.type = "font";
								group.show = false;
								group.isCheckAll = false;
							}
						}
					}
					if(!this.workflowUsers.isShowAll){
						this.tabMode = "LCDY";
					}
					//setTimeout(function() {
						this.$pdAction.closeWait();
						if(!this.$pdStorage.get("operateTip")){
							this.$pdAction.alert("双击选项卡(如部门人员)可收起或展开所有部门，确定后不再提示！","操作提示").then(res=>{
								this.$pdStorage.set("operateTip","true");
							});
						}
					//}, 500)
				});
			},
			onKeyInput: function(event) {//实时获取input输入的值  模糊搜索
				let inVal = event.detail.value;
				if(this.tabType == 'LCDY'){
					for(var i=0;i<this.roleUsers.length;i++){
						let count = 0;
						for(var j=0;j<this.roleUsers[i].JSYH.length;j++){
							//通過模糊查询的结果，判断是否显示该人员
							if(this.roleUsers[i].JSYH[j].userName.indexOf(inVal)>=0){
								this.roleUsers[i].JSYH[j].searchShow = true;
							}else{
								this.roleUsers[i].JSYH[j].searchShow = false;
								count ++;
							}
						}
						//通过模糊查询，控制没有用户的部门不显示
						if(this.roleUsers[i].JSYH > count){
							this.roleUsers[i].searchShow = true;
						}else{
							this.roleUsers[i].searchShow = false;
						}
					}
				}else if(this.tabType == 'BMRY'){
					for(var i=0;i<this.userLists.length;i++){
						let count = 0;
						for(var j=0;j<this.userLists[i].users.length;j++){
							if(this.userLists[i].users[j].YHMC.indexOf(inVal)>=0){
								this.userLists[i].users[j].searchShow = true;
							}else{
								this.userLists[i].users[j].searchShow = false;
								count ++;
							}
						}
						if(this.userLists[i].users > count){
							this.userLists[i].searchShow = true;
						}else{
							this.userLists[i].searchShow = false;
						}
					}
				}else if(this.tabType == 'ZDYZ'){
					for(var i=0;i<this.customUsers.length;i++){
						let count = 0;
						for(var j=0;j<this.customUsers[i].users.length;j++){
							if(this.customUsers[i].users[j].userName.indexOf(inVal)>=0){
								this.customUsers[i].users[j].searchShow = true;
							}else{
								this.customUsers[i].users[j].searchShow = false;
								count ++;
							}
						}
						if(this.customUsers[i].users > count){
							this.customUsers[i].searchShow = true;
						}else{
							this.customUsers[i].searchShow = false;
						}
					}
				}else{}
			},
			checkAll(id){
				if(this.isChangeTab){//切换tab页后，当选择了切换的tab页面中用户时，清楚其他页面选择的用户
					this.deletelist();
				}
				if(this.tabType == 'LCDY'){
					for(var i=0;i<this.roleUsers.length;i++){
						if(id == this.roleUsers[i].JSBH){
							this.roleUsers[i].isCheckAll = !this.roleUsers[i].isCheckAll;
							for(var j = 0;j<this.roleUsers[i].JSYH.length;j++){
								if(typeof this.roleUsers[i].JSYH[j].checked == 'undefined'){
									this.$set(this.roleUsers[i].JSYH[j],'checked',false);
								}
								if(this.roleUsers[i].isCheckAll){
									if(this.roleUsers[i].JSYH[j].userName.indexOf(this.searchKey)>=0){
										this.roleUsers[i].JSYH[j].checked = true;
										this.checkItem.push({userId: this.roleUsers[i].JSYH[j].userId, userName: this.roleUsers[i].JSYH[j].userName});
									}
								}else{
									this.roleUsers[i].JSYH[j].checked = false;
								}
							}
							if(!this.roleUsers[i].isCheckAll){
								this.checkItem = [];
							}
						}
					}
				}else if(this.tabType == 'BMRY'){
					for(var k= 0;k<this.deptLists.length;k++){
						if(id == this.deptLists[k].id){
							this.deptLists[k].isCheckAll = !this.deptLists[k].isCheckAll;
							for(var i=0;i<this.userLists.length;i++){
								if(id == this.userLists[i].deptId){
									for(var j=0;j<this.userLists[i].users.length;j++){
										if(typeof this.userLists[i].users[j].checked == 'undefined'){
											this.$set(this.userLists[i].users[j],'checked',false);
										}
										if(this.deptLists[k].isCheckAll){
											if(this.userLists[i].users[j].YHMC.indexOf(this.searchKey)>=0){
												this.userLists[i].users[j].checked = true;
												this.checkItem.push({userId: this.userLists[i].users[j].YHID, userName: this.userLists[i].users[j].YHMC});
											}
										}else{
											this.userLists[i].users[j].checked = false;
										}
										if(!this.deptLists[k].isCheckAll){
											this.checkItem = [];
										}
									}
								}
							}
						}
					}
				}else if(this.tabType == 'ZDYZ'){
					for(var i=0;i<this.customUsers.length;i++){
						if(id == this.customUsers[i].groupId){
							this.customUsers[i].isCheckAll = !this.customUsers[i].isCheckAll;
							for(var j = 0;j<this.customUsers[i].users.length;j++){
								if(typeof this.customUsers[i].users[j].checked == 'undefined'){
									this.$set(this.customUsers[i].users[j],'checked',false);
								}
								if(this.customUsers[i].isCheckAll){
									if(this.customUsers[i].users[j].userName.indexOf(this.searchKey)>=0){
										this.customUsers[i].users[j].checked = true;
										this.checkItem.push({userId: this.customUsers[i].users[j].userId, userName: this.customUsers[i].users[j].userName});
									}
								}else{
									this.customUsers[i].users[j].checked = false
								}
							}
							if(!this.customUsers[i].isCheckAll){
								this.checkItem = [];
							}
						}
					}
				}else{
				}
			},
			back (){
				uni.navigateBack();
			},
			showlist (){
				//跳转页面并返回上一页传值
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //上一个页面
				let data = {
						mdata: this.checkItem,
						userType: this.userType,
						stepDefId: this.stepDefId
				}
				if(prevPage.setDataSu){
					prevPage.setDataSu(data);
				}else{
					prevPage.$vm.setDataSu(data); 
				}
				uni.navigateBack();
			},
			//删除所选用户
			deletelist (){
				//清除三个tab页中选择的用户的显示状态
				for(var i=0;i<this.roleUsers.length;i++){
					this.roleUsers[i].isCheckAll = false;
					for(var j = 0;j<this.roleUsers[i].JSYH.length;j++){
						if(typeof this.roleUsers[i].JSYH[j].checked == 'undefined'){
							this.$set(this.roleUsers[i].JSYH[j],'checked',false);
						}else{
							this.roleUsers[i].JSYH[j].checked = false;
						}
					}
				}
				for(var i= 0;i<this.deptLists.length;i++){
					this.deptLists[i].isCheckAll = false;
				}
				for(var i=0;i<this.userLists.length;i++){
					for(var j=0;j<this.userLists[i].users.length;j++){
						if(typeof this.userLists[i].users[j].checked == 'undefined'){
							this.$set(this.userLists[i].users[j],'checked',false);
						}else{
							this.userLists[i].users[j].checked = false;
						}
					}
				}
				for(var i=0;i<this.customUsers.length;i++){
					this.customUsers[i].isCheckAll = false;
					for(var j = 0;j<this.customUsers[i].users.length;j++){
						if(typeof this.customUsers[i].users[j].checked == 'undefined'){
							this.$set(this.customUsers[i].users[j],'checked',false);
						}else{
							this.customUsers[i].users[j].checked = false;
						}
					}
				}
				//清除选择的用户的数据
				this.checkItem = [];
			},
			trigerCollapseLcdy(e,type) {
				for (let i = 0, len = this.roleUsers.length; i < len; ++i) {
					if (e === i) {
						this.roleUsers[i].show = !this.roleUsers[i].show;
					}
				}
			},
			trigerCollapseBmry(e,type) {
				for (let i = 0, len = this.deptLists.length; i < len; ++i) {
					if (e === i) {
						this.deptLists[i].show = !this.deptLists[i].show;
					}
				}
			},
			trigerCollapseZdyz(e,type) {
				for (let i = 0, len = this.customUsers.length; i < len; ++i) {
					if (e === i) {
						this.customUsers[i].show = !this.customUsers[i].show;
					}
				}
			},
			//确认所选用户并返回
			lisigleEvt (index,item,type){
				let user = {};
				if(type == 'BMRY'){
					user = {userId: item.YHID, userName: item.YHMC};
				}else{
					user = {userId: item.userId, userName: item.userName};
				}
				if(this.inputType == 'radio'){
					this.deletelist();
					item.checked = true;
					let result = [];
					result.push(user);
					this.checkItem = result;
				}else{
					if(this.isChangeTab){//切换tab页后，当选择切换的tab页面中用户时，清楚其他页面选择的用户
						this.deletelist();
					}
					let checked;
					if (item.checked!=undefined){
						checked = !item.checked;
					}else{
						checked = true;
					}
					this.$set(item,'checked',checked);
					if(item.checked == true){
						this.checkItem.push(user);
					}else{
						let index = this.checkItem.indexOf(user);
						if (index > -1) {
							this.checkItem.splice(index, 1);
						}
					}
				}
			},
			//切换tab页
			clickItem(index,id){
				if (this.currentIndex !== index) {
					this.currentIndex = index;
					this.isChangeTab = true;
				}else{
					this.isChangeTab = false;
				}
				this.tabType = id;
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
.on{
	border-color: #06baca!important;
    color: #06baca!important;
}

.checkAll{
	float: right; 
	height: 54upx; 
	line-height: 54upx; 
	font-size: 30upx; 
	color: #666; 
	padding: 0 24upx; 
	border-radius: 300px; 
	border: 1px solid #ddd; 
	margin: 28upx 0;
}

.checkAll .on{
	background-color: #06baca; 
	border-color: #06baca; 
	color: white;
}

.segmented-control {
	display: flex;
	flex-direction: row;
	justify-content: center;
	width: 75%;
	font-size: 28upx;
	border-radius: 10upx;
	box-sizing: border-box;
	margin: 0 auto;
	overflow: hidden;
}

.segmented-control.button {
	border: 2upx solid;
}

.segmented-control.text {
	border: 0;
	border-radius: 0upx;
}


.segmented-control-item {
	flex: 1;
	text-align: center;
	line-height: 60upx;
	box-sizing: border-box;
}

.segmented-control-item.button {
	border-left: 1upx solid;
}

.segmented-control-item.text {
	border-left: 0;
}

.segmented-control-item:first-child {
	border-left-width: 0;
}

.search-list{
	top:92upx;
}
/* #ifdef APP-PLUS */
	.search-list{
		top:126upx;
	}
/* #endif */
</style>
