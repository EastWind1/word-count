import { ipcRenderer } from 'electron'
import { Word } from '../common/word'

/**
 * 后端API
 */
export interface API {
  /**
   * 数据库相关
   */
  db: {
    /**
     * 根据分页信息查询关键词
     * @param pageSize 分页大小
     * @param pageIndex 分页索引，从0开始
     * @returns 关键词列表
     */
    findAllByPage: (pageSize: number, pageIndex: number) => Promise<{ data: Word[]; total: number }>
    /**
     * 根据id查询关键词
     * @param id 关键词id
     * @returns 关键词，若未查询到则为null
     */
    findById: (id: number) => Promise<Word>
    /**
     * 根据名称查询关键词
     * @param id 关键词名称
     * @returns 关键词，若未查询到则为null
     */
    findByName: (name: string) => Promise<Word>
    /**
     * 更新关键词计数
     * @param word 待更新关键词,若关键词id为-1,表示新增并计数设为1，否则表示更新
     * @returns 保存后的关键词
     */
    updateCount: (word: Word) => Promise<Word>
    /**
     * 根据关键词id查找关联的关键词
     * @param id 关键词id
     * @returns 关联词数组
     */
    findAssociationsById: (id: number) => Promise<Word[]>
  }
}
/**
 * 后端API实例
 */
export const api: API = {
  db: {
    findAllByPage: (pageSize: number, pageIndex: number) =>
      ipcRenderer.invoke('api.db.findAllByPage', pageSize, pageIndex) as Promise<{
        data: Word[]
        total: number
      }>,
    findById: (id: number) => ipcRenderer.invoke('api.db.findById', id) as Promise<Word>,
    findByName: (name: string) => ipcRenderer.invoke('api.db.findByName', name) as Promise<Word>,
    updateCount: (word: Word) => ipcRenderer.invoke('api.db.updateCount', word) as Promise<Word>,
    findAssociationsById: (id: number) =>
      ipcRenderer.invoke('api.db.findAssociationsById', id) as Promise<Word[]>
  }
}
