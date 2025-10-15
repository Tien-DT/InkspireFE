import { useTypingIndicators } from '~/hooks/useChatHelpers'

export function TypingIndicator() {
  const { typingText, isAnyoneTyping } = useTypingIndicators()

  if (!isAnyoneTyping) return null

  return (
    <div className='border-t bg-muted/40 px-6 py-2'>
      <div className='flex items-center gap-2 text-xs text-muted-foreground'>
        <div className='flex gap-1'>
          <span className='h-2 w-2 animate-bounce rounded-full bg-muted-foreground' style={{ animationDelay: '0ms' }} />
          <span
            className='h-2 w-2 animate-bounce rounded-full bg-muted-foreground'
            style={{ animationDelay: '120ms' }}
          />
          <span
            className='h-2 w-2 animate-bounce rounded-full bg-muted-foreground'
            style={{ animationDelay: '240ms' }}
          />
        </div>
        <span>{typingText}</span>
      </div>
    </div>
  )
}
