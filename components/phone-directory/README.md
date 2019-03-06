#组件使用说明

>示例数据均为静态数据，接口生成如下结构的数据：

---
#### 索引列表
```
    {
         "A": [{
                "id": 56,
                "spell": "aba",
                "name": "阿坝"
		    }]
			......
    }
```

#### 通讯录列表
```
    {
         "A": [{
                "id": 56,
                "spell": "zs",
                "name": "张三",
                "phoneNumber":"13143599999"
		    }]
			......
    }
```

> id spell name 为必须字段  phoneNumber字段如果没有则不返回


---

#### 使用示例 (phones.vue)

```
<template>
	<view>
		<phone-directory :phones="phones" @paramClick="paramClick"></phone-directory>
	</view>
</template>

<script>
	import phoneDirectory from '@/components/phone-directory/phone-directory.vue'
	export default {
		name:"phones",
		components:{
			phoneDirectory
		},
		data() {
			return {
				//示例数据
				phones:{
					"A": [{
						"id": 56,
						"spell": "aba",
						"name": "阿坝"
					}, {
						"id": 57,
						"spell": "akesu",
						"name": "阿克苏"
					}, {
						"id": 58,
						"spell": "alashanmeng",
						"name": "阿拉善盟"
					}, {
						"id": 59,
						"spell": "aletai",
						"name": "阿勒泰"
					}, {
						"id": 60,
						"spell": "ali",
						"name": "阿里"
					}, {
						"id": 61,
						"spell": "ankang",
						"name": "安康"
					}, {
						"id": 62,
						"spell": "anqing",
						"name": "安庆"
					}, {
						"id": 63,
						"spell": "anshan",
						"name": "鞍山"
					}, {
						"id": 64,
						"spell": "anshun",
						"name": "安顺"
					}, {
						"id": 65,
						"spell": "anyang",
						"name": "安阳"
					}, {
						"id": 338,
						"spell": "acheng",
						"name": "阿城"
					}, {
						"id": 339,
						"spell": "anfu",
						"name": "安福"
					}, {
						"id": 340,
						"spell": "anji",
						"name": "安吉"
					}, {
						"id": 341,
						"spell": "anning",
						"name": "安宁"
					}, {
						"id": 342,
						"spell": "anqiu",
						"name": "安丘"
					}, {
						"id": 343,
						"spell": "anxi",
						"name": "安溪"
					}, {
						"id": 344,
						"spell": "anyi",
						"name": "安义"
					}, {
						"id": 345,
						"spell": "anyuan",
						"name": "安远"
					}],
					"B": [{
						"id": 1,
						"spell": "beijing",
						"name": "北京"
					}, {
						"id": 66,
						"spell": "baicheng",
						"name": "白城"
					}, {
						"id": 67,
						"spell": "baise",
						"name": "百色"
					}, {
						"id": 68,
						"spell": "baishan",
						"name": "白山"
                    }]
                    ........
				}
			
			}
		},
		methods : {
			paramClick (e) {
				console.log(e)
			}
		}
	}
</script>

<style>

</style>

```

#### 使用示例 (phone-search.vue)

```
<template>
	<view>
		<phone-search-list :phones="phones" @paramClick="paramClick"></phone-search-list>
	</view>		
</template>

<script>
	
	import phoneSearchList from '@/components/phone-directory/phone-search-list.vue'
	
	export default {
		name:"phone-search",
		components:{
			phoneSearchList
		},
		data() {
			return {
				phones:null,
			}
		},
		onLoad (option) {
			this.phones = JSON.parse(unescape(option.phones))
		},
		methods:{
			paramClick (e) {
				console.log(e)
			}
		}
	}
</script>

<style>
	
</style>


```

#### 引入

>把phone-directory目录拷贝至项目components

>把pages下的phones目录拷贝至项目pages目录下

>在项目pages.json文件写入

(```)
    {
        "path" : "pages/phones/phones",
        "style" : {
            "navigationBarTitleText" : "通讯录",
            "app-plus":{
                "bounce":"none",
                "scrollIndicator":"none"
            }
        }
    },
    {
        "path" : "pages/phones/phone-search",
        "style" : {
            "navigationBarTitleText" : "搜索联系人"
        }
    }
(```)

### 组件参数说明

属性名|类型|是否必填|说明
--|:--:|--:
phones|Object|是|接口数据
paramClick|Object|是|当点击时返回对应参数

>文件名 参数 也可自己定义 搜索框内容可在phone-directory.vue 和phone-search-list.vue  文件修改