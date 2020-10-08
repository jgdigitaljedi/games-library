export interface IAccessory {
  name: string;
  company: string;
  createdAt: string;
  forConsoleId: number;
  forConsoleName: string;
  forClone: boolean;
  forConsoledId: number | string;
  howAcquired: string;
  image: string;
  notes: string;
  officialLicensed: boolean;
  pricePaid: string;
  purchaseDate: string;
  quantity: string;
  type: string;
  updatedAt: string;
  newPurchaseDate?: Date;
  _id: string;
}
