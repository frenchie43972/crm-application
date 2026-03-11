# CRM Backend Plan – Version 1 Architecture Guide

## Purpose of This Document

This document defines the backend scope and architectural goals for Version 1 of the Lightweight CRM application.

This CRM is not intended to be enterprise-grade. It is a controlled evolution designed to:

- Introduce relational modeling
- Increase SQL complexity slightly
- Reinforce separation of concerns
- Maintain migration-driven schema discipline
- Preserve route-driven frontend compatibility

The architecture must remain layered, deterministic at startup, and contract-stable.

# Version 1 Functional Scope

Version 1 will support the following core capabilities:

The system will allow users to create, update, delete, and list Leads.  
Each Lead will represent a potential business opportunity.  
Each Lead will move through a predefined lifecycle stage.  
Each Lead will support multiple Notes representing interactions.  
The system will support filtering, searching, and pagination of Leads.  
The system will return aggregated metadata where appropriate.

No authentication, multi-user support, dashboards, or dynamic pipeline configuration will be included in Version 1.

# Domain Model

## Lead

A Lead represents a potential customer or business opportunity.

A Lead contains:

- id
- name
- company
- email
- phone (optional)
- stage (enumerated value)
- estimated_value (optional numeric)
- created_date
- updated_date

The stage field represents lifecycle progression. Version 1 will use a controlled enumerated list such as:

New  
Contacted  
Qualified  
Proposal Sent  
Won  
Lost

This reinforces lifecycle modeling beyond a simple boolean flag.

## Note

A Note represents an interaction related to a Lead.

A Note contains:

- id
- lead_id (foreign key → leads.id)
- content
- created_date

Each Lead may have multiple Notes. Each Note belongs to exactly one Lead.

This introduces one-to-many relational modeling.

# Backend Architectural Concepts to Reinforce

## 1. Strict Layering

The backend will continue to follow the established separation:

Router → Controller → Query → Database

Controllers will handle:

- Request validation
- Parameter parsing
- HTTP status codes
- Response envelope formatting

Query modules will handle:

- SQL statements
- Joins
- Aggregations
- Foreign key operations

Controllers will not contain SQL.
Queries will not contain HTTP logic.

## 2. Migration-Driven Schema Evolution

The CRM schema will be introduced through versioned migration files.

Migration 1:

- Create leads table

Migration 2:

- Create notes table with foreign key reference

Foreign key constraints must be explicitly defined to reinforce referential integrity.

No schema logic should exist inside database connection files.

## 3. Relational Integrity

The notes table will reference leads.id via foreign key.

Deletion strategy for Version 1:

ON DELETE CASCADE

This simplifies controller logic and reinforces database responsibility for relational cleanup.

The database should own referential integrity, not JavaScript.

## 4. SQL Notch-Up: Aggregation

The Leads list endpoint will include a derived field:

last_contacted_at

This value will represent the most recent note date for each lead.

This requires either:

- A LEFT JOIN with MAX(notes.created_date)
- Or a correlated subquery

This introduces aggregation and grouping while maintaining clarity.

The Leads list response should include:

- data (array of leads with last_contacted_at)
- total
- limit
- offset

Pagination and filtering must still occur at the SQL level.

## 5. Search and Filtering

Filtering will support:

- search (name or company)
- stage (exact match)
- pagination (limit, offset)

Search logic will be implemented in SQL WHERE clauses.

Controllers will normalize query parameters before passing them to the query layer.

## 6. Defensive Parameter Parsing

Controllers must:

- Validate numeric IDs
- Validate pagination bounds
- Validate stage against allowed enum values
- Coerce numeric fields safely

Invalid inputs must produce clear 400 responses.

Nonexistent resources must produce 404 responses.

## 7. Response Envelope Consistency

All endpoints must return consistent response envelopes:

Single resource:
{
"data": { ... }
}

List resource:
{
"data": [...],
"total": number,
"limit": number,
"offset": number
}

Error responses must remain consistent across controllers.

## 8. Endpoint Overview

Leads:

GET /leads  
GET /leads/:id  
POST /leads  
PUT /leads/:id  
DELETE /leads/:id

Notes:

GET /leads/:id/notes  
POST /leads/:id/notes  
DELETE /notes/:id

Note creation should validate that the parent lead exists.

# Backend Directory Structure

The structure should mirror the Task Manager template while expanding for relational modeling.

api/
│
├── src/
│ │
│ ├── db/
│ │ ├── database.js
│ │ ├── migrations/
│ │ │ ├── 001_create_leads.sql
│ │ │ ├── 002_create_notes.sql
│ │ │
│ │ └── queries/
│ │ ├── leads.queries.js
│ │ └── notes.queries.js
│ │
│ ├── controllers/
│ │ ├── leads.controller.js
│ │ └── notes.controller.js
│ │
│ ├── routes/
│ │ ├── leads.routes.js
│ │ └── notes.routes.js
│ │
│ ├── middleware/
│ │ └── errorHandler.js
│ │
│ ├── utils/
│ │ ├── parseId.js
│ │ ├── parsePagination.js
│ │ └── validateStage.js
│ │
│ ├── app.js
│ └── server.js
│
├── package.json
└── README.md

# Structural Intent

This CRM backend must feel like a natural evolution of the Task Manager template.

It should demonstrate:

- Controlled relational modeling
- Slightly more expressive SQL
- Clean migration management
- Strong input validation
- Stable API contracts
- Predictable startup lifecycle

The system should remain small, readable, and disciplined.

---

# CRM Frontend Plan – Version 1 Architecture Guide

## Purpose of This Document

This document defines the frontend scope and architectural direction for Version 1 of the Lightweight CRM application.

The goal is not to create a visually complex interface. The goal is to reinforce disciplined state management, route-driven UI state, relational data rendering, and improved UX clarity.

Version 1 should demonstrate:

- Clear page composition
- Route-driven filtering and pagination
- Proper parent–child data rendering (Lead + Notes)
- Controlled form validation
- Clean separation between view logic and form components
- Improved error handling and UX feedback

The frontend must remain structured, predictable, and maintainable.

---

# Version 1 UI Scope

The application will include the following views:

Leads List View  
Lead Detail View  
Lead Form View (Create / Edit)

The system will not include authentication, multi-user logic, dashboards, drag-and-drop pipelines, or analytics visualizations.

---

# Route Structure

The URL must represent application state.

Routes:

/  
Displays paginated list of leads with filtering and search.

/leads/new  
Displays form for creating a new lead.

/leads/:id  
Displays a lead detail page including notes.

/leads/:id/edit  
Displays form for editing a lead.

Query parameters for list view:

- search
- stage
- limit
- offset
- sort (optional for Version 1 if implemented)

Route changes must trigger store synchronization and data fetches.

---

# Store Responsibilities

The store must act as the single IO boundary.

It will manage:

- leads array
- selectedLead (for detail view)
- notes array (for selected lead)
- loading state
- error state
- search
- stage filter
- pagination (limit, offset)
- total count

The store must:

- Perform all API requests
- Parse response envelopes
- Normalize state
- Refetch after mutations to preserve backend authority

Components must not parse raw fetch responses.

---

# Leads List View

This page is responsible for:

- Synchronizing route query parameters into store state
- Triggering lead fetch
- Rendering loading, error, and empty states
- Rendering LeadList component
- Handling pagination controls
- Handling stage filtering controls
- Handling search input
- Navigating to Create page

The list page must remain thin and delegate rendering to collection components.

---

# Lead List Component

The LeadList component renders a collection of LeadItem components.

It must not perform fetch operations.

It receives data indirectly via store state.

Layout should be structured and clean. Either:

- Responsive grid
  or
- Structured vertical list with summary metadata

Each lead summary should display:

- Name
- Company
- Stage
- Estimated value (if present)
- Last contacted date (derived field from backend)

Each lead item should include:

- View button (navigates to detail)
- Edit button
- Delete button (with confirmation)

---

# Lead Detail View

The Lead Detail page introduces relational rendering.

It must display:

Lead summary information at the top  
Stage and contact metadata  
List of notes below  
Form to add a new note

This page should:

- Fetch lead by ID
- Fetch notes for lead
- Handle invalid ID redirects
- Display notes chronologically (newest first recommended)
- Allow note creation without page reload
- Refetch notes after creation to maintain authority

This is the primary UI “notch-up” compared to the previous project.

---

# Lead Form View

The Lead Form must support both Create and Edit modes.

It must:

- Accept props for existing lead
- Emit success and cancel events
- Perform client-side validation
- Surface backend validation errors
- Not control navigation directly

Required fields:

- name
- stage

Optional fields:

- company
- email
- phone
- estimated_value

Validation must:

- Prevent empty required submissions
- Validate stage against allowed values
- Handle numeric coercion safely
- Display error messages clearly

---

# Note Handling

Notes are managed within the Lead Detail page.

Version 1 behavior:

- Add note
- Delete note
- No editing notes in Version 1

The note form must:

- Validate non-empty content
- Reset after successful submission
- Surface backend errors

Notes must be visually distinct and ordered chronologically.

---

# UX Refinement Goals

Version 1 should improve user clarity compared to previous projects.

The UI should:

- Clearly distinguish loading states
- Display friendly empty states
- Disable buttons during async operations
- Confirm destructive actions
- Highlight active filters
- Keep layout visually structured

Visual complexity is not required. Structural clarity is required.

---

# Error Handling Improvements

The frontend should demonstrate:

- Centralized store-level error handling
- Clear display of server validation errors
- Graceful handling of 404 routes
- Prevention of duplicate submissions
- Defensive handling of stale route parameters

The application should never silently fail.

---

# Component Structure

Recommended structure:

web/
│
├── index.html
├── package.json
│
├── src/
│ │
│ ├── assets/
│ │ └── main.css
│ │
│ ├── components/
│ │ ├── leads/
│ │ │ ├── LeadList.vue
│ │ │ ├── LeadItem.vue
│ │ │ ├── LeadForm.vue
│ │ │
│ │ ├── notes/
│ │ │ ├── NoteList.vue
│ │ │ ├── NoteItem.vue
│ │ │ └── NoteForm.vue
│ │
│ ├── views/
│ │ ├── LeadsView.vue
│ │ ├── LeadDetailView.vue
│ │ └── LeadFormView.vue
│ │
│ ├── stores/
│ │ └── lead.store.js
│ │
│ ├── router/
│ │ └── index.js
│ │
│ ├── App.vue
│ └── main.js

---

# Structural Intent

This frontend must demonstrate progression beyond simple CRUD.

It should show:

- Route-driven state discipline
- Parent-child relational rendering
- Controlled lifecycle state transitions
- Improved UX clarity
- Clean component boundaries
- Predictable data flow

The result should feel like a small internal SaaS tool rather than a demo application.

Version 1 remains intentionally constrained.

The goal is structural growth, not feature inflation.
