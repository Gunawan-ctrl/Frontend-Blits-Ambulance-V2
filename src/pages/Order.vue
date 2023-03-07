<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el class="text-grey-7" label="Pesanan masuk" icon="perm_phone_msg" />
      </q-breadcrumbs>
    </q-card>
    <div class="col q-col-gutter-md q-ma-md q-mt-lg">
      <q-card>
        <q-table
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
                Pesanan Masuk
              </div>
              <p class="text-caption">
                Daftar pesanan masuk pelanggan pada saat ini
              </p>
            </div>

            <q-space />

            <q-btn @click="exportdata=true" dense flat text-color="blue-7" icon="document_scanner" class="q-mr-md">
              <q-tooltip>
                Export Data
              </q-tooltip>
            </q-btn>

            <!-- <q-btn
              flat
              icon-right="document_scanner"
              text-color="blue-7"
              @click="exportTable"
            >
              <q-tooltip>
                Export Data
              </q-tooltip>
            </q-btn> -->

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
            <q-tr class="text-uppercase" :props="props" v-if="props.row.status_pesanan === 0">
              <q-td key="kode_pesanan">
                {{ props.row.kode_pesanan }}
              </q-td>
              <q-td key="fullname" :props="props">
                {{ props.row.data_user.fullname }}
              </q-td>
              <q-td class="text-bold" key="no_telpon" :props="props">
                <a target="_blank" style="text-decoration: none;" :href="'https://api.whatsapp.com/send?phone=' + this.phoneData">
                  {{ props.row.data_user.no_telpon }}
                  <q-tooltip>CHAT WHATSAPP</q-tooltip>
                </a>
              </q-td>
              <q-td class="text-bold" key="titik_jemput" :props="props">
                <a target="_blank" style="text-decoration: none;" :href="'https://www.google.com/maps/?q=' + props.row.titik_jemput_lat + ',' + props.row.titik_jemput_long">
                  {{ props.row.titik_jemput.substring(0,10)+"..." }}
                </a>
              </q-td>
              <q-td class="text-bold" key="tujuan" :props="props">
                <a target="_blank" style="text-decoration: none;" :href="'https://www.google.com/maps/?q=' + props.row.tujuan_lat + ',' + props.row.tujuan_long">
                  {{ props.row.tujuan.substring(0,10)+"..." }}
                </a>
              </q-td>
              <q-td key="created_at" :props="props">
                {{ new Date (props.row.created_at).toLocaleDateString('id', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) }}
              </q-td>
              <q-td key="status_pesanan" :props="props">
                <q-badge :color="(props.row.status_pesanan === 0) ? 'orange-7' :(props.row.status_pesanan === 1) ? 'blue-7' : 'green-7'">
                  {{`${ (props.row.status_pesanan === 0) ? 'MENUNGGU' :(props.row.status_pesanan === 1) ? 'PROSES' : 'SELESAI' }`}}
                </q-badge>
              </q-td>
              <q-td key="aksi" :props="props">
                <div class="justify-center q-gutter-x-xs">
                  <q-btn
                    color="blue-7"
                    size="sm"
                    flat
                    @click="Drivers (props.row.guid)"
                    dense>
                    <div>PILIH DRIVER</div>
                  </q-btn>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card>
    </div>

    <q-dialog v-model="exportdata">
      <q-card class="my-card" flat bordered style="width: 600px; max-width: 60vw;">
        <q-item>
          <q-item-section avatar>
              <q-icon name="document_scanner" size="30px" color="blue-7" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Data Export</q-item-label>
            <q-item-label caption>
              Export data ke format excel
            </q-item-label>
          </q-item-section>

          <q-item-section class="col-1">
            <q-btn flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-form
          @submit="exportData(dataUser.user.guid)">
          <q-card-section horizontal>
            <q-card-section class="q-gutter-md fit">
              <q-input type="date" dense outlined v-model="range_start" hint="Dari tanggal"/>
            </q-card-section>
            <q-separator vertical />
            <q-card-section class="q-gutter-md fit">
              <q-input type="date" dense outlined v-model="range_end" hint="Sampai tanggal"/>
            </q-card-section>
          </q-card-section>
          <q-separator />
          <q-card-actions>
            <q-btn type="submit" flat color="primary">
              Export
            </q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { exportFile } from 'quasar'
import createToken from 'src/boot/create_token'

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val

  formatted =
      formatted === void 0 || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')

  return `"${formatted}"`
}

const columns = [
  { name: 'kode_pesanan', align: 'left', label: 'KODE', field: 'kode_pesanan', sortable: true },
  { name: 'fullname', align: 'left', label: 'NAMA PEMESAN', field: 'fullname', sortable: true },
  { name: 'no_telpon', align: 'left', label: 'NO. HANDPHONE', field: 'no_telpon', sortable: true },
  { name: 'titik_jemput', align: 'left', label: 'JEMPUT', field: 'titik_jemput', sortable: true },
  { name: 'tujuan', required: true, label: 'TUJUAN', align: 'left', field: row => row.tujuan, sortable: true },
  { name: 'created_at', align: 'left', label: 'TGL. PEMESANAN', field: 'created_at', sortable: true },
  { name: 'status_pesanan', align: 'left', label: 'STATUS', field: 'status_pesanan', sortable: true },
  { name: 'aksi', align: 'center', label: '', field: 'aksi', sortable: true }
]

const data = []

export default {
  data () {
    return {
      visibles: false,
      columns,
      data,
      phonex: '',
      kodePesanan: '',
      no_telpon: '',
      phoneData: '',
      drivers: '',
      guid: '',
      filter: '',
      mode: 'list',
      pagination: {
        rowsPerPage: 50
      },
      exportdata: false,
      range_start: null,
      range_end: null
    }
  },
  created () {
    this.getPesanan()
  },
  methods: {
    getPesanan () {
      this.$q.loading.show()
      this.$axios.get('pesanan/get-pesanan', createToken())
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          this.data = res.data.data
          res.data.data.forEach((phonex) => {
            this.kodePesanan = phonex.kode_pesanan
            phonex.phones = phonex.data_user.no_telpon
            this.phoneData = phonex.phones.replace('0', '62')
            phonex.statuss = phonex.status_pesanan
          })
        }).catch(() => this.$commonErrorNotif())
    },
    Drivers (guid) {
      this.$router.push('/pilih-drivers/' + guid)
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

      const status = exportFile('pesanan-masuk.csv', content, 'text/csv')

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
</style>
