import { useState, useRef, useEffect, useCallback } from 'react'
import { Paperclip, ArrowUp, X, FileText, ImageIcon, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { useChatInput } from '~/hooks/useChatHelpers'
import { cn } from '~/utils/cn'

// Types
interface FileWithPreview {
  id: string
  file: File
  preview?: string
  type: string
  uploadStatus: 'pending' | 'uploading' | 'complete' | 'error'
  uploadProgress?: number
}

// Constants
const MAX_FILES = 5
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Utility functions
const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <ImageIcon className='h-4 w-4 text-gray-400' />
  return <FileText className='h-4 w-4 text-gray-400' />
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileTypeLabel = (type: string): string => {
  const parts = type.split('/')
  let label = parts[parts.length - 1].toUpperCase()
  if (label.length > 7 && label.includes('-')) {
    label = label.substring(0, label.indexOf('-'))
  }
  if (label.length > 10) {
    label = label.substring(0, 10) + '...'
  }
  return label
}

// File Preview Component
const FilePreviewCard: React.FC<{
  file: FileWithPreview
  onRemove: (id: string) => void
}> = ({ file, onRemove }) => {
  const isImage = file.type.startsWith('image/')

  return (
    <div
      className={cn(
        'relative flex flex-shrink-0 flex-col gap-2 overflow-hidden rounded-md border bg-muted/40 p-3 text-left',
        isImage ? 'h-28 w-28 justify-center' : 'w-40'
      )}
    >
      <div
        className={cn(
          'flex h-full w-full overflow-hidden',
          isImage ? 'items-center justify-center' : 'items-start gap-2'
        )}
      >
        {isImage && file.preview ? (
          <div className='relative h-full w-full overflow-hidden rounded-md bg-muted'>
            <img src={file.preview} alt={file.file.name} className='h-full w-full object-cover' />
          </div>
        ) : (
          <div className='flex min-w-0 flex-1 flex-col gap-1 overflow-hidden text-xs'>
            <div className='flex items-center gap-1.5'>
              {getFileIcon(file.type)}
              {file.uploadStatus === 'uploading' && <Loader2 className='h-3 w-3 animate-spin text-primary' />}
              {file.uploadStatus === 'error' && <AlertCircle className='h-3 w-3 text-destructive' />}
            </div>
            <p className='truncate font-medium text-sm text-foreground' title={file.file.name}>
              {file.file.name}
            </p>
            <p className='text-[11px] text-muted-foreground'>{formatFileSize(file.file.size)}</p>
            <p className='text-[11px] text-muted-foreground'>{getFileTypeLabel(file.type)}</p>
          </div>
        )}
      </div>
      <Button
        size='icon'
        variant='ghost'
        className='absolute right-1 top-1 h-6 w-6 p-0 text-muted-foreground hover:text-foreground'
        onClick={() => onRemove(file.id)}
      >
        <X className='h-3.5 w-3.5' />
      </Button>
    </div>
  )
}

export function MessageInput() {
  const { inputValue, setInputValue, sendMessage } = useChatInput()
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const maxHeight = 120
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
    }
  }, [inputValue])

  const handleFileSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return

      const currentFileCount = files.length
      if (currentFileCount >= MAX_FILES) {
        alert(`Tối đa ${MAX_FILES} tệp. Vui lòng xóa bớt tệp để thêm mới.`)
        return
      }

      const availableSlots = MAX_FILES - currentFileCount
      const filesToAdd = Array.from(selectedFiles).slice(0, availableSlots)

      const newFiles = filesToAdd
        .filter((file) => {
          if (file.size > MAX_FILE_SIZE) {
            alert(`Tệp ${file.name} (${formatFileSize(file.size)}) vượt quá giới hạn ${formatFileSize(MAX_FILE_SIZE)}.`)
            return false
          }
          return true
        })
        .map((file) => ({
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          type: file.type || 'application/octet-stream',
          uploadStatus: 'pending' as const,
          uploadProgress: 0
        }))

      setFiles((prev) => [...prev, ...newFiles])

      // Simulate upload for demo purposes
      newFiles.forEach((fileToUpload) => {
        setFiles((prev) => prev.map((f) => (f.id === fileToUpload.id ? { ...f, uploadStatus: 'uploading' } : f)))

        // Simulate upload progress
        setTimeout(() => {
          setFiles((prev) =>
            prev.map((f) => (f.id === fileToUpload.id ? { ...f, uploadStatus: 'complete', uploadProgress: 100 } : f))
          )
        }, 1000)
      })
    },
    [files.length]
  )

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files) {
        handleFileSelect(e.dataTransfer.files)
      }
    },
    [handleFileSelect]
  )

  const handleSend = useCallback(() => {
    if (!inputValue.trim() && files.length === 0) return
    if (files.some((f) => f.uploadStatus === 'uploading')) {
      alert('Vui lòng đợi tất cả tệp tải lên hoàn tất.')
      return
    }

    sendMessage()

    // TODO: Handle file upload in actual implementation
    files.forEach((file) => {
      if (file.preview) URL.revokeObjectURL(file.preview)
    })
    setFiles([])

    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }, [inputValue, files, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const hasContent = inputValue.trim() || files.length > 0
  const canSend = hasContent && !files.some((f) => f.uploadStatus === 'uploading')

  return (
    <div
      className='bg-background px-6 py-4'
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={cn(
          'relative flex flex-col gap-3 rounded-md border bg-background p-3 transition-colors',
          isDragging && 'border-dashed border-primary bg-primary/5'
        )}
      >
        {isDragging && (
          <div className='pointer-events-none absolute inset-0 flex items-center justify-center rounded-md border border-dashed border-primary bg-primary/10 text-sm text-primary'>
            <span className='flex items-center gap-2'>
              <ImageIcon className='h-4 w-4' />
              Thả tệp để đính kèm
            </span>
          </div>
        )}

        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Nhập tin nhắn... (Enter để gửi, Shift+Enter để xuống dòng)'
          className='resize-none border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:ring-0'
          rows={1}
        />

        {files.length > 0 && (
          <div className='flex flex-wrap gap-2 pt-1'>
            {files.map((file) => (
              <FilePreviewCard key={file.id} file={file} onRemove={removeFile} />
            ))}
          </div>
        )}

        <div className='flex items-center justify-between pt-1'>
          <Button
            size='icon'
            variant='ghost'
            className='h-9 w-9'
            onClick={() => fileInputRef.current?.click()}
            disabled={files.length >= MAX_FILES}
            title={files.length >= MAX_FILES ? `Tối đa ${MAX_FILES} tệp` : 'Đính kèm tệp'}
          >
            <Paperclip className='h-4 w-4' />
          </Button>
          <Button
            size='icon'
            className={cn('h-9 w-9', !canSend && 'pointer-events-none opacity-60')}
            onClick={handleSend}
            disabled={!canSend}
            title='Gửi tin nhắn'
          >
            <ArrowUp className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type='file'
        multiple
        className='hidden'
        onChange={(e) => {
          handleFileSelect(e.target.files)
          if (e.target) e.target.value = ''
        }}
      />
    </div>
  )
}
