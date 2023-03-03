<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el class="text-grey-7" label="Pengguna Terverifikasi" icon="verified" />
      </q-breadcrumbs>
    </q-card>

    <div class="col q-col-gutter-md q-ma-md q-mt-lg">
      <q-card>
        <q-table
          :rows="usersVerified"
          :hide-header="mode === 'grid'"
          :columns="columns"
          row-key="name"
          class="text-grey-7"
          :grid="mode=='grid'"
          :filter="filter"
          :pagination="pagination"
        >
          <template v-slot:top>
            <div class="col">
              <div class="col-2 q-table__title">
                Data Pengguna Terverifikasi
              </div>
              <p class="text-caption">
                Daftar pengguna yang terverifikasi admin
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
          <template v-slot:body="props">
            <q-tr class="text-uppercase" :props="props" v-if="props.row.verifikasi == 1 && props.row.role == 2">
              <q-td key="fullname" :props="props">
                {{ props.row.fullname }}
              </q-td>
              <q-td key="email" :props="props">
                {{ props.row.email == null ? 'Belum ada email' : props.row.email }}
              </q-td>
              <q-td class="text-bold" key="no_telpon" :props="props">
                {{ props.row.no_telpon }}
              </q-td>
              <q-td class="text-bold" key="status" :props="props">
                <q-badge color="green"><q-icon name="verified" size="14px" class="q-mr-xs"/> Verified</q-badge>
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
import createToken from 'src/boot/create_token'

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val

  formatted =
      formatted === void 0 || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')

  return `"${formatted}"`
}

const columns = [
  { name: 'fullname', label: 'Nama Lengkap', field: 'fullname', sortable: true, align: 'left' },
  { name: 'email', label: 'Email', field: 'email', sortable: true, align: 'center' },
  { name: 'no_telpon', label: 'No. Telpon', field: 'no_telpon', sortable: true, align: 'center', class: 'text-bold' },
  { name: 'status', label: 'status', field: 'status', sortable: true, align: 'center', class: 'text-bold' }
]

export default {
  data () {
    return {
      visibles: false,
      data: [],
      verified: '',
      usersVerified: [],
      columns,
      filter: '',
      mode: 'list',
      verifikasi: '',
      pagination: {
        rowsPerPage: 50
      }
    }
  },
  async created () {
    await this.getCustomers()
  },
  methods: {
    async getCustomers () {
      this.$q.loading.show()
      this.$axios.get('users/get/all', createToken())
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          if (res.data.status) {
            this.usersVerified = res.data.data
          }
        })
    }
  },
  exportTable () {
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

    const status = exportFile('user-verified.csv', content, 'text/csv')

    if (status !== true) {
      this.$q.notify({
        message: 'Browser denied file download...',
        color: 'negative',
        icon: 'warning'
      })
    }
  }
}

</script>
