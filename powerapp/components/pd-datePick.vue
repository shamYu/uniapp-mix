<template>
	<view v-if='isShow'>
		<view class="mx-mask">
			<view class="mx-modal">
				<view v-if="type != 'yyyy-MM' && type != 'yyyy'" class="mx-modal-header">
					<text style="padding: 0 15px;" @click="onPrevMonth"><text class="icon icon-left"></text></text>
					<text>{{date.year}}年 - {{date.month}}月</text>
					<text style="padding: 0 15px;" @click="onNextMonth"><text class="icon icon-right"></text></text>
					<view class="mx-modal-header-colse" @click="onClose"><text class="icon icon-close"></text></view>
				</view>
				 <view  class="mx-modal-header">
					<text>选择时间</text>
					<view class="mx-modal-header-colse" @click="onClose"><text class="icon icon-close"></text></view>
				</view> 
				<view class="mx-modal-body">
					<!-- 日期选择 -->
					<view v-if="type != 'yyyy-MM' && type != 'yyyy'"  class="mx-date">
						<view class="mx-date-header">
							<view v-for="(header,index) in ['一','二','三','四','五','六','日']" :key="index">{{header}}</view>
						</view>
						<view class="mx-date-body">
							<view v-for="(item,index) in dateList" :key="index" :id="index" @click="onSelectDate" :class="{'active': item.selected,'gray': item.is_gray}">{{item.date}}</view>
						</view>
					</view>
					<!-- 时间选择 -->
					<view v-if="type == 'yyyy-MM-dd HH' || type == 'yyyy-MM-dd HH:mm' || type == 'yyyy-MM-dd HH:mm:ss'">
						<view  class="line-title" style="padding: 10px 0;">选择时间</view>
						<picker-view class="mx-time" indicator-style="height: 22px;" :value="time" @change="onTimeChange">
							<picker-view-column v-if="type == 'yyyy-MM-dd HH' || type == 'yyyy-MM-dd HH:mm' || type == 'yyyy-MM-dd HH:mm:ss'">
								<view v-for="(item,index) in hours" :key="index">{{item<10?'0'+item:item}}时</view>
							</picker-view-column>
							<picker-view-column v-if="type == 'yyyy-MM-dd HH:mm' || type == 'yyyy-MM-dd HH:mm:ss'">
								<view v-for="(item,index) in minutes" :key="index">{{item<10?'0'+item:item}}分</view>
							</picker-view-column>
							<picker-view-column v-if="type == 'yyyy-MM-dd HH:mm:ss'">
								<view v-for="(item,index) in seconds" :key="index">{{item<10?'0'+item:item}}秒</view>
							</picker-view-column>
						</picker-view>
					</view>
					<view style="padding: 0 0 40upx 0;" v-if="type == 'yyyy-MM' || type == 'yyyy'">
						<!-- <view  class="line-title" style="padding: 10px 0;">选择日期</view> -->
						<picker-view class="mx-time" indicator-style="height: 60upx;line-height:60upx" :value="time" @change="onTimeChange">
							<picker-view-column v-if=" type == 'yyyy-MM' || type == 'yyyy'">
								<view v-for="(item,index) in years" :key="index">{{item}}年</view>
							</picker-view-column>
							<picker-view-column v-if="type == 'yyyy-MM'">
								<view v-for="(item,index) in months" :key="index">{{item}}月</view>
							</picker-view-column>
						</picker-view>
					</view>
				</view>
				
				<!-- <view style="color: #666;font-size: 14px;padding: 10px 0;">
					已选择:
					<text v-if="type!='time'">
						{{date.year<10?('0'+date.year):date.year}}年
						{{date.month<10?('0'+date.month):date.month}}月
						{{date.date<10?('0'+date.date):date.date}}日
					</text>
					<text v-if="type=='yyyy-MM-dd HH:mm:ss' || type=='time'">
						{{time[0]<10?('0'+time[0]):time[0]}}:
						{{time[1]<10?('0'+time[1]):time[1]}}:
						{{time[2]<10?('0'+time[2]):time[2]}}
					</text>
				</view> -->
				<view>
					<view class="mx-btn" @click="onConfirm">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>	
	export default {
		props: {
			value: {
				type: Boolean,
				default: false
			},
			init: {
				type: String,
				default () {
					let d = new Date();
					return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() +
						':' + d.getSeconds();
				}
			},
			type: {
				type: String,
				default: 'yyyy-MM-dd', 
			} //yyy,
			//yyyy-MM,
			//yyyy-MM-dd,
			//yyyy-MM-dd HH,
			//yyyy-MM-dd HH:mm,
			//yyyy-MM-dd HH:mm:ss 

		},
		data() {
			return {
				date: {
					year: 2019,
					month: 3,
					date: 1,
					hour: 0,
					minute: 0,
					second: 0
				},
				dateIndex: 0,
				dateList: [],
				isShow: false,
				time: [0, 0, 0],
				cls: {
					mask: true,
					fadeIn: false,
					fadeOut: false
				},
				indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth/(750/100))}px;`,
				years:this.getYears(),
				months:this.getMonths(),
				hours:this.getNumbers(24),
				minutes:this.getNumbers(60),
				seconds:this.getNumbers(60)
			};
		},
		mounted() {
			let initValue = this.type == 'time' ? '1970-0-0 ' + this.init : this.init;
			let date = new Date(); //转换 年-月-日 =>年/月/日
			this.date.year = date.getFullYear();
			this.date.month = date.getMonth() + 1;
			this.date.date = date.getDate();
			this.date.minute = date.getMinutes();
			this.date.second = date.getSeconds();
			this.date.hour = date.getHours();
			this.date.minute = date.getMinutes();
			this.date.second = date.getSeconds();
			if(this.type == 'yyyy-MM'){
				this.time = [this.date.year,this.date.month - 1]
			}else if(this.type == 'yyyy'){
				this.time = [this.date.year];
			}else{
				this.time = [this.date.hour, this.date.minute, this.date.second];
			}
			this.dateList = this.getDateList(this.date);
			this.dateList.forEach((item) => {
				if (item.year == this.date.year && item.month == this.date.month && item.date == this.date.date) {
					item.selected = true;
				}
			});
		},
		methods: {
			//关闭
			onClose() {
				this.isShow = false;
				this.$emit('input', this.isShow);
			},
			//确定
			onConfirm() {
				let date = JSON.parse(JSON.stringify(this.date));
				if (this.type == 'yyyy') {
					date.value = date.year;
				} else if (this.type == 'yyyy-MM') {
					date.value = date.year + '-' + this.handleDate(date.month);
				} else if (this.type == 'yyyy-MM-dd') {
					date.value = date.year + '-' + this.handleDate(date.month) + '-' + this.handleDate(date.date);
				} else if (this.type == 'yyyy-MM-dd HH') {
					date.value = date.year + '-' + this.handleDate(date.month) + '-' + this.handleDate(date.date) + ' ' + this.handleDate(date.hour);
				} else if (this.type == 'yyyy-MM-dd HH:mm') {
					date.value = date.year + '-' + this.handleDate(date.month) + '-' + this.handleDate(date.date) + ' ' + this.handleDate(date.hour) + ':' + this.handleDate(date.minute)
				} else if (this.type == 'yyyy-MM-dd HH:mm:ss') {
					date.value = date.year + '-' + this.handleDate(date.month) + '-' + this.handleDate(date.date) + ' ' + this.handleDate(date.hour) + ':' + this.handleDate(date.minute) + ':' + this.handleDate(date.second);
				} else {
					date.value = this.handleDate(date.hour) + ':' + this.handleDate(date.minute) + ':' + this.handleDate(date.second);
				}
				this.onClose();
				console.log(date)
				this.$emit('selected', date);
			},
			//时间变更
			onTimeChange(event) {
				if(this.type == 'yyyy-MM'){
					this.date.year = this.years[event.detail.value[0]];
					this.date.month = this.months[event.detail.value[1]];
				}else if(this.type == 'yyyy'){
					this.date.year = this.years[event.detail.value[0]];
				}else if(this.type == 'yyyy-MM-dd HH' || this.type == 'yyyy-MM-dd HH:mm' ||this.type == 'yyyy-MM-dd HH:mm:ss'){
					this.date.hour = this.hours[event.detail.value[0]];
					this.date.minute = this.minutes[event.detail.value[1]];
					this.date.second = this.seconds[event.detail.value[2]];
				}
				
			},
			//上一月
			onPrevMonth() {
				this.date.month--;
				if (this.date.month <= 0) {
					this.date.year--;
					this.date.month = 12;
				}
				this.dateList = this.getDateList(this.date);
			},
			//下一月
			onNextMonth() {
				this.date.month++;
				if (this.date.month > 12) {
					this.date.year++;
					this.date.month = 1;
				}
				this.dateList = this.getDateList(this.date);
			},
			//选择日期
			onSelectDate(event) {
				let index = event.target.id;
				if (this.dateList[index].is_gray) return; //不能选择非本月日期
				for (let i = 0, len = this.dateList.length; i < len; i++) this.dateList[i].selected = false;
				this.dateList[index].selected = true;
				this.date.date = this.dateList[index].date;
			},
			//转换日期对象
			getDateInfo(date) {
				let weeks = ["日", "一", "二", "三", "四", "五", "六"];
				let data = {
					year: date.getFullYear(),
					month: date.getMonth() + 1,
					date: date.getDate(),
					week: weeks[date.getDay()],
					selected: false, //是否选中
					is_gray: false //是否显示灰色
				};
				return data;
			},
			//获取日期列表
			getDateList(option = {}) {
				let nowDate = new Date();
				let year = option.year || nowDate.getFullYear();
				let month = option.month ? option.month - 1 : nowDate.getMonth();
				let date = option.date || nowDate.getDate();
				let pointerDate = new Date();
				pointerDate.setFullYear(year);
				pointerDate.setMonth(month);
				pointerDate.setDate(1);
				let oneWeek = pointerDate.getDay() == 0 ? 7 : pointerDate.getDay(); //这月1号是周几
				pointerDate.setDate(pointerDate.getDate() - (oneWeek - 1));
				let dateList = [],
					is_selected = false;
				for (let i = 0; i < 42; i++) {
					let tmp = this.getDateInfo(pointerDate);
					tmp.is_gray = pointerDate.getMonth() < month || pointerDate.getMonth() > month; //设置非本月日期
					dateList.push(tmp);
					pointerDate.setDate(pointerDate.getDate() + 1);
				}
				return dateList;
			},
			bindChange: function(e) {
				const val = e.detail.value
				this.year = this.years[val[0]]
			},
			getYears(){
				let arr = [];
				let year = new Date().getFullYear();
				for(let i = 2000; i<= year; i++) {
					arr.push(i);
				}
				return arr;
			},
			getMonths(){
				let arr = [];
				for(let i = 1; i <= 12; i++) {
					arr.push(i);
				}
				return arr;
			},
			getNumbers(num){
				let arr = [];
				for(let i = 0 ;i <= num;i++){
					arr.push(i)
				}
				return arr
			},
			handleDate(dateNum){
				if(dateNum < 10) return '0' + dateNum;
				return dateNum;
			}
		},
		watch: {
			value(newVal) {
				this.isShow = newVal;
			}
		}
	}
</script>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(.8);
		}

		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.mx-mask {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0);
		font-size: 16px;
		z-index: 1000;
		animation: fadeIn .2s 1;
	}

	.mx-modal {
		background: #fff;
		position: absolute;
		left: 5%;
		right: 5%;
		top: 50%;
		transform: translateY(-50%);
		color: #606266;
		border-radius: 6px;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
		padding: 0 10px 10px 10px;
		box-sizing: border-box;
		text-align: center;
	}

	.mx-modal-header {
		position: relative;
		padding: 10px 0;
		border-bottom: 1px solid #eee;
	}

	.mx-modal-header-colse {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
	}

	.mx-modal-body {
		padding: 10px 0;
	}

	/*日期*/
	.mx-date-header,
	.mx-date-body {
		position: relative;
		display: flex;
		justify-content: space-between;
	}

	.mx-date-header view,
	.mx-date-body view {
		width: 14.28%;
		transition: .2s;
		border-radius: 6px;
	}

	.mx-date-header {
		padding: 5px 0;
	}

	.mx-date-body view {
		padding: 2px 0;
	}

	.mx-date-body {
		flex-wrap: wrap;
	}

	.mx-date-body view.active {
		background: #409eff;
		color: #fff;
	}

	.mx-date-body view.gray {
		background: none;
		color: #c0c4cc;
	}

	/*时间*/
	.mx-time {
		width: 100%;
		height: 66px;
	}

	/*带线的标题*/
	.line-title {
		position: relative;
		font-size: 14px;
		width: 100%;
		text-align: center;
		color: #666;
	}

	.line-title::before,
	.line-title::after {
		content: "";
		display: inline-block;
		width: 30px;
		height: 1px;
		background: #eee;
		position: relative;
		top: -4px;
	}

	.line-title::before {
		right: 6px;
	}

	.line-title::after {
		right: -6px;
	}

	@font-face {
		font-family: "icondt";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAL8AAsAAAAAB0QAAAKtAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDFAqBfIFcATYCJAMQCwoABCAFhG0HUxtRBsiusCnDvUiJtoUQcQPnvVtvMMCnT/Hw/drrue/d3SConygCFR0eHy6CqjJVZVtlO74ZX0ugo/dyqp/OAdgfz4ZBXQtNLtsvRV7vk14dExXgwABohHp8A9bwLjsU6HnCWeSN0hVuWvowzYJJTfFg9rm/gkTApixA7f9/7/T/2tzJ57Vvua01aSx71Akw7AQU0FibIiuRgDyF2kUclLDyr44TGDSvqXF0cHYJCxIZF4gX1ihY6ISlDHL9QjuxNMVrjf7yslwBr/T3479+LFA0FZl6/Hw/ga1f/XqljtyVGMl5TgSrqNgAkng4mb5tWgSsaYP9Z2wBrRTKWcGuQ5OIc2370j9eUYkWKRwG23am8itOEPxCUPj1AhV+hra/m90BzlxqTxW0a29i05sRr6YTLTiDDCWc2Z2hFputH4mOOA8URaL5Hv51fMCPmzFRoiEZxKAG/j/UgibTxguO47b+ygEf64gwbJKoJTEjytLsBxVAd/1cTwE6NeqJZpavv2gguO5dXeG6fyjBFx+fFewkNx/0K8CSfysB6zKXEUtmKufiwpt6ULJgkMboIv5Jv2doZ+BSQr+ZHd4+cw1U/RbwpG5AY8g2tPrtwqB1h6uHTHGmRQ5gzZsFYVwNxahPUI17x5P6A41Zf9Aaj2kYdBlqyyFLYZeiIyWUYHSPNuZSM5ssmeJzMiFXri3TnGty3saw1+72c4dUkjtjhr8xfRGN2nGBB9ZplOeMleOUYmkPRapBp6On3tSOuYAlhxyiCJJAkXvIirGSls3F0uDz54gR5BS3gMyErxHHs52jnrYugB+qSwj5lle8G0afEBrSHFZAB5aT5DTNUDU9KEViom24I1kZ6DiNNKpu368tvnAbDCI3ZJSokdFongS+DevVqtLcc0i1VbjLfghsAgAAAAA=') format('woff2');
	}

	.icon {
		font-family: "icondt" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-close:before {
		content: "\e641";
	}

	.icon-right:before {
		content: "\e65f";
	}

	.icon-left:before {
		content: "\e660";
	}

	/*button*/
	.mx-btn {
		display: block;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		background: #409eff;
		border: 1px solid #409eff;
		color: #fff;
		-webkit-appearance: none;
		text-align: center;
		box-sizing: border-box;
		outline: none;
		margin: 0;
		transition: .1s;
		font-weight: 500;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		padding: 12px 20px;
		font-size: 14px;
		border-radius: 4px;
	}

	.mx-btn:active {
		background-color: #3A8EE6;
		border-color: #3A8EE6;
	}
</style>
