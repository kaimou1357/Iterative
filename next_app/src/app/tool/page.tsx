"use client"
import React, { useState } from 'react'
import GenKodeChat from '../components/chat'
import io, { Socket } from 'socket.io-client'
import { SOCKET_IO_URL } from '../../app/components/config'
import LiveCodeEditor from '../components/LiveCodeEditor'
import { useEffect } from 'react'
import { useMessages } from '@chatui/core';
import { DefaultEventsMap } from '@socket.io/component-emitter';
let socket: Socket<DefaultEventsMap, DefaultEventsMap>

export default function Tool() {
  const { messages, appendMsg, setTyping} = useMessages([]);
  const [reactCode, setReactCode] = useState("");

  useEffect(() => {
    socketInitializer();
    return () => {
      socket.disconnect();
    }
  }, []);

  async function socketInitializer() {
    socket = io(SOCKET_IO_URL)

    socket.on('server_response', (response) => {
      appendSystemMessage(response);
    })

    socket.on("server_code", (response) => {
      console.log(response);
      setReactCode(response);
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
    appendMsg({
      type: 'text',
      content: { text: content },
      position: 'right'
    });

    setTyping(true);
    socket.emit("user_message", {description: content});
  }

  return (
    <div>
      <div className="preview-container" style={{ flex: 1, overflow: 'auto', border: '2px solid', borderRadius: '10px' }}>
      <LiveCodeEditor code={reactCode} css={undefined} cssFramework={"DAISYUI"} fullScreen={false}/>
      </div>
      <GenKodeChat onMessageSend={handleSend} messages={messages}/>
    </div>  )
}
