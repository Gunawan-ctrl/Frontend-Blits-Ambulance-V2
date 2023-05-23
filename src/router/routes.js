const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      authAdmin: true,
    },
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("pages/IndexPage.vue"),
      },
      { path: "maps", name: "map", component: () => import("pages/Map.vue") },
      {
        path: "drivers",
        name: "driver",
        component: () => import("pages/Drivers.vue"),
      },
      {
        path: "paramedis",
        name: "paramedis",
        component: () => import("pages/Paramedis.vue"),
      },
      {
        path: "jenis-pesanan",
        name: "jenisPesanan",
        component: () => import("pages/JenisPesanan.vue"),
      },
      {
        path: "user-verified",
        name: "userVerified",
        component: () => import("pages/UserVerified.vue"),
      },
      {
        path: "user-denied",
        name: "userDenied",
        component: () => import("pages/userDenied.vue"),
      },
      {
        path: "order",
        name: "order",
        component: () => import("pages/Order.vue"),
      },
      {
        path: "pilih-drivers/:guid",
        name: "pilihDriver",
        component: () => import("pages/PilihDriver.vue"),
      },
      {
        path: "daftar-pesanan",
        name: "daftarPesanan",
        component: () => import("pages/DaftarPesanan.vue"),
      },
      {
        path: "vehicle",
        name: "vehicle",
        component: () => import("pages/Vehicle.vue"),
      },
      {
        path: "profile",
        name: "profil",
        component: () => import("pages/Profile.vue"),
      },
      {
        path: "Profile/:guid",
        name: "editProfile",
        component: () => import("pages/Profile.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("pages/Acces/Login.vue"),
    children: [
      {
        path: "Login",
        name: "login",
        component: () => import("pages/Acces/Login.vue"),
      },
    ],
  },
  // {
  //   path: '/',
  //   component: () => import('pages/Acces/LoginPage.vue'),
  //   children: [
  //     { path: 'login-page', name: 'loginPage', component: () => import('pages/Acces/LoginPage.vue') }
  //   ]
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
