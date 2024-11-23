<template>
  <div class="content">
    <div class="container">
      <h1>TASKI</h1>
      <a href="https://taski-helper.mooo.com/auth/yandex">
        <img src="../assets/img/yandex.png" alt="Yandex" />
        <span>Войти через Yandex</span>
        <img src="../assets/img/yandex.png" alt="Yandex" />
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../assets/scss/vars" as *;
@use "../assets/scss/mixins" as *;

.content {
  @include Flex-C;
}

.container {
  @include Flex-C;
  align-items: stretch;
  width: 50%;

  @media (orientation: portrait) {
    width: 100%;
  }
}

h1 {
  @include Flex-C;
  margin-bottom: 50px;
  @include Logo;
}

a {
  @include GlassBackground;
  @include Flex-HC;
  padding: 5px;
  transition: 0.2s;

  span {
    @include Flex-C;
    @include NormalText;
  }

  @media (hover: hover) {
    &:hover {
      transform: scale(0.97);
    }
  }

  &:active {
    opacity: 0.8;
  }
}

img {
  width: 50px;
}
</style>