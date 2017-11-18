<template>
  <div class="map-container">
    <el-amap
      :center="center"
      :zoom="zoom"
      :events="events"
      :plugin="plugins"
      :map-manager="mapManager">
      <el-amap-polygon
        v-for="(item, index) in polygons"
        :key="index"
        :path="item.path"
        :fillColor="item.fillColor"
        :strokeColor="item.strokeColor"
        :strokeWeight="item.strokeWeight"
        :fillOpacity="item.fillOpacity">
      </el-amap-polygon>
    </el-amap>

  </div>
</template>

<style>
  .map-container {
    height: 80vh;
    width: 100%;
    position: relative;
  }
</style>

<script>
  import {AMapManager} from 'vue-amap';

  export default {
    data() {
      return {
        mapManager: new AMapManager(),
        zoom: 10,
        center: [116.3863683,39.8800741],
        polygons: [],
        events: {
          'moveend': (e) => {
            console.log(e);
            this.initDust();
          }
        },
        plugins:['Scale', 'OverView', 'ToolBar']
      }
    },
    created() {
      //this.initDust();
    },
    methods: {
      initDust() {
        console.log(this.mapManager);
        this.mapManager.getMap().clearMap();
        if (this.mapManager.getMap().getZoom() < 18) {
          return;
        }

        var bounds = this.mapManager.getMap().getBounds();
        console.log(bounds);
        var southWest = bounds.southwest;
        var northEast = bounds.northeast;

        var basePoint = [Math.round(southWest.lng*1000)/1000, Math.round(southWest.lat*1000)/1000];
        console.log(basePoint);
        for (var i = 0; basePoint[0]+i*0.0001 < northEast.lng; i++) {
          for (var j = 0; basePoint[1]+j*0.0001 < northEast.lat; j++) {
            var polygon = {
              path: [
                [basePoint[0]+i*0.0001, basePoint[1]+j*0.0001],
                [basePoint[0]+i*0.0001, basePoint[1]+(j+1)*0.0001],
                [basePoint[0]+(i+1)*0.0001, basePoint[1]+(j+1)*0.0001],
                [basePoint[0]+(i+1)*0.0001, basePoint[1]+j*0.0001]
              ],
              fillColor: '#2f8bc9',
              strokeColor: '#298fbb',
              strokeWeight: 1,
              fillOpacity: 0.1
            };

            this.polygons.push(polygon);
          }
        }
      }
    }
  }
</script>
