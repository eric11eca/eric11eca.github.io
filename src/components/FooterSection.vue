<script setup>
const currentYear = new Date().getFullYear()

const socialLinks = [
  {
    name: 'Google Scholar',
    url: 'https://scholar.google.com/citations?user=W_qzYZ0AAAAJ',
    icon: 'scholar'
  },
  {
    name: 'GitHub',
    url: 'https://github.com/eric11eca',
    icon: 'github'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/eric_zemingchen',
    icon: 'twitter'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/zeming-chen-bb951b134',
    icon: 'linkedin'
  },
  {
    name: 'Semantic Scholar',
    url: 'https://www.semanticscholar.org/author/Zeming-Chen/2109456022',
    icon: 'semantic'
  }
]
</script>

<template>
  <footer class="bg-[var(--theme-surface)] border-t border-[var(--theme-surface-container-high)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-[max(3rem,var(--safe-area-bottom))]">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-center">
        <!-- Left: Info -->
        <div class="space-y-4">
          <h3 class="text-xl font-semibold text-[var(--theme-on-surface)]">Zeming Chen (Eric)</h3>
          <p class="text-[var(--theme-on-surface-variant)] text-sm">
            Ph.D. Candidate @ EPFL NLP Lab<br />
            Building AI systems that reason and adapt.
          </p>
          <a
            href="mailto:zeming.chen@epfl.ch"
            class="inline-flex items-center text-[var(--theme-accent)] hover:text-[var(--theme-accent-hover)] text-sm transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            zeming.chen@epfl.ch
          </a>
        </div>

        <!-- Center: Social Links -->
        <div class="flex flex-wrap justify-center gap-2 sm:gap-4 sm:col-span-2 md:col-span-1">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            :title="link.name"
            class="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-[var(--theme-surface-container)] hover:bg-[var(--theme-surface-container-high)] border border-[var(--theme-card-border)] hover:border-[var(--theme-accent)]/50 transition-all duration-200"
          >
            <!-- Google Scholar -->
            <img
              v-if="link.icon === 'scholar'"
              src="/images/google-scholar.svg"
              :alt="link.name"
              class="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
              :style="{ filter: 'var(--theme-invert)' }"
            />
            <!-- GitHub -->
            <svg v-else-if="link.icon === 'github'" class="w-5 h-5 text-[var(--theme-on-surface-variant)] hover:text-[var(--theme-on-surface)]" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
            <!-- Twitter/X -->
            <svg v-else-if="link.icon === 'twitter'" class="w-5 h-5 text-[var(--theme-on-surface-variant)] hover:text-[var(--theme-on-surface)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <!-- LinkedIn -->
            <svg v-else-if="link.icon === 'linkedin'" class="w-5 h-5 text-[var(--theme-on-surface-variant)] hover:text-[var(--theme-on-surface)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <!-- Semantic Scholar -->
            <img
              v-else-if="link.icon === 'semantic'"
              src="/images/semantic-scholar.svg"
              :alt="link.name"
              class="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
              :style="{ filter: 'var(--theme-invert)' }"
            />
          </a>
        </div>

        <!-- Right: Quick Links -->
        <div class="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6">
          <a
            href="#home"
            class="text-[var(--theme-on-surface-variant)] hover:text-[var(--theme-on-surface)] text-sm transition-colors duration-200 min-h-[44px] flex items-center"
          >
            Home
          </a>
          <a
            href="#research"
            class="text-[var(--theme-on-surface-variant)] hover:text-[var(--theme-on-surface)] text-sm transition-colors duration-200 min-h-[44px] flex items-center"
          >
            Research
          </a>
          <a
            href="#news"
            class="text-[var(--theme-on-surface-variant)] hover:text-[var(--theme-on-surface)] text-sm transition-colors duration-200 min-h-[44px] flex items-center"
          >
            News
          </a>
          <a
            href="/documents/Zeming_Chen_Resume.pdf"
            target="_blank"
            class="text-[var(--theme-on-surface-variant)] hover:text-[var(--theme-on-surface)] text-sm transition-colors duration-200 min-h-[44px] flex items-center"
          >
            CV
          </a>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-12 pt-8 border-t border-[var(--theme-surface-container-high)] text-center">
        <p class="text-[var(--theme-on-surface-muted)] text-sm">
          &copy; {{ currentYear }} Zeming Chen. Built with Vue.js & Tailwind CSS.
        </p>
      </div>
    </div>
  </footer>
</template>
