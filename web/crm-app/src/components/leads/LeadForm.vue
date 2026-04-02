/** * Reusable form component used for both creating and editing leads. * * - When `isEdit` is false
→ creates a new lead * - When `isEdit` is true → updates an existing lead * * Instead of creating
separate forms for "create" and "edit", * one component handles both cases using props. */
<script setup>
import { ref, watch } from 'vue'
import { useLeadsStore } from '@/stores/leads.store'

const props = defineProps({
  lead: {
    type: Object,
    required: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['success', 'cancel'])
const leadsStore = useLeadsStore()

const first_name = ref('')
const last_name = ref('')
const email = ref('')
const phone = ref('')
const company = ref('')
const status = ref('')

const formError = ref(null)

function validate() {
  const requiredFields = [
    { key: 'first_name', value: first_name.value, label: 'First name' },
    { key: 'last_name', value: last_name.value, label: 'Last name' },
    { key: 'email', value: email.value, label: 'Email' },
    { key: 'phone', value: phone.value, label: 'Phone' },
  ]

  for (const field of requiredFields) {
    if (!field.value || String(field.value).trim() === '') {
      formError.value = `${field.label} is required`
      return false
    }
  }

  formError.value = null

  return true
}

async function handleSubmit() {
  if (!validate()) return

  try {
    if (props.isEdit && props.lead) {
      await leadsStore.updateLead(props.lead.id, {
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        phone: phone.value,
        company: company.value,
        status: status.value,
      })
    } else {
      await leadsStore.createLead({
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        phone: phone.value,
        company: company.value,
        status: status.value,
      })
    }

    emit('success')
  } catch (err) {
    formError.value = err.message || 'An unexpected error occurred'
  }
}

function handleCancel() {
  emit('cancel')
}

watch(
  () => props.lead,
  (newLead) => {
    if (newLead) {
      first_name.value = newLead.first_name ?? ''
      last_name.value = newLead.last_name ?? ''
      email.value = newLead.email ?? ''
      phone.value = newLead.phone ?? ''
      company.value = newLead.company ?? ''
      status.value = newLead.status ?? ''
    }
  },
  { immediate: true },
)
</script>

<template>
  <h2>Lead Form</h2>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>First Name</label>
      <input v-model="first_name" />
    </div>

    <div>
      <label>Last Name</label>
      <input v-model="last_name" />
    </div>

    <div>
      <label>Email</label>
      <input v-model="email" />
    </div>

    <div>
      <label>Phone Number</label>
      <input v-model="phone" />
    </div>

    <div>
      <label>Company</label>
      <input v-model="company" />
    </div>

    <div>
      <select v-model="status">
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Qualified">Qualified</option>
        <option value="Proposal">Proposal</option>
        <option value="Negotiation">Negotiation</option>
        <option value="Won">Won</option>
        <option value="Lost">Lost</option>
      </select>
    </div>

    <div>
      <button>
        {{ isEdit ? 'Save Changes' : 'Create Lead' }}
      </button>
      <button type="button" @click="handleCancel">Cancel</button>
    </div>
  </form>
</template>

<style scoped></style>
