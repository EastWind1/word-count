import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import { Word } from '../common/word'
/**
 * 数据库相关操作
 */
export class DB {
  db: Database.Database
  constructor() {
    this.db = this.connect()
    this.createTable()
  }
  /**
   * 连接数据库文件
   * @returns 数据库连接
   */
  connect(): Database.Database {
    const dataDir = app.getPath('appData')
    const dbPath = path.join(dataDir, 'word-count', 'word-count.db')
    const db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    return db
  }
  /**
   * 创建表
   */
  createTable() {
    this.db
      .prepare(
        `
          CREATE TABLE IF NOT EXISTS word (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            count INTEGER,
            layer INTEGER
          );
        `
      )
      .run()
    this.db
      .prepare(
        `
          CREATE TABLE IF NOT EXISTS association (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            originId INTEGER NOT NULL,
            targetId INTEGER NOT NULL
          );
        `
      )
      .run()
  }
  /**
   * 关闭连接
   */
  close() {
    this.db.close()
  }
  /**
   * 根据分页信息查询关键词
   * @param pageSize 分页大小
   * @param pageIndex 分页索引，从0开始
   * @returns 关键词列表
   */
  findAllByPage(pageSize: number, pageIndex: number): Word[] {
    const rows = this.db
      .prepare(
        `
          SELECT id, name, count, layer 
          FROM word 
          LIMIT ${pageSize} OFFSET ${pageIndex * pageSize};
        `
      )
      .all() as Word[]
    return rows
  }
  /**
   * 根据id查询关键词
   * @param id 关键词id
   * @returns 关键词，若未查询到则为null
   */
  findById(id: number): Word {
    const row = this.db
      .prepare(
        `
          SELECT id, name, count, layer 
          FROM word 
          WHERE id = ${id};
        `
      )
      .get() as Word
    const associations = this.db
      .prepare(
        `
          SELECT id, name, count, layer 
          FROM word 
          WHERE id in (SELECT targetId FROM association WHERE originId = ${id});
        `
      )
      .get() as Word[]
    row.associations = associations
    return row
  }
  /**
   * 根据名称查询关键词
   * @param name 关键词名称
   * @returns 关键词，若未查询到则为null
   */
  findAssociationsById(id: number): Word[] {
    const rows = this.db
      .prepare(
        `
          SELECT id, name, count, layer FROM word WHERE id in (SELECT targetId FROM ASSOCIATION WHERE originId = ${id});
        `
      )
      .all() as Word[]
    return rows
  }
  /**
   * 根据关键词id查找关联的关键词
   * @param id 关键词id
   * @returns 关联词
   */
  findByName(name: string): Word {
    const row = this.db
      .prepare(
        `
          SELECT id, name, count, layer FROM word WHERE name = ${name};
        `
      )
      .get() as Word
    return row
  }
  /**
   * 插入
   * @param word 待插入的关键词
   * @returns 插入后的关键词，包含id
   */
  insert(word: Word): Word {
    const transactionInsert = this.db.transaction((word: Word) => {
      const result = this.db
        .prepare(
          `
            INSERT INTO word (name, count, layer) VALUES ('${word.name}', ${word.count}, ${word.layer});
          `
        )
        .run()
      const newId = result.lastInsertRowid as number
      word.id = newId
      if (word.associations) {
        for (const association of word.associations) {
          this.db
            .prepare(
              `
                INSERT INTO association (originId, targetId) VALUES (${newId}, ${association.id});
              `
            )
            .run()
        }
      }
    })
    transactionInsert(word)
    return word
  }
  /**
   * 更新
   * @param word 待更新的关键词
   */
  update(word: Word) {
    const sql = `UPDATE word SET name = '${word.name}', count = ${word.count}, layer = ${word.layer} WHERE id = ${word.id}`
    this.db.prepare(sql).run()
  }
  /**
   * 计数加一
   * @param word 待增加计数的关键字
   */
  addCount(word: Word) {
    const assocaitions = this.db
      .prepare(`SELECT targetId from association WHERE originId = ${word.id}`)
      .all() as number[]
    this.db.transaction(() => {
      assocaitions.forEach((id) => {
        this.db.prepare(`UPDATE word SET count = count + 1 WHERE id = ${id}`).run()
      })
      this.db.prepare(`UPDATE word SET count = count + 1 WHERE id = ${word.id}`).run()
    })()
  }

  /**
   * 查询总数
   * @returns 总数
   */
  getCount(): number {
    const res = this.db
      .prepare(
        `
         SELECT COUNT(id) as count FROM word;
        `
      )
      .get() as { [key: string]: number }
    return res['count']
  }
}
