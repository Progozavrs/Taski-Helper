<template>
  <div class="content">
    <HeaderPanel :groups="userData.groups"></HeaderPanel>
    <div class="profile">
      <img
        v-if="userData.profile.photoUrl"
        :src="userData.profile.photoUrl"
        alt="Фото профиля"
      />
      <img v-else src="../assets/img/default.svg" alt="Фото профиля" />
      <div class="statistic">
        <div class="statuses">
          <h2>Статистика</h2>
          {{ taskByStatuses }}
        </div>
        <div class="my groups">
          <h2>Мои рабочие пространства</h2>
          <RouterLink
            v-for="group in userData.groups[0]"
            :key="group.UUID"
            :to="'/group/' + group.UUID"
            class="button my group"
          >
            {{ group.name }}
          </RouterLink>
        </div>
        <div class="other groups">
          <h2>Доверенные рабочие пространства</h2>
          <RouterLink
            v-for="group in userData.groups[1]"
            :key="group.invitationGroup.UUID"
            :to="'/group/' + group.invitationGroup.UUID"
            class="button other group"
          >
            {{
              group.invitationGroup.name +
              " (" +
              group.invitationAccess.name +
              ")"
            }}
          </RouterLink>
        </div>
        <a class="button logout" href="/auth/logout">
          <img src="../assets/img/logout.svg" alt="Выйти из аккаунта" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, onMounted } from "vue";
import { useFetch } from "../fetch.js";
import HeaderPanel from "../components/HeaderPanel.vue";

const userData = reactive({
  profile: {},
  groups: [],
  tasks: [],
});

onMounted(() => {
  fetch("https://taski-helper.mooo.com/api/groups")
    .then((res) => res.json())
    .then((json) => (userData.groups = json));

  fetch("https://taski-helper.mooo.com/api/users")
    .then((res) => res.json())
    .then((json) => (userData.profile = json));

  fetch("https://taski-helper.mooo.com/api/tasks/my")
    .then((res) => res.json())
    .then((json) => (userData.tasks = json));
});

const taskByStatuses = computed(() => {
  const temp = {};
  for (const task of userData.tasks) {
    temp[task.taskStatus.name] = [...temp[task.taskStatus.name], task];
  }
  return temp;
});
</script>

<style lang="scss" scoped>
@use "../assets/scss/vars" as *;
@use "../assets/scss/mixins" as *;

html,
body,
#app {
  @include Flex-VS;
}

.content {
  @include Flex-VS;
}

.profile {
  @include Flex-HC;
  align-items: start;
  flex: 1;

  @media (orientation: portrait) {
    @include Flex-VS;
  }
}

.profile > img {
  @include GlassBackground;
  width: 200px;
  height: 200px;

  @media (orientation: portrait) {
    align-self: center;
  }
}

.statistic {
  @include GlassBackground;
  @include Flex-VS;
  padding: 5px;
  justify-content: space-between;
  height: 100%;
  flex: 1;
}

.button {
  @include NormalText;
  @include GlassBackground;
  @include Flex-C;
  height: 30px;
  width: 100%;
  align-self: center;
  @include Button;
  &.logout {
    background-color: $transparent-orange;
  }
}

.groups {
  @include Flex-VS;
}
</style>