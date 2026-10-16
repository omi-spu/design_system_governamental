import { createFileRoute } from "@tanstack/react-router";
import { Observatory } from "@/components/observatory";
export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa de imóveis | Observatório Imobiliário da União" },
      {
        name: "description",
        content: "Consulte a distribuição geográfica dos anúncios imobiliários.",
      },
      { property: "og:title", content: "Mapa de imóveis | Observatório Imobiliário da União" },
      {
        property: "og:description",
        content: "Consulte a distribuição geográfica dos anúncios imobiliários.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Observatory view="mapa" />,
});
