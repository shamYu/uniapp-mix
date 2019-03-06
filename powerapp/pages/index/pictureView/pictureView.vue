<!-- <template>
	<view>
		<button class="selectBtn" type="primary" @click="selectImg">选择相册</button>
		<view class="imgTotle">
			<image @click="viewImage(0)" src="../../../../static/powerapp/index/slider/cbd.jpg" mode=""></image>
			<image @click="viewImage(1)" src="../../../../static/powerapp/index/slider/muwu.jpg" mode=""></image>
			<image @click="viewImage(2)" src="../../../../static/powerapp/index/slider/shuijiao.jpg" mode=""></image>
			<image @click="viewImage(3)" src="../../../../static/powerapp/index/slider/yuantiao.jpg" mode=""></image>
		</view>
	</view>
</template> -->

<script>
	/* export default {
		data() {
			return {
				imageUrl:["../../../../static/powerapp/index/slider/cbd.jpg",
					"../../../../static/powerapp/index/slider/muwu.jpg",
					"../../../../static/powerapp/index/slider/shuijiao.jpg",
					"../../../../static/powerapp/index/slider/yuantiao.jpg",
				]
			};
		},
		methods: {
			selectImg (){//
				 uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function (res) {
						console.log(res.tempFilePaths);
					}
				}); 
			},
			viewImage (index){//图片预览
				uni.previewImage({
					urls: this.imageUrl,
					current:this.imageUrl[index],
					indicator:"default" 
				});
			}
		},
	} */
</script>

<style lang="scss">
	/* .selectBtn{
	width: 50%;
    margin: 30upx auto;
}
.imgTotle{
	width: 100%;
	margin: 30upx 0;
	height: 60%;
}
.imgTotle image{
	width: 48%;
    height: 300upx;
	margin:1%;
} */
</style>



<template>
	<view>
		<view class="uni-common-mt">
			<form>
				<view class="uni-list-margre">
					<view class="uni-list-cell">
						<view class="uni-list-cell-left">
							<view class="uni-label">图片来源</view>
						</view>
						<view class="uni-list-cell-right">
							<picker :range="sourceType" @change="sourceTypeChange" :value="sourceTypeIndex" mode="selector">
								<view class="uni-input">{{sourceType[sourceTypeIndex]}}</view>
							</picker>
						</view>
					</view>

					<view class="uni-list-cell">
						<view class="uni-list-cell-left">
							<view class="uni-label">图片质量</view>
						</view>
						<view class="uni-list-cell-right">
							<picker :range="sizeType" @change="sizeTypeChange" :value="sizeTypeIndex" mode="selector">
								<view class="uni-input">{{sizeType[sizeTypeIndex]}}</view>
							</picker>
						</view>
					</view>

					<view class="uni-list-cell">
						<view class="uni-list-cell-left">
							<view class="uni-label">数量限制</view>
						</view>
						<view class="uni-list-cell-right">
							<picker :range="count" @change="countChange" mode="selector">
								<view class="uni-input">{{count[countIndex]}}</view>
							</picker>
						</view>
					</view>
				</view>
				<!-- 上传附件组件使用示例 -->
				<pd-uploader  :uploadConfig="uploadConfig" :count="count[countIndex]" @uploadSuccess="success" @uploadFail="fail"></pd-uploader>
				
				<pd-uploader type="video" :count="count[countIndex]" :uploadConfig="uploadConfig" @uploadSuccess="success" @uploadFail="fail"></pd-uploader>	
				
			</form>
		</view>
	</view>
</template>
<script>
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	import pdUploader from '@/powerapp/components/pd-uploader.vue'
	export default {
		components:{
			pdUploader
		},
		data() {
			return {
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				uploadConfig:{
					APPBH : 'WEBAPP1550564409897061411328',             //必填, 这个好是业务系统编号,，删除的时候必须传过来.
					WDSX : 'RYXX',            
					ZLX : 'pic'	
				}
			}
		},
		onUnload() {
				this.sourceTypeIndex = 2,
				this.sourceType = ['拍照', '相册', '拍照或相册'],
				this.sizeTypeIndex = 2,
				this.sizeType = ['压缩', '原图', '压缩或原图'],
				this.countIndex = 8;
		},
		methods: {
			success(e){
				console.log(e)
			},
			fail(err){
				console.log(err)
			},
			sourceTypeChange: function(e) {
				this.sourceTypeIndex = e.target.value
			},
			sizeTypeChange: function(e) {
				this.sizeTypeIndex = e.target.value
			},
			countChange: function(e) {
				this.countIndex = e.target.value;
			}
		}
	}
</script>

<style>
	.cell-pd {
		padding: 22upx 30upx;
	}

	.list-pd {
		margin-top: 50upx;
	}
	.uploader_video{
		width: 100%;
		height: 450upx;
	}
	.uni-video{
		width: 100%;
		height: 100%;
	}
	.uni-list-margre{
		background: #fff;
		margin: 0;
	}
</style>
