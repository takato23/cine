export type PersistStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

const noopStorage: PersistStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

export function safeLocalStorage(): PersistStorage {
  if (typeof window === 'undefined') return noopStorage
  return window.localStorage
}

export function safeSessionStorage(): PersistStorage {
  if (typeof window === 'undefined') return noopStorage
  return window.sessionStorage
}

