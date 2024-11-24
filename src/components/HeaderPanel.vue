<template>
  <div id="header-panel">
    <RouterLink to="/profile" class="button" active-class="active">
      <img src="../assets/img/home.svg" alt="Профиль" />
    </RouterLink>

    <RouterLink to="/group" class="button" active-class="active">
      Мои пространства
    </RouterLink>

    <RouterLink to="/profile/search" class="button" active-class="active">
      Поиск профилей
    </RouterLink>
  </div>
</template>

<script setup>
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
  flex: 1;
  @include NormalText;
  @include GlassBackground;
  @include Flex-C;
  @include Button;
}

.button > img {
  height: 30px;
}
</style>