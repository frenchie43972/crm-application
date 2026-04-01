<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLeadsStore } from '@/stores/leads.store'
import { useNotesStore } from '@/stores/notes.store'

import LeadItem from '@/components/leads/LeadItem.vue'
import NoteList from '@/components/notes/NoteList.vue'
import NoteForm from '@/components/notes/NoteForm.vue'

const route = useRoute()
const leadsStore = useLeadsStore()
const notesStore = useNotesStore()

const loadData = (id) => {
  leadsStore.fetchLeadById(id)
  notesStore.fetchNotes(id)
}

onMounted(() => {
  loadData(route.params.id)
})

watch(
  () => route.params.id,
  (newId) => {
    loadData(newId)
  },
)

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

    <hr />

    <NoteForm :leadId="lead.id" />
  </div>
</template>

<style scoped></style>
