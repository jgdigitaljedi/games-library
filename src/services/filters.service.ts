import { PlatFilters, PlatformType } from '@/components/PlatformsSort/PlatformsSort';
import { IConsole, PlatformsPageItem } from '@/models/platforms.model';

const handheldsArr = [
  '37', // Nintendo 3DS
  '24', // GBA
  '38', // PSP
  '20', // Nintendo DS
  '33', // Game Boy
  '22', // Game Boy Color
  '35', // Game Gear
  '130', // Switch
  '379', // Game.com
  '46', // Vita
  '61' // Lynx
];

const consoleHandheldFilter = (platforms: PlatformsPageItem[], which: PlatformType) => {
  switch (which) {
    case PlatformType.All:
      return platforms;
    case PlatformType.Handhelds:
      return platforms.filter((p: PlatformsPageItem) => {
        if (p?.id) {
          return handheldsArr.indexOf(p.id.toString()) >= 0;
        }
        return false;
      });
    case PlatformType.Consoles:
      return platforms.filter((p: PlatformsPageItem) => {
        if (p.id?.toString() === '130') {
          return true;
        }
        return handheldsArr.indexOf(p?.id?.toString() || '9999') < 0;
      });
  }
};

const platformsViewSecondFilters = (which: PlatFilters, plats: IConsole[]) => {
  switch (which) {
    case 'company':
      return plats
        .reduce((acc: string[], plat: IConsole) => {
          if (plat?.company && acc.indexOf(plat.company) === -1) {
            acc.push(plat.company);
          }
          return acc;
        }, [])
        .sort();
    case 'generation':
      return plats
        .reduce((acc: number[], plat: IConsole) => {
          if (plat?.generation && acc.indexOf(plat.generation) === -1) {
            acc.push(plat.generation);
          }
          return acc;
        }, [])
        .sort();
  }
};

export { consoleHandheldFilter, platformsViewSecondFilters };
