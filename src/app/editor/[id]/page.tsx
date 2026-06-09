import { TEMPLATES } from "@/lib/templates";
import { notFound } from "next/navigation";
import { EditorClient } from "./EditorClient";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ id: t.id }));
}

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = TEMPLATES.find((t) => t.id === id);
  if (!template) notFound();
  return <EditorClient template={template} />;
}
