"use client"
import React, { useState } from 'react'
import GenKodeChat from '../components/chat'
import io, { Socket } from 'socket.io-client'
import { SOCKET_IO_URL } from '../../app/components/config'
import LiveCodeEditor from '../components/LiveCodeEditor'
import { useEffect } from 'react'
import { useMessages } from '@chatui/core';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import PromptBox from '../components/promptbox'
import Prompt from '../components/promptbox'
let socket: Socket<DefaultEventsMap, DefaultEventsMap>

export default function Tool() {
  const { messages, appendMsg, setTyping} = useMessages([]);
  const [reactCode, setReactCode] = useState("");
  const [projectId, setProjectId] = useState("");
  const [ prompts, setPrompts ] = useState<string[]>([]);

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
      setReactCode(response);
      appendSystemMessage("There's your generated code. Let me think how we can make it better")
      setTyping(true);
    })

    socket.on("project_id", (projectId) => {
      setProjectId(projectId);
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

    setPrompts(oldPrompts => [...oldPrompts, content]);

    setTyping(true);
    socket.emit("user_message", {description: content, project_id: projectId});
  }

  return (
    <div className="flex">
       <div className="preview-container w-1/2 mr-10 flex-col items-center">
        <div className="border-solid border-4 rounded-md h-screen">
          <PromptBox prompts={prompts}/>
        </div>
      </div>
      <div className="preview-container w-1/2 mr-10 flex-col items-center">
        <div>Iterative Canvas</div>
        <div className="border-solid border-4 rounded-md h-screen">
          <LiveCodeEditor code={reactCode} css={undefined} cssFramework={"DAISYUI"}/>
        </div>
      </div>
      <div className="w-1/4 h-50">
        <GenKodeChat onMessageSend={handleSend} messages={messages}/>
      </div>
    </div>  )
}
