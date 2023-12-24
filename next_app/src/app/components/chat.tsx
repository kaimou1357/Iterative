"use client";
import { Accordion } from "flowbite-react";

interface ChatProps {
  messages: string[];
}

const GenKodeChat = ({ messages }: ChatProps) => {
  return (
    <>
      <div>
        <div className="mb-3">Iterative Recommendations for you</div>

        <Accordion>
          <Accordion.Panel>
            {messages.map((p, idx) => (
              <div key={idx}>
                <Accordion.Title>Recommendation #{idx + 1}</Accordion.Title>
                <Accordion.Content>
                  <p className="mb-2 text-gray-500 dark:text-gray-400">{p}</p>
                </Accordion.Content>
              </div>
            ))}
          </Accordion.Panel>
        </Accordion>
      </div>
    </>
  );
};

export default GenKodeChat;
