"use client";
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useEffect } from 'react'
import io, { Socket } from 'socket.io-client'
import { SOCKET_IO_URL } from './config'
let socket: Socket<DefaultEventsMap, DefaultEventsMap>

const Chat = () => {
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
    })
  }

  return null
}

export default Chat;