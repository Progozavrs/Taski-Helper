<template>
  <div class="content">
    <HeaderPanel></HeaderPanel>
    <div class="searchLine">
      <input
        v-model="data.searchText"
        placeholder="Поиск по имени / фамилии"
        @change="serchUser"
      />
    </div>
    <div class="list">
      <div v-for="user in data.users" :key="user.UUID" class="item">
        <img v-if="user.photoUrl" :src="user.photoUrl" alt="Фото профиля" />
        <img v-else src="../assets/img/default.svg" alt="Фото профиля" />
        <div>
          <p class="fio">{{ user.lastName }} {{ user.firstName }}</p>
          <p v-if="user.userCredentials.vkID">(через VK)</p>
          <p v-if="user.userCredentials.yandexID">(через Yandex)</p>
        </div>
        <select
          class="button invitation"
          @change="
            (e) => startInvitation(user.userCredentials.UUID, e.target.value)
          "
        >
          <option value="" disabled selected>
            Добавить в своё пространство
          </option>
          <option
            v-for="access in data.accesses"
            :key="access.UUID"
            :value="access.UUID"
          >
            {{ access.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
    
<script setup>
import { computed, reactive, onMounted } from "vue";
import HeaderPanel from "../components/HeaderPanel.vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

const data = reactive({
  accesses: [],
  users: [],
  searchText: "",
});

onMounted(() => {
  fetch(`https://taski-helper.mooo.com/api/vars/accesses`)
    .then((res) => res.json())
    .then((json) => (data.accesses = json))
    .catch((err) => alert(err.message));
});

function serchUser() {
  if (data.searchText.length) {
    fetch("https://taski-helper.mooo.com/api/users/find", {
      method: "POST",
      body: JSON.stringify({
        searchLine: data.searchText,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        data.users.splice(0, data.users.length);
        data.users.push(...json);
      });
  }
}

function startInvitation(userUUID, accessUUID) {
  router.push(
    `/group?mode=invitation&userUUID=${userUUID}&accessUUID=${accessUUID}`
  );
}
</script>
    
<style lang="scss" scoped>
@use "../assets/scss/vars" as *;
@use "../assets/scss/mixins" as *;

.content {
  @include Flex-VS;
}

.searchLine {
  @include GlassBackground;
  padding: 5px;
}

.searchLine > input {
  padding: 5px;
  min-height: 30px;
  width: 100%;
  font-size: 16px;
  background: $light;
  border-radius: 5px;
}

.list {
  @include Flex-VS;
  padding: 5px;
}

.item {
  @include Flex-HC;
  @include GlassBackground;
  padding: 5px;
  justify-content: flex-start;
}

.item img {
  @include GlassBackground;
  width: 70px;
  height: 70px;
  border-radius: 5px;
}

.fio {
  @include NormalText;
  font-size: large;
  text-align: left;
}

.button {
  @include NormalText;
  @include GlassBackground;
  @include Flex-C;
  height: 30px;
  width: 100%;
  align-self: center;
  @include Button;
}

.invitation {
  @include Flex-C;
  padding: 5px;
  flex: 0 1 fit-content;
  margin-left: auto;
  height: auto;
}
</style>