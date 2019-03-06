<template>
	<view>
		<view class="mui-indexed-list">
			<user-search radius="0" @input="change"></user-search>
		</view>
		<view class="relative"  v-for="(item,index) in contacts" @click="toggle(index)" :key="index" v-bind:style="{borderLeft: '10upx solid ' + item.COLOR}">
			<view class="collapse-item" :class="{on : item.hide}">{{item.deptName + ' ( ' + item.count + ' ) '}}</view>
			<view v-show="item.hide">
				<organization-cloak :cate="item"></organization-cloak>
			</view>
			<view class="uni-collapse-cell__title-arrow" v-show="!item.hide">
				<image class="img-size" src="../../../../static/arrow-down.png" mode=""></image>
			</view>
			<view class="uni-collapse-cell__title-arrow" v-show="item.hide">
				<image class="img-size" src="../../../../static/arrow-up.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	import organizationCloak from './organization-cloak'
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	import userSearch from './user-search'
	export default {
		name: 'zzjg',
		data() {
			return {
				contacts: this.$pdCache.getZzjgTree(),
				YHMC: ''
			}
		},
		created(){
			this.contacts = this.filter(this.contacts)
		},
		components: {
			organizationCloak,
			uniIcon,
			userSearch
		},
		methods: {
			filter(arr){
				let newArr = [];
				if(arr.length > 0){
					arr.map((item) => {
						item.COLOR = this.randomColor();
						newArr.push(item)
					})
				}
				return newArr
			},
			//计算border的颜色
			randomColor() {
				var colors = ['#19d892', '#ffbb2a', '#ff8e2a', '#2abbff', '#8967cd', '#b98b62', '#ffb787', '#87a9ff', '#ff97ab',
					'#67dea7'
				];
				return colors[Math.floor(Math.random() * colors.length)];
			},
			toggle(index) {
				this.contacts[index].hide = !this.contacts[index].hide;
				this.$forceUpdate()
			},
			//查询联系人onchange
			change(searchVal) {
				if (searchVal) { //去掉常用的标点附号
					searchVal = searchVal.replace(/，/g, "").replace(/。/g, "").replace(/！/g, "").replace(/、/g, "");
				}
				var contacts = this.$pdCache.getZzjgTree()
				this.contacts = this.filterContact(contacts, searchVal)
			},
			//过滤联系人
			filterContact(contacts, searchStr) {
				var result = [];
				if (!searchStr || searchStr.replace(/\s+/g, "") === "") {
					//搜索条件为空或者未定义时直接返回
					result = contacts;
				} else {
					result = this.getOrgTreeByKey(contacts, searchStr);
				}
				return result;
			},
			//递归搜索数据
			getOrgTreeByKey(contactTree, searchStr) {
				var trees = [];
				for (var i = 0; i < contactTree.length; i++) {
					var userList = [];
					contactTree[i].users.map(function(user) {
						if (user.YHMC.indexOf(searchStr) > -1 || user.PYJX.indexOf(searchStr) > -
							1) {
							userList.push(user);
						}
					})
					var children = this.getOrgTreeByKey(contactTree[i].children, searchStr); //开始归递
					var userCount = userList.length;
					children.map(function(child) {
						userCount += child.count;
					})
					if (userCount > 0) {
						trees.push({
							'deptId': contactTree[i].deptId,
							'deptName': contactTree[i].deptName,
							'children': children,
							'users': userList,
							'count': userCount
						});
					}
				}
				return trees;
			}
		}
	}
</script>

<style>
	.collapse-item {
		position: relative;
		padding: 20upx;
		border-bottom: 2upx solid #E2E2E2;
		font-size: 32upx;
		background: white;
	}
	.collapse-item.on{
		background: #eee;
	}
	.uni-collapse-cell__title-arrow {
		position: absolute;
		right: 20upx;
		top: 20upx;
	}
	.img-size{
		width: 40upx;
		height: 40upx;
	}
	.relative{
		position: relative;
	}
</style>
