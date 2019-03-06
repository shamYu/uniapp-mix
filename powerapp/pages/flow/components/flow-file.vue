<template>
	<view class="uni-list-cell uni-collapse listBg2" style="background-color: #FFFFFF;">
		<view class="uni-list-cell-navigate uni-navigate-bottom" :class="isFile ? 'uni-active' : ''" style="border-bottom: 1upx solid #e2e2e7;"
		 @click="trigerCollapseFile('file')">
			附件
		</view>
		<view class="uni-collapse-content" :class="isFile ? 'uni-active' : ''">
			<ul class="apx-list">
				<li v-for="(item,index) in fileInfo" :key="index" @click='openFile(item.FJXH,item.FJPATH)'>
					<img :src="filetype(item.FJHZ)" />
					<h1>{{item.FJMC}}</h1>
					<p style="float: left;">{{item.FJDX}}</p>
				</li>
				<li class="noData" v-if="fileInfo.length==0">暂无附件</li>
			</ul>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			fileInfo: {
				type: Array
			}
		},
		data() {
			return {
				isFile: true
			};
		},
		methods: {
			trigerCollapseFile(e) {
				if (e === 'file') {
					if (this.isFile) {
						this.isFile = false;
					} else {
						this.isFile = true;
					}
				}
			},
			filetype(fjhz) {
				var type = '';
				if (fjhz.lastIndexOf('.') > -1) {
					type = fjhz.substring(fjhz.lastIndexOf(".")).toLowerCase();
				} else {
					type = '.' + fjhz.toLowerCase();
				}
				if ('.doc' == type || '.docx' == type) {
					return "../../../../static/fileicons/file_icon_doc.png";
				} else if ('.xlsx' == type || '.xls' == type) {
					return "../../../../static/fileicons/file_icon_xls.png";
				} else if ('.pptx' == type || '.ppt' == type) {
					return "../../../../static/fileicons/file_icon_ppt.png";
				} else if ('.pdf' == type) {
					return "../../../../static/fileicons/file_icon_pdf.png";
				} else if ('.txt' == type) {
					return "../../../../static/fileicons/file_icon_txt.png";
				} else if ('.rar' == type || '.zip' == type || '.gz' == type || '.7z' == type) {
					return "../../../../static/fileicons/file_icon_ysb.png";
				} else if ('.jpg' == type || '.png' == type || '.jpeg' == type || '.gif' == type || '.bmp' == type) {
					return "../../../../static/fileicons/file_icon_pic.png";
				} else if ('.avi' == type || '.mp4' == type || '.wmv' == type || '.mov' == type) {
					return "../../../../static/fileicons/file_icon_video.png";
				} else {
					return "../../../../static/fileicons/file_unknow.png";
				}
			},
			openFile(fjxh,fjpath){
				console.log(fjxh+"=="+fjpath);
			}
		}
	}
</script>

<style>
	@import '../css/flow.css';

	.apx-list {
		padding: 24upx 32upx;
	}

	.apx-list li {
		background: #f3f5f7;
		border: 1px solid #d7dce8;
		padding: 32upx;
		overflow: hidden;
		border-radius: 19upx;
		margin-top: 16upx;
	}

	.apx-list li:first-child {
		margin-top: 0;
	}

	.apx-list li img {
		float: left;
		width: 96upx;
		height: 96upx;
		margin-right: 24upx;
	}

	.apx-list li h1 {
		color: #87919e;
		font-size: 35upx;
		padding-top: 8upx;
	}

	.apx-list li p {
		color: #b5b9bf;
		font-size: 33upx;
		padding-top: 16upx;
	}

	.apx-list li.noData {
		color: #ff761b;
		text-align: center;
		font-size: 35upx;
	}
</style>
