"use client";
import { redirect } from "next/navigation";
import { useProjectStore } from "../toolstate";

export default function ProjectView({ params }: { params: { id: string } }) {
  const projectId = params.id;
  const { setProjectId } = useProjectStore();

  setProjectId(projectId);

  redirect("/tool");
}
