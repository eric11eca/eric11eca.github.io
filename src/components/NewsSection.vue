<script setup>
import { ref, onMounted, computed } from 'vue'

const newsData = ref({ newsItems: [], oldNewsItems: [] })

onMounted(async () => {
  try {
    const response = await fetch('/data/news.json')
    newsData.value = await response.json()
  } catch (error) {
    console.error('Error loading news data:', error)
  }
})

// Show all news items (users scroll to see more)
const displayedNews = computed(() => {
  return [...newsData.value.newsItems, ...newsData.value.oldNewsItems]
})

const parseContent = (item) => {
  let content = item.content
  if (item.links) {
    item.links.forEach(link => {
      content = content.replace(
        link.text,
        `<a href="${link.url}" target="_blank" class="text-[var(--theme-accent)] hover:text-[var(--theme-accent-hover)] underline decoration-[var(--theme-accent)]/30 hover:decoration-[var(--theme-accent)] transition-colors">${link.text}</a>`
      )
    })
  }
  return content
}
</script>

<template>
  <div id="news" class="h-full">
    <!-- Section Header -->
    <div class="mb-6">
      <p class="text-[var(--theme-accent)] font-medium tracking-wide uppercase text-sm mb-2">
        Latest Updates
      </p>
      <h2 class="text-xl font-bold text-[var(--theme-on-surface)]">
        News
      </h2>
    </div>

    <!-- News Timeline -->
    <div class="relative max-h-[420px] sm:max-h-[580px] overflow-y-auto custom-scrollbar hide-scrollbar-mobile pr-2">
      <!-- Timeline line -->
      <div class="absolute left-2 top-0 bottom-0 w-px bg-[var(--theme-card-border)]"></div>

      <!-- News Items -->
      <div class="space-y-4">
        <div
          v-for="(item, index) in displayedNews"
          :key="index"
          class="relative pl-6 sm:pl-8 group"
        >
          <!-- Timeline dot -->
          <div class="absolute left-0 top-2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[var(--theme-surface-container-high)] border-2 border-[var(--theme-accent)] group-hover:bg-[var(--theme-accent)] transition-colors duration-200"></div>

          <!-- News card -->
          <div class="bg-[var(--theme-surface-container)] rounded-lg p-4 sm:p-3 border border-[var(--theme-card-border)] hover:border-[var(--theme-accent)]/30 transition-all duration-300">
            <span class="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--theme-surface-container-higher)] text-[var(--theme-on-surface-variant)] mb-2">
              {{ item.date }}
            </span>
            <p
              class="text-[var(--theme-on-surface)] text-sm leading-relaxed"
              v-html="parseContent(item)"
            ></p>
          </div>
        </div>
      </div>
    </div>
  </div>
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
