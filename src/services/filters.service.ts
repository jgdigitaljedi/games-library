import { PlatformType } from '@/components/PlatformsSort/PlatformsSort';
import { PlatformsPageItem } from '@/models/platforms.model';

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

export { consoleHandheldFilter };
