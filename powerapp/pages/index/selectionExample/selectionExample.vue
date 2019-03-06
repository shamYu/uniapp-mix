<template>
	<view class="page">
		<view>
			<form name="beanForm">
				<view class="table-list-ctn" width="100%">
					<ul>
						<li>
							<span class="span-hd">单选人员：</span>
							<span class="span-value"  @tap="selectSingleUser()">
								<span class="text">{{selectedSingleUser==''?'请选择':selectedSingleUser}}</span>
								<!-- <textarea name="XM" class="textarea" disabled="true" rows="2" placeholder="请选择" v-model="selectedSingleUser" ></textarea> -->
							</span>
						</li>
						<li>
							<span class="span-hd">多选人员：</span>
							<span class="span-value" @tap="selectMultiUser()">
								<span class="text">{{selectedMultiUser==''?'请选择':selectedMultiUser}}</span>
							</span>
						</li>
						<li>
							<span class="span-hd">单选部门：</span>
							<span class="span-value" @tap="selectSingleDept()" >
								<span class="text">{{selectedSingleDept==''?'请选择':selectedSingleDept}}</span>
							</span>
						</li>
						<li>
							<span class="span-hd">多选部门：</span>
							<span class="span-value" @tap="selectMultiDept()" >
								<span class="text">{{selectedMultiDept==''?'请选择':selectedMultiDept}}</span>
							</span>
						</li>
						<li>
							<span class="span-hd">单选污染源：</span>
							<span class="span-value" @tap="selectSingleWry()">
								<span class="text">{{selectedSingleWry==''?'请选择':selectedSingleWry}}</span>
							</span>
						</li>
					</ul>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectedSingleUser:"",
				selectedMultiUser:"",
				selectedSingleDept:"",
				selectedMultiDept:"",
				selectedSingleWry:""
			};
		},
		onLoad(evt) {
			//this.$pdStorage.clear();//清除数据存储
			this.$pdStorage.set("md",'');
			this.$pdStorage.set("mu",'');
			this.$pdStorage.set("sd",'');
			this.$pdStorage.set("su",'');
			this.$pdStorage.set("sw",'');
			console.log(evt)
		},
		computed:{
			
		},
		methods:{
			setDataVal (e){
				e.mdData?this.$pdStorage.set("md",e.mdData):'';
				e.muData?this.$pdStorage.set("mu",e.muData):'';
				e.sdData?this.$pdStorage.set("sd",e.sdData):'';
				e.suData?this.$pdStorage.set("su",e.suData):'';
				e.swData?this.$pdStorage.set("sw",e.swData):'';
				this.selectedMultiDept = this.$pdStorage.get("md");
				this.selectedMultiUser = this.$pdStorage.get("mu");
				this.selectedSingleDept = this.$pdStorage.get("sd");
				this.selectedSingleUser = this.$pdStorage.get("su");
				this.selectedSingleWry = this.$pdStorage.get("sw");

			},
			selectSingleUser (){
				console.log("单选人员")
				uni.navigateTo({
					url: 'selectDail/singleUser'
				}) 
			},
			selectMultiUser (){
				console.log("多选人员")
				uni.navigateTo({
					url: 'selectDail/multiUser'
				}) 
			},
			selectSingleDept (){
				console.log("单选部门")
				uni.navigateTo({
					url: 'selectDail/singleDept'
				}) 
			},
			selectMultiDept (){
				console.log("多选部门")
				uni.navigateTo({
					url: 'selectDail/multiDept'
				}) 
			},
			selectSingleWry (){
				console.log("单选污染源")
				uni.navigateTo({
					url: 'selectDail/singleWry'
				}) 
			}
		}
	}
</script>

<style>
@import '../../../../common/powerapp/css/table_lr.scss';
.table-list-ctn ul>li,uni-textarea{width:auto;height:102upx;}
.uni-list{background:#fff;}
 .table-list-ctn li:nth-child(2n),.table-list-ctn li:nth-child(2n+1) span uni-textarea{height: 202upx;} 
 .span-value{
	 padding: 14upx;
 }
.span-value .text{color:#333 !important;line-height: 1.2;vertical-align: top;}
</style>
