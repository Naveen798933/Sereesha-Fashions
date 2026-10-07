import { redirect, notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { category: "sarees" },
    { category: "lehengas" },
    { category: "kurtis" },
    { category: "contemporary" },
    { category: "collections" },
  ];
}

export default async function CategoryRedirectPage({ params }: PageProps) {
  const { category } = await params;
  const normalized = category.toLowerCase();

  if (["sarees", "lehengas", "kurtis"].includes(normalized)) {
    redirect(`/women/${normalized}`);
  }

  if (normalized === "contemporary") {
    redirect("/contemporary");
  }

  if (normalized === "collections") {
    redirect("/collections");
  }

  notFound();
}
