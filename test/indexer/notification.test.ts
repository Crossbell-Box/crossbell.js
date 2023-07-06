import { describe, expect, test } from 'vitest'
import { createIndexer } from '../../src'

const indexer = createIndexer()
const characterId = 55926
const expoDeviceToken = 'ExponentPushToken[_H0PtKNE8Kv4YxEsprdyUS]'

describe('notification', () => {
  test('get many', async () => {
    const notifications = await indexer.notification.getMany(characterId)
    expect(notifications.list).is.an('array')
    expect(notifications.count).is.an('number')
  })

  test('unread count', async () => {
    const { count } = await indexer.notification.getUnreadCount(characterId)
    expect(count).is.a('number')
  })

  test('add notification device', async () => {
    const { ok } = await indexer.notification.addDevice(
      characterId,
      expoDeviceToken,
    )
    expect(ok).toBeTruthy()
  })

  test('remove notification device', async () => {
    const { ok } = await indexer.notification.removeDevice(
      characterId,
      expoDeviceToken,
    )
    expect(ok).toBeTruthy()
  })
})
