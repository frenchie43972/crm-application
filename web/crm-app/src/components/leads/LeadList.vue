<script setup>
import { onMounted } from 'vue'
import { useLeadsStore } from '@/stores/leads.store'

import LeadItem from './LeadItem.vue'

const leadsStore = useLeadsStore()

onMounted(() => {
  leadsStore.fetchLeads()
})
</script>

<template>
  <h3>Lead List</h3>
  <div>
    <ul>
      <LeadItem v-for="lead in leadsStore.leads" :key="lead.id" :lead="lead" />
    </ul>
  </div>
</template>

<style scoped></style>
