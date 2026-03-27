<script setup>
const { note } = defineProps({
  note: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <li>
    <p>{{ note.created_on }}</p>
    <p>{{ note.content }}</p>
  </li>
</template>

<style scoped></style>
