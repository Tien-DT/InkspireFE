import { Paperclip, Send } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useChatInput } from '~/hooks/useChatHelpers'

export function MessageInput() {
  const { inputValue, setInputValue, sendMessage } = useChatInput()

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleSendClick = () => {
    sendMessage()
  }

  return (
    <div className='bg-white border-t border-gray-200 p-4'>
      <div className='flex items-center space-x-3'>
        <Button variant='ghost' size='icon' type='button'>
          <Paperclip className='h-5 w-5' />
        </Button>
        <div className='flex-1'>
          <Input
            type='text'
            placeholder='Nhấn Enter để gửi, Shift+Enter để xuống dòng'
            className='border-0 focus:ring-0 focus:border-0'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
        <Button
          className='bg-gray-900 hover:bg-gray-800 text-white rounded-full w-10 h-10 p-0'
          onClick={handleSendClick}
          disabled={!inputValue.trim()}
          type='button'
        >
          <Send className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
