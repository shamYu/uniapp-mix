/******************************************************************************
 * Copyright (C) 2019 ShenZhen Powerdata Information Technology Co.,Ltd
 * All Rights Reserved.
 * 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
 * 复制、修改或发布本软件.
 *****************************************************************************/
/**
 * @desc 地图点point经纬度的转换
 * @date 20190220
 * @author 李凤
 */
export const pointTrans = {
	PI: 3.14159265358979324,
	x_pi: 3.14159265358979324 * 3000.0 / 180.0,
	delta: function(lat, lon) {
		// Krasovsky 1940
		//
		// a = 6378245.0, 1/f = 298.3
		// b = a * (1 - f)
		// ee = (a^2 - b^2) / a^2;
		var a = 6378245.0;
		var ee = 0.00669342162296594323;
		var dLat = this.transformLat(lon - 105.0, lat - 35.0);
		var dLon = this.transformLon(lon - 105.0, lat - 35.0);
		var radLat = lat / 180.0 * this.PI;
		var magic = Math.sin(radLat);
		magic = 1 - ee * magic * magic;
		var sqrtMagic = Math.sqrt(magic);
		dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
		dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
		return {
			'lat': dLat,
			'lon': dLon
		};
	},
	//WGS-84 to GCJ-02
	gcj_encrypt: function(wgsLat, wgsLon) {
		if (this.outOfChina(wgsLat, wgsLon))
			return {
				'lat': wgsLat,
				'lon': wgsLon
			};

		var d = this.delta(wgsLat, wgsLon);
		return {
			'lat': wgsLat + d.lat,
			'lon': wgsLon + d.lon
		};
	},
	//GCJ-02 to WGS-84
	gcj_decrypt: function(gcjLat, gcjLon) {
		if (this.outOfChina(gcjLat, gcjLon))
			return {
				'lat': gcjLat,
				'lon': gcjLon
			};

		var d = this.delta(gcjLat, gcjLon);
		return {
			'lat': gcjLat - d.lat,
			'lon': gcjLon - d.lon
		};
	},
	//GCJ-02 to WGS-84 exactly
	gcj_decrypt_exact: function(gcjLat, gcjLon) {
		var initDelta = 0.01;
		var threshold = 0.000000001;
		var dLat = initDelta,
			dLon = initDelta;
		var mLat = gcjLat - dLat,
			mLon = gcjLon - dLon;
		var pLat = gcjLat + dLat,
			pLon = gcjLon + dLon;
		var wgsLat, wgsLon, i = 0;
		while (1) {
			wgsLat = (mLat + pLat) / 2;
			wgsLon = (mLon + pLon) / 2;
			var tmp = this.gcj_encrypt(wgsLat, wgsLon)
			dLat = tmp.lat - gcjLat;
			dLon = tmp.lon - gcjLon;
			if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold))
				break;

			if (dLat > 0) pLat = wgsLat;
			else mLat = wgsLat;
			if (dLon > 0) pLon = wgsLon;
			else mLon = wgsLon;

			if (++i > 10000) break;
		}
		//console.log(i);
		return {
			'lat': wgsLat,
			'lon': wgsLon
		};
	},
	//GCJ-02 to BD-09
	bd_encrypt: function(gcjLat, gcjLon) {
		var x = gcjLon,
			y = gcjLat;
		var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
		var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
		bdLon = z * Math.cos(theta) + 0.0065;
		bdLat = z * Math.sin(theta) + 0.006;
		return {
			'lat': bdLat,
			'lon': bdLon
		};
	},
	//BD-09 to GCJ-02
	bd_decrypt: function(bdLat, bdLon) {
		var x = bdLon - 0.0065,
			y = bdLat - 0.006;
		var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
		var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
		var gcjLon = z * Math.cos(theta);
		var gcjLat = z * Math.sin(theta);
		return {
			'lat': gcjLat,
			'lon': gcjLon
		};
	},
	distance: function(latA, logA, latB, logB) {
		var earthR = 6371000;
		var x = Math.cos(latA * Math.PI / 180) * Math.cos(latB * Math.PI / 180) * Math.cos((logA - logB) * Math.PI / 180);
		var y = Math.sin(latA * Math.PI / 180) * Math.sin(latB * Math.PI / 180);
		var s = x + y;
		if (s > 1)
			s = 1;
		if (s < -1)
			s = -1;
		var alpha = Math.acos(s);
		var distance = alpha * earthR;
		return distance;
	},
	outOfChina: function(lat, lon) {
		if (lon < 72.004 || lon > 137.8347)
			return true;
		if (lat < 0.8293 || lat > 55.8271)
			return true;
		return false;
	},
	transformLat: function(x, y) {
		var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
		ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
		ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
		ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
		return ret;
	},
	transformLon: function(x, y) {
		var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
		ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
		ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
		ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
		return ret;
	}
};
