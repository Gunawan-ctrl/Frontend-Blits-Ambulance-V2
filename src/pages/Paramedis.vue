<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el label="Petugas" icon="badge" />
        <q-breadcrumbs-el
          class="text-grey-7"
          label="Paramedis"
          icon="medical_services"
        />
      </q-breadcrumbs>
    </q-card>

    <div class="col q-col-gutter-md q-ma-md">
      <q-card>
        <q-table
          :rows="data"
          :hide-header="mode === 'grid'"
          :columns="columns"
          row-key="no_plat"
          class="text-grey-7"
          :grid="mode == 'grid'"
          :filter="filter"
          :pagination="pagination"
        >
          <template v-slot:top>
            <div class="col">
              <div class="col-2 q-table__title">Data Paramedis</div>
              <p class="text-caption">
                Daftar semua paramedis ambulans pada saat ini
              </p>
            </div>

            <q-space />

            <q-btn
              @click="dialog = true"
              flat
              icon="library_add"
              text-color="blue-7"
            >
              <q-tooltip> Tambah Data </q-tooltip>
            </q-btn>

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
              <q-td key="tanggal" :props="props">
                {{ $parseDate(props.row.created_at).fullDate }}
              </q-td>
              <q-td key="nama_paramedis" :props="props">
                {{ props.row.nama_paramedis }}
              </q-td>
              <q-td key="nip" :props="props">
                {{ props.row.nip }}
              </q-td>
              <q-td key="jabatan" :props="props">
                {{ props.row.jabatan }}
              </q-td>
              <q-td key="email" :props="props">
                {{ props.row.email }}
              </q-td>
              <q-td key="no_telpon" :props="props">
                {{ props.row.no_telpon }}
              </q-td>
              <q-td key="alamat" :props="props">
                {{ props.row.alamat }}
              </q-td>
              <q-td key="status" :props="props">
                <q-badge
                  :color="props.row.status === 'Aktif' ? 'green' : 'red'"
                  text-color="white"
                  dense
                  class="text-weight-bold"
                  square
                >
                  {{ props.row.status === "Aktif" ? "AKTIF" : "TIDAK AKTIF" }}
                </q-badge>
              </q-td>
              <q-td key="action" :props="props">
                <div class="justify-center q-gutter-x-xs">
                  <q-btn
                    flat
                    color="blue-8"
                    size="md"
                    class="q-px-xs"
                    icon="edit"
                    @click="openDialog(true, props.row)"
                  ></q-btn>
                  <q-btn
                    flat
                    color="red"
                    size="md"
                    @click="hapusData(props.row.guid)"
                    class="q-px-xs"
                    icon="delete"
                  ></q-btn>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card>
    </div>

    <q-dialog v-model="dialog">
      <q-card
        class="my-card"
        flat
        bordered
        style="width: 600px; max-width: 60vw"
      >
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <q-icon name="medical_services" size="40px" color="blue-7" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Data Paramedis</q-item-label>
            <q-item-label caption>
              Tambah data paramedis ambulans
            </q-item-label>
          </q-item-section>

          <q-item-section class="col-1">
            <q-btn
              flat
              dense
              icon="close"
              class="float-right"
              color="grey-8"
              v-close-popup
            ></q-btn>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-form @submit="onSubmit()">
          <q-card-section horizontal>
            <q-card-section class="q-gutter-xs fit">
              <q-input
                class="text-capitalize"
                dense
                outlined
                v-model="nama_paramedis"
                label="Nama Paramedis"
                :rules="[
                  (val) =>
                    (val && val.length > 0) ||
                    'Nama paramedis tidak boleh kosong',
                ]"
              />
              <q-input
                class="text-capitalize"
                dense
                type="number"
                outlined
                v-model="nip"
                label="Nip"
                :rules="[
                  (val) => (val && val.length > 0) || 'nip tidak boleh kosong',
                ]"
              />
              <q-input
                class="text-capitalize"
                dense
                outlined
                v-model="jabatan"
                label="Jabatan"
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Jabatan tidak boleh kosong',
                ]"
              />
            </q-card-section>

            <q-separator vertical />

            <q-card-section class="q-gutter-xs fit">
              <q-input
                dense
                outlined
                v-model="no_telpon"
                label="No Telpon"
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'No telpon tidak boleh kosong',
                ]"
                mask="#############"
              />
              <q-select
                dense
                outlined
                v-model="status"
                option-label="label"
                :options="optionStatus"
                label="Status"
                :rules="[(val) => val !== null || 'Status tidak boleh kosong']"
              />
              <q-input
                type="email"
                dense
                outlined
                v-model="email"
                label="Email"
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Email tidak boleh kosong',
                ]"
              />
              <q-input
                class="text-capitalize"
                dense
                outlined
                v-model="alamat"
                label="Alamat"
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Alamat tidak boleh kosong',
                ]"
              />
            </q-card-section>
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn
              flat
              class="text-bold"
              type="submit"
              label="Simpan"
              color="primary"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { exportFile } from "quasar";
import createToken from "src/boot/create_token";

const columns = [
  {
    name: "tanggal",
    label: "TANGGAL",
    field: "tanggal",
    align: "left",
  },
  {
    name: "nama_paramedis",
    label: "NAMA PARAMEDIS",
    field: "nama_paramedis",
    align: "left",
  },
  {
    name: "nip",
    label: "NIP",
    field: "nip",
    align: "left",
  },
  {
    name: "jabatan",
    label: "JABATAN",
    field: "jabatan",
    align: "left",
  },
  {
    name: "email",
    class: "text-capitalized",
    label: "EMAIL",
    field: (row) => row.email,
    align: "left",
  },
  {
    name: "no_telpon",
    required: true,
    label: "NO TELPON",
    field: (row) => row.no_telpon,
    align: "left",
  },
  {
    name: "alamat",
    label: "ALAMAT",
    field: "alamat",
    align: "left",
  },
  {
    name: "status",
    label: "STATUS",
    field: "status",
    align: "center",
  },
  {
    name: "action",
    label: "AKSI",
    field: "action",
    align: "center",
  },
];
const data = [];

export default {
  data() {
    return {
      columns,
      visibles: false,
      loading: false,
      created_at: null,
      nama_paramedis: null,
      nip: null,
      jabatan: null,
      email: null,
      no_telpon: null,
      alamat: null,
      status: null,
      optionStatus: ["Aktif", "Tidak Aktif"],
      // optionStatus: [
      //   {
      //     label: "Aktif",
      //     value: 0,
      //   },
      //   {
      //     label: "Tidak Aktif",
      //     value: 3,
      //   },
      // ],
      data,
      filter: "",
      // customer: {},
      dialog: false,
      idActive: null,
      mode: "list",
      pagination: {
        rowsPerPage: 10,
      },
      startDate: null,
      endDate: null,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    openDialog(editMode, data) {
      this.editMode = editMode;
      if (editMode) {
        this.nama_paramedis = data.nama_paramedis;
        this.nip = data.nip;
        this.jabatan = data.jabatan;
        this.email = data.email;
        this.no_telpon = data.no_telpon;
        this.alamat = data.alamat;
        this.status = data.status;
        this.idActive = data.guid;
      } else {
        this.nama_paramedis = null;
        this.nip = null;
        this.jabatan = null;
        this.email = null;
        this.alamat = null;
        this.status = null;
        this.idActive = null;
      }
      this.dialog = true;
    },
    resetDialog() {
      this.editMode = false;
      this.dialog = false;
    },
    onReset() {
      this.jenisPesanan = null;
      this.status = null;
    },
    // InputParamedis() {
    //   const params = {
    //     nama_paramedis: this.nama_paramedis,
    //     nip: this.nip,
    //     jabatan: this.jabatan,
    //     email: this.email,
    //     no_telpon: this.no_telpon,
    //     alamat: this.alamat,
    //     status: this.status.value,
    //   };
    //   this.$axios
    //     .post(
    //       "paramedis/create",
    //       {
    //         ...params,
    //       },
    //       createToken()
    //     )
    //     .then((res) => {
    //       if (res.data.status) {
    //         this.$q.notify({
    //           type: "positive",
    //           message: res.data.message,
    //         });
    //         this.new_paramedis = false;
    //         this.getParamedis();
    //       } else {
    //         this.$q.notify({
    //           type: "negative",
    //           message: res.data.message,
    //         });
    //       }
    //     });
    // },
    onSubmit() {
      if (this.editMode) {
        this.$axios
          .put(
            `paramedis/update/${this.idActive}`,
            {
              nama_paramedis: this.nama_paramedis,
              nip: this.nip,
              jabatan: this.jabatan,
              email: this.email,
              no_telpon: this.no_telpon,
              alamat: this.alamat,
              status: this.status,
            },
            createToken()
          )
          .then((res) => {
            if (res.data.status) {
              this.$q.notify({
                type: "positive",
                message: res.data.message,
              });
              this.getData();
              this.resetDialog();
              this.onReset();
            } else {
              this.$q.notify({
                type: "negative",
                message: res.data.message,
              });
            }
          });
      } else {
        this.$axios
          .post(
            "paramedis/create",
            {
              nama_paramedis: this.nama_paramedis,
              nip: this.nip,
              jabatan: this.jabatan,
              email: this.email,
              no_telpon: this.no_telpon,
              alamat: this.alamat,
              status: this.status,
            },
            createToken()
          )
          .then((res) => {
            console.log(res);
            if (res.data.status) {
              this.$q.notify({
                type: "positive",
                message: res.data.message,
              });
              this.dialog = false;
              this.getData();
            } else {
              this.$q.notify({
                type: "negative",
                message: res.data.message,
              });
            }
          });
      }
    },
    getData() {
      this.$axios
        .get("paramedis/", {
          params: {
            startDate: this.startDate,
            endDate: this.endDate,
          },
          headers: createToken().headers,
        })
        .then((res) => {
          // console.log(res);
          if (res.data.status) {
            this.data = res.data.data;
          }
        });
    },
    lihat() {},
    exportToCSV() {
      const content = ["Nama Paramedis; Email; No Telpon; Alamat"]
        .concat(
          this.data.map((row) => {
            return `${row.nama_paramedis};${row.email};${row.no_telpon};${row.alamat}`;
          })
        )
        .join("\r\n");
      const status = exportFile("daftar paramedis.csv", content, "text/csv");
      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning",
        });
      }
    },
    hapusData(guid) {
      this.$q
        .dialog({
          title: "Konfirmasi",
          message: "Apakah anda yakin ingin menghapus data ini?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.$axios.delete("paramedis/" + guid, createToken()).then((res) => {
            console.log(res);
            if (res.data.status) {
              this.$q.notify({
                type: "positive",
                message: res.data.message,
              });
              this.getData();
            } else {
              this.$q.notify({
                type: "negative",
                message: res.data.message,
              });
            }
          });
        });
    },
  },
};
</script>
