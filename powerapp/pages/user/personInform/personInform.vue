<template>
	<view class="uni-content">
		<view class="dg-view">
			<view id="userTable" class="table-list-ctn">
			    <ul>
					<li>
			    		<span class="span-hd">登录账号：</span>
						<span class="span-value">SYSTEM</span>
			    		<!-- <span :bind="user.YHID" class="span-value">SYSTEM</span> -->
			    	</li>
			    	<li>
			    		<span class="span-hd">姓名：</span>
						<span class="span-value">系统管理员</span>
			    		<!-- <span :bind="user.YHMC" class="span-value">系统管理员</span> -->
			    	</li>
			    	<li>
			    		<span class="span-hd">性别：</span>
						<span class="span-value">男</span>
			    		<!-- <span :bind="user.XB" class="span-value">男</span> -->
			    	</li>
			    	<li>
			    		<span class="span-hd">所属部门：</span>
			    		<span class="span-value">开发一部</span>
			    	</li>
			    	<li>
			    		<span class="span-hd">我的职位：</span>
						<span class="span-value"></span>
			    		<!-- <span :bind="user.YHZW" class="span-value"></span> -->
			    	</li>
			    	<li>
			    		<span class="span-hd">我的称谓：</span>
						<span class="span-value"></span>
			    		<!-- <span :bind="user.YHCW" class="span-value"></span> -->
			    	</li>
			    	<li>
			    		<span class="span-hd">手机号码：</span>
						<span class="span-value">13800138000</span>
			    		<!-- <span :bind="user.YHSJ" class="span-value">13800138000</span> -->
			    	</li>
			    	<li>
			    		<span class="span-hd">办公电话：</span>
						<span class="span-value"></span>
			    		<!-- <span :bind="user.BGDH" class="span-value"></span> -->
			    	</li>
			    	<li>
			    		<span class="span-hd">内网邮箱：</span>
						<span class="span-value"></span>
			    		<!-- <span :bind="user.NWYX" class="span-value"></span> -->
			    	</li>
			    	<li>
			    		<span class="span-hd">外网邮箱：</span>
						<span class="span-value"></span>
			    		<!-- <span :bind="user.WWYX" class="span-value"></span> -->
			    	</li>
			    </ul>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
@import '../../../../common/powerapp/css/table_lr.scss';

</style>
