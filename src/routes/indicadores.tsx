import { createFileRoute } from "@tanstack/react-router";
import { Observatory } from "@/components/observatory";
export const Route = createFileRoute("/indicadores")({
  head: () => ({
    meta: [
      { title: "Indicadores e análises | Observatório Imobiliário da União" },
      {
        name: "description",
        content: "Compare preços por metro quadrado e a evolução do mercado imobiliário.",
      },
      {
        property: "og:title",
        content: "Indicadores e análises | Observatório Imobiliário da União",
      },
      {
        property: "og:description",
        content: "Compare preços por metro quadrado e a evolução do mercado imobiliário.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Observatory view="indicadores" />,
});
