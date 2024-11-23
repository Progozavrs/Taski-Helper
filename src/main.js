import { createApp } from "vue";
import App from "./App.vue";

import { createWebHistory, createRouter } from "vue-router";

import Login from "./pages/Login.vue";
import Profile from "./pages/Profile.vue";
import OtherProfile from "./pages/OtherProfile.vue";
import Group from "./pages/Group.vue";

const cookieObj = new URLSearchParams(
  document.cookie.replaceAll("&", "%26").replaceAll("; ", "&")
);

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/profile",
    name: "myProfile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/:uuid",
    name: "otherProfile",
    component: OtherProfile,
    meta: { requiresAuth: true },
  },
  {
    path: "/group/:uuid",
    name: "group",
    component: Group,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !cookieObj.get("auth_uuid")) {
    next({
      name: "login",
    });
  } else if (to.name == "login" && cookieObj.get("auth_uuid")) {
    next({
      name: "myProfile",
    });
  } else next();
});

createApp(App).use(router).mount("#app");
