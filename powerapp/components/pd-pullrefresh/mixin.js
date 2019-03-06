export const mixin_pullrefresh = {
	data(){
		return {
			list:[]
		}
	},
	methods:{
		setList(data){
			this.list = data;
		}
	}
}