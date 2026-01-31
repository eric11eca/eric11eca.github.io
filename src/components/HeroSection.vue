<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Bio content from JSON
const bioData = ref({ bio: '', links: [], bold: [] })
const showFullBio = ref(false)
const showExperience = ref(false)
const industryData = ref({ experiences: [], education: [] })

// Parse bio text using links and bold arrays from bio.json
const parseBio = (text, links, boldTerms) => {
  if (!text) return ''

  let parsed = text

  // First, replace link terms with placeholders to avoid conflicts
  const linkPlaceholders = []
  links.forEach((link, i) => {
    const placeholder = `__LINK_${i}__`
    linkPlaceholders.push({ placeholder, link })
    // Escape special regex characters in name
    const escapedName = link.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    parsed = parsed.replace(new RegExp(escapedName, 'g'), placeholder)
  })

  // Apply bold styling (excluding terms that are links)
  boldTerms.forEach(term => {
    // Skip if this term is a link (already handled)
    if (links.some(l => l.name === term)) return
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    parsed = parsed.replace(new RegExp(escapedTerm, 'g'), `<strong class="text-[var(--theme-on-surface)]">${term}</strong>`)
  })

  // Replace placeholders with actual links
  linkPlaceholders.forEach(({ placeholder, link }) => {
    parsed = parsed.replace(new RegExp(placeholder, 'g'),
      `<a href="${link.url}" target="_blank" class="text-[var(--theme-accent)] hover:underline font-medium">${link.name}</a>`)
  })

  return parsed
}

const parsedBio = computed(() => parseBio(bioData.value.bio, bioData.value.links, bioData.value.bold))

// Split bio into intro (first 3 sentences) and the rest for expandable display
const bioIntro = computed(() => {
  if (!bioData.value.bio) return ''
  // Find the first 3 sentences
  const sentences = bioData.value.bio.match(/[^.!?]+[.!?]+/g) || []
  const introText = sentences.slice(0, 3).join(' ').trim()
  return introText ? parseBio(introText, bioData.value.links, bioData.value.bold) : parsedBio.value
})

const bioRest = computed(() => {
  if (!bioData.value.bio) return ''
  const sentences = bioData.value.bio.match(/[^.!?]+[.!?]+/g) || []
  if (sentences.length <= 3) return ''
  const restText = sentences.slice(3).join(' ').trim()
  return restText ? parseBio(restText, bioData.value.links, bioData.value.bold) : ''
})

const socialLinks = [
  { name: 'Google Scholar', url: 'https://scholar.google.com/citations?user=-gqyv8cAAAAJ&hl=en', icon: 'scholar' },
  { name: 'GitHub', url: 'https://github.com/eric11eca', icon: 'github' },
  { name: 'Twitter', url: 'https://x.com/eric_zemingchen', icon: 'twitter' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/zeming-chen-769985123/', icon: 'linkedin' },
  { name: 'Semantic Scholar', url: 'https://www.semanticscholar.org/author/Zeming-Chen/2111435018', icon: 'semantic' },
  { name: 'Hugging Face', url: 'https://huggingface.co/zechen-nlp', icon: 'huggingface' },
  { name: 'Email', url: 'mailto:zeming.chen@epfl.ch', icon: 'email' },
]

const socialIconMap = {
  scholar: { type: 'img', src: '/images/google-scholar.svg', invert: true },
  semantic: { type: 'img', src: '/images/semantic-scholar.svg', invert: true },
  huggingface: { type: 'img', src: '/images/hugging-face.svg', invert: true },
  github: {
    type: 'svg',
    path: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
  },
  twitter: {
    type: 'svg',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'
  },
  linkedin: {
    type: 'svg',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
  },
  email: {
    type: 'svg',
    path: 'M2.003 5.884A2 2 0 014 4h16a2 2 0 011.997 1.884L12 12.5 2.003 5.884zM2 8.118V18a2 2 0 002 2h16a2 2 0 002-2V8.118l-9.418 6.282a2 2 0 01-2.164 0L2 8.118z'
  }
}

const affiliations = [
  { name: 'EPFL', logo: '/images/epfl_logo.svg' },
  { name: 'EPFL NLP Lab', logo: '/images/epfl_nlp_lab_logo.png' },
  { name: 'Meta AI', logo: '/images/meta_logo.svg' },
  { name: 'AI2', logo: '/images/Ai2_logo.svg' },
]

// Research themes
const researchThemes = ref([])
const currentImageIndices = ref({})
let intervalIds = {}

onMounted(async () => {
  try {
    // Fetch bio content from JSON
    const bioResponse = await fetch('/data/bio.json')
    bioData.value = await bioResponse.json()

    // Fetch industry experience data
    const industryResponse = await fetch('/data/industry.json')
    industryData.value = await industryResponse.json()

    const response = await fetch('/data/research.json')
    researchThemes.value = await response.json()

    // Initialize image indices and start auto-cycling for themes with multiple images
    researchThemes.value.forEach((theme, index) => {
      currentImageIndices.value[index] = 0
      const images = getThemeImages(theme)
      if (images.length > 1) {
        intervalIds[index] = setInterval(() => {
          currentImageIndices.value[index] = (currentImageIndices.value[index] + 1) % images.length
        }, 4000)
      }
    })
  } catch (error) {
    console.error('Error loading research data:', error)
  }
})

onUnmounted(() => {
  Object.values(intervalIds).forEach(id => clearInterval(id))
})

const getThemeImages = (theme) => {
  if (theme.images && theme.images.length > 0) {
    return theme.images
  }
  return theme.imageSrc ? [theme.imageSrc] : []
}

const themeIcons = {
  'Large-Scale AI Development': `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`,
  'Reasoning as Test-Time Learning': `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>`,
}
</script>

<template>
  <section id="home" class="min-h-[100dvh] flex items-center pt-16 relative overflow-hidden">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-[var(--theme-gradient-start)] via-[var(--theme-gradient-mid)] to-[var(--theme-gradient-start)]"></div>
    <div class="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-[var(--theme-accent)]/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-[var(--theme-accent-secondary)]/5 rounded-full blur-3xl"></div>

    <div class="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <!-- Main hero row: intro + photo + news sidebar -->
      <div class="flex flex-col xl:flex-row gap-8 xl:gap-12">
        <!-- Left section: intro + photo -->
        <div class="flex-1 grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
        <!-- Left: Content -->
        <div class="space-y-8 animate-fadeInUp">
          <div class="space-y-4">
            <p class="text-[var(--theme-accent)] font-medium tracking-wide uppercase text-sm">
              Ph.D. Candidate @ EPFL NLP Lab
            </p>
            <h1 class="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[var(--theme-on-surface)] leading-tight">
              Building <span class="gradient-text">Reasoning AI Agents</span> for the Common Good
            </h1>
            <div class="text-base sm:text-lg text-[var(--theme-on-surface-variant)] max-w-none sm:max-w-xl leading-relaxed">
              <span v-html="bioIntro"></span>
              <Transition name="bio-expand">
                <span v-if="showFullBio" v-html="' ' + bioRest"></span>
              </Transition>
              <button
                v-if="bioRest"
                @click="showFullBio = !showFullBio"
                class="ml-1 text-[var(--theme-accent)] hover:underline text-base font-medium inline-flex items-center gap-0.5"
              >
                {{ showFullBio ? 'Show less' : 'Read more' }}
                <svg
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-180': showFullBio }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-wrap gap-4">
            <a
              href="/documents/Zeming_Chen_Resume.pdf"
              target="_blank"
              class="inline-flex items-center px-6 py-3 rounded-full bg-[var(--theme-button-bg)] text-[var(--theme-button-text)] font-semibold hover:bg-[var(--theme-button-hover)] transition-all duration-200 hover:scale-105"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download CV
            </a>
            <a
              href="#research"
              class="inline-flex items-center px-6 py-3 rounded-full border border-[var(--theme-surface-container-highest)] text-[var(--theme-on-surface)] font-semibold hover:bg-[var(--theme-surface-container-high)] transition-all duration-200"
            >
              View Research
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          <!-- Social Links -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:space-x-4 pt-4">
            <span class="text-[var(--theme-on-surface-muted)] text-sm">Find me on</span>
            <div class="flex flex-wrap gap-2 sm:gap-3">
              <a
                v-for="link in socialLinks"
                :key="link.name"
                :href="link.url"
                target="_blank"
                class="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-[var(--theme-surface-container-high)] hover:bg-[var(--theme-surface-container-higher)] transition-colors duration-200"
                :title="link.name"
              >
                <img
                  v-if="socialIconMap[link.icon]?.type === 'img'"
                  :src="socialIconMap[link.icon].src"
                  :alt="link.name"
                  class="w-5 h-5 opacity-70 hover:opacity-100"
                  :style="socialIconMap[link.icon].invert ? { filter: 'var(--theme-invert)' } : undefined"
                />
                <svg
                  v-else
                  class="w-5 h-5 text-[var(--theme-on-surface-variant)] hover:text-[var(--theme-on-surface)]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path :d="socialIconMap[link.icon]?.path" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Affiliations -->
          <div class="pt-8 border-t border-[var(--theme-surface-container-high)]">
            <p class="text-[var(--theme-on-surface-muted)] text-xs uppercase tracking-wider mb-4">Current Affiliations & Past Experience</p>
            <div class="flex flex-wrap items-center gap-3 sm:gap-4">
              <div class="flex flex-wrap items-center gap-3 sm:gap-6">
                <img
                  v-for="aff in affiliations"
                  :key="aff.name"
                  :src="aff.logo"
                  :alt="aff.name"
                  class="h-6 sm:h-8 opacity-80 hover:opacity-100 transition-opacity duration-200"
                />
              </div>
              <!-- Expand button -->
              <button
                @click="showExperience = !showExperience"
                class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--theme-surface-container-high)] hover:bg-[var(--theme-surface-container-higher)] text-[var(--theme-on-surface-variant)] hover:text-[var(--theme-on-surface)] text-xs font-medium transition-all duration-200"
              >
                <span>{{ showExperience ? 'Hide' : 'Details' }}</span>
                <svg
                  class="w-3.5 h-3.5 transition-transform duration-200"
                  :class="{ 'rotate-180': showExperience }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <!-- Expandable Experience Panel -->
            <Transition name="slide-fade">
              <div
                v-if="showExperience"
                class="mt-4 p-5 rounded-xl bg-[var(--theme-surface-container-high)] border border-[var(--theme-card-border)]"
              >
                <!-- Industry Experience -->
                <div v-if="industryData.experiences.length > 0" class="mb-5">
                  <h4 class="text-xs uppercase tracking-wider text-[var(--theme-on-surface-muted)] mb-3">Industry Experience</h4>
                  <div class="space-y-3">
                    <div
                      v-for="exp in industryData.experiences"
                      :key="exp.id"
                      class="flex items-start gap-3"
                    >
                      <img :src="'/' + exp.logo" :alt="exp.company" class="w-6 h-6 mt-0.5 flex-shrink-0" />
                      <div class="flex-1 min-w-0">
                        <div class="flex items-baseline gap-2 flex-wrap">
                          <a
                            :href="exp.url"
                            target="_blank"
                            class="text-[var(--theme-on-surface)] font-medium hover:text-[var(--theme-accent)] transition-colors"
                          >{{ exp.company }}</a>
                          <span class="text-[var(--theme-on-surface-muted)] text-sm">{{ exp.year }}</span>
                        </div>
                        <p class="text-sm text-[var(--theme-on-surface-variant)]">
                          {{ exp.role }}, supervised by
                          <template v-for="(sup, idx) in exp.supervisors" :key="sup.name">
                            <a
                              v-if="sup.url"
                              :href="sup.url"
                              target="_blank"
                              class="text-[var(--theme-accent)] hover:underline"
                            >{{ sup.name }}</a>
                            <span v-else class="text-[var(--theme-on-surface)]">{{ sup.name }}</span>
                            <span v-if="idx < exp.supervisors.length - 1"> and </span>
                          </template>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Education -->
                <div v-if="industryData.education.length > 0">
                  <h4 class="text-xs uppercase tracking-wider text-[var(--theme-on-surface-muted)] mb-3">Education</h4>
                  <div class="space-y-3">
                    <div
                      v-for="edu in industryData.education"
                      :key="edu.id"
                      class="flex items-start gap-3"
                    >
                      <img v-if="edu.logo" :src="'/' + edu.logo" :alt="edu.institution" class="w-6 h-6 mt-0.5 flex-shrink-0" />
                      <div v-else class="w-6 h-6 mt-0.5 flex-shrink-0 rounded bg-[var(--theme-surface-container-higher)]"></div>
                      <div class="flex-1 min-w-0">
                        <a
                          :href="edu.url"
                          target="_blank"
                          class="text-[var(--theme-on-surface)] font-medium hover:text-[var(--theme-accent)] transition-colors"
                        >{{ edu.institution }}</a>
                        <p class="text-sm text-[var(--theme-on-surface-variant)]">
                          {{ edu.degree }} in {{ edu.majors.join(' and ') }}
                        </p>
                        <p v-if="edu.mentors && edu.mentors.length > 0" class="text-sm text-[var(--theme-on-surface-variant)] mt-1">
                          Research with
                          <template v-for="(mentor, idx) in edu.mentors" :key="mentor.name">
                            <a
                              :href="mentor.url"
                              target="_blank"
                              class="text-[var(--theme-accent)] hover:underline"
                            >{{ mentor.name }}</a>
                            <span class="text-[var(--theme-on-surface-muted)]"> ({{ mentor.affiliation }})</span>
                            <span v-if="idx < edu.mentors.length - 1"> and </span>
                          </template>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Right: Photo -->
        <div class="relative flex justify-center lg:justify-end animate-fadeInUp" style="animation-delay: 0.2s;">
          <div class="relative">
            <!-- Decorative ring -->
            <div class="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--theme-accent)]/20 to-[var(--theme-accent-secondary)]/20 blur-2xl scale-110"></div>

            <!-- Photo container -->
            <div class="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden border-2 border-[var(--theme-surface-container-high)] shadow-2xl">
              <img
                src="/images/epfl-pro.jpg"
                alt="Zeming Chen"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        </div>

        <!-- News Sidebar Slot -->
        <div class="xl:w-[400px] xl:flex-shrink-0">
          <slot name="news"></slot>
        </div>
      </div>

      <!-- Research Themes Cards -->
      <div v-if="researchThemes.length > 0" class="mt-16 animate-fadeInUp" style="animation-delay: 0.4s;">
        <p class="text-[var(--theme-accent)] font-medium tracking-wide uppercase text-sm mb-6 text-center">
          Research Focus
        </p>
        <div
          class="flex gap-4 sm:gap-6 pb-4 overflow-x-auto snap-x snap-mandatory sm:overflow-visible sm:snap-none sm:flex-wrap sm:justify-center"
        >
          <div
            v-for="(theme, index) in researchThemes"
            :key="index"
            class="group relative bg-[var(--theme-surface-container-high)] rounded-2xl overflow-hidden border border-[var(--theme-card-border)] hover:border-[var(--theme-accent)]/50 transition-all duration-300 snap-center flex-shrink-0 w-[85vw] sm:w-auto sm:flex-1 sm:max-w-[560px] sm:min-w-[360px]"
          >
            <!-- Card Image Slideshow -->
            <div class="relative h-40 overflow-hidden">
              <template v-for="(img, imgIndex) in getThemeImages(theme)" :key="imgIndex">
                <img
                  :src="img"
                  :alt="`${theme.title} - image ${imgIndex + 1}`"
                  class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500"
                  :class="currentImageIndices[index] === imgIndex ? 'opacity-100' : 'opacity-0'"
                />
              </template>
              <div class="absolute inset-0 bg-gradient-to-t from-[var(--theme-surface-container-high)] to-transparent"></div>
              <!-- Image indicators -->
              <div v-if="getThemeImages(theme).length > 1" class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                <button
                  v-for="(_, imgIndex) in getThemeImages(theme)"
                  :key="imgIndex"
                  @click="currentImageIndices[index] = imgIndex"
                  class="w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-300 min-h-[8px] min-w-[8px]"
                  :class="currentImageIndices[index] === imgIndex ? 'bg-[var(--theme-accent)] w-4 sm:w-3' : 'bg-white/50 hover:bg-white/80'"
                />
              </div>
            </div>

            <!-- Card Content -->
            <div class="p-5 space-y-3">
              <div class="flex items-start space-x-3">
                <div
                  class="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--theme-surface-container-higher)] flex items-center justify-center text-[var(--theme-accent)]"
                  v-html="themeIcons[theme.title] || themeIcons['Large-Scale AI Development']"
                ></div>
                <h3 class="text-lg font-semibold text-[var(--theme-on-surface)] group-hover:text-[var(--theme-accent)] transition-colors duration-200 leading-tight">
                  {{ theme.title }}
                </h3>
              </div>
              <p class="text-[var(--theme-on-surface-variant)] text-sm leading-relaxed line-clamp-3">
                {{ theme.description }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in theme.tags"
                  :key="tag"
                  class="px-2.5 py-0.5 text-xs rounded-full bg-[var(--theme-surface-container-higher)] text-[var(--theme-on-surface-variant)]"
                >
                  {{ tag }}
                </span>
              </div>
              <div v-if="theme.links && theme.links.length > 0" class="flex space-x-2 pt-1">
                <a
                  v-for="link in theme.links"
                  :key="link.url"
                  :href="link.url"
                  target="_blank"
                  class="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--theme-surface-container-higher)] hover:bg-[var(--theme-surface-container-highest)] text-[var(--theme-on-surface)] text-xs font-medium transition-colors duration-200"
                >
                  <svg v-if="link.type === 'code'" class="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                  </svg>
                  <svg v-if="link.type === 'model'" class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {{ link.text }}
                </a>
              </div>
            </div>
          </div>
        </div>
        <!-- Mobile swipe hint -->
        <div v-if="researchThemes.length > 1" class="flex sm:hidden justify-center items-center gap-2 mt-4 text-[var(--theme-on-surface-muted)] text-xs">
          <svg class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span>Swipe to explore</span>
          <svg class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hide scrollbar on mobile for research cards */
@media (max-width: 639px) {
  .overflow-x-auto::-webkit-scrollbar {
    display: none;
  }
  .overflow-x-auto {
    scrollbar-width: none;
    -ms-overflow-style: none;
    scroll-behavior: smooth;
  }
}

/* Custom scrollbar for research themes */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(66, 133, 244, 0.5) var(--theme-surface-container-higher);
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: var(--theme-surface-container-higher);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(66, 133, 244, 0.5);
  border-radius: 3px;
}

/* Experience panel transition */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Bio expand transition */
.bio-expand-enter-active {
  transition: opacity 0.3s ease-out;
}

.bio-expand-leave-active {
  transition: opacity 0.2s ease-in;
}

.bio-expand-enter-from,
.bio-expand-leave-to {
  opacity: 0;
}
</style>
