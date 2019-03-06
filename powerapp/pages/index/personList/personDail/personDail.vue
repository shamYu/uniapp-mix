<template>
    <view class="page">
        <view>
            <view>
                <block v-for="(list,index) in lists" :key="index">
                    <view class="uni-list-cell uni-collapse" :class="'listBg'+index">
						<!-- iconfont icon-bottom 图标引入 -->
                        <view class="uni-list-cell-navigate uni-navigate-bottom" :class="list.show ? 'uni-active' : ''" @click="trigerCollapse(index)">
                            {{list.title}}
                        </view>
                        <view class="uni-collapse-content" :class="list.show ? 'uni-active' : ''">
							<view v-if="list.type === 'swiper'">
								<view class="table-list-ctn">
									<ul>
										<li>
											<span class="span-hd">姓名：</span>
											<span class="span-value">{{upParms.XM}}</span>
										</li>
										<li>
											<span class="span-hd">专业：</span>
											<span class="span-value">{{upParms.ZY_NAME}}</span>
										</li>
										<li>
											<span class="span-hd">生日：</span>
											<span class="span-value">{{upParms.BIRTHDAY}}</span>
										</li>
										<li>
											<span class="span-hd">行政区划：</span>
											<span class="span-value">{{upParms.SHENG_NAME}}-{{upParms.SHI_NAME}}-{{upParms.QX_NAME}}</span>
										</li>
										<li>
											<span class="span-hd">办公电话：</span>
											<span class="span-value">{{upParms.BGDH}}</span>
										</li>
										<li>
											<span class="span-hd">手机：</span>
											<span class="span-value">{{upParms.MOBILE}}</span>
										</li>
										<li>
											<span class="span-hd">传真：</span>
											<span class="span-value">{{upParms.MOBILE}}</span>
										</li>
										<li>
											<span class="span-hd">邮箱：</span>
											<span class="span-value">{{upParms.EMAIL}}</span>
										</li>
										<li>
											<span class="span-hd">爱好：</span>
											<span class="span-value">{{upParms.HOBBY_NAME}}</span>
										</li>
										<li>
											<span class="span-hd">是否有效：</span>
											<span class="span-value">{{upParms.SFYX_NAME}}</span>
										</li>
										<li>
											<span class="span-hd">备注：</span>
											<span class="span-value">{{upParms.BZ}}</span>
										</li>
									</ul>
								</view>
							</view>
                            <view v-if="list.type === 'font'" class="page-pd">
                                <view class="listTip" v-if='projectArry.length<1'>暂无科目数据</view>
								<view class="tipShow" v-if='projectArry.length>0' v-for="(item,index2) in projectArry" :key="index2">
									<view class="viewName">
										<span class="spanName">科目：{{item.KMMC}}</span>
										<span class="spanName">学分：{{item.XF}}</span>
									</view>
									<view class="viewName">
										进修时间：
										<span class="spanName">{{item.JXKSSJ + '~' + item.JXJSSJ}}</span>
									</view>
								</view>
                            </view>
                            <view v-if="list.type === 'list'">
								<view class="uni-uploader__files" v-if="feedbackFJXX.length>0">
									<block v-for="(item,imgIndex) in feedbackFJXX" :key="imgIndex">
										<view class="uni-uploader__file">
											<image class="uni-uploader__img" style="width: 100%; height: 100%;" :src="item.PATH" :data-src="item.PATH" @tap="previewImage"></image>
										</view>
									</block>
								</view>
                                <view class="listTip" v-if="feedbackFJXX.length == 0">暂无附件</view>
                            </view>
                        </view>
                    </view>
                </block>
            </view>
        </view>
    </view>
</template>

<script>
	export default {
		data() {
			return {
				upParms:"",
				title: 'accordion',
				projectArry:[],//科目数据
				feedbackFJXX:[],//上传图片数据
				uploadNum:1,
				length:0,
				imageList:[],
				lists: [{
				        title: "基本信息",
				        type: 'swiper',
				        show: true
				    },
				    {
				        title: "附件(新增时需要先保存基本信息)",
				        type: 'list',
				        show: false
				    },
				    {
				        title: "选择科目(新增时需要先保存基本信息)",
				        type: 'font',
				        show: false
				    }
				]
			};
		},
		created (){

		},
		onLoad(evt) {		
			this.upParms = JSON.parse(evt.a);
			this.$pdResource.service({//科目和保存的数据请求
				data: {
					"service":"SEARCH_DEMO_DETAIL",
					"XH":this.upParms.XH
				}
			}).then(data=>{
				console.log(data,"获取保存的科目数据")
				this.projectArry = data.project_array;
				// this.feedbackFJXX = data.data_files;
				this.length = data.data_files.length;
				this.downLoadFj(data.data_files);
				
			})
		},
		computed:{
			
		},
		methods:{
			trigerCollapse(e) {
			    for (let i = 0, len = this.lists.length; i < len; ++i) {
			        if (e === i) {
			            this.lists[i].show = !this.lists[i].show;
			        } else {
			            this.lists[i].show = false;
			        }
			    }
			},
			previewImage: function(e) {
					var current = e.target.dataset.src
					uni.previewImage({ //图片预览
						current: current,
						urls: this.imageList,
						indicator: "default"
					})
				},
				downLoadFj(list) {
					console.log(list)
					if (list.length > 0) {
						this.$pdAction.showWait('正在下载截图1'+'/' + list.length + '');
						list.forEach((item, i) => {
							this.download(item.WDBH, Number(i+1), list.length).then((res) => {

								this.feedbackFJXX.push(res);
								this.imageList.push(res.PATH);
							});
						})
					}
				},
				download(WTBH, i, len) {
					var url = this.$pdGlobal.SERVICEURL + '/webapp/downloadFile?wdbh=' + WTBH;
					return new Promise((resolve, reject) => {
						uni.downloadFile({
							url: url,
							success: (e) => {
								let Obj = {
									WTBH: WTBH,
									PATH: e.tempFilePath
								}
								resolve(Obj)
								if(i == 1){
									this.$pdAction.closeWait();
								}
								if(i != len){
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
				}
			},
			watch:{
				uploadNum(num){
					this.$pdAction.showWait('正在下载截图' + num + '/' + this.length + '');
					if(num == this.length){
						this.$pdAction.closeWait();
					}
				}
			}
		
	}
</script>

<style lang="scss">
@import '../../../../../common/powerapp/css/table_lr.scss';
.uni-list-cell-navigate.uni-active,.uni-list-cell{background: #fff;}
.uni-list-cell{margin-bottom: 20upx;}
.table-list-ctn{border-top: 1px solid #ddd;}
.listBg0 .uni-navigate-bottom{
	background: url(../../../../../static/powerapp/index/yytb/GZJJ.png) no-repeat;
    background-size: 54upx;
	padding-left: 100upx;
    background-position: 24upx 18upx;
}
.listBg1 .uni-navigate-bottom{
	background: url(../../../../../static/powerapp/index/yytb/GL.png) no-repeat;
	background-size: 54upx;
	padding-left: 100upx;
	background-position: 24upx 18upx;
}
.listBg2 .uni-navigate-bottom{
	background: url(../../../../../static/powerapp/index/yytb/GZJJ.png) no-repeat;
	background-size: 54upx;
	padding-left: 100upx;
	background-position: 24upx 18upx;
}
.listTip{
	width: 80%;
    margin: 0 auto;
    height: 70upx;
	line-height: 70upx;
    text-align: center;
	background: #f3f5f7;
    border: 1px solid #d7dce8;
	border-radius: 16upx;
	margin-bottom: 26upx;
	font-size: 30upx;
}
.tipShow{
	padding: 10upx 30upx;
	border-bottom: 1px solid #ddd;
}
.tipShow .spanName{
	font-size: 30upx;
	color: #333;
	display: inline-block;
	margin-right: 30upx;
}

</style>
