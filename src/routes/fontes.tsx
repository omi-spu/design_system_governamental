import { createFileRoute } from "@tanstack/react-router";
import { Observatory } from "@/components/observatory";
export const Route = createFileRoute("/fontes")({
  head: () => ({
    meta: [
      { title: "Fontes de dados | Observatório Imobiliário da União" },
      {
        name: "description",
        content: "Consulte as fontes e a cobertura geográfica dos dados imobiliários.",
      },
      { property: "og:title", content: "Fontes de dados | Observatório Imobiliário da União" },
      {
        property: "og:description",
        content: "Consulte as fontes e a cobertura geográfica dos dados imobiliários.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Observatory view="fontes" />,
});
