import mongodbPromise from '@/lib/mongodb/mongodb_master'
import mongodbOaPromise from '@/lib/mongodb/mongodb_oa'

/**
 * db取合集数据
 * @param key 默认取users表
 * @returns
 */
export async function getDBCollection(key = 'users') {
  const client = await mongodbPromise
  return await client.db().collection(key)
}

/**
 * oa db取合集数据
 * @param key 默认取explore_list表
 * @returns
 */
export async function getOaDBCollection(key = 'explore_list') {
  const client = await mongodbOaPromise
  return await client.db().collection(key)
}
