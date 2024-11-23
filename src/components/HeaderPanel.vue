<template>
  <div id="header-panel">
    <RouterLink to="/profile" class="button" active-class="active">
      <img src="../assets/img/home.svg" alt="Профиль" />
    </RouterLink>

    <RouterLink
      v-for="group in groups[0]"
      :key="group.UUID"
      :to="'/group/' + group.UUID"
      class="button my group"
      active-class="active"
    >
      {{ group.name }}
    </RouterLink>
    <RouterLink
      v-for="group in groups[1]"
      :key="group.invitationGroup.UUID"
      :to="'/group/' + group.invitationGroup.UUID"
      class="button other group"
      active-class="active"
    >
      {{ group.invitationGroup.name }}
    </RouterLink>
  </div>
</template>

<script setup>
defineProps(["groups"]);
</script>

<style lang="scss" scoped>
@use "../assets/scss/vars" as *;
@use "../assets/scss/mixins" as *;

#header-panel {
  @include GlassBackground;
  @include Flex-HS;
  justify-content: flex-start;
  max-width: 100vw;
  height: 50px;
  padding: 2px;
  overflow-x: scroll;
}

.other.group {
  background: $transparent-green;
}

.button {
  @include NormalText;
  @include GlassBackground;
  @include Flex-C;
  @include Button;
}

.group {
  min-width: 100px;
}

.button > img {
  height: 30px;
}
</style>