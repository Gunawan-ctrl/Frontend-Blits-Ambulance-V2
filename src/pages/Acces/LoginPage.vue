<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="row" style="height: 90vh">
          <div class="col-0 col-md-6 flex justify-center content-center">
            <q-card v-bind:style="$q.screen.lt.md ? {'width': '50%'} : {'width': '60%', 'height': '74%'}">
              <q-carousel
                animated
                v-model="slide"
                infinite
                :autoplay="autoplay"
                arrows
                transition-prev="slide-right"
                transition-next="slide-left"
                @mouseenter="autoplay = false"
                @mouseleave="autoplay = true"
              >
                <q-carousel-slide :name="1" img-src="../../../public/banner_1.png" />
                <q-carousel-slide :name="2" img-src="../../../public/banner_2.png" />
                <q-carousel-slide :name="3" img-src="../../../public/banner_3.png" />
                <q-carousel-slide :name="4" img-src="../../../public/banner_4.png" />
              </q-carousel>
            </q-card>
          </div>

          <div v-bind:class="{'justify-center': $q.screen.md || $q.screen.sm ||$q.screen.xs}"
              class="col-12 col-md-6 flex content-center q-pr-xl">
            <q-card elevated style="background-color: #C3613A;" bordered dense v-bind:style="$q.screen.lt.sm ? {'width': '80%'} : {'width': '60%', 'height': '95%'}">
              <div>
                <q-card-section>
                  <div class="col-9 text-center q-mt-lg q-mb-lg">
                    <q-img src="icons/main_icon/icon.png" width="60px" />
                  </div>
                  <div class="text-h6 text-black text-weight-bold text-center">BLITS AMBULANS</div>
                  <div class="text-caption text-white text-center">Bandar Lampung Intellegent Transportation <br> System</div>
                  <div class="text-subtitle2 text-black q-mt-xl text-left" style="font-size: 20px;">Sign In</div>
                </q-card-section>
                <q-card-section>
                  <q-form class="q-gutter-md text-white" type="submit">
                    <q-input type="number" dense v-model="no_telpon" label="No Telpon" lazy-rules>
                      <template v-slot:prepend>
                        <q-icon size="20px" name="alternate_email" />
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

                    <div class="text-subtitle2 q-mt-xl text-right">
                      <q-btn
                        class=" full-width"
                        label="Sign In"
                        type="button"
                        color='blue-7'
                        @click="loginNotify"
                      />
                    </div>
                  </q-form>
                </q-card-section>
              </div>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
  <img src="~assets/wave.png" class="wave" alt="login-wave">
</template>
<script type="text/javascript"></script>
<script>
export default {
  data () {
    return {
      slide: 1,
      no_telpon: '',
      password: '',
      autoplay: true,
      username: '',
      password: '',
      isPwd: true,
      visible: false
    }
  },
  // created () {
  //   this.$q.dark.set(true)
  // },
  methods: {
    async loginNotify () {
      await this.$axios.post('user/login', {
        no_telpon: this.no_telpon,
        password: this.password
      }).then((res) => {
        if (res.data.status = true) {
          this.$q.localStorage.set('dataUser', res.data.data)
          if (dataUser.user.role === '1') {
            this.$router.push({ name: 'dashboard' })
          }
        }
      })
    }
  }
}
</script>
<style scoped>
  .wave {
  position: fixed;
  height: 100%;
  left: 0;
  bottom: 0;
  z-index: -1;
}
</style>
