<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
        <q-breadcrumbs>
          <q-breadcrumbs-el label="Home" icon="home" />
          <q-breadcrumbs-el class="text-grey-7" label="Peta" icon="map" />
          <!-- <q-breadcrumbs-el label="Breadcrumbs" /> -->
        </q-breadcrumbs>
    </q-card>
    <div class="col q-ma-md q-mt-lg">
      <q-card>
          <div style="height: fit-content; width: 100%;">
            <l-map
              :zoom="map.zoom"
              :center="map.center"
              :max-zoom="map.maxZoom"
              :min-zoom="map.minZoom"
              :bounds="map.bounds"
              :max-bounds="map.maxBounds"
              style="height: 475px; width: 100%"
              v-if="map.loaded"
            >
              <l-tile-layer
                :url="map.tileLayer"
                :attribution="map.attribution"
              />
              <l-marker
                v-for="(d, i) in maps"
                :key="i"
                :lat-lng="[Number(d.location_latitude), Number(d.location_longitude)]"
              >
                <l-popup>
                  <q-card flat>
                      <q-item>
                        <q-item-section avatar>
                          <q-avatar>
                            <img src="driver.png">
                          </q-avatar>
                        </q-item-section>

                        <q-item-section>
                          <q-item-label>{{ d.names }}</q-item-label>
                          <q-item-label caption class="text-weight-bold">
                            {{ d.plats }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-separator />

                      <q-card-section horizontal>
                        <q-card-section class="fit">
                          <q-icon name="phone" size="20px" color="blue-7" /> . {{ d.phones }}
                          <q-icon name="alt_route" size="20px" color="blue-7" /> . {{ d.trayeks }}
                        </q-card-section>

                        <q-separator vertical />

                        <q-card-section class="fit">
                          <q-icon name="local_shipping" size="20px" color="blue-7" /> . {{ d.types }}
                          <q-icon name="turn_sharp_right" size="20px" color="blue-7" /> . {{ d.kilometerss }} Km
                        </q-card-section>
                      </q-card-section>
                    </q-card>
                </l-popup>
                <l-icon
                  :icon-size="[32, 32]"
                  :icon-anchor="[16, 32]"
                  :popup-anchor="[0, -32]"
                  :icon-url="d.icons"
                />
              </l-marker>
            </l-map>
          </div>
        </q-card>
      </div>
  </q-page>
</template>
<script>
import { LMap, LIcon, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
export default {
  components: {
    LMap,
    LIcon,
    LTileLayer,
    LMarker,
    LPopup
  },
  data () {
    return {
      map: {
        loaded: false,
        tileLayer: 'http://vectormap.pptik.id/styles/klokantech-basic/{z}/{x}/{y}.png',
        attribution: 'contributors <a href="">BLITS Ambulans</a>',
        center: L.latLng([-5.422083333333333, 105.25802]),
        bounds: L.latLngBounds([
          [-5.422083333333333, 105.25802]
        ]),
        maxBounds: L.latLngBounds([
          [40.70081290280357, -74.26963806152345],
          [40.82991732677597, -74.08716201782228]
        ]),
        zoom: 12,
        minZoom: 7,
        maxZoom: 18,
        markerLatLng: [47.313220, -1.319482],
        icons: ''
      },
      maps: [],
      zoom: 2,
      km: 0,
      guid_po: '2bfab8ff-304e-42e9-b200-9fb9140f0432'
    }
  },
  async created () {
    await this.getKendaraan()
    this.map.loaded = true
  },
  methods: {
    async getKendaraan () {
      this.$q.loading.show()
      this.$axios.post('https://api-kopamas-carter.pptik.id:5121/api.v1/vehicles/po-get', {
        guid_po: this.guid_po
      }, {
        headers: {
          'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiNzNhZjk3YjQtNTllZC00MGFmLWJlZTQtOTM4MzhmMzlhNGYzIiwiaWF0IjoxNjY5MTA3MDIyLCJleHAiOjE4MjY3ODcwMjJ9.4x6F8nQyDiMaiARRMOpIV2YkbPrS4iKEEf3Qtm0SjDY'
        }
      }).finally(() => this.$q.loading.hide())
        .then((res) => {
          if (res.data.status === true) {
            res.data.data.forEach((marker) => {
              marker.location_latitude = marker.location.coordinates[1]
              marker.location_longitude = marker.location.coordinates[0]
              marker.names = marker.name
              marker.plats = marker.plat_id
              marker.phones = marker.device_phone_number
              marker.trayeks = marker.trayek
              marker.types = marker.type
              this.km = marker.kilometers / 10000
              marker.kilometerss = Math.round(this.km)
              marker.icons = 'marker_blue.png'
              this.maps.push(marker)
            })
          }
        }).catch(() => this.$commonErrorNotif())
    }
  }
}
</script>
