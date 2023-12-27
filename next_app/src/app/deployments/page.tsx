"use client"

import axios from "axios";
import { Flowbite } from "flowbite-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../components/config";
import { Deployment } from "../types/deployments/types";
import Loading from "../components/loading";

export default function Deployments() {
    const [deployments, setDeployments] = useState<Deployment[]>();
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchDeployments()
    }, []);

    const fetchDeployments = () => {
        axios.get(`${API_BASE_URL}/deployments`)
            .then((response) => {
                setDeployments(response.data.deployments);
            })
            .catch((error) => {
                console.error('Error Fetching Deployments');
                setError('Error Fetching Deployments, please try again')
            });
    }

    if(!deployments) return <Loading />
    if(error) return (
        <div className="h-[calc(100vh-16rem)] bg-slate-200 dark:bg-slate-900 pt-10 rounded-lg">
                <h1 className="text-center">{error}</h1>
        </div>
    )
    else return (
        <Flowbite>
            <div className="h-[calc(100vh-16rem)] bg-slate-200 dark:bg-slate-900 pt-10 rounded-lg">
                <div className="container w-[90%] max-h-[90%] mx-auto flex flex-row gap-10 bg-white dark:bg-slate-950 dark:text-white ">
                    <div className="relative w-full overflow-auto ">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-separate rounded-lg">
                            <thead className="w-full text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Id
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Deploynent name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Passcode
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Access
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {deployments && deployments.length && deployments.map((deployment: Deployment) => {
                                    return <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {deployment.project_state_id}
                                        </th>
                                        <td className="px-6 py-4">
                                            {deployment.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {deployment.password}
                                        </td>
                                        <td className="px-6 py-4 text-blue-600 underline underline-offset-2">
                                            <a href="#">Open</a>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </Flowbite>
    )
}