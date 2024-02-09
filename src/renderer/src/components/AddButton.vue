<template>
  <div class="add-button">
    <v-btn icon>
      <v-icon icon="mdi-plus"></v-icon>
      <v-dialog
        v-model="dialog"
        persistent
        width="80vh"
        activator="parent"
        @update:model-value="onDialogStateChange"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">添加关键词</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="wordName"
                    label="关键词"
                    :items="items"
                    item-value="name"
                    item-title="name"
                    placeholder="在此处输入要添加的关键词"
                    @update:model-value="onWordNameChanged"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="selectAssociations"
                    :items="items"
                    chips
                    closable-chips
                    item-title="name"
                    return-object
                    label="关联词"
                    multiple
                    placeholder="在此处输入要关联的关键词"
                    @update:model-value="onAssociateInputChanged"
                  >
                    <template #chip="{ props, item }">
                      <v-chip v-bind="props" :text="item.raw.name"></v-chip>
                    </template>
                  </v-autocomplete>
                </v-col>
                <small>
                  若关键词关联了关联词，则统计计数时，每有一个关键词，对应关联词计数也会加一
                </small>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-radio-group v-model="selectLayer" label="层级" inline>
                    <v-radio label="1" :value="1"></v-radio>
                    <v-radio label="2" :value="2"></v-radio>
                    <v-radio label="3" :value="3"></v-radio>
                  </v-radio-group>
                  <small> 层级用于分组统计，层级越往下数值越高 </small>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="dialog = false"> 取消 </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="save"> 保存 </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { Word } from '../../../common/word'
import { Ref } from 'vue'
import { ref } from 'vue'
const dialog = ref(false)

const wordName = ref<string | undefined>('')
const selectAssociations: Ref<Word[]> = ref([])
const items: Ref<Word[]> = ref([])
const selectLayer = ref(1)

function onDialogStateChange(state: boolean) {
  if (!state) {
    return
  }
  window.api.db.findAllByPage(10, 0).then(({ data }) => {
    items.value = data
  })
}

async function save() {
  let word: Word
  // 此处为vuetify的bug，若选择了某一项，则返回对象，即使设置return-object为false也无效
  if (typeof wordName.value === 'object') {
    word = {
      id: wordName.value['id'],
      name: wordName.value['name'],
      layer: wordName.value['name'],
      count: wordName.value['count']
    }
  } else {
    word = {
      id: -1,
      name: wordName.value as string,
      layer: selectLayer.value,
      count: 0
    }
  }
  word.associations = []
  selectAssociations.value.forEach((selectWord) => {
    word.associations?.push({
      id: selectWord.id,
      name: selectWord.name,
      layer: selectWord.layer,
      count: selectWord.count
    })
  })
  await window.api.db.updateCount(word)
  clear()
  dialog.value = false
}

async function onWordNameChanged(value) {
  if (typeof value === 'object') {
    const selectWord = value as Word
    selectLayer.value = selectWord.layer
    selectAssociations.value = await window.api.db.findAssociationsById(selectWord.id)
  }
}

async function onAssociateInputChanged() {
  window.api.db.findAllByPage(10, 0).then(({ data }) => (items.value = data))
}

function clear() {
  wordName.value = ''
  selectAssociations.value = []
  items.value = []
  selectLayer.value = 3
}
</script>

<style scoped>
.add-button {
  position: absolute;
  bottom: 2vh;
  right: 2vw;
}
</style>
