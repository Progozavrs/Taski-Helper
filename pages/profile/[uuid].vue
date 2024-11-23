<script setup>
definePageMeta({
  layout: "profile",
});
const { uuid } = useRoute().params;
</script>

<template>
  <div>
    <h1>UUID</h1>
    <h1>{{ uuid }}</h1>
  </div>
</template>