import { defineStore } from 'pinia'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [],

    loading: false,
    error: null,

    search: '',
  }),

  actions: {
    async fetchNotes(leadId) {
      this.loading = true
      this.error = null

      try {
        const res = await fetch(`${API_BASE_URL}/leads/${leadId}/notes`)

        if (!res.ok) {
          throw new Error('Failed to fetch notes')
        }

        const result = await res.json()

        this.notes = result.data
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async createNote(leadId, noteData) {
      this.error = null

      try {
        const res = await fetch(`${API_BASE_URL}/leads/${leadId}/notes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/JSON' },
          body: JSON.stringify(noteData),
        })

        if (!res.ok) {
          throw new Error('Failed to create a new note')
        }

        await res.json()
        await this.fetchNotes(leadId)
      } catch (err) {
        this.error = err.message
        throw err
      }
    },
  },
})
