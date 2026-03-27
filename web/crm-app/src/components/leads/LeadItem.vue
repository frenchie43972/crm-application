<script setup>
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

function goToDetails() {
  router.push({
    name: 'lead-detail',
    params: { id: lead.id },
  })
}
</script>

<template>
  <li>
    <div>
      <p>{{ lead.first_name }}</p>
      <p>{{ lead.last_name }}</p>
      <p>{{ lead.email }}</p>
      <p>{{ lead.phone }}</p>
      <p>{{ lead.company }}</p>
      <p>{{ lead.status }}</p>
    </div>
    <label class="goToDetails" @click="goToDetails">...more info</label>
  </li>
</template>

<style scoped>
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-sm);
  min-height: 180px;
}

.goToDetails {
  cursor: pointer;
  font-weight: 500;
}

.goToDetails:hover {
  opacity: 60%;
}
</style>
