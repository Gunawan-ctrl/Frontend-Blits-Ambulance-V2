<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el label="Pemesanan" icon="perm_phone_msg" />
        <q-breadcrumbs-el
          class="text-grey-7"
          label="Daftar pesanan"
          icon="playlist_add_check_circle"
        />
      </q-breadcrumbs>
    </q-card>
    <q-card class="q-px-md q-mx-md">
      <q-form @submit="lihat()">
        <q-card-section>
          <div class="row q-col-gutter-lg">
            <div class="col-md-4 col-sm-6 col-xs-12">
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
            <div class="col-md-4 col-sm-6 col-xs-12">
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
            <div class="col-md-4 col-sm-6 col-xs-12">
              <q-select
                hint="Status Pesanan"
                key="value"
                v-model="status_pesanan"
                :options="options"
                outlined
                dense
              >
              </q-select>
            </div>
            <div>
              <q-btn
                outline
                size="md"
                color="blue-7"
                @click="lihat"
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
          class="text-grey-7"
          :rows="data"
          :hide-header="mode === 'grid'"
          :columns="columns"
          row-key="name"
          :grid="mode == 'grid'"
          :filter="filter"
          :pagination="pagination"
        >
          <template v-slot:top>
            <div class="col">
              <div class="col-2 q-table__title">Daftar Pemesanan</div>
              <p class="text-caption">Daftar pemesanan yang sedang berjalan</p>
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
            <q-tr :props="props">
              <q-td class="text-uppercase" key="nama_driver" :props="props">
                {{
                  props.row.data_driver.nama_driver === undefined
                    ? "-"
                    : props.row.data_driver.nama_driver
                }}
              </q-td>
              <q-td
                class="text-weight-bold text-blue-7"
                key="no_telpon"
                :props="props"
                ><a
                  target="_blank"
                  style="text-decoration: none"
                  :href="
                    'https://api.whatsapp.com/send?phone=' + this.telpDriver
                  "
                >
                  {{
                    props.row.data_driver.no_telpon === undefined
                      ? "-"
                      : props.row.data_driver.no_telpon
                  }}<q-tooltip>CHAT WHATSAPP</q-tooltip></a
                >
              </q-td>
              <q-td class="text-uppercase" key="no_plat" :props="props">{{
                props.row.data_driver.no_plat
              }}</q-td>
              <q-td class="text-uppercase" key="nama_paramedis" :props="props"
                >{{ props.row.data_paramedis.nama_paramedis }}
              </q-td>
              <q-td key="status_pesanan" :props="props"
                ><q-badge
                  :color="
                    props.row.status_pesanan === 0
                      ? 'orange-7'
                      : props.row.status_pesanan === 1
                      ? 'blue-7'
                      : props.row.status_pesanan === 2
                      ? 'teal-7'
                      : 'green-7'
                  "
                  >{{
                    `${
                      props.row.status_pesanan === 0
                        ? "MENUNGGU"
                        : props.row.status_pesanan === 1
                        ? "MENJEMPUT"
                        : props.row.status_pesanan === 2
                        ? "MENGANTAR"
                        : "SELESAI"
                    }`
                  }}</q-badge
                >
              </q-td>
              <q-td class="text-uppercase" key="fullname" :props="props">{{
                props.row.data_user.fullname
              }}</q-td>
              <q-td class="text-uppercase" key="kode_pesanan" :props="props">{{
                props.row.kode_pesanan
              }}</q-td>
              <q-td
                class="text-weight-bold text-blue-7"
                key="no_telpon"
                :props="props"
                ><a
                  target="_blank"
                  style="text-decoration: none"
                  :href="
                    'https://api.whatsapp.com/send?phone=' + this.phoneData
                  "
                >
                  {{ props.row.data_user.no_telpon
                  }}<q-tooltip>CHAT WHATSAPP</q-tooltip></a
                >
              </q-td>
              <q-td
                class="text-weight-bold text-blue-7"
                key="titik_jemput"
                :props="props"
                ><a
                  target="_blank"
                  style="text-decoration: none"
                  :href="
                    'https://www.google.com/maps/?q=' +
                    props.row.titik_jemput_lat +
                    ',' +
                    props.row.titik_jemput_long
                  "
                  >{{ props.row.titik_jemput.substring(0, 10) + "..." }}</a
                ></q-td
              >
              <q-td
                class="text-weight-bold text-blue-7"
                key="tujuan"
                :props="props"
                ><a
                  target="_blank"
                  style="text-decoration: none"
                  :href="
                    'https://www.google.com/maps/?q=' +
                    props.row.tujuan_lat +
                    ',' +
                    props.row.tujuan_long
                  "
                  >{{ props.row.tujuan.substring(0, 10) + "..." }}</a
                ></q-td
              >
              <q-td key="created_at" :props="props">{{
                new Date(props.row.created_at).toLocaleDateString("id", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              }}</q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { exportFile } from "quasar";
import createToken from "src/boot/create_token";

const columns = [
  {
    name: "nama_driver",
    align: "left",
    label: "DRIVER",
    field: "nama_driver",
    sortable: true,
  },
  {
    name: "no_telpon",
    align: "left",
    label: "NO. HP",
    field: "no_telpon",
    sortable: true,
  },
  {
    name: "no_plat",
    align: "left",
    label: "NO. PLAT",
    field: "no_plat",
    sortable: true,
  },
  {
    name: "nama_paramedis",
    align: "left",
    label: "PARAMEDIS",
    field: "nama_paramedis",
    sortable: true,
  },
  {
    name: "status_pesanan",
    align: "left",
    label: "STATUS",
    field: "status_pesanan",
    sortable: true,
  },
  {
    name: "fullname",
    align: "left",
    label: "PEMESAN",
    field: "fullname",
    sortable: true,
  },
  // { name: 'kode_pesanan', align: 'left', label: 'KODE', field: 'kode_pesanan', sortable: true },
  {
    name: "no_telpon",
    align: "left",
    label: "NO. HP",
    field: "no_telpon",
    sortable: true,
  },
  {
    name: "titik_jemput",
    align: "left",
    label: "JEMPUT",
    field: "titik_jemput",
    sortable: true,
  },
  {
    name: "tujuan",
    required: true,
    label: "TUJUAN",
    align: "left",
    field: (row) => row.tujuan,
    sortable: true,
  },
  {
    name: "created_at",
    align: "left",
    label: "TGL. PEMESANAN",
    field: "created_at",
    sortable: true,
  },
];

export default {
  data() {
    return {
      options: [
        {
          label: "Menunggu",
          value: 0,
        },
        {
          label: "Menjemput",
          value: 1,
        },
        {
          label: "Selesai",
          value: 2,
        },
      ],
      visibles: false,
      columns,
      data: [],
      status_pesanan: 0,
      status_driver: 0,
      nama_driver: "",
      phonex: "",
      phoneData: "",
      telpDriver: "",
      drivers: "",
      guid: "",
      filter: "",
      startDate: null,
      endDate: null,
      mode: "list",
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  mounted() {
    this.getPesanan();
    // this.getParamedis();
  },
  methods: {
    getPesanan() {
      this.$q.loading.show();
      this.$axios
        .get("pesanan/get-pesanan", createToken())
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          console.log(res);
          if (res.data.status) {
            this.data = res.data.data;
            res.data.data.forEach((phonex) => {
              phonex.phones = phonex.data_user.no_telpon;
              this.phoneData = phonex.phones.replace("0", "62");
              this.telpDriver = phonex.data_driver.no_telpon.replace("0", "62");
              phonex.statuss = phonex.status_pesanan;
            });
          }
        });
    },
    lihat() {
      this.$axios
        .get("pesanan/filter/getPesananByDate/", {
          params: {
            startDate: this.startDate,
            endDate: this.endDate,
            status_pesanan: this.status_pesanan.value,
          },
          headers: createToken().headers,
        })
        // .finally(() => this.$q.loading.hide())
        .then((res) => {
          console.log(res);
          if (res.data.status) {
            this.data = res.data.data;
          }
        });
    },
    exportToCSV() {
      const content = [
        "Driver; No Telpon; No Plat; Status; Pemesan; No Hp; Jemput; Tujuan; Tanggal Pemesanan",
      ]
        .concat(
          this.data.map((row) => {
            return `${row.data_driver.nama_driver};${row.data_driver.no_telpon};${row.data_driver.no_plat};${row.status_pesanan};${row.data_user.fullname};${row.data_user.no_telpon};${row.titik_jemput};${row.tujuan};${row.created_at};`;
          })
        )
        .join("\r\n");
      const status = exportFile("daftar pesanan.csv", content, "text/csv");
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
<style></style>
