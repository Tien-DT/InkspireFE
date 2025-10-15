import axiosClient from '~/lib/axios'
import type {
  Conversation,
  Message,
  ConversationMember,
  CreateConversationRequest,
  UpdateConversationRequest,
  SendMessageRequest,
  UpdateMessageRequest,
  CreateConversationMemberRequest,
  UpdateConversationMemberRequest,
  PaginationParams,
  ApiResponse,
  PaginatedResponse
} from '~/types/chat.type'

// ===== API URLs =====
const BASE_URL = '/api'

// Conversations
export const URL_CONVERSATIONS = `${BASE_URL}/conversations`
export const URL_MY_CONVERSATIONS = `${BASE_URL}/conversations/myconversations`
export const URL_CONVERSATION_BY_ID = (id: string) => `${BASE_URL}/conversations/${id}`
export const URL_CONVERSATION_MEMBERS = (id: string) => `${BASE_URL}/conversations/${id}/members`
export const URL_CREATE_CONVERSATION_WITH_USER = `${BASE_URL}/conversations/create-with-user`

// Messages
export const URL_MESSAGES = `${BASE_URL}/messages`
export const URL_MESSAGE_BY_ID = (id: string) => `${BASE_URL}/messages/${id}`
export const URL_CONVERSATION_MESSAGES = (conversationId: string) =>
  `${BASE_URL}/messages/conversation/${conversationId}`
export const URL_MARK_READ = (id: string) => `${BASE_URL}/messages/${id}/mark-read`
export const URL_MARK_RECEIVED = (id: string) => `${BASE_URL}/messages/${id}/mark-received`

// Conversation Members
export const URL_CONVERSATION_MEMBERS_BASE = `${BASE_URL}/conversation-members`
export const URL_CONVERSATION_MEMBER_BY_ID = (id: string) => `${BASE_URL}/conversation-members/${id}`
export const URL_MEMBERS_BY_CONVERSATION = (conversationId: string) =>
  `${BASE_URL}/conversation-members/conversation/${conversationId}`
export const URL_RESET_UNREAD = (id: string) => `${BASE_URL}/conversation-members/${id}/reset-unread`

// ===== Chat API =====
export const chatApi = {
  // ========== Conversations ==========

  /**
   * Get current user's conversations with pagination
   */
  getMyConversations: async (params: PaginationParams = { page: 1, pageSize: 20 }) => {
    const response = await axiosClient.get<PaginatedResponse<Conversation[]>>(URL_MY_CONVERSATIONS, { params })
    return response.data
  },

  /**
   * Get conversation by ID
   */
  getConversationById: async (id: string) => {
    const response = await axiosClient.get<ApiResponse<Conversation>>(URL_CONVERSATION_BY_ID(id))
    return response.data
  },

  /**
   * Get members of a conversation
   */
  getConversationMembers: async (conversationId: string) => {
    const response = await axiosClient.get<ApiResponse<ConversationMember[]>>(URL_CONVERSATION_MEMBERS(conversationId))
    return response.data
  },

  /**
   * Create a new conversation
   */
  createConversation: async (body: CreateConversationRequest) => {
    const response = await axiosClient.post<ApiResponse<Conversation>>(URL_CONVERSATIONS, body)
    return response.data
  },

  /**
   * Create a conversation with a specific user
   */
  createConversationWithUser: async (userId: string) => {
    const response = await axiosClient.post<ApiResponse<Conversation>>(URL_CREATE_CONVERSATION_WITH_USER, { userId })
    return response.data
  },

  /**
   * Update a conversation
   */
  updateConversation: async (id: string, body: UpdateConversationRequest) => {
    const response = await axiosClient.put<ApiResponse<Conversation>>(URL_CONVERSATION_BY_ID(id), body)
    return response.data
  },

  /**
   * Delete a conversation
   */
  deleteConversation: async (id: string) => {
    const response = await axiosClient.delete<ApiResponse<void>>(URL_CONVERSATION_BY_ID(id))
    return response.data
  },

  // ========== Messages ==========

  /**
   * Get messages by conversation ID with pagination
   */
  getConversationMessages: async (conversationId: string, params: PaginationParams = { page: 1, pageSize: 50 }) => {
    const response = await axiosClient.get<PaginatedResponse<Message[]>>(URL_CONVERSATION_MESSAGES(conversationId), {
      params
    })
    return response.data
  },

  /**
   * Get message by ID
   */
  getMessageById: async (id: string) => {
    const response = await axiosClient.get<ApiResponse<Message>>(URL_MESSAGE_BY_ID(id))
    return response.data
  },

  /**
   * Send a new message (via REST API)
   */
  sendMessage: async (body: SendMessageRequest) => {
    const response = await axiosClient.post<ApiResponse<Message>>(URL_MESSAGES, body)
    return response.data
  },

  /**
   * Update a message
   */
  updateMessage: async (id: string, body: UpdateMessageRequest) => {
    const response = await axiosClient.put<ApiResponse<Message>>(URL_MESSAGE_BY_ID(id), body)
    return response.data
  },

  /**
   * Delete a message
   */
  deleteMessage: async (id: string) => {
    const response = await axiosClient.delete<ApiResponse<void>>(URL_MESSAGE_BY_ID(id))
    return response.data
  },

  /**
   * Mark message as read
   */
  markAsRead: async (id: string) => {
    const response = await axiosClient.post<ApiResponse<Message>>(URL_MARK_READ(id))
    return response.data
  },

  /**
   * Mark message as received
   */
  markAsReceived: async (id: string) => {
    const response = await axiosClient.post<ApiResponse<Message>>(URL_MARK_RECEIVED(id))
    return response.data
  },

  // ========== Conversation Members ==========

  /**
   * Get members by conversation ID
   */
  getMembersByConversation: async (conversationId: string) => {
    const response = await axiosClient.get<ApiResponse<ConversationMember[]>>(
      URL_MEMBERS_BY_CONVERSATION(conversationId)
    )
    return response.data
  },

  /**
   * Add member to conversation
   */
  addMember: async (body: CreateConversationMemberRequest) => {
    const response = await axiosClient.post<ApiResponse<ConversationMember>>(URL_CONVERSATION_MEMBERS_BASE, body)
    return response.data
  },

  /**
   * Update conversation member
   */
  updateMember: async (id: string, body: UpdateConversationMemberRequest) => {
    const response = await axiosClient.put<ApiResponse<ConversationMember>>(URL_CONVERSATION_MEMBER_BY_ID(id), body)
    return response.data
  },

  /**
   * Remove member from conversation
   */
  removeMember: async (id: string) => {
    const response = await axiosClient.delete<ApiResponse<void>>(URL_CONVERSATION_MEMBER_BY_ID(id))
    return response.data
  },

  /**
   * Reset unread count
   */
  resetUnreadCount: async (memberId: string) => {
    const response = await axiosClient.post<ApiResponse<ConversationMember>>(URL_RESET_UNREAD(memberId))
    return response.data
  }
}

export default chatApi
