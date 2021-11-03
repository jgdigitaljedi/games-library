import { IPriceChartingData } from './pricecharting.model';

export interface ICollAssociatedCon {
  id: number | string;
  name: string;
}

export interface ICollectible {
  associatedConsoles: ICollAssociatedCon[];
  associatedGame: string;
  character: string;
  company: string;
  createdAt: string;
  howAcquired: string;
  image: string;
  name: string;
  notes: string;
  newPurchaseDate?: Date;
  officialLicensed: string | boolean;
  pricePaid: string | number;
  purchaseDate: string;
  quantity: string | number;
  type: string;
  updatedAt: string;
  _id: string;
  priceCharting?: IPriceChartingData;
}
