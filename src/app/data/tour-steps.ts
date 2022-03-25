// import { IStepOption } from 'ngx-ui-tour-md-menu';

export const tourSteps = [
  {
    anchorId: 'app-home',
    content: 'Nele você poderá visualizar dashboards importantes',
    title: 'Bem vindo ao aplicativo da COORTE10K',
    route: '',
  },
  {
    anchorId: 'dash-graph',
    content:
      'É possível visualizar a distribuição dos dados utilizando gráficos temporais das variáveis disponíveis',
    title: 'Crie gráficos temporais',
    route: 'app/dashboard',
  },
  {
    anchorId: 'graph-filter-var-cat',
    content:
      'Selecione uma categoria de variável e selecione uma dentre as variáveis disponíveis',
    title: 'Variáveis por categoria',
    route: 'app/dashboard',
  },
  {
    anchorId: 'dash-map',
    content:
      'É possível visualizar a distribuição dos dados em diferentes níveis geográficos',
    title: 'Crie gráficos geográficos',
    route: 'app/dashboard',
  },
  {
    anchorId: 'map-loc-filter-estado',
    content: 'Selecione um estado e veja os dados coletados sobre a variável',
    title: 'Filtre o mapa por estado',
    route: 'app/dashboard',
  },
  {
    anchorId: 'map-loc-filter-regiao',
    content: 'Selecione uma região e veja os dados coletados sobre a variável',
    title: 'Filtre o mapa por região',
    route: 'app/dashboard',
  },
  {
    anchorId: 'map-loc-filter-brasil',
    content: 'Ou selecione o Brasil todo novamente',
    title: 'Resete o filtro de localidade',
    route: 'app/dashboard',
  },
];
