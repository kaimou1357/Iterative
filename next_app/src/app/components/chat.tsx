"use client";
import Chat, { Bubble, MessageProps } from '@chatui/core';
import '@chatui/core/dist/index.css';

interface ChatProps {
  onMessageSend: (type: string, content: string) => void;
  messages: MessageProps[];
}

const GenKodeChat = ({onMessageSend, messages}: ChatProps) => {
  const renderMessageContent = (message: MessageProps) => {
    const { content } = message;
    return <Bubble content= { content.text } />
  }
  return (
    <Chat
      locale="en-US"
      navbar={{ title: 'Iterative' }}
      messages={messages}
      placeholder='Tell us what you want to build!'
      renderMessageContent={renderMessageContent}
      onSend={onMessageSend}
    />
  )
}

export default GenKodeChat;