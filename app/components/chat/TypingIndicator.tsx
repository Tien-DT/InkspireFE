import { useTypingIndicators } from '~/hooks/useChatHelpers'

export function TypingIndicator() {
  const { typingText, isAnyoneTyping } = useTypingIndicators()

  if (!isAnyoneTyping) return null

  return (
    <div className='px-4 py-2 bg-gray-50 border-t border-gray-100'>
      <div className='flex items-center space-x-2'>
        <div className='flex space-x-1'>
          <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
          <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
          <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
        </div>
        <span className='text-xs text-gray-600'>{typingText}</span>
      </div>
    </div>
  )
}
