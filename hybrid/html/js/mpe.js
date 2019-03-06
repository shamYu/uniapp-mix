/******************************************************************************
 * Copyright (C) 2019 ShenZhen Powerdata Information Technology Co.,Ltd
 * All Rights Reserved.
 * 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
 * 复制、修改或发布本软件.
 *****************************************************************************/
/**
 * @desc 地图
 * @date 20190220
 * @author 李凤
 */

/**
 * 高德【h5,app版】
 * map.getCenter(); //获取当前地图中心点
 * map.setCenter([lng, lat]); // 设置中心点
 * map.setZoomAndCenter(zoom, [lng, lat]); //同时设置地图层级与中心点
 * 平移：map.panTo([116.405467, 39.907761]);
 * 自适应显示多个标记: map.setFitView()
 */

// // #ifdef H5
// import {GdMap} from '@/common/powerapp/map/pd.map';
// import imgSrc1 from '@/static/powerapp/index/map/business_wry.png';
// import imgSrc2 from '@/static/powerapp/index/map/business_tr.png';
// // #endif

var mapPointEmp = {
	map: null,
	infoWindow:null,
	mounted(){
		this.map = GdMap.create('map_container',{
			zoom: 17,
			center: [121.5273285, 31.21515044]
		});
	},
	data(){
		return {
			hj_type:true, // 环境true表示为.vue环境下
			map: null,
			infoWindow: null
		}
	},
	methods:{
		// app 时，html页面调用
		renderMapByData(type){
			var _self,_methods;
			if (this.hj_type){
				_self = this;
				_methods = this;
			}else{
				_self = mapPointEmp;
				_methods = _self.methods;
			}
			var d_arr = JSON.parse(plus.storage.getItem(type));
			var t = type=='wry'?1:2;
			_methods.renderMarker(d_arr,t)
		},
		// 渲染添加marker
		renderMarker: function(data,type) {
			var _self,_methods,imgSrc;
			if (this.hj_type){
				_self = this;
				_methods = this;
				imgSrc = type==1?imgSrc1:imgSrc2;
			}else{
				_self = mapPointEmp;
				_methods = _self.methods;
				imgSrc = type==1?'../image/index/business_wry.png':'../image/index/business_tr.png';
			}
			var	markers = []
			//创建窗体
			_self.infoWindow = GdMap.createInfoContent({
				offset: [0,-8],
				content:'',
				isCustom:true
			});
			// 单击地图关闭infowindow
			GdMap.closeInfoWindowByClickMap(_self.infoWindow,_self.map)
			for(var i = 0; i < data.length; i++) {
				var item = data[i];
				var marker = GdMap.createMarker({
					position: [ item.point.longitude,item.point.latitude],
					offset: [-12,-12],
					size:[24,24], // 图标尺寸
					imageSize:[24,24],
					image:imgSrc
				}, false)
				marker.data = data[i]
				GdMap.markerClick(marker, function(e){
					console.log('点击marker数据：'+JSON.stringify(e.target.data) )
					_methods.openInfo(e.target.data)
					event.stopPropagation()

				})
				markers.push(marker)
			}
			GdMap.addMarker(_self.map, markers,false,true)
		},
		// 创建自定义窗体信息弹窗
		createInfoHtml:function(item){
			var _self,_methods;
			if (this.hj_type == 'h5'){// 取vue语法下的数据
				_self = this;
				_methods = this;
			}else{
				_self = mapPointEmp;
				_methods = _self.methods;
			}
			var div = document.createElement("div");
			div.className = 'custom-info-win';
			// div.setAttribute('data-item',JSON.stringify(item));
			div.onclick = function(){
				_methods.infoItemClink(item);
			};
			div.innerHTML = item.name;
			return div
		},
		openInfo(item){
			var _self,_methods;
			if (this.hj_type){//
				_self = this;
				_methods = this;
			}else{
				_self = mapPointEmp;
				_methods = _self.methods;
			}
			GdMap.openInfoWindow(_self.infoWindow,_self.map,{
				position:[item.point.longitude,item.point.latitude],
				content: _methods.createInfoHtml(item)
			});
		},
		infoItemClink(item){
			console.log('详情数据')
			console.log(item)
			var _self,_methods;
			if (this.hj_type){
				_self = this;
				_methods = this;
				_methods.toDetail(item); // 直接调用.vue中的toDetail方法
			}else{
				_self = mapPointEmp;
				_methods = _self.methods;
				pdHtml.alert(JSON.stringify(item));
			}
		},
		// 定位
		dw(){
			var _self,_methods;
			if (this.hj_type){ // vue条件下
				_self = this;
				_methods = this;
				GdMap.geolocation(_self.map,{
					success:function(data){
						
					},
					error:function(data){
						
					}
				});
			}else{
				_self = mapPointEmp;
				_methods = _self.methods;
				GdMap.geolocation(_self.map,{
					success:function(data){
						
					},
					error:function(data){
						
					}
				});
			}
		}
	}
}
// // #ifdef H5
// export const mapPointEmp_mixin = mapPointEmp
// // #endif