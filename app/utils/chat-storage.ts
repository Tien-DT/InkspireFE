import type { Conversation, Message, ChatLocalStorage } from '~/types/chat.type'

// ===== Constants =====
const CHAT_STORAGE_KEY = 'inkspire_chat_storage'
const MAX_MESSAGES_PER_CONVERSATION = 100
const SYNC_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes

// ===== Helper Functions =====

/**
 * Safely parse JSON from localStorage
 */
function safeJSONParse<T>(str: string | null, defaultValue: T): T {
  if (!str) return defaultValue
  try {
    return JSON.parse(str) as T
  } catch {
    return defaultValue
  }
}

/**
 * Safely stringify JSON
 */
function safeJSONStringify(value: unknown): string {
  try {
    return JSON.stringify(value)
  } catch {
    return '{}'
  }
}

// ===== Chat Storage Service =====

/**
 * Get chat storage from localStorage
 */
export function getChatStorage(): ChatLocalStorage {
  if (typeof window === 'undefined') {
    return {
      conversations: [],
      messages: {},
      lastSync: 0
    }
  }

  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY)
    return safeJSONParse(stored, {
      conversations: [],
      messages: {},
      lastSync: 0
    })
  } catch {
    return {
      conversations: [],
      messages: {},
      lastSync: 0
    }
  }
}

/**
 * Save chat storage to localStorage
 */
export function saveChatStorage(storage: ChatLocalStorage): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CHAT_STORAGE_KEY, safeJSONStringify(storage))
  } catch (error) {
    console.error('[ChatStorage] Failed to save:', error)
  }
}

/**
 * Clear all chat storage
 */
export function clearChatStorage(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(CHAT_STORAGE_KEY)
  } catch (error) {
    console.error('[ChatStorage] Failed to clear:', error)
  }
}

/**
 * Check if sync is needed based on last sync time
 */
export function shouldSync(): boolean {
  const storage = getChatStorage()
  const now = Date.now()
  return now - storage.lastSync > SYNC_INTERVAL_MS
}

/**
 * Update last sync timestamp
 */
export function updateLastSync(): void {
  const storage = getChatStorage()
  storage.lastSync = Date.now()
  saveChatStorage(storage)
}

// ===== Conversations =====

/**
 * Get all conversations from localStorage
 */
export function getStoredConversations(): Conversation[] {
  const storage = getChatStorage()
  return storage.conversations || []
}

/**
 * Save conversations to localStorage
 */
export function saveConversations(conversations: Conversation[]): void {
  const storage = getChatStorage()
  storage.conversations = conversations
  saveChatStorage(storage)
}

/**
 * Add or update a conversation
 */
export function upsertConversation(conversation: Conversation): void {
  const storage = getChatStorage()
  const index = storage.conversations.findIndex((c) => c.id === conversation.id)

  if (index >= 0) {
    storage.conversations[index] = conversation
  } else {
    storage.conversations.push(conversation)
  }

  saveChatStorage(storage)
}

/**
 * Remove a conversation
 */
export function removeConversation(conversationId: string): void {
  const storage = getChatStorage()
  storage.conversations = storage.conversations.filter((c) => c.id !== conversationId)
  
  // Also remove messages for this conversation
  delete storage.messages[conversationId]
  
  saveChatStorage(storage)
}

// ===== Messages =====

/**
 * Get messages for a specific conversation
 */
export function getStoredMessages(conversationId: string): Message[] {
  const storage = getChatStorage()
  return storage.messages[conversationId] || []
}

/**
 * Save messages for a specific conversation (limit to MAX_MESSAGES)
 */
export function saveMessages(conversationId: string, messages: Message[]): void {
  const storage = getChatStorage()
  
  // Sort by sendAt descending and take latest MAX_MESSAGES
  const sortedMessages = [...messages].sort((a, b) => {
    const dateA = a.sendAt ? new Date(a.sendAt).getTime() : 0
    const dateB = b.sendAt ? new Date(b.sendAt).getTime() : 0
    return dateB - dateA
  })
  
  storage.messages[conversationId] = sortedMessages.slice(0, MAX_MESSAGES_PER_CONVERSATION)
  saveChatStorage(storage)
}

/**
 * Add or update a message in localStorage
 */
export function upsertMessage(conversationId: string, message: Message): void {
  const storage = getChatStorage()
  const messages = storage.messages[conversationId] || []
  
  const index = messages.findIndex((m) => m.id === message.id)
  
  if (index >= 0) {
    messages[index] = message
  } else {
    messages.push(message)
  }
  
  // Sort and limit
  const sortedMessages = messages.sort((a, b) => {
    const dateA = a.sendAt ? new Date(a.sendAt).getTime() : 0
    const dateB = b.sendAt ? new Date(b.sendAt).getTime() : 0
    return dateB - dateA
  })
  
  storage.messages[conversationId] = sortedMessages.slice(0, MAX_MESSAGES_PER_CONVERSATION)
  saveChatStorage(storage)
}

/**
 * Remove a message from localStorage
 */
export function removeMessage(conversationId: string, messageId: string): void {
  const storage = getChatStorage()
  const messages = storage.messages[conversationId] || []
  
  storage.messages[conversationId] = messages.filter((m) => m.id !== messageId)
  saveChatStorage(storage)
}

/**
 * Get all messages across all conversations
 */
export function getAllStoredMessages(): Record<string, Message[]> {
  const storage = getChatStorage()
  return storage.messages || {}
}

// ===== Sync Helpers =====

/**
 * Merge server conversations with local storage
 * Server data takes precedence
 */
export function mergeConversations(
  serverConversations: Conversation[],
  localConversations: Conversation[]
): Conversation[] {
  const merged = new Map<string, Conversation>()

  // Add local first
  localConversations.forEach((conv) => {
    merged.set(conv.id, conv)
  })

  // Overwrite with server data
  serverConversations.forEach((conv) => {
    merged.set(conv.id, conv)
  })

  return Array.from(merged.values())
}

/**
 * Merge server messages with local storage
 * Server data takes precedence for existing messages
 */
export function mergeMessages(
  conversationId: string,
  serverMessages: Message[],
  localMessages: Message[]
): Message[] {
  const merged = new Map<string, Message>()

  // Add local first
  localMessages.forEach((msg) => {
    merged.set(msg.id, msg)
  })

  // Overwrite with server data
  serverMessages.forEach((msg) => {
    merged.set(msg.id, msg)
  })

  const allMessages = Array.from(merged.values())

  // Sort by sendAt descending and limit
  return allMessages
    .sort((a, b) => {
      const dateA = a.sendAt ? new Date(a.sendAt).getTime() : 0
      const dateB = b.sendAt ? new Date(b.sendAt).getTime() : 0
      return dateB - dateA
    })
    .slice(0, MAX_MESSAGES_PER_CONVERSATION)
}

/**
 * Sync local storage with server data
 */
export function syncWithServer(
  serverConversations: Conversation[],
  serverMessages: Record<string, Message[]>
): void {
  const storage = getChatStorage()

  // Merge conversations
  storage.conversations = mergeConversations(serverConversations, storage.conversations)

  // Merge messages for each conversation
  Object.keys(serverMessages).forEach((conversationId) => {
    const localMessages = storage.messages[conversationId] || []
    storage.messages[conversationId] = mergeMessages(
      conversationId,
      serverMessages[conversationId],
      localMessages
    )
  })

  storage.lastSync = Date.now()
  saveChatStorage(storage)
}

// Export all functions
export const chatStorage = {
  get: getChatStorage,
  save: saveChatStorage,
  clear: clearChatStorage,
  shouldSync,
  updateLastSync,
  
  // Conversations
  getConversations: getStoredConversations,
  saveConversations,
  upsertConversation,
  removeConversation,
  
  // Messages
  getMessages: getStoredMessages,
  saveMessages,
  upsertMessage,
  removeMessage,
  getAllMessages: getAllStoredMessages,
  
  // Sync
  mergeConversations,
  mergeMessages,
  syncWithServer
}

export default chatStorage
