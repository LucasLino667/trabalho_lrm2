<template>
  <q-layout view="lHh Lpr lFf" class="app-layout">
    <!-- Header -->
    <q-header class="transparent-header q-py-sm">
      <q-toolbar class="container justify-between">
        <div class="row items-center cursor-pointer" @click="goHome">
          <q-avatar size="42px" class="q-mr-sm logo-glow">
            <span class="text-h5">🎬</span>
          </q-avatar>
          <q-toolbar-title class="text-weight-bolder text-h5 text-gradient-primary tracking-wide">
            CineMatch
          </q-toolbar-title>
        </div>

        <div class="row items-center q-gutter-sm">
          <q-chip
            outline
            color="accent"
            text-color="accent"
            dense
            class="pulse-neon-cyan text-weight-bold"
          >
            Versão Local 1.0
          </q-chip>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Page Content Container -->
    <q-page-container>
      <q-page class="flex flex-center q-py-xl container-main">
        <router-view />
      </q-page>
    </q-page-container>

    <!-- Footer -->
    <q-footer class="transparent-footer text-center q-py-md text-grey-5">
      <div>Desenvolvido usando <strong>Quasar Framework</strong> e <strong>Vue 3</strong></div>
      <div class="text-caption q-mt-xs">&copy; 2026 CineMatch. Todos os direitos reservados.</div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.transparent-header {
  background: rgba(10, 5, 22, 0.4) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.transparent-footer {
  background: rgba(10, 5, 22, 0.6) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 14px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.container-main {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding-top: 80px;
  padding-bottom: 80px;
}

.logo-glow {
  background: rgba(138, 43, 226, 0.15);
  border: 1.5px solid rgba(138, 43, 226, 0.4);
  box-shadow: 0 0 10px rgba(138, 43, 226, 0.3);
}

.tracking-wide {
  letter-spacing: 0.8px;
}
</style>
