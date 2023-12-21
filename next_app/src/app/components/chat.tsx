"use client";
import Chat, { Bubble, useMessages, MessageProps } from '@chatui/core';
import '@chatui/core/dist/index.css';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useEffect } from 'react'
import io, { Socket } from 'socket.io-client'
import { SOCKET_IO_URL } from './config'
let socket: Socket<DefaultEventsMap, DefaultEventsMap>

const GenKodeChat = () => {
  const { messages, appendMsg, setTyping } = useMessages([]);
  useEffect(() => {
    socketInitializer();
    return () => {
      socket.disconnect();
    }
  }, []);

  async function socketInitializer() {
    socket = io(SOCKET_IO_URL)
    socket.on('connect', () => {
      console.log("connected to socket IO");
      appendSystemMessage("What would you like to build?");
    })
  }

  const appendSystemMessage = (content: string) => {
    appendMsg({
      type: 'text',
      content: { text: content },
      position: 'left'
    });
  }

  const handleSend = (type: string, content: string) => {
    socket.emit('user_message', content);
    appendMsg({
      type: 'text',
      content: { text: content },
      position: 'right'
    });

    setTyping(true);
  }

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
      onSend={handleSend}
    />
  )
}

export default GenKodeChat;