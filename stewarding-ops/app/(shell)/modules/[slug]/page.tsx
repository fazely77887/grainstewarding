"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ModulePage } from "@/components/module-page";
import { moduleBySlug } from "@/lib/modules";

export default function ModuleRoute() {
  const { slug } = useParams<{ slug: string }>();
  const cfg = moduleBySlug(slug);

  if (!cfg) {
    return (
      <div className="card p-12 text-center">
        <p className="text-lg font-bold">Module not found</p>
        <Link href="/" className="mt-2 inline-block text-sm font-bold text-accent hover:underline">← Back to dashboard</Link>
      </div>
    );
  }
  return <ModulePage cfg={cfg} />;
}
