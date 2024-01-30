<template>
  <v-data-table-server
    :items="items"
    :items-length="length"
    :loading="loading"
    :headers="headers"
    :items-per-page="10"
    @update:options="loadItems"
  >
  </v-data-table-server>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const items = ref()
const length = ref(0)
const loading = ref(false)

const headers = [
  { title: '名称', value: 'name' },
  { title: '计数', value: 'count' }
]

function loadItems({ page, itemsPerPage }) {
  loading.value = true
  window.api.db.findAllByPage(itemsPerPage, page - 1).then(({ data, total }) => {
    items.value = data
    length.value = total
    loading.value = false
  })
}
</script>

<style scoped></style>
