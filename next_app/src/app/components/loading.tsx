import { Spinner } from "flowbite-react";

export default function Loading() {
    return(
        <div className="flex items-center justify-center w-full h-[calc(100vh-16rem)] border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <Spinner aria-label="Loading content" size="lg"/>
        </div>
    )
}