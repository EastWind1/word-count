/**
 * 关键词
 */
export interface Word {
  /**
   * 主键
   * 若值为-1,说明为新增项
   */
  id: number
  /**
   * 名称
   */
  name: string
  /**
   * 计数
   */
  count: number
  /**
   * 层级
   */
  layer: number
  /**
   * 关联词
   */
  associations?: Word[]
}
