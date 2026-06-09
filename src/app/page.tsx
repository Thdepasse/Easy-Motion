import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { TemplateGallery } from "@/components/TemplateGallery";

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <TemplateGallery />
      </div>
    </div>
  );
}
