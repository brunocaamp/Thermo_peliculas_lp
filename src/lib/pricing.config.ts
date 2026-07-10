/* ============================================================
 * CONFIGURAÇÃO DA CALCULADORA DE ORÇAMENTO — Thermopelícula
 *
 * Este é o único arquivo que precisa ser editado para manter
 * a página /orcamento: preço do metro quadrado, tamanhos de
 * janela oferecidos e descontos promocionais.
 * ============================================================ */

/** Número do WhatsApp que recebe os orçamentos (só dígitos, com DDI). */
export const WHATSAPP_NUMERO = "5511994575663";

/** Preço do metro quadrado instalado, em reais. */
export const PRECO_POR_M2 = 179;

/** Tamanhos médios de janela apresentados na calculadora (medidas em metros). */
export const TAMANHOS_JANELA = [
  {
    id: "pequena",
    rotulo: "Pequena",
    exemplo: "Banheiro, cozinha",
    largura: 1.2,
    altura: 1.0,
  },
  {
    id: "media",
    rotulo: "Média",
    exemplo: "Quarto, escritório",
    largura: 1.5,
    altura: 1.4,
  },
  {
    id: "grande",
    rotulo: "Grande",
    exemplo: "Sala, porta de varanda",
    largura: 2.2,
    altura: 2.1,
  },
] as const;

export type TamanhoJanela = (typeof TAMANHOS_JANELA)[number];

export type Desconto = {
  /** Identificador interno, sem espaços. */
  id: string;
  /** Texto exibido para o cliente. Ex.: "Oferta de lançamento". */
  rotulo: string;
  /** Percentual de desconto, de 0 a 100. */
  percentual: number;
  /** true = o desconto aparece e é aplicado na calculadora. */
  ativo: boolean;
  /** Opcional: última data de validade no formato "AAAA-MM-DD".
   *  Depois dessa data o desconto expira sozinho, sem precisar editar nada. */
  validoAte?: string;
};

/* ------------------------------------------------------------
 * DESCONTOS
 *
 * Como usar:
 *  - Para ativar um desconto: mude `ativo` para true.
 *  - Para desativar: mude `ativo` para false.
 *  - `validoAte` é opcional; com ela o desconto sai do ar
 *    automaticamente no dia seguinte à data informada.
 *  - Se houver mais de um desconto ativo, vale o PRIMEIRO da lista.
 * ------------------------------------------------------------ */
export const DESCONTOS: Desconto[] = [
  {
    id: "oferta-lancamento",
    rotulo: "Oferta de lançamento",
    percentual: 10,
    ativo: true,
    validoAte: "2026-08-31",
  },
];

/** Retorna o desconto vigente (ativo e dentro da validade) ou null. */
export function obterDescontoAtivo(hoje: Date = new Date()): Desconto | null {
  for (const desconto of DESCONTOS) {
    if (!desconto.ativo) continue;
    if (desconto.validoAte) {
      const limite = new Date(`${desconto.validoAte}T23:59:59`);
      if (Number.isNaN(limite.getTime()) || hoje > limite) continue;
    }
    return desconto;
  }
  return null;
}
