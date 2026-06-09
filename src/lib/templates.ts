export type Category =
  | "All"
  | "Text"
  | "Graphics"
  | "Overlays"
  | "Logos"
  | "Social Media"
  | "Charts"
  | "UI Elements";

export interface Template {
  id: string;
  title: string;
  category: Exclude<Category, "All">;
  duration: string;
  tags: string[];
  gradient: string;
  shape: "circle" | "square" | "triangle" | "wave" | "dots" | "lines";
  featured?: boolean;
}

export const CATEGORIES: Category[] = [
  "All",
  "Text",
  "Graphics",
  "Overlays",
  "Logos",
  "Social Media",
  "Charts",
  "UI Elements",
];

export const TEMPLATES: Template[] = [
  { id: "t1",  title: "Kinetic Typography",       category: "Text",         duration: "0:05", tags: ["bold", "modern"],     gradient: "from-purple-500 to-pink-500",   shape: "wave",     featured: true },
  { id: "t2",  title: "Neon Glow Title",          category: "Text",         duration: "0:08", tags: ["neon", "glow"],       gradient: "from-cyan-500 to-blue-500",     shape: "lines"    },
  { id: "t3",  title: "Split Screen Text",        category: "Text",         duration: "0:06", tags: ["minimal", "clean"],   gradient: "from-orange-500 to-red-500",    shape: "square"   },
  { id: "t4",  title: "Liquid Motion Logo",       category: "Logos",        duration: "0:10", tags: ["fluid", "premium"],   gradient: "from-emerald-500 to-teal-500",  shape: "circle",   featured: true },
  { id: "t5",  title: "Particle Burst Logo",      category: "Logos",        duration: "0:08", tags: ["particles", "epic"],  gradient: "from-violet-500 to-purple-500", shape: "dots"     },
  { id: "t6",  title: "Glitch Logo Reveal",       category: "Logos",        duration: "0:06", tags: ["glitch", "retro"],    gradient: "from-red-500 to-yellow-500",    shape: "square"   },
  { id: "t7",  title: "Instagram Story Kit",      category: "Social Media", duration: "0:15", tags: ["IG", "stories"],      gradient: "from-pink-500 to-orange-500",   shape: "wave",     featured: true },
  { id: "t8",  title: "TikTok Lower Third",       category: "Social Media", duration: "0:05", tags: ["TikTok", "lower"],    gradient: "from-sky-500 to-indigo-500",    shape: "lines"    },
  { id: "t9",  title: "YouTube End Screen",       category: "Social Media", duration: "0:20", tags: ["YT", "CTA"],          gradient: "from-red-600 to-rose-500",      shape: "circle"   },
  { id: "t10", title: "Frosted Glass Overlay",    category: "Overlays",     duration: "0:05", tags: ["glass", "blur"],      gradient: "from-slate-400 to-zinc-500",    shape: "square"   },
  { id: "t11", title: "Lower Third Pro",          category: "Overlays",     duration: "0:04", tags: ["broadcast", "clean"], gradient: "from-blue-500 to-violet-500",   shape: "lines"    },
  { id: "t12", title: "Countdown Timer",          category: "Overlays",     duration: "0:10", tags: ["timer", "live"],      gradient: "from-amber-500 to-orange-500",  shape: "circle"   },
  { id: "t13", title: "Animated Bar Chart",       category: "Charts",       duration: "0:08", tags: ["data", "bar"],        gradient: "from-green-500 to-emerald-500", shape: "square",   featured: true },
  { id: "t14", title: "Pie Chart Reveal",         category: "Charts",       duration: "0:06", tags: ["data", "pie"],        gradient: "from-teal-500 to-cyan-500",     shape: "circle"   },
  { id: "t15", title: "Line Graph Motion",        category: "Charts",       duration: "0:08", tags: ["data", "line"],       gradient: "from-indigo-500 to-blue-500",   shape: "wave"     },
  { id: "t16", title: "Floating Particles",       category: "Graphics",     duration: "0:12", tags: ["ambient", "bg"],      gradient: "from-purple-600 to-blue-600",   shape: "dots",     featured: true },
  { id: "t17", title: "Geometric Transition",     category: "Graphics",     duration: "0:05", tags: ["geo", "transition"],  gradient: "from-fuchsia-500 to-pink-500",  shape: "triangle" },
  { id: "t18", title: "Abstract Waves",           category: "Graphics",     duration: "0:10", tags: ["abstract", "loop"],   gradient: "from-blue-600 to-cyan-500",     shape: "wave"     },
  { id: "t19", title: "Button Click Effect",      category: "UI Elements",  duration: "0:02", tags: ["micro", "UI"],        gradient: "from-violet-500 to-indigo-500", shape: "square"   },
  { id: "t20", title: "Loading Spinner Pack",     category: "UI Elements",  duration: "0:03", tags: ["loader", "loop"],     gradient: "from-cyan-500 to-teal-500",     shape: "circle"   },
  { id: "t21", title: "Card Hover Animation",     category: "UI Elements",  duration: "0:02", tags: ["hover", "card"],      gradient: "from-orange-500 to-amber-500",  shape: "square"   },
  { id: "t22", title: "Bouncing Word Reveal",     category: "Text",         duration: "0:06", tags: ["bounce", "fun"],      gradient: "from-lime-500 to-green-500",    shape: "wave"     },
  { id: "t23", title: "Typewriter Effect",        category: "Text",         duration: "0:08", tags: ["type", "classic"],    gradient: "from-gray-400 to-slate-500",    shape: "lines"    },
  { id: "t24", title: "3D Text Extrusion",        category: "Text",         duration: "0:08", tags: ["3D", "premium"],      gradient: "from-rose-500 to-pink-600",     shape: "square"   },
];
