import { createFileRoute } from "@tanstack/react-router";
import { Observatory } from "@/components/observatory";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Panorama do mercado | Observatório Imobiliário da União" },
      {
        name: "description",
        content:
          "Panorama de anúncios e indicadores do mercado imobiliário para estudos do patrimônio da União.",
      },
      { property: "og:title", content: "Panorama do mercado | Observatório Imobiliário da União" },
      {
        property: "og:description",
        content:
          "Indicadores, preços e distribuição dos anúncios imobiliários nas grandes cidades brasileiras.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Observatory view="panorama" />,
});
