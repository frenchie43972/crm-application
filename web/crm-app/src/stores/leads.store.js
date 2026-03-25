import { defineStore } from 'pinia'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useLeadsStore = defineStore('leads', {
  state: () => ({
    // The single source of truth for leads data
    leads: [],

    /**
     * UI state that components react to.
     * Example uses:
     * - show loading spinners
     * - display error messages
     */
    loading: false,
    error: null,

    /**
     * Query state used when fetching leads.
     *
     * These values control pagination and filtering
     * when calling the backend API.
     */
    search: '',
    limit: 20,
    offset: 0,
    total: 0,
  }),

  actions: {
    /*
      Fetch a list of leads from the backend.
      This action owns:
      - loading state
      - error handling
      - knowledge of the API response shape
    */
    async fetchLeads() {
      this.loading = true
      this.error = null

      try {
        /**
         * URLSearchParams helps construct query strings safely.
         *
         * Example result:
         * ?search=network&limit=20&offset=0
         */
        const params = new URLSearchParams({
          search: this.search,
          limit: this.limit,
          offset: this.offset,
        })

        /**
         * Performs API request to backend.
         */
        const res = await fetch(`${API_BASE_URL}/leads?${params}`)

        if (!res.ok) {
          throw new Error('Failed to fetch leads')
        }

        /**
         * Backend response structure from the controller:
         * {
         *   data: [...leads],
         *   total: number,
         *   limit: number,
         *   offset: number
         * }
         */
        const result = await res.json()

        // Store the lead data
        this.leads = result.data

        /**
         * Stores the total for pagination.
         */
        this.total = result.total
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        // Always reset loading state whether success or failure
        this.loading = false
      }
    },

    /*
      Create a new lead.
      Components pass a plain object:
      { first_name, last_name, etc. }
    */
    async createLead(leadData) {
      this.error = null

      try {
        const res = await fetch(`${API_BASE_URL}/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData),
        })

        if (!res.ok) {
          throw new Error('Failed to create a new lead')
        }

        await res.json()
        await this.fetchLeads()
      } catch (err) {
        this.error = err.message
        throw err
      }
    },

    /*
      Delete a lead by ID.
      Backend returns 204 No Content on success.
    */
    async deleteLead(id) {
      this.error = null

      try {
        const res = await fetch(`${API_BASE_URL}/leads/${id}`, {
          method: 'DELETE',
        })

        if (!res.ok) {
          throw new Error('Failed to delete lead')
        }

        await this.fetchLeads()
      } catch (err) {
        this.error = err.message
        throw err
      }
    },

    /*
      Update an existing lead.
    */
    async updateLead(id, updates) {
      this.error = null
      try {
        const res = await fetch(`${API_BASE_URL}/leads/${id}`, {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(updates),
        })

        await res.json()
        await this.fetchLeads()
      } catch (err) {
        this.error = err.message
        throw err
      }
    },
  },
})
