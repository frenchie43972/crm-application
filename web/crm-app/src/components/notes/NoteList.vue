<script setup>
import { useNotesStore } from '@/stores/notes.store'
import NoteItem from './NoteItem.vue'

const notesStore = useNotesStore()

// onMounted(() => {
//   notesStore.fetchNotes()
// })
</script>

<template>
  <div>
    <ul>
      <NoteItem v-for="note in notesStore.notes" :key="note.id" :note="note" />
    </ul>
  </div>
</template>

<style scoped></style>
