import { ref, watch, onMounted } from 'vue'

const isDark = ref(true)

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  const setTheme = (dark) => {
    isDark.value = dark
  }

  // Apply theme to document
  watch(isDark, (dark) => {
    if (dark) {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, { immediate: true })

  // Initialize from localStorage or system preference
  onMounted(() => {
    const stored = localStorage.getItem('theme')
    if (stored) {
      isDark.value = stored === 'dark'
    } else {
      // Check system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  })

  return {
    isDark,
    toggleTheme,
    setTheme
  }
}
