<template>
  <div class="content">
    <HeaderPanel :groups="userData.groups"></HeaderPanel>
  </div>
</template>
  
<script setup>
import { reactive, onMounted } from "vue";
import { useFetch } from "../fetch.js";
import HeaderPanel from "../components/HeaderPanel.vue";

const userData = reactive({
  groups: [],
});

onMounted(() => {
  fetch("https://taski-helper.mooo.com/api/groups")
    .then((res) => res.json())
    .then((json) => (userData.groups = json));
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
</style>