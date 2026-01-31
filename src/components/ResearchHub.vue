<script setup>
import { ref, computed, onMounted } from 'vue'

const activeTab = ref('featured')
const searchQuery = ref('')
const activeFilter = ref('all')
const expandedAbstracts = ref(new Set())

// Touch device detection
const isTouchDevice = ref(false)

// Image preview on hover (and modal for touch)
const hoveredImage = ref(null)
const previewPosition = ref({ x: 0, y: 0 })
const modalImage = ref(null) // For touch device modal

const showImagePreview = (src, event) => {
  if (isTouchDevice.value) return // Don't show hover preview on touch
  hoveredImage.value = src
  updatePreviewPosition(event)
}

const hideImagePreview = () => {
  hoveredImage.value = null
}

// Touch-friendly modal for image preview
const openImageModal = (src) => {
  if (isTouchDevice.value) {
    modalImage.value = src
  }
}

const closeImageModal = () => {
  modalImage.value = null
}

const updatePreviewPosition = (event) => {
  const padding = 20
  // Responsive preview dimensions
  const maxPreviewWidth = Math.min(1080, window.innerWidth * 0.9)
  const maxPreviewHeight = Math.min(720, window.innerHeight * 0.8)

  let x = event.clientX + padding
  let y = event.clientY - maxPreviewHeight / 2

  // Keep preview within viewport
  if (x + maxPreviewWidth > window.innerWidth) {
    x = event.clientX - maxPreviewWidth - padding
  }
  if (y < padding) {
    y = padding
  }
  if (y + maxPreviewHeight > window.innerHeight - padding) {
    y = window.innerHeight - maxPreviewHeight - padding
  }

  previewPosition.value = { x, y }
}

// Data
const highlightsData = ref({ categories: [], featured: [] })
const publications = ref([])
const opensource = ref([])
const talks = ref([])
const media = ref([])

const tabs = [
  { id: 'featured', label: 'Featured Work', icon: 'star' },
  { id: 'publications', label: 'Publications', icon: 'paper' },
  { id: 'opensource', label: 'Open Source', icon: 'code' },
  { id: 'talks', label: 'Talks', icon: 'mic' },
  { id: 'media', label: 'Media', icon: 'news' }
]

const pubFilters = [
  { id: 'all', label: 'All' },
  { id: 'preprint', label: 'Preprint' },
  { id: 'conference', label: 'Conference' },
  { id: 'journal', label: 'Journal' },
  { id: 'workshop', label: 'Workshop' }
]

onMounted(async () => {
  // Detect touch device
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  try {
    const [highlightsRes, pubsRes, osRes, talksRes, mediaRes] = await Promise.all([
      fetch('/data/highlights.json'),
      fetch('/data/publications.json'),
      fetch('/data/opensource.json'),
      fetch('/data/talks.json'),
      fetch('/data/media.json')
    ])
    highlightsData.value = await highlightsRes.json()
    publications.value = await pubsRes.json()
    opensource.value = await osRes.json()
    talks.value = await talksRes.json()
    media.value = await mediaRes.json()
  } catch (error) {
    console.error('Error loading data:', error)
  }
})

const filteredPublications = computed(() => {
  let result = publications.value
  if (activeFilter.value !== 'all') {
    result = result.filter(pub => pub.type === activeFilter.value)
  }
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(pub =>
      pub.title.toLowerCase().includes(query) ||
      pub.authors.toLowerCase().includes(query) ||
      pub.venue.toLowerCase().includes(query) ||
      pub.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  return result
})

const shouldShowYearDivider = (index) => {
  if (index === 0) return true
  const currentYear = filteredPublications.value[index]?.year
  const previousYear = filteredPublications.value[index - 1]?.year
  return currentYear !== previousYear
}

const toggleAbstract = (id) => {
  if (expandedAbstracts.value.has(id)) {
    expandedAbstracts.value.delete(id)
  } else {
    expandedAbstracts.value.add(id)
  }
}

const highlightAuthor = (authors) => {
  return authors.replace(/(Zeming Chen)/g, '<strong class="text-[var(--theme-accent)]">$1</strong>')
}

const getTypeColor = (type) => {
  const colors = {
    conference: 'bg-blue-500/20 text-blue-400',
    preprint: 'bg-yellow-500/20 text-yellow-400',
    journal: 'bg-green-500/20 text-green-400',
    workshop: 'bg-purple-500/20 text-purple-400'
  }
  return colors[type] || 'bg-gray-500/20 text-gray-400'
}

// Check if image is an SVG that needs inversion
const isSvg = (src) => src && src.toLowerCase().endsWith('.svg')

const getTabIcon = (icon) => {
  const icons = {
    star: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />',
    paper: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />',
    code: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />',
    mic: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />',
    news: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />'
  }
  return icons[icon] || icons.star
}
</script>

<template>
  <section id="research" class="py-24 bg-[var(--theme-surface-container)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <!-- <div class="text-center mb-12">
        <p class="text-[var(--theme-accent)] font-medium tracking-wide uppercase text-sm mb-4">
          Research Portfolio
        </p>
        <h2 class="text-3xl sm:text-4xl font-bold text-[var(--theme-on-surface)] mb-6">
          Research & Work
        </h2>
      </div> -->

      <!-- Tab Navigation -->
      <div class="flex flex-wrap justify-center gap-2 mb-10 border-b border-[var(--theme-card-border)] pb-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px]"
          :class="activeTab === tab.id
            ? 'bg-[var(--theme-accent)] text-white'
            : 'bg-[var(--theme-surface-container-high)] text-[var(--theme-on-surface-variant)] hover:bg-[var(--theme-surface-container-higher)] hover:text-[var(--theme-on-surface)]'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getTabIcon(tab.icon)"></svg>
          {{ tab.label }}
        </button>
      </div>

      <!-- ========== FEATURED WORK TAB ========== -->
      <div v-show="activeTab === 'featured'" class="space-y-12">
        <!-- Research Categories -->
        <div v-for="category in highlightsData.categories" :key="category.id" class="space-y-6">
          <!-- Category Header -->
          <div class="flex items-center gap-4 pb-4 border-b border-[var(--theme-card-border)]">
            <div class="w-16 h-16 rounded-xl overflow-hidden bg-[var(--theme-surface-container-high)] flex-shrink-0">
              <img :src="category.thumbnail" :alt="category.title" class="w-full h-full object-contain" :class="{ 'invert-on-dark': isSvg(category.thumbnail) }" />
            </div>
            <div>
              <h3 class="text-xl font-semibold text-[var(--theme-on-surface)]">{{ category.title }}</h3>
              <p class="text-[var(--theme-on-surface-variant)] text-sm mt-1">{{ category.description }}</p>
            </div>
          </div>

          <!-- Featured Items in this Category -->
          <div class="space-y-6 pl-4 border-l-2 border-[var(--theme-card-border)]">
            <div
              v-for="item in highlightsData.featured.filter(f => f.category === category.id)"
              :key="item.id"
              class="group bg-[var(--theme-surface-container-high)] rounded-2xl border border-[var(--theme-card-border)] hover:border-[var(--theme-accent)]/30 transition-all duration-300 overflow-hidden"
            >
              <!-- Title Bar -->
              <div class="px-6 py-4 border-b border-[var(--theme-card-border)] bg-[var(--theme-surface-container)]/50">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <h4 class="text-lg font-semibold text-[var(--theme-on-surface)] group-hover:text-[var(--theme-accent)] transition-colors leading-snug">
                      {{ item.title }}
                    </h4>
                    <p class="text-[var(--theme-accent)] text-sm font-medium mt-1">{{ item.subtitle }}</p>
                  </div>
                  <div class="flex gap-2 flex-shrink-0 whitespace-nowrap">
                    <span v-for="tag in item.tags.slice(0, 2)" :key="tag" class="hidden sm:inline-block px-3 py-1 text-xs rounded-full bg-[var(--theme-surface-container-higher)] text-[var(--theme-on-surface-variant)]">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6">
                <div class="flex flex-col lg:flex-row gap-6">
                  <!-- Thumbnail -->
                  <div class="w-full sm:w-auto lg:w-64 flex-shrink-0">
                    <div class="aspect-video rounded-xl overflow-hidden bg-[var(--theme-surface-container)] cursor-zoom-in"
                      @mouseenter="showImagePreview(item.thumbnail, $event)"
                      @mousemove="updatePreviewPosition($event)"
                      @mouseleave="hideImagePreview"
                      @click="openImageModal(item.thumbnail)">
                      <img :src="item.thumbnail" :alt="item.title" class="w-full h-full object-contain" />
                    </div>
                    <div v-if="item.stats" class="grid grid-cols-3 gap-2 mt-3">
                      <div v-for="stat in item.stats" :key="stat.label" class="text-center p-2 rounded-lg bg-[var(--theme-surface-container)]">
                        <p class="text-sm font-bold text-[var(--theme-accent)]">{{ stat.value }}</p>
                        <p class="text-xs text-[var(--theme-on-surface-variant)]">{{ stat.label }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Details -->
                  <div class="flex-1 space-y-4">
                    <p class="text-[var(--theme-on-surface-variant)] leading-relaxed">{{ item.description }}</p>

                    <!-- TL;DR toggle -->
                    <div v-if="item.tldr">
                      <button @click="toggleAbstract(item.id)" class="text-sm text-[var(--theme-accent)] hover:text-[var(--theme-accent-hover)] flex items-center gap-1">
                        <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': expandedAbstracts.has(item.id) }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        {{ expandedAbstracts.has(item.id) ? 'Hide' : 'Show' }} TL;DR
                      </button>
                      <p v-if="expandedAbstracts.has(item.id)" class="text-sm text-[var(--theme-on-surface-variant)] leading-relaxed mt-2 pl-5 border-l-2 border-[var(--theme-accent)]/30">{{ item.tldr }}</p>
                    </div>

                    <!-- Media Coverage -->
                    <div v-if="item.media && item.media.length > 0">
                      <p class="text-xs uppercase tracking-wider text-[var(--theme-on-surface-muted)] mb-2">Media Coverage</p>
                      <div class="flex flex-wrap gap-2">
                        <a v-for="m in item.media" :key="m.url" :href="m.url" target="_blank" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--theme-surface-container-higher)] hover:bg-[var(--theme-surface-container-highest)] text-[var(--theme-on-surface)] text-sm transition-colors">
                          <svg class="w-4 h-4 mr-2 text-[var(--theme-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                          {{ m.name }}
                        </a>
                      </div>
                    </div>

                    <!-- Links -->
                    <div class="flex flex-wrap gap-3 pt-2">
                      <a v-if="item.links.paper" :href="item.links.paper" target="_blank" class="inline-flex items-center px-4 py-2 rounded-lg bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white text-sm font-medium transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Paper
                      </a>
                      <a v-if="item.links.paper1" :href="item.links.paper1" target="_blank" class="inline-flex items-center px-4 py-2 rounded-lg bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white text-sm font-medium transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Paper 1
                      </a>
                      <a v-if="item.links.paper2" :href="item.links.paper2" target="_blank" class="inline-flex items-center px-4 py-2 rounded-lg bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white text-sm font-medium transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Paper 2
                      </a>
                      <a v-if="item.links.code" :href="item.links.code" target="_blank" class="inline-flex items-center px-4 py-2 rounded-lg bg-[var(--theme-surface-container-higher)] hover:bg-[var(--theme-surface-container-highest)] text-[var(--theme-on-surface)] text-sm font-medium transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>
                        Code
                      </a>
                      <a v-if="item.links.models" :href="item.links.models" target="_blank" class="inline-flex items-center px-4 py-2 rounded-lg bg-[var(--theme-surface-container-higher)] hover:bg-[var(--theme-surface-container-highest)] text-[var(--theme-on-surface)] text-sm font-medium transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        Models
                      </a>
                      <a v-if="item.links.dataset" :href="item.links.dataset" target="_blank" class="inline-flex items-center px-4 py-2 rounded-lg bg-[var(--theme-surface-container-higher)] hover:bg-[var(--theme-surface-container-highest)] text-[var(--theme-on-surface)] text-sm font-medium transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                        Dataset
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== PUBLICATIONS TAB ========== -->
      <div v-show="activeTab === 'publications'" class="space-y-6">
        <!-- Filter & Search -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
          <div class="flex flex-wrap gap-2">
            <button v-for="filter in pubFilters" :key="filter.id" @click="activeFilter = filter.id"
              class="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 min-h-[40px]"
              :class="activeFilter === filter.id ? 'bg-[var(--theme-accent)] text-white' : 'bg-[var(--theme-surface-container-high)] text-[var(--theme-on-surface-variant)] hover:bg-[var(--theme-surface-container-higher)]'">
              {{ filter.label }}
            </button>
          </div>
          <div class="flex-1 sm:max-w-md sm:ml-auto">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--theme-on-surface-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input v-model="searchQuery" type="text" placeholder="Search title, author, keyword..."
                class="w-full pl-10 pr-4 py-2 rounded-full bg-[var(--theme-surface-container-high)] border border-[var(--theme-card-border)] text-[var(--theme-on-surface)] placeholder-[var(--theme-on-surface-muted)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors" />
            </div>
          </div>
        </div>

        <p class="text-[var(--theme-on-surface-muted)] text-sm">Showing {{ filteredPublications.length }} of {{ publications.length }} publications</p>

        <!-- Publications List -->
        <div class="space-y-4">
          <div v-for="(pub, index) in filteredPublications" :key="pub.id" class="space-y-3">
            <div v-if="shouldShowYearDivider(index)" class="flex items-center gap-3">
              <span class="text-sm font-semibold text-[var(--theme-on-surface-variant)]">{{ pub.year }}</span>
              <div class="flex-1 h-px bg-[var(--theme-card-border)]"></div>
            </div>
            <div class="group bg-[var(--theme-surface-container-high)] rounded-xl border border-[var(--theme-card-border)] hover:border-[var(--theme-accent)]/30 transition-all duration-300 overflow-hidden">
              <div class="p-5">
                <div class="flex flex-col lg:flex-row gap-5">
                  <!-- Thumbnail -->
                  <div class="w-full sm:w-auto lg:w-48 flex-shrink-0">
                    <div class="aspect-video rounded-lg overflow-hidden bg-[var(--theme-surface-container)] cursor-zoom-in"
                      @mouseenter="showImagePreview(pub.thumbnail, $event)"
                      @mousemove="updatePreviewPosition($event)"
                      @mouseleave="hideImagePreview"
                      @click="openImageModal(pub.thumbnail)">
                      <img :src="pub.thumbnail" :alt="pub.title" class="w-full h-full object-contain" />
                    </div>
                  </div>
                  <!-- Details -->
                  <div class="flex-1 space-y-2">
                    <div class="flex items-start justify-between gap-3">
                      <a :href="pub.links.arxiv" target="_blank" class="flex-1 min-w-0 text-base font-semibold text-[var(--theme-on-surface)] hover:text-[var(--theme-accent)] transition-colors leading-snug">
                        {{ pub.title }}
                      </a>
                      <div class="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
                        <span v-if="pub.award" class="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400">{{ pub.award }}</span>
                        <span :class="['px-2 py-0.5 text-xs font-medium rounded-full', getTypeColor(pub.type)]">{{ pub.type }}</span>
                      </div>
                    </div>
                    <p class="text-sm text-[var(--theme-on-surface-variant)]" v-html="highlightAuthor(pub.authors)"></p>
                    <div class="flex items-center gap-2 text-sm">
                      <a v-if="pub.venueLink" :href="pub.venueLink" target="_blank" class="text-[var(--theme-accent)] hover:underline">{{ pub.venue }}</a>
                      <span v-else class="text-[var(--theme-on-surface)]">{{ pub.venue }}</span>
                      <template v-if="pub.venueName">
                        <span class="text-[var(--theme-on-surface-muted)]">·</span>
                        <span class="text-[var(--theme-on-surface-variant)]">{{ pub.venueName }}</span>
                      </template>
                      <span class="text-[var(--theme-on-surface-muted)]">·</span>
                      <span class="text-[var(--theme-on-surface-variant)]">{{ pub.year }}</span>
                    </div>
                    <!-- Abstract toggle -->
                    <button @click="toggleAbstract(pub.id)" class="text-sm text-[var(--theme-accent)] hover:text-[var(--theme-accent-hover)] flex items-center gap-1">
                      <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': expandedAbstracts.has(pub.id) }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      {{ expandedAbstracts.has(pub.id) ? 'Hide' : 'Show' }} TL;DR
                    </button>
                    <p v-if="expandedAbstracts.has(pub.id)" class="text-sm text-[var(--theme-on-surface-variant)] leading-relaxed">{{ pub.abstract }}</p>
                    <!-- Links -->
                    <div class="flex flex-wrap gap-2 pt-2">
                      <a v-if="pub.links.arxiv" :href="pub.links.arxiv" target="_blank" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white text-xs font-medium transition-colors">
                        <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Paper
                      </a>
                      <a v-if="pub.links.code" :href="pub.links.code" target="_blank" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--theme-surface-container-higher)] hover:bg-[var(--theme-surface-container-highest)] text-[var(--theme-on-surface)] text-xs font-medium transition-colors">
                        <svg class="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>
                        Code
                      </a>
                      <a v-if="pub.links.models" :href="pub.links.models" target="_blank" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--theme-surface-container-higher)] hover:bg-[var(--theme-surface-container-highest)] text-[var(--theme-on-surface)] text-xs font-medium transition-colors">
                        <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        Models
                      </a>
                      <a v-if="pub.links.video" :href="pub.links.video" target="_blank" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--theme-surface-container-higher)] hover:bg-[var(--theme-surface-container-highest)] text-[var(--theme-on-surface)] text-xs font-medium transition-colors">
                        <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Video
                      </a>
                      <a v-if="pub.links.dataset" :href="pub.links.dataset" target="_blank" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--theme-surface-container-higher)] hover:bg-[var(--theme-surface-container-highest)] text-[var(--theme-on-surface)] text-xs font-medium transition-colors">
                        <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                        Dataset
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredPublications.length === 0" class="text-center py-12">
          <p class="text-[var(--theme-on-surface-variant)]">No publications found matching your criteria.</p>
          <button @click="activeFilter = 'all'; searchQuery = ''" class="mt-4 text-[var(--theme-accent)] hover:underline">Clear filters</button>
        </div>
      </div>

      <!-- ========== OPEN SOURCE TAB ========== -->
      <div v-show="activeTab === 'opensource'" class="space-y-6">
        <div v-for="project in opensource" :key="project.id" class="group bg-[var(--theme-surface-container-high)] rounded-xl border border-[var(--theme-card-border)] hover:border-[var(--theme-accent)]/30 transition-all duration-300 overflow-hidden">
          <div class="p-5">
            <div class="flex flex-col lg:flex-row gap-5">
              <div class="w-full sm:w-auto lg:w-48 flex-shrink-0">
                <div class="aspect-video rounded-lg overflow-hidden bg-[var(--theme-surface-container)] cursor-zoom-in"
                  @mouseenter="showImagePreview(project.thumbnail, $event)"
                  @mousemove="updatePreviewPosition($event)"
                  @mouseleave="hideImagePreview"
                  @click="openImageModal(project.thumbnail)">
                  <img :src="project.thumbnail" :alt="project.title" class="w-full h-full object-contain" />
                </div>
              </div>
              <div class="flex-1 space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <a :href="project.github" target="_blank" class="text-lg font-semibold text-[var(--theme-on-surface)] hover:text-[var(--theme-accent)] transition-colors leading-snug min-w-0">{{ project.title }}</a>
                    <span class="px-2 py-0.5 text-xs rounded-full bg-[var(--theme-surface-container-higher)] text-[var(--theme-on-surface-variant)] flex-shrink-0 whitespace-nowrap">{{ project.language }}</span>
                  </div>
                  <div class="flex items-center gap-1 text-[var(--theme-on-surface-variant)] flex-shrink-0 whitespace-nowrap">
                    <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    <span class="text-sm font-medium">{{ project.stars }}</span>
                  </div>
                </div>
                <p class="text-[var(--theme-on-surface-variant)] text-sm">{{ project.description }}</p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in project.tags" :key="tag" class="px-2 py-0.5 text-xs rounded-full bg-[var(--theme-surface-container-higher)] text-[var(--theme-on-surface-variant)]">{{ tag }}</span>
                </div>
                <div class="flex flex-wrap gap-2 pt-1">
                  <a :href="project.github" target="_blank" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--theme-surface-container-higher)] hover:bg-[var(--theme-surface-container-highest)] text-[var(--theme-on-surface)] text-sm font-medium transition-colors">
                    <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>
                    GitHub
                  </a>
                  <a v-if="project.links.huggingface" :href="project.links.huggingface" target="_blank" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--theme-surface-container-higher)] hover:bg-[var(--theme-surface-container-highest)] text-[var(--theme-on-surface)] text-sm font-medium transition-colors">Models</a>
                  <a v-if="project.links.paper" :href="project.links.paper" target="_blank" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white text-sm font-medium transition-colors">Paper</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== TALKS TAB ========== -->
      <div v-show="activeTab === 'talks'" class="space-y-6">
        <div v-for="talk in talks" :key="talk.id" class="group bg-[var(--theme-surface-container-high)] rounded-xl border border-[var(--theme-card-border)] hover:border-[var(--theme-accent)]/30 transition-all duration-300 overflow-hidden">
          <div class="p-5">
            <div class="flex flex-col lg:flex-row gap-5">
              <div class="w-full sm:w-auto lg:w-48 flex-shrink-0">
                <div class="aspect-video rounded-lg overflow-hidden bg-[var(--theme-surface-container)] cursor-zoom-in"
                  @mouseenter="showImagePreview(talk.thumbnail, $event)"
                  @mousemove="updatePreviewPosition($event)"
                  @mouseleave="hideImagePreview"
                  @click="openImageModal(talk.thumbnail)">
                  <img :src="talk.thumbnail" :alt="talk.title" class="w-full h-full object-contain" />
                </div>
              </div>
              <div class="flex-1 space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <h3 class="flex-1 min-w-0 text-base font-semibold text-[var(--theme-on-surface)] group-hover:text-[var(--theme-accent)] transition-colors leading-snug">{{ talk.title }}</h3>
                  <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--theme-surface-container-higher)] text-[var(--theme-on-surface-variant)] flex-shrink-0 whitespace-nowrap">{{ talk.type }}</span>
                </div>
                <p class="text-[var(--theme-accent)] text-sm font-medium">{{ talk.event }}</p>
                <div class="flex items-center gap-3 text-sm text-[var(--theme-on-surface-variant)]">
                  <span>{{ talk.date }}</span>
                  <span class="text-[var(--theme-on-surface-muted)]">·</span>
                  <span>{{ talk.location }}</span>
                </div>
                <p class="text-[var(--theme-on-surface-variant)] text-sm">{{ talk.description }}</p>
                <div v-if="Object.keys(talk.links).length > 0" class="flex flex-wrap gap-2 pt-1">
                  <a v-if="talk.links.event" :href="talk.links.event" target="_blank" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--theme-surface-container-higher)] hover:bg-[var(--theme-surface-container-highest)] text-[var(--theme-on-surface)] text-sm font-medium transition-colors">Event</a>
                  <a v-if="talk.links.paper" :href="talk.links.paper" target="_blank" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white text-sm font-medium transition-colors">Paper</a>
                  <a v-if="talk.links.slides" :href="talk.links.slides" target="_blank" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--theme-surface-container-higher)] hover:bg-[var(--theme-surface-container-highest)] text-[var(--theme-on-surface)] text-sm font-medium transition-colors">Slides</a>
                  <a v-if="talk.links.video" :href="talk.links.video" target="_blank" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--theme-surface-container-higher)] hover:bg-[var(--theme-surface-container-highest)] text-[var(--theme-on-surface)] text-sm font-medium transition-colors">Video</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== MEDIA TAB ========== -->
      <div v-show="activeTab === 'media'" class="space-y-6">
        <div v-for="(item, index) in media" :key="index" class="group bg-[var(--theme-surface-container-high)] rounded-xl border border-[var(--theme-card-border)] hover:border-[var(--theme-accent)]/30 transition-all duration-300 overflow-hidden">
          <div class="p-5">
            <div class="flex flex-col lg:flex-row gap-5">
              <div class="w-full sm:w-auto lg:w-48 flex-shrink-0">
                <div class="aspect-video rounded-lg overflow-hidden bg-[var(--theme-surface-container)] cursor-zoom-in"
                  @mouseenter="showImagePreview(item.imageSrc, $event)"
                  @mousemove="updatePreviewPosition($event)"
                  @mouseleave="hideImagePreview"
                  @click="openImageModal(item.imageSrc)">
                  <img :src="item.imageSrc" :alt="item.title" class="w-full h-full object-contain" />
                </div>
              </div>
              <div class="flex-1 space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <a :href="item.readMoreLink" target="_blank" class="flex-1 min-w-0 text-base font-semibold text-[var(--theme-on-surface)] hover:text-[var(--theme-accent)] transition-colors leading-snug">{{ item.title }}</a>
                  <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--theme-accent)]/20 text-[var(--theme-accent)] flex-shrink-0 whitespace-nowrap">{{ item.source }}</span>
                </div>
                <p class="text-sm text-[var(--theme-on-surface-variant)]">{{ item.date }}</p>
                <p class="text-[var(--theme-on-surface-variant)] text-sm leading-relaxed">{{ item.overview }}</p>
                <a :href="item.readMoreLink" target="_blank" class="inline-flex items-center text-[var(--theme-accent)] hover:text-[var(--theme-accent-hover)] text-sm font-medium transition-colors">
                  Read More
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Image Preview Overlay (Desktop hover) -->
    <Teleport to="body">
      <Transition name="preview-fade">
        <div
          v-if="hoveredImage && !isTouchDevice"
          class="fixed z-50 pointer-events-none hidden sm:block"
          :style="{ left: previewPosition.x + 'px', top: previewPosition.y + 'px' }"
        >
          <div class="bg-[var(--theme-surface-container)] rounded-xl shadow-2xl border border-[var(--theme-card-border)] overflow-hidden">
            <img
              :src="hoveredImage"
              alt="Preview"
              class="max-w-[min(1080px,90vw)] max-h-[min(720px,80vh)] object-contain"
            />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Image Modal (Touch devices) -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="modalImage"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          @click="closeImageModal"
        >
          <div class="relative max-w-full max-h-full" @click.stop>
            <button
              @click="closeImageModal"
              class="absolute -top-12 right-0 p-3 min-h-[44px] min-w-[44px] text-white/80 hover:text-white transition-colors"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              :src="modalImage"
              alt="Preview"
              class="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: opacity 0.15s ease;
}

.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
}

/* Modal fade transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
