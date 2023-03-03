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
          icon-right="document_scanner"
          text-color="blue-7"
          @click="exportTable"
        >
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
      </q-table>
    </q-card>
    </div>
  </q-page>
</template>

<script>
import { exportFile } from 'quasar'

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val

  formatted =
      formatted === void 0 || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')

  return `"${formatted}"`
}
const columns = [
  {
    name: 'plat_id',
    align: 'left',
    label: 'NO PLAT',
    field: 'plat_id',
    sortable: true
  },
  {
    name: 'name',
    required: true,
    label: 'NAMA INSTANSI',
    align: 'left',
    field: row => row.name,
    sortable: true
  },
  {
    name: 'device_id',
    align: 'left',
    label: 'IMEI GPS',
    field: 'device_id',
    sortable: true
  },
  {
    name: 'device_phone_number',
    align: 'left',
    label: 'NO GPS',
    field: 'device_phone_number',
    sortable: true
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
    createKendaraan () {
      this.$axios.post('', {
        plat_id: this.plat_id,
        name: this.name,
        device_id: this.device_id,
        device_phone_number: this.device_phone_number
      }
        .then((res) => {
        })
      )
    },
    exportTable () {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))]
        .concat(
          this.data.map(row =>
            this.columns
              .map(col =>
                wrapCsvValue(
                  typeof col.field === 'function'
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(',')
          )
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
