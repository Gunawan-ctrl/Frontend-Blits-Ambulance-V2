<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el class="text-grey-7" label="Jenis Pesanan" icon="list_alt" />
      </q-breadcrumbs>
    </q-card>

    <div class="col q-col-gutter-md q-ma-md">
      <q-card>
        <q-table
          :rows="data"
          :hide-header="mode === 'grid'"
          :columns="columns"
          row-key="name"
          class="text-grey-7"
          :grid="mode=='grid'"
          :filter="filter"
          :pagination="pagination">
          <template v-slot:top>
            <div class="col">
              <div class="col-2 q-table__title">
                Data Jenis Pesanan
              </div>
              <p class="text-caption">
                Daftar semua jenis pesanan ambulans pada saat ini
              </p>
            </div>

            <q-space />

            <q-btn @click="new_paramedis=true" flat icon="library_add" text-color="blue-7">
              <q-tooltip>
                Tambah Data
              </q-tooltip>
            </q-btn>

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
            <q-tr :props="props">
              <q-td key="created_at" :props="props">
                {{ $parseDate(props.row.created_at).fullDate }}
              </q-td>
              <q-td key="jenisPesanan" :props="props">
                {{ props.row.jenisPesanan }}
              </q-td>
              <q-td key="status" :props="props">
                {{ props.row.status }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card>
    </div>

    <q-dialog v-model="new_paramedis">
      <q-card class="my-card" flat bordered style="width: 600px; max-width: 60vw;">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <q-icon name="list_alt" size="40px" color="blue-7" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Data Jenis Pesanan</q-item-label>
            <q-item-label caption>
              Tambah data jenis pesanan ambulans
            </q-item-label>
          </q-item-section>

          <q-item-section class="col-1">
            <q-btn flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-form @submit="InputParamedis()">

          <q-card-section horizontal>
            <q-card-section class="q-gutter-xs fit">
              <q-select
                class="text-capitalize"
                dense
                outlined
                v-model="jenisPesanan"
                :options="optionJenisPesanan"
                label="Jenis Pesanan"
                :rules="[ val => val && val.length > 0 || 'data jenis pesanan tidak boleh kosong']"
              />
            </q-card-section>

            <q-separator vertical />

            <q-card-section class="q-gutter-xs fit">
              <q-select
                dense outlined
                v-model="status"
                :options="optionStatus"
                label="Status"
                :rules="[ val => val !== null || 'Status tidak boleh kosong']"
              />
            </q-card-section>
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn type="submit" flat class="text-weight-bold" label="Simpan" color="primary"/>
          </q-card-actions>

        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { exportFile } from 'quasar'
import createToken from 'src/boot/create_token'

const columns = [
  {
    name: 'tanggal',
    label: 'TANGGAL',
    field: 'tanggal',
    align: 'left'
  },
  {
    name: 'jenisPesanan',
    label: 'JENIS PESANAN',
    field: 'jenisPesanan',
    align: 'left'
  },
  {
    name: 'status',
    label: 'STATUS',
    field: 'status',
    align: 'left'
  }
]
const data = []

export default {
  data () {
    return {
      columns,
      visibles: false,
      loading: false,
      instansi: null,
      instansi_code: null,
      app_code: null,
      nama_paramedis: null,
      alamat: null,
      no_telpon: null,
      created_at: null,
      jenisPesanan: null,
      optionJenisPesanan: ['Kecelakaan', 'Melahirkan', 'Sakit', 'Meninggal'],
      status: null,
      optionStatus: ['Gawat Darurat', 'Sedang', 'Sangat Darurat'],
      data,
      filter: '',
      customer: {},
      new_paramedis: false,
      mode: 'list',
      pagination: {
        rowsPerPage: 10
      },
      startDate: null,
      endDate: null
    }
  },
  created () {
    this.getData()
  },
  methods: {
    InputParamedis () {
      const params = {
        nama_paramedis: this.nama_paramedis,
        email: this.email,
        no_telpon: this.no_telpon,
        alamat: this.alamat,
        status_paramedis: this.status.value,
        instansi_code: this.instansi_code,
        app_code: this.app_code
      }
      this.$axios.post('users/registrasiParamedis', {
        ...params
      }, createToken()).then((res) => {
        if (res.data.status === true) {
          this.$q.notify({
            color: 'green',
            message: res.data.message
          })
          this.new_paramedis = false
          this.getParamedis()
        } else {
          this.$q.notify({
            type: 'error',
            color: 'red',
            message: res.data.message
          })
        }
      }).catch((err) => {
        if (err.response) {
          this.$errorNotif(err.response.data.message)
        } else {
          this.$errorServer()
        }
      })
    },
    getData () {
      this.$axios.get('paramedis/getparamedisbydate/', {
        params: {
          startDate: this.startDate,
          endDate: this.endDate
        },
        headers: createToken().headers
      })
        .then((res) => {
          if (res.data.status) {
            this.data = res.data.data
          }
        })
    },
    lihat () {},
    exportToCSV () {
      const content = ['Nama Paramedis; Email; No Telpon; Alamat']
        .concat(
          this.data.map((row) => {
            return `${row.nama_paramedis};${
              row.email
            };${row.no_telpon};${row.alamat}`
          })
        )
        .join('\r\n')
      const status = exportFile('daftar paramedis.csv', content, 'text/csv')
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
