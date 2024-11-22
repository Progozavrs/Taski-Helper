<script setup>
useHead({
  title: "Войти в аккаунт",
  description: "Форма входа в аккаунт",
});
</script>


<template>
  <div class="container">
    <h1>TASKI</h1>

    <a href="https://taski-helper.mooo.com/auth/yandex">
      <img src="/public/yandex.png" alt="Yandex" />
      <span>Войти через Yandex</span>
      <img src="/public/yandex.png" alt="Yandex" />
    </a>

    <a href="https://taski-helper.mooo.com/auth/telegram">
      <img src="/public/telegram.png" alt="Telegram" />
      <span>Войти через Telegram</span>
      <img src="/public/telegram.png" alt="Telegram" />
    </a>

    <a href="https://taski-helper.mooo.com/auth/vk">
      <img src="/public/vk.png" alt="VK" />
      <span>Войти через VK</span>
      <img src="/public/vk.png" alt="VK" />
    </a>
  </div>
</template>

<style lang="scss">
html,
body,
#__nuxt,
#__nuxt > div {
  @include Flex-C;
  @media (orientation: portrait) {
    align-items: stretch;
  }
}

.container {
  @include Flex-C;
  align-items: stretch;
  width: 150%;

  @media (orientation: portrait) {
    width: 100%;
  }
}

h1 {
  @include Flex-C;
  margin-bottom: 50px;
  font-size: 80px;
  line-height: 64px;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: $dark;
  text-shadow: 0px 0px 50px $light;
}

a {
  @include GlassBackground;
  @include Flex-H;
  justify-content: space-between;
  padding: 5px;
  transition: 0.2s;

  span {
    flex: 1;
    @include Flex-C;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    color: $dark;
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