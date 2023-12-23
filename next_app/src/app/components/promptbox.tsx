"use client";
import Chat, { Bubble, MessageProps } from '@chatui/core';
import '@chatui/core/dist/index.css';

interface PromptBoxProps{
  prompts: Prompt[];
}

export interface Prompt {
  content: string,
}

const PromptBox = ({prompts}: PromptBoxProps) => {
  return (
    <>
    <ul>
      {prompts.map(p => (<li key={p.content}>{p.content}</li>))}
    </ul>
    </>
  );
}

export default PromptBox;