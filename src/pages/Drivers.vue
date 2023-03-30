<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el class="text-grey-7" label="Pengemudi" icon="supervised_user_circle" />
      </q-breadcrumbs>
    </q-card>
    <q-card class="q-px-md q-mx-md">
      <q-form @submit="lihat()">
        <q-card-section>
          <div class="row q-col-gutter-lg">
            <div class="col-md-6 col-sm-6 col-xs-12">
              <q-input
                type="date"
                hint="Tanggal Mulai"
                v-model="startDate"
                mask="date"
                outlined
                dense
              >
              </q-input>
            </div>
            <div class="col-md-6 col-sm-6 col-xs-12">
              <q-input
                type="date"
                hint="Tanggal Selesai"
                v-model="endDate"
                mask="date"
                outlined
                dense
              >
              </q-input>
            </div>
            <div>
              <q-btn size="md" outline class="full-width" color="blue-7" icon="visibility" @click="lihat" label="lihat data" />
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>

    <div class="col q-col-gutter-md q-ma-md">
      <q-card>
        <q-table
          :rows="data"
          :hide-header="mode === 'grid'"
          :columns="columns"
          row-key="no_plat"
          class="text-grey-7"
          :grid="mode=='grid'"
          :filter="filter"
          :pagination="pagination">
          <template v-slot:top>
            <div class="col">
              <div class="col-2 q-table__title">
                Data Drivers
              </div>
              <p class="text-caption">
                Daftar semua drivers ambulans pada saat ini
              </p>
            </div>

            <q-space />

            <q-btn @click="new_driver=true" flat icon="library_add" text-color="blue-7">
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
              <q-td key="tanggal" :props="props">
                {{ $parseDate(props.row.created_at).fullDate }}
              </q-td>
              <q-td key="nama_driver" :props="props">
                {{ props.row.nama_driver }}
              </q-td>
              <q-td key="email" :props="props">
                {{ props.row.data_user.email }}
              </q-td>
              <q-td key="no_telpon" :props="props">
                {{ props.row.no_telpon }}
              </q-td>
              <q-td key="no_plat" :props="props">
                {{ props.row.no_plat }}
              </q-td>
              <q-td key="alamat" :props="props">
                {{ props.row.alamat }}
              </q-td>
              <q-td key="instansi_code" :props="props">
                {{ props.row.data_user.instansi_code }}
              </q-td>
              <q-td key="app_code" :props="props">
                {{ props.row.data_user.app_code }}
              </q-td>
              <q-td key="status_driver" :props="props">
                <q-badge
                :color="(props.row.status_driver === 0) ?'green'
                :(props.row.status_driver === 1 ?'red':'red')"
                text-color="white"
                dense
                class="text-weight-bold"
                square>
                {{ props.row.status_driver === 0 ? 'AKTIF' : 'TIDAK AKTIF' }}
              </q-badge>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card>
    </div>

    <q-dialog v-model="new_driver">
      <q-card class="my-card" flat bordered style="width: 600px; max-width: 60vw;">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <q-icon name="supervised_user_circle" size="40px" color="blue-7" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Data Pengemudi</q-item-label>
            <q-item-label caption>
              Tambah data pengemudi ambulans
            </q-item-label>
          </q-item-section>

          <q-item-section class="col-1">
            <q-btn flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-form @submit="InputDriver()">

          <q-card-section horizontal>
            <q-card-section class="q-gutter-xs fit">
              <q-input class="text-capitalize" dense outlined v-model="nama_driver" label="Nama Driver" :rules="[ val => val && val.length > 0 || 'Nama driver tidak boleh kosong']"/>
              <q-input dense outlined v-model="no_telpon" label="No Telpon" :rules="[ val => val && val.length > 0 || 'No telpon tidak boleh kosong']" mask="#############"/>
              <q-select
                dense outlined
                key="value"
                v-model="status"
                option-label="label"
                :options="optionStatus"
                label="Status"
                :rules="[ val => val !== null || 'Status tidak boleh kosong']"
              />
              <q-input type="number" dense outlined v-model="instansi_code" label="Instansi Code" :rules="[ val => val && val.length > 0 || 'Instansi code tidak boleh kosong']" />
            </q-card-section>

            <q-separator vertical />

            <q-card-section class="q-gutter-xs fit">
              <q-select
                dense
                width="fit-content"
                outlined
                key="plat_id"
                v-model="no_plat"
                option-label="plat_id"
                :options="listPlat"
                label="No Plat"
                :rules="[ val => val !== null || 'No plat tidak boleh kosong']"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label caption>{{ scope.opt.plat_id }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-input type="mail" dense outlined v-model="email" label="Email" :rules="[ val => val && val.length > 0 || 'Email tidak boleh kosong']"/>
              <q-input class="text-capitalize" dense outlined v-model="alamat" label="Alamat" :rules="[ val => val && val.length > 0 || 'Alamat tidak boleh kosong']"/>
              <q-input type="number" class="text-capitalize" dense outlined v-model="app_code" label="App Code" :rules="[ val => val && val.length > 0 || 'App code tidak boleh kosong']"/>
            </q-card-section>
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn type="submit" label="Simpan" color="primary"/>
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
    name: 'nama_driver',
    label: 'NAMA PENGEMUDI',
    field: 'nama_driver',
    align: 'left'
  },
  {
    name: 'email',
    class: 'text-capitalized',
    label: 'EMAIL',
    field: row => row.data_user.email,
    align: 'left'
  },
  {
    name: 'no_telpon',
    required: true,
    label: 'NO TELPON',
    field: row => row.no_telpon,
    align: 'left'
  },
  {
    name: 'no_plat',
    required: true,
    label: 'NO PLAT',
    field: row => row.no_plat,
    align: 'left'
  },
  {
    name: 'alamat',
    label: 'ALAMAT',
    field: 'alamat',
    align: 'left'
  },
  {
    name: 'instansi_code',
    label: 'INSTANSI KODE',
    field: row => row.data_user.instansi_code,
    align: 'left'
  },
  {
    name: 'app_code',
    label: 'APP KODE',
    field: row => row.data_user.app_code,
    align: 'left'
  },
  {
    name: 'status_driver',
    label: 'STATUS DRIVER',
    field: 'status_driver',
    align: 'center'
  }
]
const data = []

export default {
  data () {
    return {
      visibles: false,
      loading: false,
      instansi: null,
      instansi_code: null,
      app_code: null,
      listPlat: [],
      no_plat: null,
      guid_po: '2bfab8ff-304e-42e9-b200-9fb9140f0432',
      headers: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiNzNhZjk3YjQtNTllZC00MGFmLWJlZTQtOTM4MzhmMzlhNGYzIiwiaWF0IjoxNjY5MTA3MDIyLCJleHAiOjE4MjY3ODcwMjJ9.4x6F8nQyDiMaiARRMOpIV2YkbPrS4iKEEf3Qtm0SjDY',
      nama_driver: null,
      alamat: null,
      columns,
      no_telpon: null,
      created_at: null,
      email: null,
      status: null,
      optionStatus: [
        {
          label: 'Aktif',
          value: 0
        },
        {
          label: 'Tidak Aktif',
          value: 3
        }
      ],
      data,
      filter: '',
      customer: {},
      new_driver: false,
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
    this.getKendaraan()
  },
  methods: {
    getData () {
      this.onRequest({
        pagination: this.pagination,
        filter: this.nama
      })
    },
    exportToCSV () {
      const content = ['Nama Pengemudi; Email; No Telpon; No Plat; Alamat']
        .concat(
          this.data.map((row) => {
            return `${row.nama_driver};${
              row.data_user.email
            };${row.no_telpon};${row.no_plat};${row.alamat}`
          })
        )
        .join('\r\n')
      const status = exportFile('daftar pengemudi.csv', content, 'text/csv')
      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    onRequest () {
      this.lihat()
    },
    lihat () {
      // this.$q.loading.show()
      this.$axios.get('drivers/getdriverbydate/', {
        params: {
          startDate: this.startDate,
          endDate: this.endDate
        },
        headers: createToken().headers
      })
        // .finally(() => this.$q.loading.hide())
        .then((res) => {
          console.log(res)
          if (res.data.status) {
            this.data = res.data.data
          }
        })
    },
    getKendaraan () {
      this.$axios.post('https://api-kopamas-carter.pptik.id:5121/api.v1/vehicles/po-get', {
        guid_po: this.guid_po
      }, {
        headers: {
          'x-access-token': this.headers
        }
      })
        .then((res) => {
          this.listPlat = res.data.data
        })
    },
    InputDriver () {
      const params = {
        no_plat: this.no_plat.plat_id,
        nama_driver: this.nama_driver,
        email: this.email,
        no_telpon: this.no_telpon,
        alamat: this.alamat,
        status_driver: this.status.value,
        instansi_code: this.instansi_code,
        app_code: this.app_code
      }
      this.$axios.post('users/registrasiDriver', {
        ...params
      }, createToken()).then((res) => {
        if (res.data.status === true) {
          this.$q.notify({
            color: 'green',
            message: res.data.message
          })
          this.new_driver = false
          this.getDriver()
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
    }
  }
}
</script>
