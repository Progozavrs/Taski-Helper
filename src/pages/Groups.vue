<template>
  <div class="content">
    <HeaderPanel></HeaderPanel>
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
          group.invitationGroup.name + " (" + group.invitationAccess.name + ")"
        }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, onMounted } from "vue";
import HeaderPanel from "../components/HeaderPanel.vue";

const userData = reactive({
  groups: [],
  tasks: [],
});

onMounted(() => {
  fetch("https://taski-helper.mooo.com/api/groups")
    .then((res) => res.json())
    .then((json) => (userData.groups = json));

  fetch("https://taski-helper.mooo.com/api/tasks/my")
    .then((res) => res.json())
    .then((json) => (userData.tasks = json));
});
</script>
  
<style lang="scss" scoped>
@use "../assets/scss/vars" as *;
@use "../assets/scss/mixins" as *;

.content {
  @include Flex-VS;
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
  @include GlassBackground;
  padding: 5px;
}

.statuses {
  @include Flex-VS;
}
</style>