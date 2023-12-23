"use client"
import React from 'react'
import GenKodeChat from '../components/chat'
import io, { Socket } from 'socket.io-client'
import { SOCKET_IO_URL } from '../../app/components/config'
import LiveCodeEditor from '../components/LiveCodeEditor'
import { useEffect } from 'react'
import { DefaultEventsMap } from '@socket.io/component-emitter';
import PromptBox from '../components/userprompts'
import PromptInput from '../components/promptinput'
import { useToolStore } from './toolstate'
let socket: Socket<DefaultEventsMap, DefaultEventsMap>

export default function Tool() {
  const { loading, setLoading, prompts, addPrompt, projectId, setProjectId, reactCode, setReactCode, messages, addMessage} = useToolStore();

  useEffect(() => {
    socketInitializer();
    return () => {
      socket.disconnect();
    }
  });

  async function socketInitializer() {
    socket = io(SOCKET_IO_URL)

    socket.on('server_response', (response) => {
      addMessage(response);
    })

    socket.on("server_code", (response) => {
      setLoading(false);
      setReactCode(response);
    })

    socket.on("project_id", (projectId) => {
      setProjectId(projectId);
    })
  }


  const handleSend = (prompt: string) => {
    setLoading(true);
    addPrompt(prompt);
    socket.emit("user_message", {description: prompt, project_id: projectId});
  }

  return (
    <div className="flex">
       <div className="w-1/4 mr-10 flex-col items-center">
        <PromptBox prompts={prompts}/>
      </div>
      <div className="flex w-1/2 mr-10 flex-col">
        <div>Iterative Canvas</div>
        <div className="border-solid border-4 rounded-md">
          <LiveCodeEditor code={reactCode} css={undefined} cssFramework={"DAISYUI"}/>
        </div>
        <PromptInput loading={loading} onPromptSubmit={handleSend} />
      </div>
      <div className="w-1/4">
        <GenKodeChat messages={messages}/>
      </div>
    </div>  )
}
