<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el label="Pengguna" icon="supervisor_account" />
        <q-breadcrumbs-el
          class="text-grey-7"
          label="Pengguna Tertolak"
          icon="do_disturb"
        />
      </q-breadcrumbs>
    </q-card>

    <q-card class="q-px-md q-mx-md">
      <q-form @submit="lihatData()">
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
              <q-btn
                outline
                size="md"
                color="blue-7"
                @click="lihatData"
                label="lihat data"
              />
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>

    <div class="col q-col-gutter-md q-ma-md q-mt-lg">
      <q-card>
        <q-table
          :rows="usersDenied"
          class="text-grey-7"
          :hide-header="mode === 'grid'"
          :columns="columns"
          row-key="name"
          :grid="mode == 'grid'"
          :filter="filter"
          :pagination="initialPagination"
        >
          <template v-slot:top>
            <div class="col">
              <div class="col-2 q-table__title">Data Pengguna Tertolak</div>
              <p class="text-caption">
                Daftar pengguna yang tertolak verifikasi admin
              </p>
            </div>

            <q-space />

            <q-btn
              flat
              unelevated
              icon="document_scanner"
              text-color="blue-7"
              @click="exportToCSV()"
            >
              <q-tooltip> Export Data </q-tooltip>
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
            <q-tr
              class="text-uppercase"
              :props="props"
              v-if="props.row.verifikasi === 2"
            >
              <q-td key="tanggal" :props="props">
                {{ $parseDate(props.row.created_at).fullDate }}
              </q-td>
              <q-td key="fullname" :props="props">
                {{ props.row.fullname }}
              </q-td>
              <q-td key="email" :props="props">
                {{
                  props.row.email == null ? "Belum ada email" : props.row.email
                }}
              </q-td>
              <q-td class="text-bold" key="no_telpon" :props="props">
                {{ props.row.no_telpon }}
              </q-td>
              <q-td class="text-bold" key="status" :props="props">
                <q-badge color="red">
                  <q-icon name="do_disturb" size="14px" class="q-mr-xs" />
                  Denied</q-badge
                >
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>
<script>
import createToken from "src/boot/create_token";
import { exportFile } from "quasar";

const columns = [
  {
    name: "tanggal",
    label: "TANGGAL",
    field: "tanggal",
    sortable: true,
    align: "left",
  },
  {
    name: "fullname",
    label: "NAMA LENGKAP",
    field: "fullname",
    sortable: true,
    align: "left",
  },
  {
    name: "email",
    label: "EMAIL",
    field: "email",
    sortable: true,
    align: "center",
  },
  {
    name: "no_telpon",
    label: "NOMOR TELEPON",
    field: "no_telpon",
    sortable: true,
    align: "center",
    class: "text-bold",
  },
  {
    name: "status",
    label: "STATUS",
    field: "status",
    sortable: true,
    align: "center",
    class: "text-bold",
  },
];

export default {
  data() {
    return {
      visibles: false,
      mode: "",
      data: [],
      usersDenied: [],
      columns,
      created_at: null,
      filter: "",
      initialPagination: {
        sortBy: "desc",
        descending: false,
        rowsPerPage: 10,
      },
      startDate: null,
      endDate: null,
      userverif: null,
    };
  },
  async created() {
    await this.getCustomers();
  },
  methods: {
    async getCustomers() {
      this.$q.loading.show();
      this.$axios
        .get("users/get/role-user", createToken())
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          if (res.data.status) {
            this.usersDenied = res.data.data;
          }
        });
    },
    lihatData() {
      this.$axios
        .get("users/getuserbydate/", {
          params: {
            startDate: this.startDate,
            endDate: this.endDate,
          },
          headers: createToken().headers,
        })
        // .finally(() => this.$q.loading.hide())
        .then((res) => {
          if (res.data.status) {
            this.data = res.data.data;
          }
        });
    },
    exportToCSV() {
      const content = ["Tanggal; Nama Lengkap; Email; No Telpon"]
        .concat(
          this.usersDenied.map((row) => {
            return `${row.created_at};${row.fullname};${row.email};${row.no_telpon};`;
          })
        )
        .join("\r\n");
      const status = exportFile(
        "daftar-pengguna-tertolak.csv",
        content,
        "text/csv"
      );
      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning",
        });
      }
    },
  },
};
</script>
