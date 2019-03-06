export const common_mixin= {
	methods:{
		// 失去焦点或收起软键盘
		common_scrollToTop(top=0,duration=0){
			uni.pageScrollTo({
				scrollTop:top,
				duration:duration
			})
		}
	}
}