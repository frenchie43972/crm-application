<script setup>
import { ref } from 'vue'
import { useNotesStore } from '@/stores/notes.store'

const { leadId } = defineProps({
  leadId: {
    type: [String, Number],
    required: true,
  },
})

const notesStore = useNotesStore()
const emit = defineEmits(['success', 'cancel'])

const content = ref('')
const formError = ref(null)

/**
 * Basic client-side validation before submitting.
 */
function validate() {
  if (!content.value.trim()) {
    formError.value = 'Note content is required.'
    return false
  }

  formError.value = null
  return true
}

// Handles form submission
async function handleSubmit() {
  if (!validate()) return

  try {
    await notesStore.createNote(leadId, {
      content: content.value,
    })

    content.value = ''
    emit('success')
  } catch (err) {
    formError.value = err.message || 'An unexpected error occured'
  }
}

// Cancel button handler
function handleCancel() {
  content.value = ''
  emit('cancel')
}

// watch(
//   () => props.notes,

//   /**
//    * This callback runs whenever props.notes changes.
//    */
//   (newNote) => {
//     // Safeguard to ensure a note Object exists
//     if (newNote) {
//       /**
//        * Puts the values into the local ref(s)
//        * and newNote.content ?? '' ensures content is always a string
//        */
//       content.value = newNote.content ?? ''
//     }
//   },

//   /**
//    * immediate: true means the watcher runs
//    * once when the component is first mounted.
//    */
//   { immediate: true },
// )
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>Contact Note</label>
      <textarea v-model="content" placeholder="Note Details"></textarea>
    </div>

    <p v-if="formError">{{ formError }}</p>

    <div>
      <button type="submit">Save Note</button>
      <button type="button" @click="handleCancel">Cancel</button>
    </div>
  </form>
</template>

<style scoped></style>
