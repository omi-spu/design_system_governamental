import { createFileRoute } from "@tanstack/react-router";
import { Observatory } from "@/components/observatory";
export const Route = createFileRoute("/anuncios")({
  head: () => ({
    meta: [
      { title: "Explorar anúncios | Observatório Imobiliário da União" },
      {
        name: "description",
        content: "Consulte anúncios imobiliários por cidade, tipologia e área.",
      },
      { property: "og:title", content: "Explorar anúncios | Observatório Imobiliário da União" },
      {
        property: "og:description",
        content: "Consulte anúncios imobiliários por cidade, tipologia e área.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Observatory view="anuncios" />,
});
