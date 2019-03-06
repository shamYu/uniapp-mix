<template>
	<view class="wrapper">
		<view class="handRight">
			<view class="handTitle">电子签名</view>
		</view>	
	  <view class="handBtn">
		<view class="slide-wrapper">
			<text>选择粗细</text>
			<slider @change="updateValue" value="50" show-value class="slider" step="25" />
		</view>
		<view class="color">
			<text>选择颜色</text>
			<image @click="selectColorEvent('black')" :src="selectColor === 'black' ? './static/img/color_black_selected.png' : './static/img/color_black.png'" :class="selectColor === 'black' ? 'color_select' : ''" class="black-select"></image>
			<image @click="selectColorEvent('red')" :src="selectColor === 'red' ? './static/img/color_red_selected.png' : './static/img/color_red.png' " :class="selectColor === 'red' ? 'color_select' : ''"  class="red-select" ></image>
		</view>
	  </view>
	  <view class="handCenter">
		<canvas class="handWriting" disable-scroll="true" @touchstart="uploadScaleStart" @touchmove="uploadScaleMove"
		  @touchend="uploadScaleEnd" @tap="mouseDown" canvas-id="handWriting">
		</canvas>
	  </view>
		<view class="showimg">
			<image v-if="showimg" :src="showimg" mode=""></image>
			<text v-else >签名展示</text>
		</view>
		<view class="buttons">
			<button @click="retDraw" class="delBtn">重写</button>
			<button @click="subCanvas" class="subBtn">保存</button>	
		</view>
	</view>
</template>

<script>
import Handwriting from "./static/js/signature.js"
export default {
	data(){
		return{
			lineColor:'black',
			slideValue:50,
			handwriting:'',
			selectColor:'black',
			color:'',
			showimg:'',
			share_popup:false,
		}
	},
	onLoad() {
		this.handwriting = new Handwriting({
		  lineColor: this.lineColor,
		  slideValue: this.slideValue, // 0, 25, 50, 75, 100
		  canvasName: 'handWriting',
		})
	},
	methods:{
	 // 选择画笔颜色
	  selectColorEvent(event) {
		  this.selectColor = event;
		if(event=='black'){
			this.color= '#1A1A1A'
		}else if(event=='red'){
			this.color= '#ca262a'
		} 
		this.handwriting.selectColorEvent(this.color)
	  },
	  retDraw() {
		this.handwriting.retDraw();
		 this.showimg =  '';
	  },
	  // 笔迹粗细滑块
	  updateValue(e) {
		  console.log(e.detail);
		  this.slideValue = e.detail.value;
		this.handwriting.selectSlideValue(this.slideValue);
	  },
	  uploadScaleStart(event){
		  this.handwriting.uploadScaleStart(event)
	  },
	  uploadScaleMove(event){
		  this.handwriting.uploadScaleMove(event)
	  },
	  uploadScaleEnd(event){
		  this.handwriting.uploadScaleEnd(event)
	  },
	  subCanvas(){
		  this.handwriting.saveCanvas().then(res=>{
			  this.showimg = res;
			  console.log(res);
			  this.$emit("save",res);
		  }).catch(err=>{
			  console.log(err);
		  });		  
		  
	  },
	}
}
</script>

<style scoped="true">
.wrapper {
  width: 100%;
  height: 100%;
  margin: 30upx 0;
  overflow: hidden;
  display: flex;
  align-content: center;
  flex-direction: column;
  justify-content: center;
  font-size: 28upx;
}

.handWriting {
  background: #fff;
  width: 100%;
  height: 350upx;
}

.handRight {
  align-items: center;
}

.handCenter {
  border: 4upx dashed #e9e9e9;
  flex: 5;
  overflow: hidden;
  box-sizing: border-box;
  width: 90%;
  margin: 0 auto;
}
.handTitle {
  flex: 1;
  color: #666;
  justify-content: center;
  font-size: 30upx;
}
.handBtn {
  flex-direction: column;
  padding: 40upx 20upx;
}
.buttons{
	width: 70%;
	margin: 0 auto;
	margin-top: 20upx;
	justify-content: space-between;
}
.buttons>button{
	font-size: 30upx;
	height: 80upx;
	width: 120upx;
}
.delBtn {
  color: #666;
}
.color{
	align-items: center;
}
.color>text{
	margin-right: 20upx;
}
.subBtn {
  background: #008ef6;
  color: #fff;
  text-align: center;
  justify-content: center;
}

.black-select {
  width: 60upx;
  height: 60upx;
}
.black-select.color_select {
  width: 90upx;
  height: 90upx;
}
.red-select {
  width: 60upx;
  height: 60upx;
}
.red-select.color_select {
  width: 90upx;
  height: 90upx;
}
.slide-wrapper {
  align-items: center;
  margin-bottom: 20upx;
}
.slider{
	width: 400upx;
	padding-left: 20upx;
}
.drop {
  width: 50upx;
  height: 50upx;
  border-radius: 50%;
  background: #FFF;
  position: absolute;
  left: 0upx;
  top: -10upx;
  box-shadow: 0px 1px 5px #888888;
}

.slide {
  width: 250upx;
  height: 30upx;
}
.showimg{
	border: 4upx solid #e9e9e9;
	overflow: hidden;
	width: 90%;
	margin: 0 auto;
	background: #eee;
	height: 350upx;
	margin-top: 40upx;
	align-items: center;
	justify-content: center;
}
.showimg>image{
	width: 100%;
	height: 100%;	
}
.showimg>text{
	font-size: 40upx;
	color: #888;
}
/*每个页面公共css */
	view{
		display: flex;
	}
</style>
