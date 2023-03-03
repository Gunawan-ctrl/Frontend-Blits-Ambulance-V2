<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center" style="background-color: lightgrey;">
        <q-card class="my-card" flat unelevated dense bordered v-bind:style="$q.platform.is.mobile ? { width: '80%' } : { width: '60%' }">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-5">
              <q-carousel
                animated
                v-model="slide"
                infinite
                height="100%"
                :autoplay="autoplay"
                transition-prev="slide-right"
                transition-next="slide-left"
                @mouseenter="autoplay = false"
                @mouseleave="autoplay = true"
              >
                <q-carousel-slide :name="1" img-src="banner_1.png" />
                <q-carousel-slide :name="2" img-src="banner_2.png" />
                <q-carousel-slide :name="3" img-src="banner_3.png" />
                <q-carousel-slide :name="4" img-src="banner_4.png" />
              </q-carousel>
            </div>
            <div class="row col-md-7 col-sm-12 flex-center flex">
              <div class="col-9 text-center q-mt-lg q-mb-lg">
                <q-img src="icons/main_icon/icon.png" width="60px" />
                <div class="text-h6 q-mt-sm text-blue-7 text-weight-bold">BLITS AMBULANS</div>
                <div class="text-caption text-grey-7">Bandar Lampung Intellegent Transportation System</div>
                <div class="text-subtitle2 q-mt-lg text-left" style="font-size: 20px;">Sign In</div>
                <q-form class="q-gutter-md q-mt-md">
                  <q-input dense v-model="no_telpon" label="Nomor Telepon" lazy-rules mask="#############">
                    <template v-slot:prepend>
                      <q-icon size="20px" name="dialpad" />
                    </template>
                  </q-input>

                  <q-input dense label="Password" v-model="password" :type="isPwd ? 'password' : 'text'">
                    <template v-slot:prepend>
                      <q-icon size="20px" name="gpp_good" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>

                  <div class="text-subtitle2 q-mt-lg text-right">
                    <q-btn
                      class="q-mt-md full-width"
                      label="Sign In"
                      type="button"
                      style="width: 150px; align-content: right;"
                      color='blue-7'
                      @click="loginNotify"
                    />
                  </div>
                </q-form>
              </div>
            </div>
          </div>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script type="text/javascript"></script>
<script>
  export default {
    data() {
      return {
        no_telpon: null,
        email: null,
        password: null,
        role: null,
        slide: 1,
        autoplay: true,
        isPwd: true,
        visible: false,
      }
    },
    methods: {
      async loginNotify() {
        await this.$axios.post('users/login', {
          // no_telpon: 12345678,
          // password: blits2023
          no_telpon: this.no_telpon,
          password: this.password
        })
        .then((res) => {
          if (res.data.status === true) {
            this.$q.localStorage.set('dataUser', res.data.data)
            if (res.data.data.user.role === '1') {
              this.$router.push({ name: 'dashboard' })
              this.$q.notify({
                color: 'positive',
                message: res.data.message
              })
            } else {
              this.$q.notify({
                color: 'negative',
                message: res.data.message
              })
            }
          } else {
            this.$q.notify({
              color: 'negative',
              message: res.data.message
            })
          }
        })
      }
    },
  }
</script>

<style>
</style>
