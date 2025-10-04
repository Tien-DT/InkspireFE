import type { User } from './user.type'

// ===== Message Types =====
export interface Message {
  id: string
  conversationId: string
  messageContent: string | null
  senderId: string | null
  sender?: User
  sendAt: string | null
  receivedAt: string | null
  readAt: string | null
  status: number | null
}

export interface ChatMessageResponse {
  id: string
  conversationId: string
  messageContent: string | null
  senderId: string | null
  senderName?: string | null
  sendAt: string
  receivedAt: string | null
  readAt: string | null
  status: number | null
}

export interface SendMessageRequest {
  conversationId: string
  messageContent: string
  senderId?: string | null
  status: number
}

export interface UpdateMessageRequest {
  messageContent?: string | null
  receivedAt?: string | null
  readAt?: string | null
  status?: number | null
}

// ===== Conversation Types =====
export interface Conversation {
  id: string
  latestMessage: string | null
  createdAt: string | null
  updatedAt: string | null
  deletedAt: string | null
  status: number | null
  members?: ConversationMember[]
  messages?: Message[]
}

export interface CreateConversationRequest {
  latestMessage?: string
  status?: number
}

export interface UpdateConversationRequest {
  latestMessage?: string
  status?: number
}

// ===== ConversationMember Types =====
export interface ConversationMember {
  id: string
  conversationId: string
  userId: string
  user?: User
  role: string | null
  joinedAt: string | null
  leftAt: string | null
  unreadCount: number
}

export interface CreateConversationMemberRequest {
  conversationId: string
  userId: string
  role?: string
}

export interface UpdateConversationMemberRequest {
  role?: string
  leftAt?: string | null
  unreadCount?: number
}

// ===== Attachment Types =====
export interface Attachment {
  id: string
  ownerUserId: string
  url: string
  type: string
  createdAt: string
  status: number
}

export interface CreateAttachmentRequest {
  ownerUserId: string
  url: string
  type: string
  status?: number
}

export interface MessageAttachment {
  id: string
  messageId: string
  attachmentId: string
  attachment?: Attachment
}

// ===== Pagination =====
export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginationMetadata {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T
  message: string
  pagination?: PaginationMetadata
}

// ===== Chat State Types =====
export interface TypingUser {
  userId: string
  userName: string
  conversationId: string
  timestamp: number
}

export interface OnlineUser {
  userId: string
  timestamp: number
}

export interface ChatState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Record<string, Message[]> // conversationId -> messages[]
  typingUsers: TypingUser[]
  onlineUsers: Set<string>
  isConnected: boolean
  isLoading: boolean
}

// ===== Local Storage Types =====
export interface ChatLocalStorage {
  conversations: Conversation[]
  messages: Record<string, Message[]>
  lastSync: number
}

// ===== API Response Types =====
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  pagination?: PaginationMetadata
  errors?: string[]
}

export interface ConversationWithDetails extends Conversation {
  otherMember?: User
  lastMessage?: Message
  unreadCount?: number
}

// ===== Status Enums =====
export enum MessageStatus {
  Sent = 1,
  Delivered = 2,
  Read = 3,
  Failed = 4
}

export enum ConversationStatus {
  Active = 1,
  Archived = 2,
  Deleted = 3
}

export enum MemberRole {
  Admin = 'admin',
  Member = 'member'
}
