export interface PricechartingGameSearchResponse {
  'console-name': string;
  id: string;
  'loose-price'?: number;
  'cib-price'?: number;
  'new-price'?: number;
  'product-name': string;
  status?: string;
  'release-date'?: string;
  productConsoleCombined: string;
}

export type IPCCaseType = 'cib' | 'sealed' | 'loose';

export interface IPriceChartingData {
  consoleName?: string;
  id: string;
  price: number;
  name: string;
  case: IPCCaseType;
  lastUpdated: string;
}

type IItemTypeField = 'GAME' | 'CONSOLE' | 'ACC';

export interface IItemCommonFormat {
  name: string;
  cib: boolean;
  consoleName: string;
  consoleId: number;
  box: boolean;
  manual: boolean;
  notes: string;
  type: IItemTypeField;
}
