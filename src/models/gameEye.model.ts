export type GeType = 'System' | 'VideoGame' | 'Peripheral' | 'Toys To Life';

export type GeStatus = 'Loose' | 'Loose+' | 'CIB' | 'CIB+' | 'Sealed' | null;

export interface IGameEye {
  platform: string | null;
  type: GeType;
  title: string;
  status: GeStatus;
  myValue: number | null;
}
