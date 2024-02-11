import { ipcMain } from 'electron'
import { DB } from './db'
import { Word } from '../common/word'
/**
 * 注册API相关方法
 * @param db 数据库实例
 */
export function registerAPIHandle(db: DB) {
  ipcMain.handle('api.db.findAllByPage', (_, pageSize: number, pageIndex: number) => {
    const data = db.findAllByPage(pageSize, pageIndex)
    const total = db.getCount()
    return { data, total }
  })
  ipcMain.handle('api.db.findByNameLike', (_, keyword: string) => {
    return db.findByNameLike(keyword)
  })
  ipcMain.handle('api.db.findById', (_, id: number) => {
    return db.findById(id)
  })
  ipcMain.handle('api.db.findByName', (_, name: string) => {
    return db.findByName(name)
  })
  ipcMain.handle('api.db.updateCount', (_, word: Word) => {
    if (word.id === -1) {
      db.db.transaction(() => {
        db.insert(word)
        db.addCount(word)
      })()
    } else {
      db.addCount(word)
    }
  })
  ipcMain.handle('api.db.findAssociationsById', (_, id: number) => {
    return db.findAssociationsById(id)
  })
  ipcMain.handle('api.db.findAssociatedById', (_, id: number, fetchOneLayer: boolean) => {
    return db.findAssociatedById(id, fetchOneLayer)
  })
}
