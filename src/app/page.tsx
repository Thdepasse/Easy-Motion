import { Sidebar } from "@/components/Sidebar";
import { TemplateGallery } from "@/components/TemplateGallery";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <TemplateGallery />
    </div>
  );
}
