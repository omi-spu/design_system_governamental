import { Link } from "@tanstack/react-router";
import govLogo from "@/assets/govbr-logo.svg";
import { useState, useMemo, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  ArrowUpRight,
  Building2,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Home,
  Info,
  Layers,
  LayoutDashboard,
  Map,
  Menu,
  Search,
  SlidersHorizontal,
  TrendingUp,
  UserRound,
  X,
  Check,
  CircleHelp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ObservatoryMap } from "@/components/observatory-map";
import { cities, currency, evolution, listings, type Listing } from "@/lib/observatory-data";

type View = "panorama" | "anuncios" | "mapa" | "indicadores" | "fontes";
const navigation = [
  { to: "/" as const, view: "panorama", label: "Panorama do mercado", icon: LayoutDashboard },
  { to: "/anuncios" as const, view: "anuncios", label: "Explorar anúncios", icon: Building2 },
  { to: "/mapa" as const, view: "mapa", label: "Mapa de imóveis", icon: Map },
  {
    to: "/indicadores" as const,
    view: "indicadores",
    label: "Indicadores e análises",
    icon: ChartNoAxesCombined,
  },
  { to: "/fontes" as const, view: "fontes", label: "Fontes de dados", icon: Database },
];
const titles: Record<View, [string, string]> = {
  panorama: [
    "Panorama do mercado",
    "Acompanhe os principais indicadores do mercado imobiliário brasileiro.",
  ],
  anuncios: ["Explorar anúncios", "Consulte os imóveis e compare as informações dos anúncios."],
  mapa: ["Mapa de imóveis", "Distribuição geográfica dos anúncios imobiliários."],
  indicadores: [
    "Indicadores e análises",
    "Evolução de preços e comportamento do mercado imobiliário.",
  ],
  fontes: ["Fontes de dados", "Origem e cobertura das informações do observatório."],
};
function PriceChart({ period }: { period: string }) {
  const data = period === "Últimos 3 meses" ? evolution.slice(-3) : evolution;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 15, left: 2, bottom: 4 }}>
        <CartesianGrid stroke="var(--chart-grid)" vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          dy={8}
        />
        <YAxis
          domain={[9000, 12000]}
          ticks={[9000, 10000, 11000, 12000]}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)} mil`}
        />
        <Tooltip
          formatter={(value) => [currency(Number(value)), "Preço por m²"]}
          contentStyle={{
            background: "var(--card)",
            borderColor: "var(--border)",
            borderRadius: 4,
            fontSize: 12,
          }}
        />
        <Area
          isAnimationActive={false}
          type="monotone"
          dataKey="value"
          stroke="var(--primary)"
          fill="var(--chart-fill)"
          strokeWidth={2.5}
          dot={{ fill: "var(--card)", stroke: "var(--primary)", strokeWidth: 2, r: 3.5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
export function Observatory({ view }: { view: View }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [city, setCity] = useState("São Paulo");
  const [type, setType] = useState("Todos os tipos");
  const [purpose, setPurpose] = useState("Venda");
  const [period, setPeriod] = useState("Últimos 6 meses");
  const [applied, setApplied] = useState({
    city: "São Paulo",
    type: "Todos os tipos",
    purpose: "Venda",
    min: "",
    max: "",
    rooms: "Todos",
  });
  const [advanced, setAdvanced] = useState(false);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [rooms, setRooms] = useState("Todos");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<Listing | null>(null);
  const [help, setHelp] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(false);
  const [exported, setExported] = useState(false);
  const rows = useMemo(
    () =>
      listings
        .filter(
          (row) =>
            (applied.city === "Todas as cidades" || row.city === applied.city) &&
            (applied.type === "Todos os tipos" || row.type === applied.type) &&
            (!applied.min || row.area >= Number(applied.min)) &&
            (!applied.max || row.area <= Number(applied.max)) &&
            (applied.rooms === "Todos" || row.rooms >= Number(applied.rooms)) &&
            (!query ||
              `${row.neighborhood} ${row.city} ${row.id}`
                .toLowerCase()
                .includes(query.toLowerCase())),
        )
        .sort((a, b) => (sort ? a.price / a.area - b.price / b.area : 0)),
    [applied, query, sort],
  );
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDetail(null);
        setHelp(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const isDefault =
    applied.city === "São Paulo" &&
    applied.type === "Todos os tipos" &&
    !applied.min &&
    !applied.max &&
    applied.rooms === "Todos" &&
    !query;
  const sampleMean = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + row.price / row.area, 0) / rows.length)
    : 0;
  const apply = () => {
    setApplied({ city, type, purpose, min, max, rooms });
    setPage(1);
  };
  const reset = () => {
    setCity("Todas as cidades");
    setType("Todos os tipos");
    setPurpose("Venda");
    setMin("");
    setMax("");
    setRooms("Todos");
    setQuery("");
    setApplied({
      city: "Todas as cidades",
      type: "Todos os tipos",
      purpose: "Venda",
      min: "",
      max: "",
      rooms: "Todos",
    });
    setPage(1);
  };
  const exportData = () => {
    const csv =
      "\uFEFFCidade;Bairro;Tipo;Área (m²);Valor (R$);Fonte\n" +
      rows
        .map(
          (row) =>
            `${row.city};${row.neighborhood};${row.type};${row.area};${row.price};${row.source}`,
        )
        .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "observatorio-anuncios-demonstrativos.csv";
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };
  const table = (
    <section className="table-section">
      <div className="table-heading">
        <div>
          <h3>{view === "anuncios" ? "Anúncios de imóveis" : "Anúncios recentes"}</h3>
          <p>Imóveis que compõem a amostra selecionada</p>
        </div>
        {view !== "anuncios" ? (
          <Button asChild variant="ghost" size="sm">
            <Link to="/anuncios">
              Ver todos <ChevronRight size={14} />
            </Link>
          </Button>
        ) : (
          <span className="demo-label">{rows.length} anúncios</span>
        )}
      </div>
      <div className="table-scroll">
        <table className="listing-table">
          <thead>
            <tr>
              <th>Localização</th>
              <th>Tipo de imóvel</th>
              <th>Área (m²)</th>
              <th>Valor anunciado</th>
              <th>
                <Button variant="ghost" size="sm" onClick={() => setSort(!sort)}>
                  Valor / m² <ChevronDown size={12} />
                </Button>
              </th>
              <th>Fonte</th>
              <th aria-label="Detalhes" />
            </tr>
          </thead>
          <tbody>
            {rows.slice((page - 1) * 5, page * 5).map((row) => (
              <tr key={row.id}>
                <td>
                  <div className="listing-location">{row.neighborhood}</div>
                  <div className="listing-id">
                    {row.city} · {row.id}
                  </div>
                </td>
                <td>
                  <span className="type-badge">{row.type}</span>
                </td>
                <td>{row.area}</td>
                <td>{currency(row.price)}</td>
                <td>{currency(row.price / row.area)}</td>
                <td>{row.source}</td>
                <td>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Ver detalhes de ${row.id}`}
                    title="Ver detalhes"
                    onClick={() => setDetail(row)}
                  >
                    <Eye size={17} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <div className="empty-state">Nenhum anúncio encontrado para os filtros selecionados.</div>
        )}
      </div>
      <div className="table-pagination">
        <span>
          {rows.length
            ? `${(page - 1) * 5 + 1}–${Math.min(page * 5, rows.length)} de ${rows.length} anúncios`
            : "0 anúncios"}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Página anterior"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft />
          </Button>
          <span>Página {page}</span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Próxima página"
            disabled={page * 5 >= rows.length}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </section>
  );
  return (
    <>
      <header className="gov-header">
        <div className="gov-top">
          <div className="flex items-center gap-6">
            <Link to="/" aria-label="Página inicial gov.br" className="gov-brand">
              <img src={govLogo} alt="gov.br" width="104" height="38" />
            </Link>
            <span className="institution">
              Ministério da Gestão e da Inovação em Serviços Públicos
            </span>
          </div>
          <div className="top-links">
            <a href="https://www.gov.br/acessoainformacao/pt-br" target="_blank" rel="noreferrer">
              Acesso à informação
            </a>
            <span className="separator" />
            <Button
              variant="ghost"
              size="icon"
              title="Informações de acessibilidade"
              aria-label="Informações de acessibilidade"
              onClick={() => setHelp(true)}
            >
              <CircleHelp size={17} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setHelp(true)}>
              <UserRound size={16} /> Área pública
            </Button>
          </div>
        </div>
        <div className="gov-heading">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Abrir menu de navegação"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={22} />
          </Button>
          <div>
            <h1>Observatório do Mercado Imobiliário</h1>
            <p>Secretaria do Patrimônio da União</p>
          </div>
          <label className="header-search">
            <input
              aria-label="Buscar imóveis"
              placeholder="Buscar no observatório"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
            <Search size={20} className="text-primary" />
          </label>
        </div>
      </header>
      <div className={`app-layout ${menuOpen ? "menu-open" : ""}`}>
        <aside className="sidebar">
          <div className="nav-label">Observatório</div>
          <nav aria-label="Navegação principal">
            {navigation.slice(0, 4).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`side-link ${view === item.view ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <item.icon />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="nav-divider" />
            <div className="nav-label">Informações</div>
            <Link to="/fontes" className={`side-link ${view === "fontes" ? "active" : ""}`}>
              <Database />
              <span>Fontes de dados</span>
            </Link>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setHelp(true)}>
              <CircleHelp />
              Sobre o observatório
            </Button>
          </nav>
          <div className="sidebar-bottom">
            <Layers size={23} className="text-primary mb-3" />
            <strong>Patrimônio da União</strong>
            <br />
            Informação para uma gestão
            <br />
            pública mais eficiente.
            <div className="mt-4">
              <span className="demo-label">Ambiente demonstrativo</span>
            </div>
          </div>
        </aside>
        <main className="main-content">
          <div className="breadcrumb">
            <Link to="/" aria-label="Início">
              <Home size={15} />
            </Link>
            <ChevronRight size={12} />
            <span>Observatório</span>
            <ChevronRight size={12} />
            <span>{titles[view][0]}</span>
          </div>
          <div className="page-title-row">
            <div>
              <h2>{titles[view][0]}</h2>
              <p>{titles[view][1]}</p>
            </div>
            <Button variant="outline" onClick={exportData} aria-label="Exportar dados">
              {exported ? <Check /> : <Download />}
              {exported ? "Dados exportados" : "Exportar dados"}
            </Button>
          </div>
          <div className="update-label">
            <span className="live-dot" />
            Atualizado em 15 out. 2026, às 09:00 <span className="mx-1">·</span>
            <span>Dados demonstrativos</span>
          </div>
          {view !== "fontes" && (
            <section className="filter-section" aria-label="Filtros do mercado">
              <div className="filter-title">
                <Filter size={16} />
                Filtrar informações
              </div>
              <div className="filter-grid">
                <label className="field">
                  Cidade
                  <select value={city} onChange={(e) => setCity(e.target.value)}>
                    <option>Todas as cidades</option>
                    {cities.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  Tipo de imóvel
                  <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option>Todos os tipos</option>
                    <option>Apartamento</option>
                    <option>Casa</option>
                    <option>Comercial</option>
                  </select>
                </label>
                <label className="field">
                  Finalidade
                  <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                    <option>Venda</option>
                    <option disabled>Locação — sem amostra</option>
                  </select>
                </label>
                <label className="field">
                  Período
                  <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                    <option>Últimos 6 meses</option>
                    <option>Últimos 3 meses</option>
                  </select>
                </label>
                <Button onClick={apply}>
                  <Search size={15} />
                  Aplicar filtros
                </Button>
              </div>
              {advanced && (
                <div className="advanced-fields">
                  <label className="field">
                    Área mínima (m²)
                    <input
                      type="number"
                      min="0"
                      placeholder="Ex.: 50"
                      value={min}
                      onChange={(e) => setMin(e.target.value)}
                    />
                  </label>
                  <label className="field">
                    Área máxima (m²)
                    <input
                      type="number"
                      min="0"
                      placeholder="Ex.: 200"
                      value={max}
                      onChange={(e) => setMax(e.target.value)}
                    />
                  </label>
                  <label className="field">
                    Quartos (mínimo)
                    <select value={rooms} onChange={(e) => setRooms(e.target.value)}>
                      <option>Todos</option>
                      <option value="1">1 quarto</option>
                      <option value="2">2 quartos</option>
                      <option value="3">3 quartos</option>
                    </select>
                  </label>
                </div>
              )}
              <div className="filter-footer">
                <div className="filter-chips">
                  <span className="filter-chip">{applied.city}</span>
                  <span className="filter-chip">{applied.purpose}</span>
                  {applied.type !== "Todos os tipos" && (
                    <span className="filter-chip">{applied.type}</span>
                  )}
                  <Button variant="ghost" size="sm" onClick={reset}>
                    Limpar filtros
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setAdvanced(!advanced)}>
                  <SlidersHorizontal size={14} />
                  {advanced ? "Menos filtros" : "Mais filtros"}
                  <ChevronDown size={12} />
                </Button>
              </div>
            </section>
          )}
          {(view === "panorama" || view === "indicadores") && (
            <>
              <div className="section-heading">
                <h3>Visão geral do mercado</h3>
                <p>Referência: outubro de 2026</p>
              </div>
              <div className="kpi-grid">
                {[
                  {
                    label: "Anúncios monitorados",
                    value: isDefault ? "24.856" : String(rows.length),
                    unit: "",
                    change: "8,2%",
                    sub: "em relação ao mês anterior",
                    icon: Building2,
                  },
                  {
                    label: "Valor médio por m²",
                    value: currency(isDefault ? 11350 : sampleMean),
                    unit: "/m²",
                    change: "2,3%",
                    sub: "em relação ao mês anterior",
                    icon: TrendingUp,
                  },
                  {
                    label: "Valor mediano",
                    value: currency(
                      isDefault
                        ? 780000
                        : ([...rows].sort((a, b) => a.price - b.price)[Math.floor(rows.length / 2)]
                            ?.price ?? 0),
                    ),
                    unit: "",
                    change: "1,8%",
                    sub: "em relação ao mês anterior",
                    icon: ChartNoAxesCombined,
                  },
                  {
                    label: "Área média dos imóveis",
                    value: isDefault
                      ? "92"
                      : String(
                          rows.length
                            ? Math.round(rows.reduce((sum, row) => sum + row.area, 0) / rows.length)
                            : 0,
                        ),
                    unit: "m²",
                    change: "",
                    sub: "Área privativa anunciada",
                    icon: Layers,
                  },
                ].map((kpi) => (
                  <article className="kpi" key={kpi.label}>
                    <div className="kpi-top">
                      <span>{kpi.label}</span>
                      <span className="kpi-icon">
                        <kpi.icon size={17} />
                      </span>
                    </div>
                    <div className="kpi-value">
                      {kpi.value} <small>{kpi.unit}</small>
                    </div>
                    <div className="kpi-bottom">
                      {kpi.change && isDefault && (
                        <span className="positive">
                          <ArrowUpRight size={12} />
                          {kpi.change}
                        </span>
                      )}
                      <span>
                        {kpi.change && !isDefault ? "Amostra demonstrativa filtrada" : kpi.sub}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
          {view === "panorama" && (
            <div className="analysis-grid">
              <section className="analysis-panel">
                <div className="panel-heading">
                  <h3>Evolução do valor por m²</h3>
                  <select
                    aria-label="Período do gráfico"
                    className="chart-select"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                  >
                    <option>Últimos 6 meses</option>
                    <option>Últimos 3 meses</option>
                  </select>
                </div>
                <p className="panel-subtitle">
                  Preço médio de venda · série ilustrativa de São Paulo
                </p>
                <div className="chart-wrapper">{mounted && <PriceChart period={period} />}</div>
                <div className="chart-footer">
                  <span className="legend-dot" />
                  Valor médio por m²<span className="ml-auto">Valores em reais (R$)</span>
                </div>
              </section>
              <section className="analysis-panel">
                <div className="panel-heading">
                  <h3>Distribuição dos anúncios</h3>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/mapa">
                      Ampliar <ExternalLink size={12} />
                    </Link>
                  </Button>
                </div>
                <p className="panel-subtitle">Localização dos imóveis na amostra</p>
                <ObservatoryMap rows={rows} />
                <div className="map-footer">
                  <span className="flex items-center gap-2">
                    <span className="legend-dot" />
                    Imóveis anunciados
                  </span>
                  <span>{rows.length} imóveis na amostra</span>
                </div>
              </section>
            </div>
          )}
          {(view === "panorama" || view === "anuncios") && table}
          {view === "mapa" && (
            <section className="table-section">
              <div className="table-heading">
                <div>
                  <h3>{applied.city}</h3>
                  <p>{rows.length} imóveis na amostra selecionada</p>
                </div>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="legend-dot" />
                  Anúncios de venda
                </span>
              </div>
              <ObservatoryMap rows={rows} large />
              <div className="map-footer">
                Fonte: anúncios demonstrativos · Base cartográfica OpenStreetMap
              </div>
            </section>
          )}
          {view === "indicadores" && (
            <div className="analysis-grid">
              <section className="analysis-panel">
                <div className="panel-heading">
                  <h3>Evolução do valor por m²</h3>
                  <TrendingUp size={18} className="text-primary" />
                </div>
                <p className="panel-subtitle">Série ilustrativa · São Paulo</p>
                <div className="chart-wrapper">{mounted && <PriceChart period={period} />}</div>
                <div className="chart-footer">
                  <span className="legend-dot" />
                  Preço médio de venda por m²
                </div>
              </section>
              <section className="analysis-panel">
                <div className="panel-heading">
                  <h3>Comparativo entre cidades</h3>
                  <ChartNoAxesCombined size={18} className="text-primary" />
                </div>
                <p className="panel-subtitle">Preço médio por m² · amostra de anúncios</p>
                <div className="chart-wrapper">
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={cities.map((c) => {
                          const sample = listings.filter((r) => r.city === c);
                          return {
                            city: c,
                            value: Math.round(
                              sample.reduce((s, r) => s + r.price / r.area, 0) / sample.length,
                            ),
                          };
                        })}
                        margin={{ left: 5, right: 25, bottom: 8 }}
                      >
                        <CartesianGrid stroke="var(--chart-grid)" horizontal={false} />
                        <XAxis
                          type="number"
                          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="city"
                          width={105}
                          tick={{ fontSize: 11, fill: "var(--foreground)" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip formatter={(v) => currency(Number(v))} />
                        <Bar
                          isAnimationActive={false}
                          dataKey="value"
                          fill="var(--chart-teal)"
                          barSize={24}
                          radius={[0, 3, 3, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="chart-footer">Dados demonstrativos · valores em reais (R$)</div>
              </section>
            </div>
          )}
          {view === "fontes" && (
            <>
              <div className="section-heading">
                <h3>Fontes de anúncios</h3>
                <span className="demo-label">Conexões ilustrativas</span>
              </div>
              <section className="table-section">
                <div className="table-scroll">
                  <table className="listing-table">
                    <thead>
                      <tr>
                        <th>Fonte</th>
                        <th>Categoria</th>
                        <th>Cidades na amostra</th>
                        <th>Anúncios de exemplo</th>
                        <th>Situação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {["Viva Real", "ZAP Imóveis", "Imovelweb"].map((source) => (
                        <tr key={source}>
                          <td>
                            <strong>{source}</strong>
                          </td>
                          <td>Portal imobiliário</td>
                          <td>
                            {
                              new Set(
                                listings.filter((r) => r.source === source).map((r) => r.city),
                              ).size
                            }{" "}
                            cidades
                          </td>
                          <td>{listings.filter((r) => r.source === source).length}</td>
                          <td>
                            <span className="type-badge">Dados demonstrativos</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
              <div className="section-heading">
                <h3>Cobertura geográfica</h3>
                <p>4 grandes cidades</p>
              </div>
              <div className="kpi-grid">
                {cities.map((c) => (
                  <article className="kpi" key={c}>
                    <div className="kpi-top">
                      <strong>{c}</strong>
                      <Map size={18} className="text-primary" />
                    </div>
                    <div className="kpi-value">{listings.filter((r) => r.city === c).length}</div>
                    <p className="text-xs text-muted-foreground mt-2">anúncios na amostra</p>
                  </article>
                ))}
              </div>
            </>
          )}
          <footer className="page-footer">
            <span>
              © 2026 Secretaria do Patrimônio da União · Ministério da Gestão e da Inovação
            </span>
            <span className="flex items-center gap-1">
              <Info size={12} />
              Dados demonstrativos, sem validade para avaliações oficiais.
            </span>
          </footer>
        </main>
      </div>
      {(detail || help) && (
        <div
          className="modal-overlay"
          onClick={() => {
            setDetail(null);
            setHelp(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={detail ? "Detalhes do anúncio" : "Sobre o observatório"}
            className="details-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h3>
                {detail ? `${detail.type} em ${detail.neighborhood}` : "Sobre o observatório"}
              </h3>
              <Button
                autoFocus
                variant="ghost"
                size="icon"
                aria-label="Fechar"
                onClick={() => {
                  setDetail(null);
                  setHelp(false);
                }}
              >
                <X />
              </Button>
            </div>
            {detail ? (
              <>
                <p className="text-muted-foreground text-xs mt-2">
                  {detail.city} · {detail.id}
                </p>
                <dl className="details-grid">
                  {[
                    ["Valor anunciado", currency(detail.price)],
                    ["Valor por m²", currency(detail.price / detail.area)],
                    ["Área privativa", `${detail.area} m²`],
                    ["Quartos", detail.rooms || "Não se aplica"],
                    ["Fonte do anúncio", detail.source],
                    ["Data de coleta", detail.date],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <span className="demo-label">Anúncio fictício para demonstração</span>
              </>
            ) : (
              <>
                <p className="mt-6 leading-relaxed">
                  O Observatório do Mercado Imobiliário reúne informações para apoiar estudos e
                  avaliações do patrimônio imobiliário da União.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Este ambiente apresenta dados fictícios. Não há coleta de anúncios ou conexão com
                  serviços externos.
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  Padrões visuais: Design System gov.br. Navegação por teclado e foco visível nos
                  controles.
                </p>
                <Button asChild variant="link" className="mt-3">
                  <a
                    href="https://www.gov.br/ds/fundamentos-visuais/visao-geral"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Design System gov.br <ExternalLink />
                  </a>
                </Button>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}

