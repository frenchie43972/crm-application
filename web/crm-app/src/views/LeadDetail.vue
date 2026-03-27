<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLeadsStore } from '@/stores/leads.store'
import { useNotesStore } from '@/stores/notes.store'

import LeadItem from '@/components/leads/LeadItem.vue'
import NoteList from '@/components/notes/NoteList.vue'

const route = useRoute()
const leadsStore = useLeadsStore()
const notesStore = useNotesStore()

onMounted(() => {
  leadsStore.fetchLeadById(route.params.id)
  notesStore.fetchNotes(route.params.id)
})

const lead = computed(() => leadsStore.currentLead)
</script>

<template>
  <h1>Lead Details</h1>

  <div v-if="leadsStore.loading">Loading...</div>
  <div v-else-if="leadsStore.error">{{ leadsStore.error }}</div>
  <div v-else-if="!lead">Lead not found</div>

  <div v-else>
    <LeadItem :lead="lead" />
    <h3>Notes</h3>

    <div v-if="notesStore.loading">Loading notes...</div>
    <div v-else-if="notesStore.error">{{ notesStore.error }}</div>

    <NoteList v-else />
  </div>
</template>

<style scoped></style>
