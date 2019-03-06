/******************************************************************************
* Copyright (C) 2019 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/
/**
* @desc 日志
* @date 20190124
* @author 李凤
*/
// 高德【h5,app版】
var GdMap = {
	key: '93d15f2caa3f93a8f2289d262b0cfc60',
	// 创建地图
	create(id, {
		resizeEnable = true,
		zoom = 15,
		center = [116.397428, 39.90923]
	} = {}) {
		return new AMap.Map(id, {
			resizeEnable: resizeEnable, //是否监控地图容器尺寸变化
			zoom: zoom, //初始化地图层级
			center: center //初始化地图中心点
		})
	},
	// 销毁地图
	destroy(map) {
		map && map.destroy();
	},
	// 地图加载完成事件
	complete(map, callback) {
		map.on('complete', function() {
			if (callback) {
				callback()
			}
		})
	},
	/**
	 * @desc 创建marker
	 * @param options: marker的设置；custom:true表示marker自定义
	 */
	createMarker:function(options, custom, labelOptions) { // 创建marker
		var set = {
			position: options.position
		}
		if (custom) { // 是否自定义
			set.content = options.content
			set.offset = new AMap.Pixel(options.offset[0], options.offset[1])
		} else {
			set.offset = new AMap.Pixel(options.offset[0], options.offset[1])
			var iconSet = {
				size:new AMap.Size(options.size[0], options.size[1]), // 图标尺寸
				image: options.image
			}
			if(options.imageOffset){
				iconSet.imageOffset=new AMap.Pixel(options.imageOffset[0], options.imageOffset[1])
			}
			if (options.imageSize){
				iconSet.imageSize = new AMap.Size(options.imageSize[0], options.imageSize[1])// 根据所设置的大小拉伸或压缩图片
			}
			set.icon = new AMap.Icon(iconSet);
		}
		var marker = new AMap.Marker(set)
		var label = ''
		if (labelOptions) {
			label = Gd.setLabel(marker, labelOptions)
		}
		return marker
	},
	cluster: null,
	addMarker: function(map, markers, isJuhe, clearMap) { // 添加多个或单个marker，且自适应【添加聚合】
		// 聚合
		if (isJuhe) {
			if (clearMap && this.cluster) {
				this.cluster.clearMarkers(); // 清除所有marker
			}
			this.cluster = new AMap.MarkerClusterer(map, markers, {
				gridSize: 80,
				averageCenter: true
			});
		} else { // 不聚和
			if (clearMap) {
				// 清除地图上所有添加的覆盖物
				map.clearMap();
			}
			map.add(markers);
		}
		map.setFitView(markers); // 自动自适应所有覆盖物
	},
	// marker单击事件
	markerClick: function(marker, callback) {
		marker.on('click', callback);
	},
	// 添加label
	createLabel: function(marker, options) { // 设置label
		var label = marker.setLabel({
			//修改label相对于maker的位置
			offset: options.offset || new AMap.Pixel(0, 0),
			content: options.content
		});
		return label
	},
	/**
	 * @desc 创建信息窗体
	 * @param options: marker的设置；custom:true表示marker自定义
	 */
	createInfoContent:function(options){
		var set = {
			content: options.content,
			anchor: 'bottom-center',
		};
		if(options.offset){
			set.offset=new AMap.Pixel(options.offset[0], options.offset[1])
		}
		if(options.isCustom){//自定义窗体
			set.isCustom = true;
		}
		return new AMap.InfoWindow(set)
	},
	/**
	 * @desc 打开信息窗体
	 * @param InfoWindow,map：地图，options：position地址；content:内容
	 */
	openInfoWindow: function(infoWindow,map,options){
		if(options.content){infoWindow.setContent(options.content)}
		infoWindow.open(map, options.position);
	},
	closeInfoWindow:function(infoWindow){
		 infoWindow.close();
	},
	// 通过单击地图的其他区域关闭infowindow
	closeInfoWindowByClickMap(infoWindow,map){
		map.on('click', function(ev) {
		  // 触发事件的对象
		  var target = ev.target;
		  // 触发事件类型
		  var type = ev.type;
		  GdMap.closeInfoWindow(infoWindow)
		});
	},
	/**
	 * @desc: 定位
	 * @param: options【success:定位成功；error:失败】
	 * set:自定义定位点
	 */
	geolocation(map,options,set){
		AMap.plugin('AMap.Geolocation', function() {
			var geolocation = new AMap.Geolocation({
				enableHighAccuracy: true,//是否使用高精度定位，默认:true
				timeout: 10000,          //超过10秒后停止定位，默认：5s
				buttonPosition:'RB',    //定位按钮的停靠位置【/* LT LB RT RB */】
				buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
				zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
			});
			map.addControl(geolocation);
			geolocation.getCurrentPosition(function(status,data){
				if(status=='complete'){
					console.log( '定位结果：' + data.position+'定位类别：' + data.location_type);
					if(data.accuracy){
						 console.log('精度：' + data.accuracy + ' 米');
					}
					//如为IP精确定位结果则没有精度信息
					console.log('是否经过偏移：' + (data.isConverted ? '是' : '否'))
					options.success(data)
				}else{
					console.log('定位失败'+data.message)
					options.error(data)
				}
			});
		});
	}
}