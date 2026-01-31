<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme'

const { isDark, toggleTheme } = useTheme()

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Research', href: '#research' },
  { name: 'News', href: '#news' },
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-[var(--safe-area-top)]"
    :class="isScrolled ? 'bg-[var(--theme-nav-bg)] backdrop-blur-md border-b border-[var(--theme-outline)]' : 'bg-transparent'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <a href="#home" class="flex items-center space-x-2">
          <img src="/images/zemingchen-identity.jpeg" alt="Identity Seal" class="w-8 h-8 sm:w-10 sm:h-10 rounded" />
          <span class="text-base sm:text-xl font-semibold text-[var(--theme-on-surface)] truncate max-w-[180px] sm:max-w-none">Zeming Chen (Eric) | 陈泽铭</span>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <a
            v-for="link in navLinks"
            :key="link.name"
            :href="link.href"
            class="text-[var(--theme-on-surface-variant)] hover:text-[var(--theme-on-surface)] transition-colors duration-200 text-sm font-medium"
          >
            {{ link.name }}
          </a>

          <!-- Theme Toggle Button -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-full bg-[var(--theme-surface-container-high)] hover:bg-[var(--theme-surface-container-higher)] transition-colors duration-200"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <!-- Sun icon (show in dark mode) -->
            <svg
              v-if="isDark"
              class="w-5 h-5 text-[var(--theme-on-surface-variant)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <!-- Moon icon (show in light mode) -->
            <svg
              v-else
              class="w-5 h-5 text-[var(--theme-on-surface-variant)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>

          <a
            href="/documents/Zeming_Chen_Resume.pdf"
            target="_blank"
            class="px-4 py-2 rounded-full bg-[var(--theme-button-bg)] text-[var(--theme-button-text)] text-sm font-medium hover:bg-[var(--theme-button-hover)] transition-colors duration-200"
          >
            CV
          </a>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center space-x-2">
          <!-- Mobile Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-3 rounded-md text-[var(--theme-on-surface-variant)] hover:text-[var(--theme-on-surface)] focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg
              v-if="isDark"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>

          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="p-3 rounded-md text-[var(--theme-on-surface-variant)] hover:text-[var(--theme-on-surface)] focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden bg-[var(--theme-surface-container)] border-t border-[var(--theme-outline)] z-50"
    >
      <div class="px-4 py-4 space-y-2">
        <a
          v-for="link in navLinks"
          :key="link.name"
          :href="link.href"
          @click="isMobileMenuOpen = false"
          class="block px-4 py-3 min-h-[44px] text-[var(--theme-on-surface-variant)] hover:text-[var(--theme-on-surface)] hover:bg-[var(--theme-surface-container-high)] rounded-lg transition-colors duration-200"
        >
          {{ link.name }}
        </a>
        <a
          href="/documents/Zeming_Chen_Resume.pdf"
          target="_blank"
          class="block px-4 py-3 min-h-[44px] mt-2 text-center rounded-full bg-[var(--theme-button-bg)] text-[var(--theme-button-text)] font-medium"
        >
          Download CV
        </a>
      </div>
    </div>
  </nav>
</template>
