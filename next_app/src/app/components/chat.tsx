"use client";
import { Accordion } from "flowbite-react";

interface ChatProps {
  recommendations: string[];
}

const GenKodeChat = ({ recommendations }: ChatProps) => {
  return (
    <>
      <div className="w-full">
        <div className="mb-3 w-full font-bold text-lg text-center dark:text-gray-200">Iterative Recommendations for you</div>

        <Accordion className="w-full max-h-[300px] pb-2">
          <Accordion.Panel>
            {recommendations.map((p, idx) => (
              <div key={idx}>
                <Accordion.Title className="dark:text-gray-200">Recommendation #{idx + 1}</Accordion.Title>
                <Accordion.Content>
                  <p className="mb-2 text-black dark:text-gray-400 max-h-[100px] sm:max-h-[200px] xl:max-h-[100px] overflow-y-auto">{p}</p>
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
