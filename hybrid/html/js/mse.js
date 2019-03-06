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
// 
// // #ifdef H5
// import {GdMap} from '@/common/powerapp/map/pd.map';
// // #endif

var mapSearchEmp = {
	map: null,
	searchStr:null,
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
			searchStr: null
		}
	},
	methods:{
		// 搜索
		search(searchStr){
			var _self,_methods;
			if (this.hj_type){
				_self = this;
				_methods = this;
			}else{
				_self = mapSearchEmp;
				_methods = _self.methods;
			}
			AMap.service(["AMap.PlaceSearch"], function() {
				//构造地点查询类
				var placeSearch = new AMap.PlaceSearch({ 
					type: '餐饮服务', // 兴趣点类别
					pageSize: 5, // 单页显示结果条数
					pageIndex: 1, // 页码
					city: "010", // 兴趣点城市
					citylimit: true,  //是否强制限制在设置的城市内搜索
					map: _self.map, // 展现结果的地图实例
					panel: "panel_result", // 结果列表将在此容器中进行展示。
					autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
				});
				placeSearch.searchNearBy(searchStr, [116.405467,39.907761], 200, function(status, result) {
					console.log(JSON.stringify(result))
				});
			});
		}
	}
}
// // #ifdef H5
// export const mapSearchEmp_mixin = mapSearchEmp
// // #endif