<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el label="Pesanan masuk" icon="perm_phone_msg" />
        <q-breadcrumbs-el
          class="text-grey-7"
          label="Pilih pengemudi"
          icon="verified"
        />
      </q-breadcrumbs>
    </q-card>
    <div class="col q-col-gutter-md q-ma-md q-mt-lg">
      <q-card>
        <q-table
          :rows="data"
          class="text-grey-7"
          :columns="columns"
          row-key="name"
          :filter="filter"
          :pagination="pagination"
        >
          <template v-slot:top>
            <div class="col">
              <div class="col-2 q-table__title">Pilih Driver</div>
              <p class="text-caption">
                Kode Pemesanan :
                <span class="text-blue"> {{ kodePesanan }} </span><br />
                Pilihkan driver yang sedang bertugas dengan status aktif.
              </p>
            </div>

            <q-space />

            <q-btn
              flat
              icon-right="document_scanner"
              text-color="blue-7"
              @click="exportTable"
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
              v-if="props.row.status_driver === 0"
            >
              <q-td key="instansi" :props="props">
                {{ props.row.instansi }}
              </q-td>
              <q-td key="nama_driver" :props="props">
                {{ props.row.nama_driver }}
              </q-td>
              <q-td class="text-weight-bold" key="no_telpon" :props="props">
                <a
                  style="text-decoration: none"
                  target="_blank"
                  :href="
                    'http://https://api.whatsapp.com/send?phone=' + telponDriver
                  "
                >
                  {{ props.row.no_telpon }}<q-tooltip>CHAT WHATSAPP</q-tooltip>
                </a>
              </q-td>
              <q-td key="no_plat" :props="props">
                {{ props.row.no_plat }}
              </q-td>
              <q-td key="status_driver" :props="props">
                <q-badge
                  :color="
                    props.row.status_driver === 0
                      ? 'green-7'
                      : props.row.status_driver == 1
                      ? 'orange-7'
                      : 'green-7'
                  "
                >
                  {{
                    props.row.status_driver === 0
                      ? "SIAP JEMPUT"
                      : props.row.status_driver === 1
                      ? "TIDAK AKTIF"
                      : "SELESAI"
                  }}
                </q-badge>
              </q-td>
              <q-td key="aksi" :props="props">
                <div class="justify-center q-gutter-x-xs">
                  <q-btn
                    @click="Pilih(props.row.guid, this.$route.params.guid)"
                    color="blue-7"
                    dense
                    flat
                    size="sm"
                  >
                    <div>Pilih Driver</div>
                  </q-btn>
                  <q-btn
                    v-if="jenisPesanan === 'Sakit'"
                    @click="Medis(props.row.guid, this.$route.params.guid)"
                    color="blue-7"
                    dense
                    flat
                    disable
                    size="sm"
                  >
                    <div>Pilih Paramedis</div>
                  </q-btn>
                </div>
              </q-td>
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

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

const columns = [
  {
    name: "nama_driver",
    align: "left",
    label: "NAMA DRIVER",
    field: "nama_driver",
    sortable: true,
  },
  {
    name: "no_telpon",
    align: "left",
    label: "NOMOR TELEPON",
    field: "no_telpon",
    sortable: true,
  },
  {
    name: "no_plat",
    align: "left",
    label: "NOMOR PLAT",
    field: "no_plat",
    sortable: true,
  },
  {
    name: "status_driver",
    align: "left",
    label: "STATUS DRIVER",
    field: "status_driver",
    sortable: true,
  },
  { name: "aksi", align: "center", label: "", field: "aksi", sortable: true },
];

const data = [];

export default {
  data() {
    return {
      visibles: false,
      dataUser: this.$q.localStorage.getItem("dataUser"),
      columns,
      data,
      Pesanan: "",
      status_pesanan: "",
      kodePesanan: "",
      jenisPesanan: "",
      status_driver: "",
      telponDriver: "",
      guid: "",
      pilih: "",
      driver: "",
      filter: "",
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  created() {
    this.getDriver();
    this.getidPesanan();
  },
  methods: {
    getDriver() {
      this.$q.loading.show();
      this.$axios
        .get("drivers/get-driver", createToken())
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          if (res.data.status) {
            this.data = res.data.data;
            res.data.data.forEach((telpon) => {
              telpon = telpon.no_telpon.replace("0", "62");
              this.telponDriver = telpon;
            });
          }
        })
        .catch(() => this.$commonErrorNotif());
    },
    getidPesanan() {
      this.$axios
        .get(`pesanan/${this.$route.params.guid}`, createToken())
        .then((res) => {
          if (res.data.status) {
            this.kodePesanan = res.data.data[0].kode_pesanan;
            this.status = res.data.data[0].jenis_pesanan.status;
          }
        });
    },
    Pilih(guid, Pesanan) {
      this.$axios
        .put(
          `pesanan/update-pesanan/${Pesanan}`,
          {
            status_pesanan: 1,
            status_driver: 1,
            guid_driver: guid,
          },
          createToken()
        )
        .then((res) => {
          if (this.status === "Ya") {
            this.$router.push({ name: "pilihParamedis" });
          } else {
            this.$router.push({ name: "daftarPesanan" });
          }
        });
    },
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map((col) => wrapCsvValue(col.label))]
        .concat(
          this.data.map((row) =>
            this.columns
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("pilih-pengemudi.csv", content, "text/csv");

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
