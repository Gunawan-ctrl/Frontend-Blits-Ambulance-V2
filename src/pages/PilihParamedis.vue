<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el label="Pesanan masuk" icon="perm_phone_msg" />
        <q-breadcrumbs-el
          class="text-grey-7"
          label="Pilih paramedis"
          icon="medical_services"
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
              <div class="col-2 q-table__title">Pilih Paramedis</div>
              <p class="text-caption">
                Kode Pemesanan :
                <span class="text-blue"> {{ kodePesanan }} </span><br />
                Pilihkan paramedis yang sedang bertugas sesuai kebutuhan.
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
              v-if="props.row.status === 'Aktif'"
            >
              <q-td key="nama_paramedis" :props="props">
                {{ props.row.nama_paramedis }}
              </q-td>
              <q-td key="nip" :props="props">
                {{ props.row.nip }}
              </q-td>
              <q-td key="jabatan" :props="props">
                {{ props.row.jabatan }}
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
    name: "nama_paramedis",
    align: "left",
    label: "NAMA PARAMEDIS",
    field: "nama_paramedis",
    sortable: true,
  },
  {
    name: "nip",
    align: "left",
    label: "NIP",
    field: "nip",
    sortable: true,
  },
  {
    name: "jabatan",
    align: "left",
    label: "JABATAN",
    field: "jabatan",
    sortable: true,
  },
  // {
  //   name: "no_telpon",
  //   align: "left",
  //   label: "NO TELPON",
  //   field: "no_telpon",
  //   sortable: true,
  // },
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
      status_driver: "",
      telponDriver: "",
      guid: "",
      pilih: "",
      driver: "",
      nip: "",
      nama_paramedis: "",
      jabatan: "",
      email: "",
      // no_telpon: "",
      alamat: "",
      status: "",
      filter: "",
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  created() {
    this.getParamedis();
    this.getidPesanan();
  },
  methods: {
    getParamedis() {
      this.$q.loading.show();
      this.$axios
        .get("paramedis/", createToken())
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          if (res.data.status) {
            this.data = res.data.data;
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
          }
        });
    },
    Pilih(guid, Pesanan) {
      this.$axios
        .put(
          `pesanan/update-pesanan/${Pesanan}`,
          {
            status: "Tidak Aktif",
            guid_paramedis: guid,
          },
          createToken()
        )
        .then((res) => {
          this.$router.push({ name: "daftarPesanan" });
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
