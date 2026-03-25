<script setup>
import { useLeadsStore } from '@/stores/leads.store'
import { useRouter } from 'vue-router'

/**
 * defineProps is part of Vue's <script setup> syntax.
 *
 * It declares the props the component expects.
 * In this case we require a task object.
 */
const { lead } = defineProps({
  lead: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const leadStore = useLeadsStore()
</script>

<template>
  <h1>Lead Item</h1>
</template>

<style scoped></style>
