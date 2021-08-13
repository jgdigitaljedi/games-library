import { createContext } from 'react';

export interface IPlatformsWithId {
  name: string;
  id: number;
}

export interface IItems {
  platformsWithId: IPlatformsWithId[];
}

const ItemsContext = createContext({ platformsWithId: [] as IPlatformsWithId[] });

export default ItemsContext;
