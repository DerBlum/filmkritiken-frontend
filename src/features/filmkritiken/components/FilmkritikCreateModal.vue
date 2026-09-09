<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from '@/composables/useToast'
import { useFilmCreateModal } from '@/features/filmkritiken/composables/useFilmCreateModal'
import { createFilm, fetchFilterOptions } from '@/features/filmkritiken/services/filmkritikenService'
import type { CreateFilmPayload } from '@/features/filmkritiken/types/filmkritik'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { showToast } = useToast()
const { isOpen, closeModal } = useFilmCreateModal()

// Filter options for Beitragende datalist
const bekannteBeitragende = ref<string[]>([])

// Form state
const titel = ref('')
const originaltitel = ref('')
const erscheinungsjahr = ref<number | ''>(new Date().getFullYear())
const regie = ref('')
const laenge = ref<number | ''>('')
const altersfreigabe = ref<number | ''>('')
const produktionsland = ref('')
const originalsprache = ref('')
const beitragvon = ref('')
const besprochenam = ref('')
const bewertungoffen = ref(false)
const copyright = ref('IMDb')

// Image upload state
const imageFile = ref<File | null>(null)
const imagePreviewUrl = ref<string | null>(null)
const isDragging = ref(false)

// Validation & Loading
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

// Check if form has unsaved modifications
const isDirty = computed(() => {
  return (
    titel.value.trim() !== '' ||
    originaltitel.value.trim() !== '' ||
    regie.value.trim() !== '' ||
    laenge.value !== '' ||
    altersfreigabe.value !== '' ||
    produktionsland.value.trim() !== '' ||
    originalsprache.value.trim() !== '' ||
    besprochenam.value !== '' ||
    bewertungoffen.value !== false ||
    copyright.value !== 'IMDb' ||
    imageFile.value !== null
  )
})

function resetForm(): void {
  titel.value = ''
  originaltitel.value = ''
  erscheinungsjahr.value = new Date().getFullYear()
  regie.value = ''
  laenge.value = ''
  altersfreigabe.value = ''
  produktionsland.value = ''
  originalsprache.value = ''
  beitragvon.value = authStore.user || ''
  besprochenam.value = ''
  bewertungoffen.value = false
  copyright.value = 'IMDb'
  errors.value = {}

  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value)
    imagePreviewUrl.value = null
  }
  imageFile.value = null
}

// Initialize form when modal opens
watch(isOpen, async (open) => {
  if (open) {
    resetForm()
    beitragvon.value = authStore.user || ''
    try {
      const opts = await fetchFilterOptions()
      if (opts?.beitragende) {
        bekannteBeitragende.value = opts.beitragende
      }
    } catch {
      // Ignoriere Fehler beim Laden der Vorschläge
    }
  }
})

// Image file selection & drag/drop
function onFileChange(e: Event): void {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    handleFile(target.files[0])
  }
}

function handleFile(file: File): void {
  if (!file.type.startsWith('image/')) {
    errors.value.image = 'Bitte eine gültige Bilddatei auswählen (z. B. JPG, PNG, WEBP).'
    return
  }
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value)
  }
  imageFile.value = file
  imagePreviewUrl.value = URL.createObjectURL(file)
  delete errors.value.image
}

function onDrop(e: DragEvent): void {
  isDragging.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    handleFile(e.dataTransfer.files[0])
  }
}

function removeImage(): void {
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value)
    imagePreviewUrl.value = null
  }
  imageFile.value = null
}

// Backdrop and Close handling
function handleBackdropClick(): void {
  if (isDirty.value) {
    // Klick auf Backdrop wird ignoriert, wenn Formular dirty ist (Schutz vor versehentlichem Verlust)
    return
  }
  closeModal()
}

function handleCancel(): void {
  closeModal()
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape' && isOpen.value) {
    if (!isDirty.value) {
      closeModal()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value)
  }
})

function validate(): boolean {
  const newErrors: Record<string, string> = {}

  if (!titel.value.trim()) {
    newErrors.titel = 'Titel ist erforderlich.'
  }

  if (erscheinungsjahr.value === '' || isNaN(Number(erscheinungsjahr.value))) {
    newErrors.erscheinungsjahr = 'Erscheinungsjahr ist erforderlich.'
  } else {
    const year = Number(erscheinungsjahr.value)
    if (year < 1888 || year > 2100) {
      newErrors.erscheinungsjahr = 'Bitte ein gültiges Jahr (z. B. 2024) eingeben.'
    }
  }

  if (!beitragvon.value.trim()) {
    newErrors.beitragvon = 'Beitrag von ist erforderlich.'
  }

  if (!besprochenam.value) {
    newErrors.besprochenam = 'Besprochen am ist erforderlich.'
  }

  if (!imageFile.value) {
    newErrors.image = 'Bitte ein Filmplakat hochladen (wird vom Server verlangt).'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

async function handleSubmit(): Promise<void> {
  if (!validate() || !imageFile.value) {
    return
  }

  isSubmitting.value = true
  try {
    const besprochenAmIso = new Date(`${besprochenam.value}T12:00:00Z`).toISOString()

    const payload: CreateFilmPayload = {
      von: beitragvon.value.trim(),
      besprochenam: besprochenAmIso,
      bewertungoffen: bewertungoffen.value,
      film: {
        titel: titel.value.trim(),
        originaltitel: originaltitel.value.trim() || null,
        erscheinungsjahr: Number(erscheinungsjahr.value),
        regie: regie.value.trim() || null,
        laenge: laenge.value !== '' ? Number(laenge.value) : null,
        altersfreigabe: altersfreigabe.value !== '' ? Number(altersfreigabe.value) : null,
        produktionsland: produktionsland.value.trim() || null,
        originalsprache: originalsprache.value.trim() || null,
        image: {
          source: '',
          copyright: copyright.value.trim() || 'IMDb',
          id: '',
        },
      },
    }

    await createFilm(payload, imageFile.value)

    showToast(`„${payload.film.titel}“ wurde erfolgreich hinzugefügt.`, 'success')
    closeModal()
    resetForm()

    if (route.path !== '/') {
      await router.push('/')
    }
  } catch (err: unknown) {
    // Fehlerbehandlung erfolgt teilweise im apiClient-Interceptor
    showToast('Fehler beim Anlegen des Films. Bitte prüfe deine Eingaben.', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <!-- Modal Overlay (only rendered when isOpen & user has canAddFilm permission) -->
  <div
    v-if="isOpen && authStore.canAddFilm"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md transition-all duration-300"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    @click.self="handleBackdropClick"
  >
    <div
      class="cinema-glass w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh] my-auto bg-slate-950/95"
    >
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🎬</span>
          <h2 id="modal-title" class="text-xl font-bold text-cinema-text">Film hinzufügen</h2>
        </div>
        <button
          type="button"
          class="text-cinema-text-muted hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Modal schließen"
          @click="handleCancel"
        >
          ✕
        </button>
      </div>

      <!-- Modal Body (Scrollable Form) -->
      <form id="create-film-form" class="overflow-y-auto p-6 space-y-6 flex-1" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Left Column: Poster Upload & Copyright (lg:col-span-5) -->
          <div class="lg:col-span-5 space-y-4">
            <label class="block text-sm font-semibold text-cinema-text">
              Filmplakat <span class="text-cinema-red">*</span>
            </label>

            <!-- Dropzone -->
            <div
              class="relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-200 aspect-[2/3] max-h-[380px] w-full mx-auto"
              :class="[
                isDragging ? 'border-cinema-red bg-cinema-red/10' : 'border-white/20 hover:border-white/40 bg-black/30',
                errors.image ? 'border-rose-500 bg-rose-500/10' : ''
              ]"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onDrop"
            >
              <!-- Preview if selected -->
              <template v-if="imagePreviewUrl">
                <img
                  :src="imagePreviewUrl"
                  alt="Filmplakat Vorschau"
                  class="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
                <div class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 rounded-lg">
                  <span class="text-xs text-cinema-text-muted font-medium truncate max-w-full">
                    {{ imageFile?.name }}
                  </span>
                  <button
                    type="button"
                    class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow transition-all"
                    @click="removeImage"
                  >
                    Plakat entfernen
                  </button>
                </div>
              </template>

              <!-- Empty State / File Selector -->
              <template v-else>
                <div class="flex flex-col items-center justify-center gap-2 p-4">
                  <span class="text-4xl text-cinema-text-muted">🖼️</span>
                  <p class="text-sm font-medium text-cinema-text">Bild hierher ziehen</p>
                  <p class="text-xs text-cinema-text-muted">oder Datei auswählen</p>
                  <label
                    class="mt-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-cinema-text text-xs font-semibold rounded-lg cursor-pointer transition-all duration-200"
                  >
                    Datei durchsuchen
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="onFileChange"
                    />
                  </label>
                </div>
              </template>
            </div>
            <p v-if="errors.image" class="text-xs text-rose-400 font-medium">
              {{ errors.image }}
            </p>

            <!-- Copyright Input -->
            <div class="space-y-1">
              <label for="copyright-input" class="block text-xs font-medium text-cinema-text-muted">
                Bildquelle / Copyright
              </label>
              <input
                id="copyright-input"
                v-model="copyright"
                type="text"
                placeholder="z. B. IMDb"
                class="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-lg text-sm text-cinema-text placeholder-cinema-text-muted/40 focus:outline-none focus:border-cinema-red"
              />
            </div>
          </div>

          <!-- Right Column: Film Metadata (lg:col-span-7) -->
          <div class="lg:col-span-7 space-y-4">
            
            <!-- Titel (Pflichtfeld) -->
            <div class="space-y-1">
              <label for="titel-input" class="block text-sm font-semibold text-cinema-text">
                Titel <span class="text-cinema-red">*</span>
              </label>
              <input
                id="titel-input"
                v-model="titel"
                type="text"
                required
                placeholder="z. B. Inception"
                class="w-full px-3.5 py-2.5 bg-black/40 border rounded-lg text-cinema-text placeholder-cinema-text-muted/40 focus:outline-none transition-colors"
                :class="errors.titel ? 'border-rose-500 focus:border-rose-500' : 'border-white/15 focus:border-cinema-red'"
              />
              <p v-if="errors.titel" class="text-xs text-rose-400 font-medium">{{ errors.titel }}</p>
            </div>

            <!-- Originaltitel -->
            <div class="space-y-1">
              <label for="originaltitel-input" class="block text-sm font-medium text-cinema-text-muted">
                Originaltitel
              </label>
              <input
                id="originaltitel-input"
                v-model="originaltitel"
                type="text"
                placeholder="z. B. Inception (falls abweichend)"
                class="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-lg text-sm text-cinema-text placeholder-cinema-text-muted/40 focus:outline-none focus:border-cinema-red transition-colors"
              />
            </div>

            <!-- 2-spaltig: Erscheinungsjahr & Laufzeit -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label for="jahr-input" class="block text-sm font-semibold text-cinema-text">
                  Erscheinungsjahr <span class="text-cinema-red">*</span>
                </label>
                <input
                  id="jahr-input"
                  v-model="erscheinungsjahr"
                  type="number"
                  min="1888"
                  max="2100"
                  required
                  placeholder="z. B. 2010"
                  class="w-full px-3.5 py-2 bg-black/40 border rounded-lg text-sm text-cinema-text placeholder-cinema-text-muted/40 focus:outline-none transition-colors"
                  :class="errors.erscheinungsjahr ? 'border-rose-500 focus:border-rose-500' : 'border-white/15 focus:border-cinema-red'"
                />
                <p v-if="errors.erscheinungsjahr" class="text-xs text-rose-400 font-medium">{{ errors.erscheinungsjahr }}</p>
              </div>

              <div class="space-y-1">
                <label for="laenge-input" class="block text-sm font-medium text-cinema-text-muted">
                  Laufzeit (Minuten)
                </label>
                <input
                  id="laenge-input"
                  v-model="laenge"
                  type="number"
                  min="1"
                  placeholder="z. B. 148"
                  class="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-lg text-sm text-cinema-text placeholder-cinema-text-muted/40 focus:outline-none focus:border-cinema-red transition-colors"
                />
              </div>
            </div>

            <!-- Regie -->
            <div class="space-y-1">
              <label for="regie-input" class="block text-sm font-medium text-cinema-text-muted">
                Regie
              </label>
              <input
                id="regie-input"
                v-model="regie"
                type="text"
                placeholder="z. B. Christopher Nolan"
                class="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-lg text-sm text-cinema-text placeholder-cinema-text-muted/40 focus:outline-none focus:border-cinema-red transition-colors"
              />
            </div>

            <!-- 2-spaltig: FSK & Originalsprache -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label for="fsk-select" class="block text-sm font-medium text-cinema-text-muted">
                  Altersfreigabe (FSK)
                </label>
                <select
                  id="fsk-select"
                  v-model="altersfreigabe"
                  class="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-lg text-sm text-cinema-text focus:outline-none focus:border-cinema-red transition-colors"
                >
                  <option :value="''">Keine Angabe</option>
                  <option :value="0">FSK 0</option>
                  <option :value="6">FSK 6</option>
                  <option :value="12">FSK 12</option>
                  <option :value="16">FSK 16</option>
                  <option :value="18">FSK 18</option>
                </select>
              </div>

              <div class="space-y-1">
                <label for="sprache-input" class="block text-sm font-medium text-cinema-text-muted">
                  Originalsprache
                </label>
                <input
                  id="sprache-input"
                  v-model="originalsprache"
                  type="text"
                  placeholder="z. B. Englisch"
                  class="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-lg text-sm text-cinema-text placeholder-cinema-text-muted/40 focus:outline-none focus:border-cinema-red transition-colors"
                />
              </div>
            </div>

            <!-- Produktionsland -->
            <div class="space-y-1">
              <label for="land-input" class="block text-sm font-medium text-cinema-text-muted">
                Produktionsland
              </label>
              <input
                id="land-input"
                v-model="produktionsland"
                type="text"
                placeholder="z. B. Vereinigte Staaten, Großbritannien"
                class="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-lg text-sm text-cinema-text placeholder-cinema-text-muted/40 focus:outline-none focus:border-cinema-red transition-colors"
              />
            </div>

            <hr class="border-white/10 my-4" />

            <!-- Metadaten des Filmabends: Beitrag von & Besprochen am -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <!-- Beitrag von (Pflichtfeld mit Datalist) -->
              <div class="space-y-1">
                <label for="beitragvon-input" class="block text-sm font-semibold text-cinema-text">
                  Beitrag von <span class="text-cinema-red">*</span>
                </label>
                <input
                  id="beitragvon-input"
                  v-model="beitragvon"
                  type="text"
                  list="beitragende-list"
                  required
                  placeholder="Name des Mitglieds"
                  class="w-full px-3.5 py-2 bg-black/40 border rounded-lg text-sm text-cinema-text placeholder-cinema-text-muted/40 focus:outline-none transition-colors"
                  :class="errors.beitragvon ? 'border-rose-500 focus:border-rose-500' : 'border-white/15 focus:border-cinema-red'"
                />
                <datalist id="beitragende-list">
                  <option v-for="b in bekannteBeitragende" :key="b" :value="b" />
                </datalist>
                <p v-if="errors.beitragvon" class="text-xs text-rose-400 font-medium">{{ errors.beitragvon }}</p>
              </div>

              <!-- Besprochen am (Pflichtfeld) -->
              <div class="space-y-1">
                <label for="besprochenam-input" class="block text-sm font-semibold text-cinema-text">
                  Besprochen am <span class="text-cinema-red">*</span>
                </label>
                <input
                  id="besprochenam-input"
                  v-model="besprochenam"
                  type="date"
                  required
                  class="w-full px-3.5 py-2 bg-black/40 border rounded-lg text-sm text-cinema-text focus:outline-none transition-colors"
                  :class="errors.besprochenam ? 'border-rose-500 focus:border-rose-500' : 'border-white/15 focus:border-cinema-red'"
                />
                <p v-if="errors.besprochenam" class="text-xs text-rose-400 font-medium">{{ errors.besprochenam }}</p>
                <p v-else class="text-[11px] text-cinema-text-muted/60">
                  Datum des Filmabends (Zukunft = Nächster Film).
                </p>
              </div>
            </div>

            <!-- Bewertung offen (Toggle) -->
            <div class="flex items-center justify-between pt-2">
              <div>
                <span class="text-sm font-semibold text-cinema-text block">Bewertungen geöffnet</span>
                <span class="text-xs text-cinema-text-muted">
                  Können Mitglieder direkt nach dem Erstellen bewerten?
                </span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="bewertungoffen"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-white/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cinema-red"
                ></div>
              </label>
            </div>

          </div>
        </div>
      </form>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3 bg-black/40">
        <button
          type="button"
          class="px-4 py-2 rounded-lg text-sm font-medium text-cinema-text-muted hover:text-white hover:bg-white/10 transition-colors"
          :disabled="isSubmitting"
          @click="handleCancel"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          form="create-film-form"
          class="px-5 py-2 rounded-lg text-sm font-semibold bg-cinema-red hover:opacity-90 text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="animate-spin text-sm">⏳</span>
          <span>{{ isSubmitting ? 'Wird angelegt...' : 'Film anlegen' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
