<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el class="text-grey-7" label="Ambulans" icon="local_shipping" />
      </q-breadcrumbs>
    </q-card>
    <div class="col q-col-gutter-md q-ma-md q-mt-lg">
      <q-card>
      <q-table
        title="Data ambulans"
        :rows="data"
        class="text-grey-7"
        :hide-header="mode === 'grid'"
        :columns="columns"
        row-key="name"
        :grid="mode=='grid'"
        :filter="filter"
        :pagination="pagination"
      >
      <template v-slot:top>
        <div class="col">
          <div class="col-2 q-table__title">
            Data Ambulans
          </div>
          <p class="text-caption">
            Daftar ambulance yang beroperasi pada saat ini
          </p>
        </div>

        <q-space />

        <q-btn
          flat
          unelevated
          icon="document_scanner"
          text-color="blue-7"
          @click="exportToCSV()">
          <q-tooltip>
            Export Data
          </q-tooltip>
        </q-btn>

        <q-btn
          flat
          color="primary"
          icon="search"
          @click="visibles = !visibles"
          size="md"
          class="q-mr-sm"
        />
        <q-slide-transition>
          <div v-show="visibles">
            <q-input
              outlined
              debounce="300"
              placeholder="Pencarian"
              style="width: 200px"
              color="primary"
              v-model="filter"
              dense
            />
          </div>
        </q-slide-transition>
      </template>
      <template v-slot:body="props">
        <q-tr class="text-uppercase" :props="props">
          <q-td key="plat_id" :props="props">
            {{ props.row.plat_id }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td class="text-bold" key="device_id" :props="props">
            {{ props.row.device_id }}
          </q-td>
          <q-td class="text-bold" key="device_phone_number" :props="props">
            {{ props.row.device_phone_number }}
          </q-td>
          <q-td class="text-bold" key="status" :props="props">
            <q-badge color="green">
              <q-icon name="verified" size="14px" class="q-mr-xs"/> Verified</q-badge>
          </q-td>
        </q-tr>
      </template>
      </q-table>
    </q-card>
    </div>
  </q-page>
</template>

<script>
import { exportFile } from 'quasar'

const columns = [
  {
    name: 'plat_id',
    align: 'left',
    label: 'NO PLAT',
    field: 'plat_id'
  },
  {
    name: 'name',
    required: true,
    label: 'NAMA INSTANSI',
    align: 'left',
    field: row => row.name
  },
  {
    name: 'device_id',
    align: 'left',
    label: 'IMEI GPS',
    field: 'device_id'
  },
  {
    name: 'device_phone_number',
    align: 'left',
    label: 'NO GPS',
    field: 'device_phone_number'
  }
]

const data = []

export default {
  data () {
    return {
      visibles: false,
      loading: false,
      plat_id: '',
      name: '',
      device_id: '',
      device_phone_number: '',
      columns,
      data,
      filter: '',
      guid_po: '2bfab8ff-304e-42e9-b200-9fb9140f0432',
      customer: {},
      new_customer: false,
      mode: 'list',
      pagination: {
        rowsPerPage: 10
      }
    }
  },
  created () {
    this.getKendaraan()
  },
  methods: {
    getKendaraan () {
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
            this.data = res.data.data
          } else {
            this.$q.notify({
              color: 'negative',
              message: 'data tidak dapat dimuat'
            })
          }
        }).catch(() => this.$commonErrorNotif())
    },
    exportToCSV () {
      const content = ['No Plat; Nama Instansi; Imei GPS; No GPS;']
        .concat(
          this.data.map((row) => {
            return `${row.plat_id};${row.name};${row.device_id};${row.device_phone_number};`
          })
        )
        .join('\r\n')
      const status = exportFile('daftar-ambulans.csv', content, 'text/csv')
      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    }
  }

}
</script>
<style>
  .q-chip__content {
    display: block;
    text-align: center;
  }
</style>
