"use client";

import axios from "axios";
import { Flowbite, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../components/config";
import Loading from "../components/loading";
import Link from "next/link";

export type Project = {
  id: string;
  name: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>();
  const [error, setError] = useState<string | null>(null);
  axios.defaults.withCredentials = true;
  // Trigger projects fetching on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    axios
      .get(`${API_BASE_URL}/projects`)
      .then((response) => {
        setProjects(response.data.projects);
      })
      .catch((error) => {
        console.error("Error Fetching projects");
        setError("Error Fetching projects, please try again");
      });
  };

  // Show loading spinner while projects are being fetched
  if (!projects) return <Loading />;
  // Show error message if error is thrown by server
  if (error)
    return (
      <div className="h-[calc(100vh-16rem)] rounded-lg bg-slate-200 pt-10 dark:bg-slate-900">
        <p aria-label="Error message" className="text-center text-xl">
          {error}
        </p>
      </div>
    );
  // Show projects table if projects are fetched correctly
  else
    return (
      <Flowbite>
        <div className="h-[calc(100vh-16rem)] rounded-lg bg-slate-200 pt-10 dark:bg-slate-900">
          <div className="container mx-auto flex max-h-[90%] w-[90%] flex-row gap-10 bg-white dark:bg-slate-950 dark:text-white ">
            <div className="relative w-full overflow-auto ">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell scope="col" className="px-6 py-3">
                    Project Name
                  </Table.HeadCell>
                  <Table.HeadCell scope="col" className="px-6 py-3">
                    Open Project
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {projects &&
                    projects.length &&
                    projects.map((project: Project) => {
                      return (
                        <Table.Row
                          key={project.id}
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                          <Table.Cell className="px-6 py-4">
                            {project.name}
                          </Table.Cell>
                          <Table.Cell className="px-6 py-4 text-blue-600 underline underline-offset-2">
                            <Link href={`/tool/${project.id}`}>
                              Open in Tool
                            </Link>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </Flowbite>
    );
}
