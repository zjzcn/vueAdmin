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
    height: 81vh;
    width: 100%;
    position: relative;
  }
</style>

<script>
  import {AMapManager} from 'vue-amap';

  export default {
    data() {
      let self = this;
      return {
        mapManager: new AMapManager(),
        zoom: 15,
        center: [116.397428, 39.90923],
        polygons: [],
        events: {
          'complete': (e) => {
            this.initDust();
          }
        },
        plugins:[
          {
            pName: 'DistrictSearch',
            events: {
              init(o) {
                o.setLevel('province');
                o.setExtensions('all');
                o.setSubdistrict(1);
                o.search('北京', (status, result) => {
                  console.log(result);
                  var bounds = result.districtList[0].boundaries;
                  if (bounds) {
                    var path = []
                    for (var i = 0; i < bounds.length; i++) {
                      var points = bounds[i];
                      var path = points.map(point => {
                        return [point.getLng(), point.getLat()];
                      });
                      var polygon = {
                        path: path,
                        fillColor: '#2f8bc9',
                        strokeColor: '#298fbb',
                        strokeWeight: 2,
                        fillOpacity: 0
                      };
                      self.polygons.push(polygon);
                    }
                  }
                });
              }
            }
          }
        ]
      }
    },
    created() {
      //this.initDust();
    },
    methods: {
      initDust() {


      }
    }
  }
</script>
