
### 组件说明
在开发移动端应用的时候，会有很多使用搜索组件的时候。但有时候要实现一些动画效果的时候，有一些开发者就会有些束手无责的感觉。于是我提供几种常见的搜索框的例子。
### 组件示例
![Jan-04-2019 17-40-53.gif](https://upload-images.jianshu.io/upload_images/4472817-29814c46e4ac6b11.gif?imageMogr2/auto-orient/strip)

### 属性说明
1. `mode [number]` 对齐方式 ,可选值: 1 [默认]文字左对齐  ，2 文字居中对齐 
 
2. `button [string]` 按钮位置，可选值: 'outside' [默认]按钮在搜索框外  'inside' 按钮在搜索框内
 
3. `show [boolean]` 按钮显示规则 ，可选值: true [默认]如果mode为1 ，则为始终显示按钮，mode为2，则获取焦点显示按钮。 false 如果mode为1 ，则为获取焦点显示按钮，mode为2，则为输入时显示按钮
 
 
 
 ### 事件说明

1. `search [function]` 点击搜索按钮返回 输入框内输入的值 


 ### 调用说明



 ```javascript
 
 <template>
 	<view class="content">
 		1.文字左对齐 外部显示搜索按钮并且始终显示
 		<mSearch @search="search($event,0)"></mSearch>
 		搜索的值：{{val0}}
 		<br/>
 		2.文字左对齐 外部显示搜索按钮并且获取焦点时显示
 		<mSearch :show="false" @search="search($event,1)"></mSearch>
 		搜索的值：{{val1}}
 
 		<br/>
 		3.文字居中对齐 内部显示搜索按钮并且获取焦点时显示
 		<mSearch :mode="2" button="inside" @search="search($event,2)"></mSearch>
 		搜索的值：{{val2}}
 
 		<br/>
 		4.文字居中对齐 内部显示搜索按钮并且获取输入时显示
 		<mSearch :mode="2" button="inside" :show="false" @search="search($event,3)"></mSearch>
 		搜索的值：{{val3}}
		<br/>
		5.自定义输入框弧度
		<mSearch :show="false" radius="5"></mSearch>
 	</view>
 </template>
 
 <script>
 import mSearch from '../../components/mehaotian-search/mehaotian-search.vue';
 export default {
 	components: {
 		mSearch
 	},
 	data() {
 		return {
 			val0: '',
 			val1: '',
 			val2: '',
 			val3: ''
 		};
 	},
 	
 	methods: {
 		search(e, val) {
 			console.log(e, val);
 			this['val'+val] = e;
 		}
 	}
 };
 </script>
 
 <style lang="scss" scoped>
 	page {
 		background: #F5F5F5;
 	}

 </style>
 
 
 ```