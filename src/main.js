import { createApp } from "vue";
import App from "./App.vue";

import { createWebHistory, createRouter } from "vue-router";

import Login from "./pages/Login.vue";
import Profile from "./pages/Profile.vue";
import OtherProfile from "./pages/OtherProfile.vue";
import SearchProfile from "./pages/SearchProfile.vue";
import Group from "./pages/Group.vue";
import Groups from "./pages/Groups.vue";

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
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "myProfile",
        component: Profile,
      },
      {
        path: ":uuid",
        name: "otherProfile",
        component: OtherProfile,
      },
    ],
  },
  {
    path: "/profile/search",
    name: "searchProfile",
    component: SearchProfile,
    meta: { requiresAuth: true },
  },
  {
    path: "/group",
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "groups",
        component: Groups,
      },
      {
        path: ":uuid",
        name: "group",
        component: Group,
      },
    ],
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
