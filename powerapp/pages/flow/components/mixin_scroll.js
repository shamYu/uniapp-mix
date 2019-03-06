export const mixin_scroll = {
	data(){
		return {
			is_overflow_hidden:false
		}
	},
	methods:{
		stopScroll(isScroll){
			this.is_overflow_hidden = isScroll;
		}
	}
}