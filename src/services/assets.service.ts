import { IConsoleArr } from '@/models/platforms.model';
import Axios from 'axios';
import { uniqBy as _uniqBy } from 'lodash';

export interface LogoReturn {
  name: string;
  img: string;
}

export const platformLogos: { [key: string]: string } = {
  '3DO Interactive Multiplayer': 'logos/3do.gif',
  'Atari 2600': 'logos/Atari2600logo.svg',
  'Atari 7800': 'logos/atari7800.svg',
  'Atari 5200': 'logos/Atari_5200_Logo.svg',
  'Atari Jaguar': 'logos/Atari_Jaguar.svg',
  'Analogue Pocket': 'logos/analogue_logo_icon_145501.svg',
  Dreamcast: 'logos/Dreamcast_logo.svg',
  'Game Boy': 'logos/Gameboy-pocket-logo.svg',
  'Game Boy Advance': 'logos/Gameboy_advance_logo.svg',
  'Game Boy Color': 'logos/Game_Boy_Color_logo.svg',
  Intellivision: 'logos/Intellivision-shadow-logo.svg',
  'Microsoft Xbox 360': 'logos/Xbox_logo_2012_cropped.svg',
  'Microsoft Xbox One': 'logos/Xbox_one_logo.svg',
  'Nintendo 3DS': 'logos/Nintendo_3ds_logo.svg',
  'Nintendo 64': 'logos/Nintendo_64_Logo.svg',
  'Nintendo DS': 'logos/Nintendo_DS_Lite_logo.svg',
  'Nintendo DS Lite': 'logos/Nintendo_DS_Lite_logo.svg',
  'Nintendo Entertainment System (NES)': 'logos/NES_logo.svg',
  'Nintendo Game Boy Advance': 'logos/Gameboy_advance_logo.svg',
  'Nintendo Game Boy Color': 'logos/Game_Boy_Color_logo.svg',
  'Nintendo GameCube': 'logos/GC_Logo.svg',
  'Nintendo GameCube (Game Boy Player)': 'logos/Game_Boy_Player_logo.svg',
  'Nintendo Switch': 'logos/Nintendo_Switch_Logo.svg',
  'Nintendo Wii U': 'logos/WiiU.svg',
  'PC (Microsoft Windows)': 'logos/windows.png',
  PlayStation: 'logos/Playstation_logo_colour.svg',
  'PlayStation 2': 'logos/PlayStation_2_logo.svg',
  'PlayStation 3': 'logos/PlayStation_3_logo_(2009).svg',
  'PlayStation 4': 'logos/PlayStation_4_logo_and_wordmark.svg',
  'PlayStation Portable': 'logos/PSP_Logo.svg',
  'Sega 32X': 'logos/Sega_32X_logo.svg',
  'Sega CD': 'logos/Sega_CD_Logo.svg',
  'Sega Game Gear': 'logos/Game_Gear_logo_Sega.png',
  'Sega Master System': 'logos/Master_System_Logo.svg',
  'Sega Mega Drive/Genesis': 'logos/GenesisLogo.png',
  'Sega Saturn': 'logos/SEGA_Saturn_logo.png',
  'Sony PlayStation 2': 'logos/PlayStation_2_logo.svg',
  'Sony PlayStation 3': 'logos/PlayStation_3_logo_(2009).svg',
  'Super Game Boy': 'logos/SuperGameBoy.svg',
  'Super Nintendo Entertainment System (SNES)': 'logos/SNES_logo.svg',
  'TurboGrafx-16/PC Engine': 'logos/TurboGrafx16logo.jpg',
  'Virtual Boy': 'logos/Virtualboy_logo.svg',
  Wii: 'logos/Wii.svg',
  'Wii U': 'logos/WiiU.svg',
  Xbox: 'logos/Vectorial_Xbox_logo.svg',
  'Xbox 360': 'logos/Xbox_logo_2012_cropped.svg',
  'Xbox One': 'logos/Xbox_one_logo.svg'
};

export const getGalleryList = async () => {
  const url = `${window.urlPrefix}/api/vg/gallerylist`;
  const list = await Axios.get(url);
  return list;
};

export const parentalRatings = {
  E: 'ESRB_2013_Everyone.svg',
  M: 'ESRB_2013_Mature.svg',
  T: 'ESRB_2013_Teen.svg',
  RP: 'ESRB_2013_Rating_Pending.svg',
  'E10+': 'ESRB_2013_Everyone_10+.svg',
  KA: 'ESRB_KA.png'
};

export const canBePlayedOn = (consoleArr: IConsoleArr[] | undefined): LogoReturn[] => {
  // @ts-ignore
  const returnArr = consoleArr?.map((con: IConsoleArr) => ({
    name: con.consoleName,
    img: platformLogos[con.consoleName]
  })); // get for each console in consoleArr
  const additional = consoleArr?.reduce((acc: LogoReturn[], con: IConsoleArr) => {
    switch (con.consoleId) {
      case 59: // Atari 2600
        acc.push({ name: 'Atari 7800', img: platformLogos['Atari 7800'] });
        break;
      case 33: // Game Boy
        acc.push({ name: 'Game Boy Color', img: platformLogos['Game Boy Color'] });
        acc.push({ name: 'Game Boy Advance', img: platformLogos['Game Boy Advance'] });
        acc.push({ name: 'Super Game Boy', img: platformLogos['Super Game Boy'] });
        acc.push({
          name: 'Nintendo GameCube (Game Boy Player)',
          img: platformLogos['Nintendo GameCube (Game Boy Player)']
        });
        acc.push({ name: 'Analogue Pocket', img: platformLogos['Analogue Pocket'] });
        break;
      case 22: // Game Boy Color
        acc.push({ name: 'Game Boy Advance', img: platformLogos['Game Boy Advance'] });
        acc.push({ name: 'Super Game Boy', img: platformLogos['Super Game Boy'] });
        acc.push({
          name: 'Nintendo GameCube (Game Boy Player)',
          img: platformLogos['Nintendo GameCube (Game Boy Player)']
        });
        acc.push({ name: 'Analogue Pocket', img: platformLogos['Analogue Pocket'] });
        break;
      case 24: // Game Boy Advance
        acc.push({ name: 'Nintendo DS Lite', img: platformLogos['Nintendo DS Lite'] });
        acc.push({
          name: 'Nintendo GameCube (Game Boy Player)',
          img: platformLogos['Nintendo GameCube (Game Boy Player)']
        });
        acc.push({ name: 'Analogue Pocket', img: platformLogos['Analogue Pocket'] });
        break;
      case 20: // Nintendo DS
        acc.push({ name: 'Nintendo 3DS', img: platformLogos['Nintendo 3DS'] });
        break;
      case 7: // Sony PlayStation
        acc.push({ name: 'Sony PlayStation 2', img: platformLogos['Sony PlayStation 2'] });
        acc.push({ name: 'Sony PlayStation 3', img: platformLogos['Sony PlayStation 3'] });
        break;
      case 35: // Sega Game Gear
        acc.push({ name: 'Analogue Pocket', img: platformLogos['Analogue Pocket'] });
        break;
      case 5: // Nintendo Wii
        acc.push({ name: 'Nintendo Wii U', img: platformLogos['Nintendo Wii U'] });
        break;
      default:
        break;
    }
    // TODO: add Xbox BC logic
    return acc;
  }, []);
  return _uniqBy([...(returnArr || []), ...(additional || [])], 'img');
};
