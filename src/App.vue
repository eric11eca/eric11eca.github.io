<script setup>
import { useTheme } from './composables/useTheme'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import ResearchHub from './components/ResearchHub.vue'
import NewsSection from './components/NewsSection.vue'
import InfoPanels from './components/InfoPanels.vue'
import FooterSection from './components/FooterSection.vue'

// Initialize theme
useTheme()
</script>

<template>
  <div class="min-h-screen bg-[var(--theme-surface)] transition-colors duration-300">
    <NavBar />
    <main>
      <HeroSection>
        <template #news>
          <NewsSection />
        </template>
      </HeroSection>
      <ResearchHub />
      <InfoPanels />
    </main>
    <FooterSection />
  </div>
</template>
