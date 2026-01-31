<script setup>
import { ref, onMounted } from 'vue'

const awards = ref([])
const services = ref([])
const mentees = ref([])

onMounted(async () => {
  try {
    const [awardsRes, servicesRes, menteesRes] = await Promise.all([
      fetch('/data/awards.json'),
      fetch('/data/service.json'),
      fetch('/data/mantees.json')
    ])
    awards.value = await awardsRes.json()
    services.value = await servicesRes.json()
    mentees.value = await menteesRes.json()
  } catch (error) {
    console.error('Error loading data:', error)
  }
})
</script>

<template>
  <section class="py-16 bg-[var(--theme-surface)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Three Column Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <!-- Awards Panel -->
        <div class="bg-[var(--theme-surface-container)] rounded-2xl border border-[var(--theme-card-border)] p-6">
          <div class="mb-6">
            <p class="text-[var(--theme-accent)] font-medium tracking-wide uppercase text-sm mb-2">
              Recognition
            </p>
            <h2 class="text-xl font-bold text-[var(--theme-on-surface)]">
              Awards
            </h2>
          </div>

          <div class="space-y-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto custom-scrollbar hide-scrollbar-mobile pr-2">
            <a
              v-for="(award, index) in awards"
              :key="index"
              :href="award.url"
              target="_blank"
              class="block p-4 rounded-xl bg-[var(--theme-surface-container-high)] border border-[var(--theme-card-border)] hover:border-[var(--theme-accent)]/30 transition-all duration-300 min-h-[44px]"
            >
              <h3 class="text-[var(--theme-on-surface)] font-medium text-sm mb-2 hover:text-[var(--theme-accent)] transition-colors">
                {{ award.name }}
              </h3>
              <p class="text-[var(--theme-on-surface-variant)] text-xs leading-relaxed">
                {{ award.event }}
              </p>
            </a>
          </div>
        </div>

        <!-- Services Panel -->
        <div class="bg-[var(--theme-surface-container)] rounded-2xl border border-[var(--theme-card-border)] p-6">
          <div class="mb-6">
            <p class="text-[var(--theme-accent)] font-medium tracking-wide uppercase text-sm mb-2">
              Academic
            </p>
            <h2 class="text-xl font-bold text-[var(--theme-on-surface)]">
              Services
            </h2>
          </div>

          <div class="space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto custom-scrollbar hide-scrollbar-mobile pr-2">
            <a
              v-for="(service, index) in services"
              :key="index"
              :href="service.url"
              target="_blank"
              class="block p-3 rounded-xl bg-[var(--theme-surface-container-high)] border border-[var(--theme-card-border)] hover:border-[var(--theme-accent)]/30 transition-all duration-300 min-h-[44px]"
            >
              <div class="flex items-center justify-between mb-1">
                <h3 class="text-[var(--theme-on-surface)] font-medium text-sm hover:text-[var(--theme-accent)] transition-colors">
                  {{ service.conference }}
                </h3>
                <span class="text-xs px-2 py-0.5 rounded-full bg-[var(--theme-surface-container-higher)] text-[var(--theme-on-surface-variant)]">
                  {{ service.reviews }}
                </span>
              </div>
              <p class="text-[var(--theme-on-surface-variant)] text-xs" v-html="service.role"></p>
            </a>
          </div>
        </div>

        <!-- Mentees Panel -->
        <div class="bg-[var(--theme-surface-container)] rounded-2xl border border-[var(--theme-card-border)] p-6">
          <div class="mb-6">
            <p class="text-[var(--theme-accent)] font-medium tracking-wide uppercase text-sm mb-2">
              Supervision
            </p>
            <h2 class="text-xl font-bold text-[var(--theme-on-surface)]">
              Mentees
            </h2>
          </div>

          <div class="space-y-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto custom-scrollbar hide-scrollbar-mobile pr-2">
            <div
              v-for="(mentee, index) in mentees"
              :key="index"
              class="p-4 rounded-xl bg-[var(--theme-surface-container-high)] border border-[var(--theme-card-border)]"
            >
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-[var(--theme-on-surface)] font-medium text-sm">
                  {{ mentee.name }}
                </h3>
                <span class="text-xs px-2 py-0.5 rounded-full bg-[var(--theme-accent)]/20 text-[var(--theme-accent)]">
                  {{ mentee.type }}
                </span>
              </div>
              <p class="text-[var(--theme-on-surface-variant)] text-xs mb-1">
                {{ mentee.occupation }} @ {{ mentee.affiliation }}
              </p>
              <p v-if="mentee.outcompe" class="text-[var(--theme-accent)] text-xs font-medium">
                {{ mentee.outcompe }}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(66, 133, 244, 0.5) var(--theme-surface-container-higher);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--theme-surface-container-higher);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(66, 133, 244, 0.5);
  border-radius: 3px;
}
</style>
