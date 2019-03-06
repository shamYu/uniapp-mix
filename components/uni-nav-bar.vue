<template>
	<view class="uni-navbar" :class="{'uni-navbar-fixed':isFixed,'uni-navbar-shadow':hasShadow}" :style="{'background-color':backgroundColor}">
		<uni-status-bar v-if="insertStatusBar"></uni-status-bar>
		<view class="uni-navbar-header" :style="{color:color}">
			<view class="uni-navbar-header-btns" @tap="onClickLeft">
				<view class='left' v-if="leftIcon.length">
					<uni-icon :type="leftIcon" :color="color" size="26"></uni-icon>
				</view>
				<view v-if="leftText.length" class="uni-navbar-btn-text left" :class="{'uni-navbar-btn-icon-left':!leftIcon.length}">{{leftText}}</view>
				<slot name="left"></slot>
			</view>
			<view class="uni-navbar-container">
				<view v-if="title.length" class="uni-navbar-container-title">{{title}}</view>
				<!-- 标题插槽 -->
				<slot></slot>
			</view>
			<view class="uni-navbar-header-btns right" @tap="onClickRight($event)">
				<view v-if="rightText.length" class="lf-text-list lf-list">
					<template v-if="rightTextJudge">
						<text class="lf-text-list-item" :data-id="rightText">{{rightText}}</text>
					</template>
					<template v-if="!rightTextJudge">
						<text class="lf-text-list-item" v-for="(item,txtIndex) in rightText" :key="txtIndex"
						 :data-id="item">{{item}}</text>
					</template>
				</view>
                <view class="lf-icon-list lf-list" v-if="rightIcon.length">
					<template v-if="rightIconJudge">
						<uni-icon class="lf-icon-list-item" :data-id="rightIcon" :type="rightIcon" :color="color" size="24"></uni-icon>
					</template>
					<template v-if="!rightIconJudge">
						<uni-icon class="lf-icon-list-item" v-for="(item,iconIndex) in rightIcon" :key="iconIndex"
						  :data-id="item" :type="item" :color="color" size="26"></uni-icon>
					</template>
                </view>
                <slot name="right"></slot>
            </view>
		</view>
	</view>
</template>

<script>
    import uniStatusBar from './uni-status-bar.vue'
    import uniIcon from './uni-icon.vue'

    export default {
        components: {
            uniStatusBar,
            uniIcon
        },
        props: {
			noRight:{
				type: Boolean,
				default:true
			},
            /**
             * 标题文字
             */
            title: {
                type: String,
                default: ''
            },
            /**
             * 左侧按钮文本
             */
            leftText: {
                type: [String,Array],
                default: ''
            },
            /**
             * 右侧按钮文本
             */
            rightText: {
                type: [String,Array],
                default: ''
            },
            /**
             * 左侧按钮图标
             */
            leftIcon: {
                type: String,
                default: 'return'
            },
            /**
             * 右侧按钮图标
             */
            rightIcon: {
                type: [String,Array],
                default: ''
            },
            /**
             * 是否固定在顶部
             */
            fixed: {
                type: [Boolean, String],
                default: false
            },
            /**
             * 按钮图标和文字颜色
             */
            color: {
                type: String,
                default: '#fff'
            },
            /**
             * 背景颜色
             */
            backgroundColor: {
                type: String,
                default: '#17bdcc'
            },
            /**
             * 是否包含状态栏，默认固定在顶部时包含
             */
            statusBar: {
                type: [Boolean, String],
                default: true
            },
            /**
             * 是否使用阴影，默认根据背景色判断
             */
            shadow: {
                type: String,
                default: ''
            }
        },
        computed: {
			rightTextJudge(){
				return (typeof this.rightText === 'string')
			},
			rightIconJudge(){
				return (typeof this.rightIcon === 'string')
			},
            isFixed() {
                return String(this.fixed) === 'true'
            },
            insertStatusBar() {
                switch (String(this.statusBar)) {
                    case 'true':
                        return true
                    case 'false':
                        return false
                    default:
                        return this.isFixed
                }
            },
            hasShadow() {
                var backgroundColor = this.backgroundColor
                switch (String(this.shadow)) {
                    case 'true':
                        return true
                    case 'false':
                        return false
                    default:
                        return backgroundColor !== 'transparent' && backgroundColor.indexOf('rgba') < 0
                }
            }
        },
        methods: {
            /**
             * 左侧按钮点击事件
             */
            onClickLeft() {
                this.$emit('clickLeft')
                this.$emit('click-left')
            },
            /**
             * 右侧按钮点击事件
             */
            onClickRight(e) {
				console.log(e)
				let dataset = e.target.dataset;
				console.log(dataset)
                this.$emit('clickRight',dataset.id)
                this.$emit('click-right',dataset.id)
            }
        }
    }
</script>

<style lang="scss">
	@import '../common/powerapp/css/_var.scss';
    .uni-navbar {
        display: block;
        position: relative;
        width: 100%;
        background-color: #FFFFFF;
        overflow: hidden;
    }
// 	.pos-nav,.pos-nav .status,.pos-nav .content{
// 		width:100%;
// 		height:auto;
// 		display:block;
// 		background: transparent;
// 		line-height: 1;
// 	}
// 	.pos-nav .status{
// 		height:var(--status-bar-height);
// 	}
// 	.pos-nav .content{
// 		height:$nav-bar-height;
// 	}
	.uni-navbar view{
		line-height:$nav-bar-height;
	}

    .uni-navbar-shadow {
        box-shadow: 0 1upx 6upx #ccc;
    }
	.uni-navbar.uni-navbar-fixed{
		position: fixed;
		z-index: 998;
		top:0;
	}
    .uni-navbar-header {
        display: flex;
        flex-direction: row;
        width: 100%;
        height:$nav-bar-height;
        line-height:$nav-bar-height;
        font-size: 30upx;
    }
	
	.uni-navbar-header .uni-navbar-header-btns{
		display:inline-flex;
		flex-wrap:nowrap;
		flex-shrink:0;
		justify-content: center;
		padding:0;
		padding-left:10upx;
		padding-right:10upx;
	}
	
	.uni-navbar-header .uni-navbar-header-btns:first-child{
		
	}
	.uni-navbar-header .uni-navbar-header-btns:last-child{
	}
	.uni-navbar-container{
		flex:1;
		margin:0;
		display:flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.uni-navbar-container-title{
		font-size:30upx;
		text-align:center;
		// padding-right: 60upx;
	}
	
	.nav_custom{
		background-color: $pd-color-primary !important;
	}
	.uni-navbar-header .uni-navbar-header-btns:last-child{
		color: #fff;
		text-align: center;
		font-size: 30upx;
	} 
	.uni-navbar-container-title{
		color:#fff;
		font-size: 30upx;
	}
	.uni-navbar-btn-text{
		&.left{
			padding-left:12upx;
		}
		&.right{
			padding-right:12upx;
		}
		&.left,&.right{
			color: #fff;
			font-size: 30upx;
		}
	}
	.left .iconfont{
		color:#fff !important;
		font-size: 48upx!important;
	}
	.lf-text-list{
		font-size:30upx;
		padding-right:10upx;
	}
	.lf-icon-list,.lf-text-list{
		display:flex;
		flex-direction: row;
	}
	.lf-text-list-item+.lf-icon-list-item{
		
		}
	.lf-icon-list-item:nth-child(n+2){
		margin-left:4upx;
	}
	.lf-text-list-item:nth-child(n+2){
		margin-left:10upx;
	}
</style>
