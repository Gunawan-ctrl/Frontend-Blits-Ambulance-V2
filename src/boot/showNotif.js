import { boot } from 'quasar/wrappers'
import { Notify } from 'quasar'

const notif = (message, jenis) => {
  return Notify.create({
    message,
    color: jenis,
    timeout: 2000,
    actions: [{ icon: 'close', color: 'white' }]
  })
}
export default boot(async ({ app }) => {
  app.config.globalProperties.$successNotif = (msg) => {
    notif(msg, 'positive')
  }
  app.config.globalProperties.$commonErrorNotif = () => {
    notif('Terjadi kesalahan periksa koneksi internet anda', 'negative')
  }
  app.config.globalProperties.$errorNotif = (msg) => {
    notif(msg, 'negative')
  }
  app.config.globalProperties.$errorServer = (msg) => {
    notif('Terjadi kesalahan pada server. Silahkan hubungi administrator', 'negative')
  }
})
export { notif }
