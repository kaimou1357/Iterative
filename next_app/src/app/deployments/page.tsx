"use client"

import axios from "axios";
import { Flowbite, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../components/config";
import { Deployment } from "./types";
import Loading from "../components/loading";

export default function Deployments() {
    const [deployments, setDeployments] = useState<Deployment[]>();
    const [error, setError] = useState<string | null>(null)

    // Trigger deployments fetching on component mount
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
    
    // Show loading spinner while deployments are being fetched
    if(!deployments) return <Loading />
    // Show error message if error is thrown by server
    if(error) return (
        <div className="h-[calc(100vh-16rem)] bg-slate-200 dark:bg-slate-900 pt-10 rounded-lg">
            <p aria-label="Error message" className="text-center text-xl">{error}</p>
        </div>
    )
    // Show deployments table if deployments are fetched correctly
    else return (
        <Flowbite>
            <div className="h-[calc(100vh-16rem)] bg-slate-200 dark:bg-slate-900 pt-10 rounded-lg">
                <div className="container w-[90%] max-h-[90%] mx-auto flex flex-row gap-10 bg-white dark:bg-slate-950 dark:text-white ">
                    <div className="relative w-full overflow-auto ">
                        <Table hoverable>
                            <Table.Head>
                                {/* <tr> */}
                                    <Table.HeadCell scope="col" className="px-6 py-3">
                                        Id
                                    </Table.HeadCell>
                                    <Table.HeadCell scope="col" className="px-6 py-3">
                                        Deploynent name
                                    </Table.HeadCell>
                                    <Table.HeadCell scope="col" className="px-6 py-3">
                                        Passcode
                                    </Table.HeadCell>
                                    <Table.HeadCell scope="col" className="px-6 py-3">
                                        Access
                                    </Table.HeadCell>
                                {/* </tr> */}
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {deployments && deployments.length && deployments.map((deployment: Deployment) => {
                                    return <Table.Row key={deployment.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {deployment.project_state_id}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            {deployment.name}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            {deployment.password}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4 text-blue-600 underline underline-offset-2">
                                            <a href="#">Open</a>
                                        </Table.Cell>
                                    </Table.Row>
                                })}
                            </Table.Body>
                        </Table>
                    </div>

                </div>
            </div>
        </Flowbite>
    )
}