import ProductPageClient from "./ProductPageClient"

// Add generateStaticParams for static export
export async function generateStaticParams() {
  return [{ slug: "relogio-personalizado" }, { slug: "caderno-colorir" }, { slug: "bolos-personalizados" }]
}

export default function ProductPage() {
  return <ProductPageClient />
}
