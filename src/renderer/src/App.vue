<template>
  <v-layout>
    <v-navigation-drawer expand-on-hover rail permanent disable-resize-watcher>
      <v-list>
        <v-list-item prepend-icon="mdi-file-word-box-outline" title="Word Count"></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item
          link
          prepend-icon="mdi-view-dashboard-outline"
          title="图表"
          to="/"
        ></v-list-item>
        <v-list-item
          link
          prepend-icon="mdi-list-box-outline"
          title="详情"
          to="detail"
        ></v-list-item>
        <v-list-item link prepend-icon="mdi-cog-outline" title="设置" to="setting"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main style="min-height: 250px">
      <router-view></router-view>
      <add-button v-draggable></add-button>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import AddButton from './components/AddButton.vue'
</script>

<style scoped></style>
