export type Category =
  | "All"
  | "Text"
  | "Graphics"
  | "Overlays"
  | "Logos"
  | "Social Media"
  | "Charts"
  | "UI Elements"
  | "Particles"
  | "3D & Motion";

export interface Template {
  id: string;
  title: string;
  category: Exclude<Category, "All">;
  duration: string;
  tags: string[];
  gradient: string;
  shape: string;
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
  "Particles",
  "3D & Motion",
];

export const TEMPLATES: Template[] = [
  // ── TEXT ─────────────────────────────────────────────────────────────────
  { id: "t1",  title: "Kinetic Typography",     category: "Text",         duration: "0:05", tags: ["bold", "modern"],     gradient: "from-purple-500 to-pink-500",    shape: "kinetic",        featured: true },
  { id: "t2",  title: "Typewriter Effect",       category: "Text",         duration: "0:08", tags: ["type", "terminal"],   gradient: "from-emerald-500 to-cyan-500",   shape: "typewriter"     },
  { id: "t3",  title: "Wiggle Letters",          category: "Text",         duration: "0:04", tags: ["fun", "bounce"],      gradient: "from-orange-500 to-yellow-400",  shape: "wiggle"         },
  { id: "t4",  title: "Scatter Reveal",          category: "Text",         duration: "0:06", tags: ["scatter", "reveal"],  gradient: "from-sky-500 to-indigo-500",     shape: "scatter"        },
  { id: "t5",  title: "Energy Text",             category: "Text",         duration: "0:05", tags: ["energy", "vibrate"],  gradient: "from-red-500 to-orange-500",     shape: "energy"         },
  { id: "t6",  title: "Spill Word",              category: "Text",         duration: "0:06", tags: ["spill", "drop"],      gradient: "from-violet-500 to-fuchsia-500", shape: "spill"          },
  { id: "t7",  title: "Sentence Reveal",         category: "Text",         duration: "0:08", tags: ["reveal", "slide"],    gradient: "from-teal-500 to-green-500",     shape: "reveal",        featured: true },
  { id: "t8",  title: "Funnel Text",             category: "Text",         duration: "0:05", tags: ["funnel", "compress"], gradient: "from-rose-500 to-pink-500",      shape: "funnel"         },
  { id: "t9",  title: "Glitch Title",            category: "Text",         duration: "0:05", tags: ["glitch", "retro"],    gradient: "from-red-600 to-cyan-500",       shape: "glitch",        featured: true },
  { id: "t10", title: "Neon Wave",               category: "Text",         duration: "0:06", tags: ["neon", "wave"],       gradient: "from-cyan-500 to-blue-500",      shape: "wave"           },

  // ── GRAPHICS ─────────────────────────────────────────────────────────────
  { id: "g1",  title: "Blob Morph",              category: "Graphics",     duration: "0:08", tags: ["blob", "organic"],    gradient: "from-purple-600 to-pink-500",    shape: "blob",          featured: true },
  { id: "g2",  title: "Morph Blocks",            category: "Graphics",     duration: "0:06", tags: ["morph", "geo"],       gradient: "from-fuchsia-500 to-purple-500", shape: "morph_blocks"   },
  { id: "g3",  title: "Geometric Spin",          category: "Graphics",     duration: "0:05", tags: ["geo", "spin"],        gradient: "from-blue-500 to-violet-500",    shape: "triangle"       },
  { id: "g4",  title: "Square Burst",            category: "Graphics",     duration: "0:04", tags: ["burst", "square"],    gradient: "from-amber-500 to-orange-500",   shape: "square"         },
  { id: "g5",  title: "Glow Pulse",              category: "Graphics",     duration: "0:06", tags: ["glow", "pulse"],      gradient: "from-yellow-400 to-orange-500",  shape: "glow_pulse",    featured: true },
  { id: "g6",  title: "Stagger Grid",            category: "Graphics",     duration: "0:05", tags: ["grid", "stagger"],    gradient: "from-indigo-500 to-blue-500",    shape: "stagger_grid"   },
  { id: "g7",  title: "Pixel Wave",              category: "Graphics",     duration: "0:06", tags: ["pixel", "wave"],      gradient: "from-green-500 to-teal-500",     shape: "pixel_grid"     },
  { id: "g8",  title: "Abstract Waves",          category: "Graphics",     duration: "0:08", tags: ["abstract", "loop"],   gradient: "from-blue-600 to-cyan-500",      shape: "wave"           },

  // ── OVERLAYS ─────────────────────────────────────────────────────────────
  { id: "o1",  title: "Lower Third Pro",         category: "Overlays",     duration: "0:04", tags: ["broadcast", "lines"], gradient: "from-blue-500 to-violet-500",    shape: "lines"          },
  { id: "o2",  title: "Line Reveal",             category: "Overlays",     duration: "0:06", tags: ["draw", "line"],       gradient: "from-emerald-500 to-cyan-500",   shape: "line_draw"      },
  { id: "o3",  title: "Countdown Ring",          category: "Overlays",     duration: "0:10", tags: ["timer", "ring"],      gradient: "from-red-500 to-orange-500",     shape: "progress_ring"  },
  { id: "o4",  title: "Pulse Rings",             category: "Overlays",     duration: "0:05", tags: ["pulse", "rings"],     gradient: "from-purple-500 to-pink-500",    shape: "circle"         },

  // ── LOGOS ─────────────────────────────────────────────────────────────────
  { id: "l1",  title: "Liquid Logo",             category: "Logos",        duration: "0:08", tags: ["liquid", "fluid"],    gradient: "from-violet-500 to-purple-500",  shape: "logo_liquid",   featured: true },
  { id: "l2",  title: "Particle Burst Logo",     category: "Logos",        duration: "0:06", tags: ["particles", "burst"], gradient: "from-pink-500 to-rose-500",      shape: "dots"           },
  { id: "l3",  title: "Glitch Logo",             category: "Logos",        duration: "0:05", tags: ["glitch", "logo"],     gradient: "from-cyan-500 to-red-500",       shape: "glitch"         },
  { id: "l4",  title: "Blob Logo",               category: "Logos",        duration: "0:10", tags: ["blob", "organic"],    gradient: "from-emerald-500 to-teal-500",   shape: "blob"           },

  // ── SOCIAL MEDIA ─────────────────────────────────────────────────────────
  { id: "s1",  title: "Instagram Story Kit",     category: "Social Media", duration: "0:15", tags: ["IG", "stories"],      gradient: "from-pink-500 to-orange-500",    shape: "wiggle",        featured: true },
  { id: "s2",  title: "TikTok Caption Pop",      category: "Social Media", duration: "0:04", tags: ["TikTok", "caption"],  gradient: "from-sky-400 to-indigo-500",     shape: "kinetic"        },
  { id: "s3",  title: "YouTube End Screen",      category: "Social Media", duration: "0:20", tags: ["YT", "CTA"],          gradient: "from-red-600 to-rose-500",       shape: "reveal"         },
  { id: "s4",  title: "Confetti Burst",          category: "Social Media", duration: "0:06", tags: ["celebrate", "party"], gradient: "from-yellow-400 to-pink-500",    shape: "confetti"       },
  { id: "s5",  title: "Energy Opener",           category: "Social Media", duration: "0:05", tags: ["opener", "bold"],     gradient: "from-violet-500 to-fuchsia-500", shape: "energy"         },

  // ── CHARTS ───────────────────────────────────────────────────────────────
  { id: "c1",  title: "Animated Bar Chart",      category: "Charts",       duration: "0:08", tags: ["data", "bar"],        gradient: "from-green-500 to-emerald-500",  shape: "bar_chart",     featured: true },
  { id: "c2",  title: "Donut Chart",             category: "Charts",       duration: "0:06", tags: ["data", "pie"],        gradient: "from-teal-500 to-cyan-500",      shape: "pie_chart"      },
  { id: "c3",  title: "Progress Ring",           category: "Charts",       duration: "0:05", tags: ["progress", "ring"],   gradient: "from-indigo-500 to-violet-500",  shape: "progress_ring"  },
  { id: "c4",  title: "Growth Trend",            category: "Charts",       duration: "0:07", tags: ["trend", "growth"],    gradient: "from-emerald-500 to-blue-500",   shape: "trend_line"     },
  { id: "c5",  title: "Audio Visualizer",        category: "Charts",       duration: "0:06", tags: ["audio", "bars"],      gradient: "from-purple-500 to-pink-500",    shape: "audio_wave"     },

  // ── UI ELEMENTS ───────────────────────────────────────────────────────────
  { id: "u1",  title: "Notification Pop",        category: "UI Elements",  duration: "0:04", tags: ["notif", "card"],      gradient: "from-violet-500 to-purple-500",  shape: "notification",  featured: true },
  { id: "u2",  title: "iMessage Bubbles",        category: "UI Elements",  duration: "0:06", tags: ["chat", "bubbles"],    gradient: "from-blue-500 to-sky-400",       shape: "message_bubble" },
  { id: "u3",  title: "Spring Bounce",           category: "UI Elements",  duration: "0:04", tags: ["spring", "physics"],  gradient: "from-orange-500 to-yellow-400",  shape: "spring_bounce"  },
  { id: "u4",  title: "Stagger Dots",            category: "UI Elements",  duration: "0:03", tags: ["stagger", "dots"],    gradient: "from-pink-500 to-fuchsia-500",   shape: "stagger_grid"   },

  // ── PARTICLES ─────────────────────────────────────────────────────────────
  { id: "p1",  title: "Money Rain",              category: "Particles",    duration: "0:08", tags: ["money", "rain"],      gradient: "from-yellow-400 to-green-500",   shape: "particles_rain", featured: true },
  { id: "p2",  title: "Confetti Party",          category: "Particles",    duration: "0:06", tags: ["confetti", "party"],  gradient: "from-pink-500 to-orange-400",    shape: "confetti"       },
  { id: "p3",  title: "Particle Burst",          category: "Particles",    duration: "0:05", tags: ["burst", "explode"],   gradient: "from-purple-600 to-blue-600",    shape: "dots"           },
  { id: "p4",  title: "Stagger Wave",            category: "Particles",    duration: "0:05", tags: ["wave", "grid"],       gradient: "from-cyan-500 to-teal-500",      shape: "pixel_grid"     },

  // ── 3D & MOTION ───────────────────────────────────────────────────────────
  { id: "d1",  title: "Rotating Cube",           category: "3D & Motion",  duration: "0:06", tags: ["3D", "cube"],         gradient: "from-blue-500 to-violet-500",    shape: "rotating_cube", featured: true },
  { id: "d2",  title: "Vinyl Spin",              category: "3D & Motion",  duration: "0:08", tags: ["vinyl", "record"],    gradient: "from-gray-600 to-zinc-500",      shape: "vinyl"          },
  { id: "d3",  title: "Blob Morph 3D",           category: "3D & Motion",  duration: "0:10", tags: ["blob", "depth"],      gradient: "from-purple-600 to-pink-500",    shape: "blob"           },
  { id: "d4",  title: "Glow Rays",               category: "3D & Motion",  duration: "0:06", tags: ["glow", "rays"],       gradient: "from-yellow-500 to-orange-500",  shape: "glow_pulse"     },
  { id: "d5",  title: "Line Draw Art",           category: "3D & Motion",  duration: "0:07", tags: ["draw", "art"],        gradient: "from-teal-500 to-green-500",     shape: "line_draw"      },
];
