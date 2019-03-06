<template>
	<view class="">
		<!-- image -->
		<view class="uni-list-margre list-pd">
			<view class="uni-list-cell cell-pd">
				<view class="uni-uploader">
					<view class="uni-uploader-head" v-if="!readOnly">
						<view class="uni-uploader-title" v-if="type === 'img'">点击可预览选好的图片</view>
						<view class="uni-uploader-title" v-if="type === 'video'">点击播放选好的视频</view>
						<view class="uni-uploader-info">{{FJXX.length}}/{{count}}</view>
					</view>
					<view class="uni-uploader-body">
						<view class="uni-uploader__files">
							<block v-for="(item,i) in FJXX" :key="i">
								<view class="uni-uploader__file" v-if="item.fileType == 'img'">
									<text class="iconfont icon-delete" @tap="delectFjxx(item.WDBH,i)" v-if="!readOnly"></text>
									<image class="uni-uploader__img" style="width: 100%; height: 100%;" :src="item.filePath" :data-src="item.filePath"
									 @tap="previewImage"></image>
								</view>
								<view class="uni-uploader__file uploader_video" v-if="item.fileType == 'video'">
									<!-- #ifdef APP-PLUS -->
										<view style="height: 40upx;">
										</view>
									<!-- #endif -->
									<text class="iconfont icon-delete" @tap="delectFjxx(item.WDBH,i)" v-if="!readOnly"></text>
									<video style="width: 100%; height: 100%;" :src="item.filePath" @error="videoErrorCallback" controls></video>
								</view>
							</block>
							<view class="uni-uploader__input-box" v-if="!readOnly">
								<view class="uni-uploader__input" v-if="type === 'img'" @tap="chooseImage"></view>
								<view class="uni-uploader__input" v-if="type === 'video'" @tap="chooseVideo"></view>
							</view>
							<view class="nodata" v-if="FJXX.length == 0 && readOnly ">
								暂无附件
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		name: 'pd-uploader',
		props: {
			//附件类型
			type: {
				type: String,
				default: 'img' //可选  img ,video
			},
			//最大上传数
			count: {
				type: Number,
				default: 9
			},
			//上传附件后台url
			uploadServer: {
				type: String,
				default: '/webapp/uploadFile'
			},
			//参数
			uploadConfig: {
				type: Object,
				default () {
					return {
						APPBH: '', //必填
						WDSX: 'RYXX',
						ZLX: 'pic'
					}
				}
			},
			//文件上传大小限制,默认5M
			maxSize: {
				type: Number,
				default: 10
			},
			//只读
			readOnly: {
				type: Boolean,
				default: false
			},
			//附件LIST,只读的时候必须传。
			// 			  [{
			// 				  WJMC:'',    //文件名称
			// 				  WJBH:''         //附件的编号
			// 			  }]
			//
			fileArray: {
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {
				imageList: [],
				FJXX: [],
				uploadNum: 1,
				imgefileType: ['jpg', 'png', 'jpeg', 'gif', 'svg'],
				videoFileType: ['mp4', 'avi', 'mov', 'mkv', 'wmv']
			}
		},
		methods: {
			chooseImage: async function() {
				if (this.uploadConfig.APPBH == '') {
					this.$pdAction.alert("未传入业务系统编号,请选保存基本信息!")
					return
				}
				if (this.FJXX.length === this.count) {
					let isContinue = await this.isFullImg();
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					count: this.count,
					success: (res) => {
						let FilePaths = res.tempFilePaths;
						//文件大小限制
						let currentSize = 0
						res.tempFiles.forEach((item) => {
							currentSize += item.size;
						})
						let isMax = this.sizeControll(currentSize);
						if (!isMax) {
							return
						}
						//准备上传到后台
						FilePaths.forEach((item, i) => {
							this.uploadFile(item).then((data) => {
								if (data.result == 'success') {
									if (typeof data.wd_data == 'string') {
										try {
											let fjitem = JSON.parse(data.wd_data)[0];
											this.FJXX.push({
												WDBH: fjitem.WDBH,
												WDMC: fjitem.WDMC,
												WDDX: fjitem.WDDX,
												WDLJ: fjitem.WDLJ,
												WDHZ: fjitem.WDHZ,
												CJSJ: fjitem.CJSJ,
												filePath: item,
												fileType: this.fileTypeTest(fjitem.WDMC) //获取文件后缀名称
											})
										} catch (e) {
											this.$pdAction.toast("附件信息数据转换失败");
										}
									}
									this.imageList = this.imageList.concat(item);
								}
							});
						})
					}
				})
			},
			isFullImg: function() {
				return new Promise((res) => {
					uni.showModal({
						content: '已经有' + this.FJXX.length + '张图片了,是否清空现有图片？',
						success: (e) => {
							if (e.confirm) {
								this.FJXX.forEach((item, index) => {
									this.delect(item.WDBH, 0)
								})
								res(false);
							} else {
								res(false)
							}
						},
						fail: () => {
							res(false)
						}
					})
				})
			},
			isFullVideo() {
				return new Promise((reslove) => {
					uni.showModal({
						content: '已经有' + this.FJXX.length + '个视频了,是否清空现有的视频',
						success: (e) => {
							if (e.confirm) {
								this.FJXX.forEach((item, index) => {
									this.delect(item.WDBH, 0)
								})
								reslove(false)
							} else {
								reslove(false)
							}
						},
						fail: () => {
							reslove(false)
						}
					})
				})
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({ //图片预览
					current: current,
					urls: this.imageList,
					indicator: "default"
				})
			},
			chooseVideo: async function() {
				if (this.uploadConfig.APPBH == '') {
					this.$pdAction.alert("未传入业务系统编号,请选保存基本信息!")
					return
				}
				if (this.FJXX.length === this.count) {
					let isContinue = await this.isFullVideo();
					if (!isContinue) {
						return;
					}
				}
				uni.chooseVideo({
					count: this.count,
					success: (res) => {
						//文件大小限制
						let isMax = this.sizeControll(res.size);
						if (!isMax) {
							return
						}
						var filePathNov = res.tempFilePath
						this.uploadFile(filePathNov).then((data) => {
							if (data.result == 'success') {
								if (typeof data.wd_data == 'string') {
									try {
										let fjitem = JSON.parse(data.wd_data)[0];
										this.FJXX.push({
											WDBH: fjitem.WDBH,
											WDMC: fjitem.WDMC,
											WDDX: fjitem.WDDX,
											WDLJ: fjitem.WDLJ,
											WDHZ: fjitem.WDHZ,
											CJSJ: fjitem.CJSJ,
											filePath: filePathNov,
											fileType: this.fileTypeTest(fjitem.WDMC) //获取文件后缀名称
										})
									} catch (e) {
										this.$pdAction.toast("附件信息数据转换失败");
									}
								}
							}
						});

					}
				})
			},
			videoErrorCallback: function(e) {
				uni.showModal({
					content: '文件路径读取失败!',
					showCancel: false
				})
			},
			//把数据上传到后台
			uploadFile(Path) {
				let url = this.uploadServer ? this.uploadServer : this.$pdGlobal.UPLOADSERVICE;
				this.$pdAction.showWait("正在上传...")
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: this.$pdGlobal.SERVICEURL + '/' + url,
						filePath: Path,
						name: 'file',
						formData: this.uploadConfig,
						success: (res) => {
							this.$emit("uploadSuccess", res);
							this.$pdAction.closeWait()
							this.$pdAction.toast("上传成功");
							resolve(JSON.parse(res.data));
						},
						fail: (err) => {
							this.$emit("uploadFail", err);
							this.$pdAction.closeWait();
							this.$pdAction.toast("上传失败", {
								icon: 'none'
							});
							resolve(false)
						}
					})
				})
			},
			//删除附件信息
			delectFjxx(key, index) {
				this.$pdAction.alert("确定删除?", {
					title: '删除',
					showCancel: true
				}).then((res) => {
					if (res == 'confirm') {
						this.delect(key, index);
					}
				})
			},
			//删除
			delect(key, index) {
				this.$pdAction.showWait("删除中...")
				this.$pdResource.service({
					data: {
						service: 'DELETE_FILE',
						WDBH: key,
						isSaveProject: true
					}
				}).then((result) => {
					if (result.result == 'success') {
						this.$pdAction.closeWait();
						this.$pdAction.toast("删除成功");
						this.FJXX.splice(index, 1);
						this.imageList.splice(index,1);
					} else {
						this.$pdAction.closeWait();
						this.$pdAction.toast("附件删除失败");
					}
				}, (err) => {
					this.$pdAction.closeWait();
					this.$pdAction.toast(err.resData.data);
				})
			},
			//文件大小限制
			sizeControll(size) {
				let maxSize = this.maxSize * 1024 * 1024;
				if (size > maxSize) {
					this.$pdAction.alert("文件大小超过限制" + this.maxSize + "M!");
					return false;
				}
				return true;
			},
			//附件下载
			downloadFile(list) {
				var _this = this;
				if (list.length > 0) {
					this.$pdAction.showWait('正在下载截图1' + '/' + list.length + '');
					list.forEach((item, i) => {
						this.download(item.WJBH, Number(i + 1), list.length).then((res) => {
							var obj = {
								fileType: _this.fileTypeTest(item.WJMC),
								filePath: res.filePath
							}
							_this.FJXX.push(obj);
							if (obj.fileType == 'img') {
								_this.imageList.push(res.filePath); //用来预览图片的
							}
						});
					})
				}
			},
			download(WJBH, i, len) {
				var url = this.$pdGlobal.SERVICEURL + '/webapp/downloadFile?wdbh=' + WJBH;
				return new Promise((resolve, reject) => {
					uni.downloadFile({
						url: url,
						success: (e) => {
							let Obj = {
								WTBH: WJBH,
								filePath: e.tempFilePath
							}
							resolve(Obj)
							if (i == 1) {
								this.$pdAction.closeWait();
							}
							if (i != len) {
								this.uploadNum++;
							}
						},
						fail: (e) => {
							reject(e);
							this.$pdAction.alert(e.errMsg);
							this.$pdAction.closeWait();
						}
					})
				})
			},
			//获取文件后缀名称
			fileTypeTest(file) {
				let fileName = file.lastIndexOf("."); //取到文件名开始到最后一个点的长度
				let fileNameLength = file.length; //取到文件名长度
				let fileFormat = file.substring(fileName + 1, fileNameLength); //截
				if (this.imgefileType.indexOf(fileFormat) != -1) {
					return 'img'
				}
				if (this.videoFileType.indexOf(fileFormat) != -1) {
					return 'video'
				}else{
					return 'img'
				}
				
			}
		},
		watch: {
			uploadNum(num) {
				this.$pdAction.showWait('正在下载截图' + num + '/' + this.fileArray.length + '');
				if (num == this.fileArray.length) {
					this.$pdAction.closeWait();
				}
			},
			fileArray(arr) {
				this.downloadFile(arr);
			}
		}
	}
</script>

<style>
	.uni-uploader-body{
		margin-top: 0;
	}
	.uni-uploader__file {
		position: relative;
		width: 32%;
		margin: 2upx 4upx;
	}

	.icon-delete {
		color: red;
		position: absolute;
		top: 0;
		right: 0;
		z-index: 1000;
		border-radius: 50%;
		background: white;
	}

	.cell-pd {
		padding: 22upx 30upx;
	}

	.list-pd {
		margin-top: 50upx;
	}

	.uploader_video {
		width: 100%;
		height: 450upx;
	}

	.uni-video {
		width: 100%;
		height: 100%;
	}

	.uni-list-margre {
		background: #fff;
		margin: 0;
	}

	.uni-uploader__img {
		display: block;
		width: 100%;
		height: 100%;
	}

	.nodata {
		width: 300upx;
		height: 60upx;
		text-align: center;
		margin: 0 auto;
		line-height: 60upx;
		background: #eee;
		border-radius: 10upx;
	}
</style>
