<template>
  <div style="max-width: 360px" v-for="(d, i) in dataInformasi" :key="i">
    <q-item v-if="d.status_pesanan === 0">
      <q-item-section top avatar>
        <q-avatar>
          <q-icon name="person_pin" class="text-blue-7" size="35px" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-uppercase">
          {{ d.data_user.fullname }}
        </q-item-label>
        <q-item-label caption>
          {{ d.titik_jemput.substring(0, 20) + "..." }}
          <q-icon name="sync_alt" color="blue-7" size="15px" />
          {{ d.tujuan.substring(0, 20) + "..." }}
        </q-item-label>
      </q-item-section>

      <q-item-section side top>
        <q-item-label caption class="q-mt-md">
          {{ d.kode_pesanan }}
        </q-item-label>
        <q-btn
          :to="{ name: 'order' }"
          class="btn-sm"
          flat
          size="sm"
          icon="trip_origin"
          text-color="blue-7"
        ></q-btn>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import createToken from "src/boot/create_token";
export default {
  name: "MainLayout",
  data() {
    return {
      leftDrawerOpen: false,
      dataInformasi: [],
      dataUser: this.$q.localStorage.getItem("dataUser"),
    };
  },
  created() {
    this.getPesanan();
  },
  methods: {
    getPesanan() {
      this.$axios.get("pesanan/get-pesanan", createToken()).then((res) => {
        if (res.data.status) {
          this.dataInformasi = res.data.data;
        }
      });
    },
  },
};
</script>

<style scoped></style>
