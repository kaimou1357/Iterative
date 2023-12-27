import { Spinner } from "flowbite-react";

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-16rem)] w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
      <Spinner aria-label="Loading content" size="lg" />
    </div>
  );
}
