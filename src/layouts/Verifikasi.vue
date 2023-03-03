<template>
  <div style="max-width: 420px" v-for="(d, i) in customers" :key="i">
    <q-item v-if="d.verifikasi === 0">
      <!-- <div v-if="d.verifikasi === 0"> -->
        <q-item-section avatar>
          <q-avatar>
            <q-icon name="person_pin" class="text-blue-7" size="35px" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-uppercase">{{ d.fullname }}</q-item-label>
          <q-item-label caption>{{ d.no_telpon }}</q-item-label>
        </q-item-section>
      <!-- </div> -->
    </q-item>
  </div>
</template>

<script>
import createToken from 'src/boot/create_token'
export default ({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Verifikasi',
  data () {
    return {
      customers: []
    }
  },
  async created () {
    await this.getCustomers()
  },
  methods: {
    async getCustomers () {
      this.$q.loading.show()
      this.$axios.get('users/get/role-user', createToken())
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          if (res.data.status) {
            this.customers = res.data.data
            console.log(this.customers)
          }
        })
    }
  }
})
</script>
