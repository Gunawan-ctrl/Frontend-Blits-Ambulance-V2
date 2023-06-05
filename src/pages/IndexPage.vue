<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el
          class="text-grey-7"
          label="Dashboard"
          icon="widgets"
        />
      </q-breadcrumbs>
    </q-card>

    <q-card class="q-pa-md q-ma-md">
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
            <div class="col-2 q-table__title">Verifikasi Pengguna Baru</div>
            <p class="text-caption">
              Daftar pengguna layanan BLITS yang baru terdaftar di sistem
            </p>
          </div>

          <q-space />

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
                dense
              />
            </div>
          </q-slide-transition>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" v-if="props.row.verifikasi == 0">
            <q-td key="fullname">
              {{ props.row.fullname }}
              <q-badge color="warning">
                {{ props.row.verifikasi === 0 ? "unverified" : "verified" }}
              </q-badge>
            </q-td>
            <q-td key="email" :props="props">
              <q-item>
                <q-item-section>
                  <q-item-label>{{
                    props.row.email === null ? "-" : "Belum ada email"
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-td>
            <q-td key="no_telpon" :props="props">
              <q-item>
                <q-item-section>
                  <q-item-label>{{ props.row.no_telpon }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-td>
            <q-td key="status" :props="props">
              <div class="text-grey-8 q-gutter-xs">
                <q-badge
                  :color="
                    props.row.role === '1'
                      ? 'orange'
                      : props.row.role === '2'
                      ? 'success'
                      : 'red'
                  "
                >
                  {{
                    props.row.role === "3"
                      ? "Driver"
                      : props.row.role === "2"
                      ? "Customer"
                      : "Admins"
                  }}
                </q-badge>
              </div>
            </q-td>
            <q-td class="col q-gutter-sm" key="identitas" :props="props">
              <q-img
                class="rounded-borders"
                :ratio="16 / 9"
                style="width: 70px"
                :src="
                  'https://img.psti-ubl.id/blits/uploads/' + props.row.foto_ktp
                "
              />
              <q-img
                class="rounded-borders"
                :ratio="16 / 9"
                style="width: 70px"
                :src="
                  'https://img.psti-ubl.id/blits/uploads/' +
                  props.row.foto_selfie
                "
              />
            </q-td>
            <q-td key="aksi" :props="props">
              <div class="text-grey-8 q-gutter-xs">
                <q-btn
                  @click="this.verifyUser(props.row.guid)"
                  dense
                  color="blue-7"
                  class="q-pr-md q-pl-md"
                  size="10px"
                >
                  Verified
                </q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="verify">
      <q-card
        class="my-card"
        flat
        bordered
        style="width: 650px; max-width: 60vw"
      >
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <q-icon name="verified" size="40px" color="blue-7" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Verifikasi Customer</q-item-label>
            <q-item-label caption>
              Cek data pengguna untuk di konfirmasi
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

        <q-card-section horizontal>
          <q-card-section class="q-gutter-sm fit">
            <q-item-section>
              <q-item-label>NAMA LENGKAP</q-item-label>
              <q-item-label caption>
                {{ this.fullname }}
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>NOMOR TELEPON</q-item-label>
              <q-item-label caption>
                {{ this.phone }}
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>FOTO KTP</q-item-label>
              <q-item-label caption>
                <q-img
                  class="rounded-borders"
                  :ratio="16 / 9"
                  style="width: 270px"
                  :src="'https://img.psti-ubl.id/blits/uploads/' + this.ktp"
                />
              </q-item-label>
            </q-item-section>
          </q-card-section>
          <q-separator vertical />
          <q-card-section class="q-gutter-sm fit">
            <q-item-section>
              <q-item-label>EMAIL</q-item-label>
              <q-item-label caption>
                {{ this.email == null ? "Belum ada email" : this.email }}
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>STATUS</q-item-label>
              <q-item-label caption>
                {{ this.status == 2 ? "Customer" : "-" }}
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>SELFIE KTP</q-item-label>
              <q-item-label caption>
                <q-img
                  class="rounded-borders"
                  :ratio="16 / 9"
                  style="width: 270px"
                  :src="'https://img.psti-ubl.id/blits/uploads/' + this.selfie"
                />
              </q-item-label>
            </q-item-section>
          </q-card-section>
        </q-card-section>
        <q-separator />
        <q-card-actions>
          <q-btn
            @click="denied(this.guidVerify)"
            v-if="this.status === '2'"
            :disable="this.verifyAct === 1"
            class="q-pl-md q-pr-md"
            color="red"
            flat
            dense
            >Tolak</q-btn
          >
          <q-btn
            @click="verified(this.guidVerify)"
            v-if="this.status === '2'"
            :disable="this.verifyAct === 1"
            class="q-pl-md q-pr-md"
            color="primary"
            flat
            dense
            >Terima</q-btn
          >
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="row q-col-gutter-md q-ma-xs">
      <div class="col-12 col-md-9 q-pr-md">
        <q-card>
          <MyMap />
        </q-card>
      </div>
      <div class="col-12 col-md-3 q-gutter-md">
        <div class="col-12 col-md-3">
          <q-card>
            <q-card-section class="text-white bg-white">
              <div class="row">
                <div class="col-8">
                  <div
                    v-if="jumlah === null || jumlah === undefined"
                    class="text-h4 text-red-7 text-weight-bold"
                  >
                    -
                  </div>
                  <div v-else class="text-h4 text-red-7 text-weight-bold">
                    {{ jumlah }}
                  </div>
                  <div class="text-subtitle2 text-blue-7">Ambulans</div>
                  <div class="text-caption text-grey">
                    Jumlah ambulans yang terdaftar.
                  </div>
                </div>
                <div class="col-2">
                  <q-img src="ambulance.png" width="60px" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-3">
          <q-card>
            <q-card-section class="text-white bg-white">
              <div class="row">
                <div class="col-8">
                  <div
                    v-if="pesanan === null || pesanan === undefined"
                    class="text-h4 text-red-7 text-weight-bold"
                  >
                    -
                  </div>
                  <div v-else class="text-h4 text-red-7 text-weight-bold">
                    {{ pesanan }}
                  </div>
                  <div class="text-subtitle2 text-blue-7">Pemesan</div>
                  <div class="text-caption text-grey">
                    Jumlah pemesan ambulans terdaftar.
                  </div>
                </div>
                <div class="col-2">
                  <q-img src="heart-beat.png" width="60px" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-3">
          <q-card>
            <q-card-section class="text-white bg-white">
              <div class="row">
                <div class="col-8">
                  <div
                    v-if="pengemudi === null || pengemudi === undefined"
                    class="text-h4 text-red-7 text-weight-bold"
                  >
                    -
                  </div>
                  <div v-else class="text-h4 text-red-7 text-weight-bold">
                    {{ pengemudi }}
                  </div>
                  <div class="text-subtitle2 text-blue-7">Pengemudi</div>
                  <div class="text-caption text-grey">
                    Jumlah pengemudi terdaftar.
                  </div>
                </div>
                <div class="col-2">
                  <q-img src="driver.png" width="60px" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import createToken from "src/boot/create_token";
import MyMap from "./../components/MyMaps.vue";

const columns = [
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
  {
    name: "identitas",
    label: "IDENTITAS",
    field: "identitas",
    sortable: true,
    align: "left",
    class: "text-bold",
  },
  {
    name: "aksi",
    label: "",
    field: "aksi",
    sortable: true,
    align: "center",
    class: "text-bold",
  },
];

export default {
  components: {
    MyMap,
  },
  data() {
    return {
      visibles: false,
      columns,
      verify: false,
      filter: "",
      data: [],
      pagination: {
        rowsPerPage: 10,
      },
      km: 0,
      pengemudi: null,
      pesanan: null,
      jumlah: null,
      verifikasi: "",
      guid: "",
      sample: null,
      fullname: null,
      email: null,
      phone: null,
      status: null,
      selfie: null,
      ktp: null,
      guidVerify: null,
      verifyAct: null,
      guid_po: "2bfab8ff-304e-42e9-b200-9fb9140f0432",
      yourNumber: +6289503251381,
      yourMessage: "user telah diverifikasi",
    };
  },
  created() {
    this.getKendaraan();
    this.getDriver();
    this.getPesanan();
    this.getCustomers();
  },
  methods: {
    verifyUser(guid) {
      this.verify = true;
      this.$axios.get(`users/${guid}`, createToken()).then((res) => {
        if (res.data.status) {
          this.sample = res.data.data;
          this.fullname = this.sample.fullname;
          this.email = this.sample.email;
          this.phone = this.sample.no_telpon;
          this.status = this.sample.role;
          this.selfie = this.sample.foto_selfie;
          this.ktp = this.sample.foto_ktp;
          this.guidVerify = guid;
          this.verifyAct = this.sample.verifikasi;
        }
      });
    },
    async getKendaraan() {
      this.$q.loading.show();
      this.$axios
        .post(
          "https://api-kopamas-carter.pptik.id:5121/api.v1/vehicles/po-get",
          {
            guid_po: this.guid_po,
          },
          {
            headers: {
              "x-access-token":
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiNzNhZjk3YjQtNTllZC00MGFmLWJlZTQtOTM4MzhmMzlhNGYzIiwiaWF0IjoxNjY5MTA3MDIyLCJleHAiOjE4MjY3ODcwMjJ9.4x6F8nQyDiMaiARRMOpIV2YkbPrS4iKEEf3Qtm0SjDY",
            },
          }
        )
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          console.log(res);
          if (res.data.status) {
            this.jumlah = res.data.data.length;
          }
        })
        .catch(() => this.$commonErrorNotif());
    },
    getDriver() {
      this.$q.loading.show();
      this.$axios
        .get("drivers/get-driver", createToken())
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          if (res.data.status) {
            this.pengemudi = res.data.data.length;
          }
        });
    },
    getPesanan() {
      this.$q.loading.show();
      this.$axios
        .get("pesanan/get-pesanan", createToken())
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          if (res.data.status) {
            this.pesanan = res.data.data.length;
          }
        });
    },
    getCustomers() {
      this.$q.loading.show();
      this.$axios
        .get("users/get/role-user", createToken())
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          if (res.data.status) {
            this.data = res.data.data;
            console.log(this.data);
          }
        });
    },
    verified(guid) {
      this.$axios
        .put(
          `users/user-update/${guid}`,
          {
            verifikasi: 1,
          },
          createToken()
        )
        .then((res) => {
          this.$q
            .dialog({
              title: "Confirm",
              message: "apakah anda yakin? ",
              cancel: true,
              persistent: true,
            })
            .onOk(() => {
              this.$router.push({ name: "userVerified" });
            })
            .onCancel((err) => {
              console.log(err);
            });
        });
    },
    verifyDetail(guid) {
      this.$axios
        .put(
          `users/get-pesanan/${this.pesanan.guid}`,
          {
            fullname: this.fullname,
            email: this.email,
            no_telpon: this.no_telpon,
            alamat: this.alamat,
          },
          createToken()
        )
        .then((res) => {
          if (res.data.status === true) {
            this.$q.notify({
              color: "success",
              message: "Data berhasil diubah!",
            });
            this.$router.push({ name: "profil" });
            this.profile = false;
          }
        });
    },
    denied(guid) {
      this.$axios
        .put(
          `users/user-update/${guid}`,
          {
            verifikasi: 2,
          },
          createToken()
        )
        .then((res) => {
          if (res.data.status === true) {
            this.$router.push({ name: "userDenied" });
          }
        });
    },
  },
};
</script>
