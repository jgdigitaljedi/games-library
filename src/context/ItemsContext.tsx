import { createContext } from 'react';

export interface IPlatformsWithId {
  name: string;
  id: number;
}

export interface IItems {
  platformsWithId?: IPlatformsWithId[];
  gameReleaseYears?: string[];
}

const ItemsContext = createContext({
  platformsWithId: [] as IPlatformsWithId[],
  gameReleaseYears: [] as string[]
});

export default ItemsContext;
