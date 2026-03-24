<script setup>
import { onMounted } from 'vue'
import { useLeadsStore } from './stores/leads.store.js'

const leadsStore = useLeadsStore()

onMounted(() => {
  leadsStore.fetchLeads()
})
</script>

<template>
  <div>
    <div v-if="leadsStore.loading">Loading...</div>
    <div v-if="leadsStore.error">{{ leadsStore.error }}</div>

    <ul>
      <li v-for="lead in leadsStore.leads" :key="lead.id">
        <div>
          <p>{{ lead.first_name }}</p>
          <p>{{ lead.last_name }}</p>
          <p>{{ lead.email }}</p>
          <p>{{ lead.phone }}</p>
          <p>{{ lead.company }}</p>
          <p>{{ lead.status }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
