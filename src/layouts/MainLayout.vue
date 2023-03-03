<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="header_normal bg-white" elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          style="color: #323746"
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          round
        />
        <q-space />
        <div class="row q-gutter-md q-mr-md">

          <!-- Button notification verifikasi user -->
          <q-btn round dense flat color="blue-7" icon="mail">
            <q-badge v-if="totalnotif != 0" color="red" text-color="white" floating>{{ totalnotif }}</q-badge>
            <q-menu>
              <q-card>
                <q-card-section>
                  <div class="text-h6 text-grey-7">Informasi Pengguna</div>
                  <div class="text-subtitle text-grey-7">Daftar informasi pengguna baru belum terverifikasi</div>
                  <verifikasi></verifikasi>
                </q-card-section>
                <q-separator />
                <q-card-actions vertical>
                  <q-btn
                    clickable
                    v-ripple
                    exact
                    :to="{ name: 'dashboard' }"
                    v-close-popup
                    flat
                    text-color="blue-7"
                    >Lihat Semua</q-btn
                  >
                </q-card-actions>
              </q-card>
            </q-menu>
          </q-btn>
          <!-- End Button notification verifikasi user -->

          <!-- Button notification pesanan -->
          <q-btn round dense flat color="blue-7" icon="notifications">
            <q-badge v-if="pesanan != 0" color="red" text-color="white" floating>
              {{ pesanan }} {{ notification }}
            </q-badge>
            <q-menu>
              <q-card class="my-card">
                <q-card-section>
                  <div class="text-h6 text-grey-7">Informasi Pesanan</div>
                  <div class="text-subtitle text-grey-7">
                    Daftar informasi pesanan masuk system
                  </div>
                  <messages></messages>
                </q-card-section>

                <q-separator />

                <q-card-actions vertical>
                  <q-btn
                    clickable
                    v-ripple
                    exact
                    :to="{ name: 'order' }"
                    v-close-popup
                    flat
                    text-color="blue-7"
                    >Lihat Semua</q-btn
                  >
                </q-card-actions>
              </q-card>
            </q-menu>
          </q-btn>
          <!-- End Button notification pesanan -->

        </div>
        <div class="row q-gutter-md q-mr-md"></div>

        <q-btn-dropdown
          flat
          text-color="blue-7"
          class="text-capitalize text-subtitle1"
          :label="this.sapa + dataUser.user.fullname"
          left
          stretch
          no-caps
        >
          <div class="row no-wrap q-pa-md">
            <div class="column">
              <div class="text-h6 q-mb-md">Settings</div>
              <q-btn
                outline
                color="primary"
                label="Profile"
                clickable
                :to="{ name: 'profil' }"
                size="sm"
                icon="manage_accounts"
                left
                v-close-popup
              />
            </div>

            <q-separator vertical inset class="q-mx-lg" />

            <div class="column items-center">
              <q-avatar size="72px">
                <img src="avatar.png" />
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs text-capitalize">
                {{ dataUser.user.fullname }}
              </div>

              <q-btn
                color="red orange"
                label="Keluar"
                outline
                size="sm"
                v-close-popup
                @click="Logout"
              />
              <q-dialog v-model="confirm" persistent>
                <q-card class="my-card header-counter" flat bordered>
                  <q-card-section horizontal>
                    <q-card-section class="q-pt-xs">
                      <div class="text-h6 q-mt-sm q-mb-xs">
                        Keluar dari sistem BLITS Ambulans
                      </div>
                      <div class="text-caption text-grey">
                        Apakah kamu yakin mau keluar dari sistem BLITS Ambulans
                        sekarang ?
                      </div>
                    </q-card-section>

                    <q-card-section class="col-4 flex flex-center">
                      <q-avatar size="120px" rounded>
                        <img src="image-logout.jpg" alt="" />
                      </q-avatar>
                    </q-card-section>
                  </q-card-section>

                  <q-separator />

                  <q-card-actions>
                    <q-btn
                      flat
                      color="blue-13"
                      @click="Logout"
                      label="Keluar"
                      icon="sentiment_very_dissatisfied"
                    />
                    <q-btn
                      flat
                      color="red-13"
                      v-close-popup
                      label="Batal"
                      icon="highlight_off"
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
          </div>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      class="left-navigation text-white"
      show-if-above
      v-model="leftDrawerOpen"
      style="background-color: #323746"
      side="left"
      :width="280"
      elevated
    >
      <div class="full-height">
        <div
          style="height: calc(100% - 67px); padding: 20px; align-items: center"
        >
          <q-toolbar class="q-mb-md">
            <q-avatar style="width: 50px; height: 55px">
              <img src="icons/main_icon/icon.png" />
            </q-avatar>
            <q-toolbar-title style="font-family: monospace; font-weight: bold">
              BLITS
              <div class="text-caption text-blue-7">
                Administrator
                <q-badge color="green" rounded text-color="white" />
              </div>
            </q-toolbar-title>
          </q-toolbar>
          <q-scroll-area style="height: 100%">
            <q-list padding class="text-grey text-weight-bold">
              <q-item
                active-class="tab-active"
                :to="{ name: 'dashboard' }"
                exact
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="dashboard" />
                </q-item-section>
                <q-item-section>
                  Dashboard
                </q-item-section>
              </q-item>

              <q-expansion-item class="q-pl-sm">
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-icon name="perm_phone_msg" />
                  </q-item-section>
                  <q-item-section> Pemesanan </q-item-section>
                  <div class="q-gutter-md">
                    <q-badge v-if="pesanan != 0" rounded color="red">{{ pesanan }}</q-badge>
                  </div>
                </template>
                <q-item
                  active-class="tab-active"
                  class="q-ma-sm navigation-item"
                  :to="{ name: 'order' }"
                  exact
                  clickable
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-icon name="verified" />
                  </q-item-section>
                  <q-item-section> Pesanan Masuk </q-item-section>
                </q-item>

                <q-item
                  active-class="tab-active"
                  class="q-ma-sm navigation-item"
                  :to="{ name: 'daftarPesanan' }"
                  exact
                  clickable
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-icon name="playlist_add_check_circle" />
                  </q-item-section>
                  <q-item-section> Daftar Pesanan </q-item-section>
                </q-item>
              </q-expansion-item>

              <q-expansion-item
                class="q-pl-sm"
                icon="supervisor_account"
                label="Pengguna"
              >
                <q-item
                  active-class="tab-active"
                  class="q-ma-sm navigation-item"
                  :to="{ name: 'userVerified' }"
                  exact
                  clickable
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-icon name="verified" />
                  </q-item-section>
                  <q-item-section> Terverifikasi </q-item-section>
                </q-item>
                <q-item
                  active-class="tab-active"
                  class="q-ma-sm navigation-item"
                  :to="{ name: 'userDenied' }"
                  exact
                  clickable
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-icon name="do_disturb" />
                  </q-item-section>
                  <q-item-section> Tertolak </q-item-section>
                </q-item>
              </q-expansion-item>

              <q-item
                active-class="tab-active"
                :to="{ name: 'vehicle' }"
                exact
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="local_shipping" />
                </q-item-section>
                <q-item-section> Ambulans </q-item-section>
              </q-item>

              <q-item
                active-class="tab-active"
                :to="{ name: 'driver' }"
                exact
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="supervised_user_circle" />
                </q-item-section>
                <q-item-section> Pengemudi </q-item-section>
              </q-item>

              <q-item
                active-class="tab-active"
                :to="{ name: 'map' }"
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="map" />
                </q-item-section>
                <q-item-section> Peta </q-item-section>
              </q-item>

              <q-item
                active-class="tab-active"
                :to="{ name: 'profil' }"
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="manage_accounts" />
                </q-item-section>
                <q-item-section> Profil </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import createToken from 'src/boot/create_token'
import Messages from './Messages'
import Verifikasi from './Verifikasi'

import mqttjs from 'mqtt'
let client = null
export default {
  name: 'MainLayout',
  components: {
    Messages,
    Verifikasi
  },
  data () {
    return {
      notification: null,
      leftDrawerOpen: false,
      fullname: null,
      username: null,
      dataUser: this.$q.localStorage.getItem('dataUser'),
      confirm: false,
      pesanan: null,
      sapa: 'Hallo, ',
      totalnotif: null,
      customers: [],
      data: '',
      rmqdata: null
    }
  },
  beforeCreate: async function () {
    const option = {
      clientId: 'NotifyOrder',
      username: '/blits:blits',
      password: 'I3!tzs2t7',
      protocolId: '',
      reconnectPeriode: 0,
      keepAlive: 0
    }

    client = await mqttjs.connect('ws://rmq2.pptik.id:15675/ws', option)
  },
  async created () {
    await this.getPesanan()
    await this.getCustomers()
    await this.getMessages()
  },
  methods: {
    getPesanan () {
      this.$q.loading.show()
      this.$axios
        .get('pesanan/get-pesanan', createToken())
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          this.data = res.data.data
          const tempRecipes = this.data.filter((item) => {
            return item.status_pesanan === 0
          })
          this.pesanan = tempRecipes.length
        })
    },
    getCustomers () {
      this.$q.loading.show()
      this.$axios
        .get('users/get/role-user', createToken())
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          if (res.data.status) {
            this.customers = res.data.data
            const totalnotif = this.customers.filter((item) => {
              return item.verifikasi === 0
            })
            this.totalnotif = totalnotif.length
            console.log(this.totalnotif)
          }
        })
    },
    Logout () {
      this.$q.localStorage.clear()
      this.$router.push({ name: 'login' })
    },
    getMessages: function () {
      const parseData = (data) => {
        this.notification = data
        if (data != null) {
          const audio = new Audio('Notifikasi.mp3')
          audio.play()
        }
      }

      client.on('connect', function () {
        client.subscribe('orderan', function (err, topic) {
          if (err) {
            return err
          }
          client.on('message', function (topic, message) {
            this.notification = message.toString()
            parseData(message.toString())
          })
        })
      })
    }
  }
}
</script>
<style>
.navigation-item {
  border-radius: 5px;
}
.tab-active {
  color: white;
}
.header_normal {
  background: linear-gradient(
    145deg,
    rgb(86, 106, 32) 15%,
    rgb(21, 57, 102) 70%
  );
}
</style>
