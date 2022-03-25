export interface DictionaryEntry {
  variavel: string;

  nome: string;
  nome_en: string;

  nome_viz_barras: string;
  nome_viz_mapa: string;
  nome_viz_serie: string;
  nome_viz_barras_en: string;
  nome_viz_mapa_en: string;
  nome_viz_serie_en: string;

  descricao: string;
  descricao_en: string;

  categorias: string;
  categorias_en: string;

  classe: string;
  classe_en: string;

  tipo: string;
  presenca: string;
  origem: string;
  organizacao: string;
  disponibilidade: number;

  perc_preench: number;
  n_invalidas: number;
  n_validas: number;
  n_total: number;
}
