import { Spinner } from "flowbite-react";

export default function Loading() {
  return (
      <div className="absolute top-0 flex h-[calc(100vh)] backdrop-blur-[3px] w-full items-center justify-center rounded-lg border border-gray-200 bg-[rgba(0, 0, 0, 0.81)] dark:border-gray-700 dark:bg-gray-800">
        <Spinner aria-label="Loading content" size="lg" />
    </div>
  );
}
