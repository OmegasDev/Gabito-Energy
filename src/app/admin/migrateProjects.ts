import { supabase } from "../../lib/supabase";

import img1 from "@/imports/IMG-20260616-WA0002_1_.jpg";
import img2 from "@/imports/IMG-20260616-WA0004.jpg";
import img3 from "@/imports/IMG-20260616-WA0008.jpg";
import img4 from "@/imports/IMG-20260616-WA0010.jpg";
import img5 from "@/imports/IMG-20260616-WA0011.jpg";
import img6 from "@/imports/IMG-20260616-WA0012.jpg";

const projects = [
  {
    id: "proj-001",
    title: "AllsparkPower + Firman Hybrid System",
    category: "residential",
    location: "Nnewi, Anambra",
    challenge: "Family home experiencing 18+ hours of daily blackouts.",
    solution: "2× AllsparkPower lithium batteries + Firman 5kVA hybrid inverter.",
    outcome: "Full home power for 12+ hours per charge cycle.",
    image: img1,
    featured: true,
    showOnHomepage: true,
    completionDate: "2026-04-15",
  },
  {
    id: "proj-002",
    title: "Cworth Energy Commercial Array",
    category: "commercial",
    location: "Awka, Anambra",
    challenge: "Business losing revenue from constant power interruptions.",
    solution: "Multiple Cworth Energy inverters with large battery bank.",
    outcome: "Uninterrupted operations from 8am to 10pm daily.",
    image: img2,
    featured: true,
    showOnHomepage: true,
    completionDate: "2026-03-20",
  },
  {
    id: "proj-003",
    title: "Twin Felicity Solar Inverter Setup",
    category: "commercial",
    location: "Onitsha, Anambra",
    challenge: "High energy demand commercial facility needing expanded capacity.",
    solution: "2× Felicity Solar inverters + 2× Cworth Energy battery units.",
    outcome: "Heavy commercial loads powered reliably around the clock.",
    image: img3,
    featured: true,
    showOnHomepage: true,
    completionDate: "2026-02-10",
  },
  {
    id: "proj-004",
    title: "Felicity + LiFePO4 Wall Battery",
    category: "residential",
    location: "Nnewi, Anambra",
    challenge: "Homeowner needed a clean, compact wall-mounted solution.",
    solution: "Felicity Solar inverter + wall-mounted lithium iron phosphate battery.",
    outcome: "Compact installation in utility room, zero noise.",
    image: img4,
    featured: true,
    showOnHomepage: true,
    completionDate: "2026-05-01",
  },
  {
    id: "proj-005",
    title: "Firman Hybrid Wall System",
    category: "residential",
    location: "Nkpor, Anambra",
    challenge: "Small property needing efficient backup power on limited wall space.",
    solution: "Firman hybrid inverter + Firman 05 wall-mounted battery storage.",
    outcome: "Reliable 8-hour backup on a compact professionally mounted installation.",
    image: img5,
    featured: false,
    showOnHomepage: false,
    completionDate: "2026-01-22",
  },
  {
    id: "proj-006",
    title: "LvtopSun LiFePO4 Power Wall",
    category: "residential",
    location: "Nnewi, Anambra",
    challenge: "Customer wanted premium lithium technology with full solar integration.",
    solution: "Felicity Solar inverter + LytopSun 51.2V 300Ah LiFePO4 power wall.",
    outcome: "Over 15kWh of clean storage — enough for 24-hour energy independence.",
    image: img6,
    featured: false,
    showOnHomepage: false,
    completionDate: "2026-06-16",
  },
];

export async function migrateProjects() {
  console.log("Starting Gabito project migration...");

  for (const project of projects) {
    console.log(`Uploading ${project.id}...`);

    const response = await fetch(project.image);
    const blob = await response.blob();

    const extension = blob.type.split("/")[1] || "jpg";
    const storagePath = `projects/${project.id}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(storagePath, blob, {
        contentType: blob.type || "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error(`Image upload failed for ${project.id}:`, uploadError);
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from("project-images")
      .getPublicUrl(storagePath);

    const imageUrl = publicUrlData.publicUrl;

    const { error: projectError } = await supabase
      .from("projects")
      .upsert({
        id: project.id,
        title: project.title,
        category: project.category,
        location: project.location,
        challenge: project.challenge,
        solution: project.solution,
        outcome: project.outcome,
        thumbnail: imageUrl,
        images: [imageUrl],
        featured: project.featured,
        show_on_homepage: project.showOnHomepage,
        published: true,
        completion_date: project.completionDate,
        status: "published",
      });

    if (projectError) {
      console.error(`Database insert failed for ${project.id}:`, projectError);
      throw projectError;
    }

    console.log(`✓ ${project.id} migrated successfully`);
  }

  console.log("🎉 All 6 Gabito projects migrated successfully!");
}