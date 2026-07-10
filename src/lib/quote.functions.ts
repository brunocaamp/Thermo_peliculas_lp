import {
  PRECO_POR_M2,
  WHATSAPP_NUMERO,
  obterDescontoAtivo,
  type Desconto,
} from "./pricing.config";

/** Resumo de uma janela quando o cliente informa tamanhos individuais. */
export type JanelaResumo = { rotulo: string; area: number };

export type Orcamento = {
  janelas: number;
  /** Área média de uma janela, em m². */
  areaMediaM2: number;
  /** Rótulo do tamanho escolhido ("Média", "Tamanhos individuais"…). */
  tamanhoRotulo: string;
  /** true quando cada janela teve o tamanho definido separadamente. */
  individual: boolean;
  /** Detalhe por janela — preenchido apenas no modo individual. */
  detalhes: JanelaResumo[];
  areaTotalM2: number;
  precoM2: number;
  subtotal: number;
  desconto: Desconto | null;
  valorDesconto: number;
  total: number;
};

type CalcularParams = {
  janelas: number;
  areaTotalM2: number;
  tamanhoRotulo: string;
  individual?: boolean;
  detalhes?: JanelaResumo[];
};

export function calcularOrcamento({
  janelas,
  areaTotalM2,
  tamanhoRotulo,
  individual = false,
  detalhes = [],
}: CalcularParams): Orcamento {
  const areaMediaM2 = janelas > 0 ? areaTotalM2 / janelas : 0;
  const subtotal = areaTotalM2 * PRECO_POR_M2;
  const desconto = obterDescontoAtivo();
  const valorDesconto = desconto ? subtotal * (desconto.percentual / 100) : 0;

  return {
    janelas,
    areaMediaM2,
    tamanhoRotulo,
    individual,
    detalhes,
    areaTotalM2,
    precoM2: PRECO_POR_M2,
    subtotal,
    desconto,
    valorDesconto,
    total: subtotal - valorDesconto,
  };
}

export const formatBRL = (valor: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(valor);

export const formatM2 = (valor: number) =>
  `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(valor)} m²`;

type DadosLead = { name: string; whatsapp: string; city: string };

/** Monta o link wa.me com o resumo do orçamento (e dados do lead, se houver). */
export function linkWhatsAppOrcamento(orcamento: Orcamento, lead?: DadosLead) {
  const linhas = [
    "Olá! Acabei de simular um orçamento no site da Thermopelícula:",
    "",
  ];

  if (orcamento.individual && orcamento.detalhes.length) {
    linhas.push(`🪟 Janelas: ${orcamento.janelas} (tamanhos individuais)`);
    orcamento.detalhes.forEach((d, i) => {
      linhas.push(`   • Janela ${i + 1}: ${d.rotulo} (${formatM2(d.area)})`);
    });
    linhas.push(`📐 Área total: ${formatM2(orcamento.areaTotalM2)}`);
  } else {
    linhas.push(
      `🪟 Janelas: ${orcamento.janelas} (tamanho ${orcamento.tamanhoRotulo.toLowerCase()}, ~${formatM2(orcamento.areaMediaM2)} cada)`,
      `📐 Área total: ${formatM2(orcamento.areaTotalM2)}`,
    );
  }

  if (orcamento.desconto) {
    linhas.push(
      `💰 Estimativa: ${formatBRL(orcamento.total)} (${orcamento.desconto.rotulo} −${orcamento.desconto.percentual}% já aplicada)`,
    );
  } else {
    linhas.push(`💰 Estimativa: ${formatBRL(orcamento.total)}`);
  }

  if (lead) {
    linhas.push(
      "",
      `Meu nome é ${lead.name}, moro em ${lead.city}. Meu WhatsApp: ${lead.whatsapp}.`,
    );
  }

  linhas.push("", "Gostaria de confirmar esse valor com um especialista. 😊");

  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(linhas.join("\n"))}`;
}
