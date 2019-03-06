### 一、开发环境配置
1.下载开发工具
- HBuilderX：<a href="http://www.dcloud.io/hbuilderx.html">下载地址</a>,下载完后直接安装。
- 微信开发者工具：<a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html">下载地址</a>下载完后直接安装。
- Tortoisegit : 代码管理工具[下载地址](https://tortoisegit.org/download/)。下载直接安装。
- 准备一台手机（安卓或者苹果）,一根与之配套数据线.


2.下载代码。
1. 克隆代码,新建一个文件夹,单击右键Gitclone,输入URL地址：http://gitlab.powerdata.com.cn/platform/platform-module-mixapp.git。
然后点击OK。或者使用密令，如下：
 
  
```
gitclone http://gitlab.powerdata.com.cn/platform/platform-module-mixapp.git
```

2. 使用HBuilderX打开克隆下来的代码.HBuilderX -> 文件 -> 打开目录 ->选中打开。
3. 使用pages.json 文件用来对 app 进行全局配置，决定页面文件的路径、窗口表现、设置多 tab 等。[详情请移步这里](https://uniapp.dcloud.io/collocation/pages)

### 二、目录结构
1. powerapp目录表示是框架相关的东西；【除了store外】
2. 必备调试工具：HBuilderX,微信开发者工具；
3. common目录放公用的css和js文件，目录下：
4. css[公用样式]; js[公用js];
css目录下：app.scss[公用样式]；demo.scss[demo样式]
5. components目录放公用的组件；
6. pages下放页面模块；template.vue为模板页；如：pages目录下
7. login【登录块】；component【组件块】；API【接口块】；tabBar【底部导航关联块】；
8. template【模板块】；user【我的块】
9. static目录放公用图片，static目录下：
common【除开icon图标和tab图标的公用图片】;icon[小图标类似字体图标]；tab[底部的导航图标]，guide[导图图片]
10. demo目录放置框架的demo图片
11. font 目录放置字体图标文件（如.ttf）
12. store目录放置vuex的地方
13. pages.json：用来对 uni-app 进行全局配置，决定页面文件的路径、窗口表现、设置多 tab
14. manifest.json：是应用的配置文件，用于指定应用的名称、图标、权限等。
### 三、运行代码。
1. H5端:直接点击HBuilder上面的运行 -> 运行到浏览器 -> Chrome
2. APP端：手机连接电脑,允许USB调试模式.直接点击HBuilder上面的运行 -> 运行到手机或者模拟器.
3. 小程序端:直接点击运行 ->运行到微信小程序.
4. 发布就是点击HBuilder的发行，会弹出你想要的编译的平台。
### 四、开发
1.pages.json配置页面路由
```
{
    "pages": [
        {
			"path": "powerapp/pages/login/login", //页面的路径
			"style": {
				"navigationBarTitleText": "登录", //页面的导航标题
				"app-plus": {
					"titleNView": false    //隐藏标题，一般自定义标题样式才隐藏
				}
			}
		}, {
			"path": "powerapp/pages/login/guide",
			"style": {
				"navigationStyle": "custom",
				// "enablePullDownRefresh":true, // 下拉刷新页面都要加上
				"app-plus": {
					"titleNView": false
**				}**
			}
		}
    ]
}
```
==数组的第一个就是APP应用打开的第一个页面。==
2. 页面开发模版是使用vue的语法，[还不熟悉vue的请移步vue学习](http://www.runoob.com/vue2/vue-tutorial.html),当然还有部分VUE语法不支持，比如:1. filter不支持。2. 非H5端不支持在 template 内使用 methods 中的函数。3. 不支持纯HTML等等，[具体差异详情请看这里](https://uniapp.dcloud.io/use)
3. 页面开发示例。
    
```
<template>
	<view>
		//templatel里面写静态页面
		{{title}}
	</view>
</template>
<script>
    //script里面编写JS脚本
	export default {
		data() {
			return {
				title: '博安达'
			}
		},
		methods: {
			actionSheetTap() {
			    
			}
		}
	}
</script>
<style>
    //样式编写在这里
</style>

```
4.组件使用示例

```
<template>
	<view>
	<!--kebab-case命名-->
		<pd-uploader :uploadConfig="uploadConfig"></pd-uploader>
	</view>
</template>
<script>
    //首先引入组件
    import pdUploader from '@/powerapp/components/pd-uoloader'  
	export default {
		data() {
			return {
				uploadConfig:{
					APPBH : 'WEBAPP1550564409897061411328',             //必填, 这个好是业务系统编号,，删除的时候必须传过来.
				}
			}
		},
		components:{
		    pdUploader  //注册组件,驼峰命名
		},
		methods: {
			actionSheetTap() {
			    
			}
		}
	}
</script>
```
uni-app内部封装了很多组件，社区有丰富的组件可提供使用,[详情请移步这里](https://uniapp.dcloud.io/component/README)
5. 常用的通用方法调用
```
//数据请求
this.$pdResource.service({
                    data:{
                        service:'MODIFY_PASS',  //接口名称
                        oldpass : oldPass ,   // 参数
                        newpass : newPass     // 参数
                        }
            }).then((res) =>{
					
		},(e) => {
				
		})
//tips
this.$pdAction.alert("SOMETHING WRONG") //弹框
this.$pdAction.toast("SOMETHING BAD") //提示语
this.$pdAction.showWait()  //正在加载

//缓存
this.$pdStorage.set(key,value)  //存
this.$pdStorage.get(key)        // 取
```     


###  五、打包发布
1.云打包:打开HBuilderX --->点击发行---->云打包。
     ==注意：打包过程中很可能会报错，就把manifest的APPID重新获取一下,重新再打一次.==  
2. 然后把打包过后的APK或者ipa文件上传到蒲公英生成二维提供下载即可。




 
    


