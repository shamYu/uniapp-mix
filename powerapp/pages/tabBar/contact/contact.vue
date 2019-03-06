<template>
	<view>
		<phone-directory :phones="phones" @paramClick="paramClick"></phone-directory>
	</view>
</template>

<script>
	import phoneDirectory from '@/components/phone-directory/phone-directory.vue'
	export default {
		name: "phones",
		components: {
			phoneDirectory
		},
		data() {
			return {
				// 联系人数据
				phones: {

				}
			}
		},
		mounted() {
			this.$pdAction.showWait("正在加载联系人")
			this.getContacts();
		},
		methods: {
			/* 获取联系人 */
			getContacts() {
				var contacts = this.$pdStorage.get("yhxxArray") || [];
				this.filterContact(contacts);
			},
			/* 处理联系人 */
			filterContact(arr) {
				var contacts = {
					A: [],
					B: [],
					C: [],
					D: [],
					E: [],
					F: [],
					G: [],
					H: [],
					I: [],
					J: [],
					K: [],
					L: [],
					M: [],
					N: [],
					O: [],
					P: [],
					Q: [],
					R: [],
					S: [],
					T: [],
					U: [],
					V: [],
					W: [],
					X: [],
					Y: [],
					Z: [],
					_other: []
				}
				if (arr && arr.length > 0) {
					arr.map((item, index) => {
						let letter = item.PYJX.substring(0, 1).toUpperCase();
						var obj = {
							"id": item.BMBH,
							"spell": item.YHID,
							"name": item.YHMC,
							 "BGDH" : item.BGDH,
							 "BMBH" : item.BMBH,
							 "PYJX" : item.PYJS,
							 "BMMC" :item.BMMC,
							 "SFZG" : item.SFZG,
							 "XB" : item.XB,
							 "YHMC" :item.YHMC,
							 "YHID" :item.YHID,
							 "YHCW" : item.YHCW,
							 "YHSJ" : item.YHSJ,
							 "YHZW" :item.YHZW,
						}
						if(!contacts[letter]){
							contacts[_other].push(obj)
						}
						contacts[letter].push(obj);
					})
				}
				Object.keys(contacts).map((item) => {
					if (contacts[item].length == 0) {
						delete contacts[item];
					}
				})
				this.phones = contacts;
				this.$pdAction.closeWait();
			},
			paramClick(e) {
				uni.navigateTo({
					url:'./contactInfo?option='+JSON.stringify(e)
				})
			}
		}
	}
</script>

<style>

</style>

