import CategoryPageClient from "./CategoryPageClient"

// Add generateStaticParams for static export
export async function generateStaticParams() {
  return [{ slug: "relogios" }, { slug: "bolos" }, { slug: "cadernos" }]
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return <CategoryPageClient params={params} />
}
