import { IConsole, IConsoleArr } from '@/models/platforms.model';
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
  'Neo Geo AES': 'logos/Neo_geo_aes-logo.svg',
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
  'Nintendo Switch 2': 'logos/Nintendo_Switch_2_Logo.svg',
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
  'TurboGrafx-16/PC Engine CD': 'logos/NEC_TurboGrafx-CD.svg',
  'Virtual Boy': 'logos/Virtualboy_logo.svg',
  Wii: 'logos/Wii.svg',
  'Wii U': 'logos/WiiU.svg',
  Xbox: 'logos/Vectorial_Xbox_logo.svg',
  'Xbox 360': 'logos/Xbox_logo_2012_cropped.svg',
  'Xbox One': 'logos/Xbox_one_logo.svg',
  'Game.com': 'logos/Game_com_gif_logo.svg',
  'Atari Lynx': 'logos/Atari_Lynx_logo.svg',
  'PlayStation Vita': 'logos/PlayStation_Vita_logo.svg',
  'Retron 77': 'logos/hyperkin77.png',
  'RetroUSB AVS': 'logos/retrousbAVS.svg'
};

const platformImages = {
  '3DO Interactive Multiplayer': 'consolePics/panasonic_3do.jpg',
  'Atari 2600': 'consolePics/atari_2600.png',
  'Atari 7800': 'consolePics/Atari-7800.png',
  'Atari 5200': 'consolePics/atari-5200.jpg',
  'Atari Jaguar': 'consolePics/atari_jaguar.jpg',
  'Atari Lynx': 'consolePics/Atari-Lynx-1.png',
  'Atari Lynx II': 'consolePics/atari_lynx.jpg',
  Dreamcast: 'consolePics/Dreamcast.png',
  'Game Boy': 'consolePics/nintendo-game-boy-pocket.jpg',
  'Game Boy Advance': 'consolePics/game_boy_advance.jpg',
  'Game Boy Advance SP': 'consolePics/game_boy_advance_sp.jpg',
  'Game Boy Color': 'consolePics/game_boy_color_.jpg',
  Intellivision: 'consolePics/intellivision.jpg',
  'Microsoft Xbox 360': 'consolePics/xbox360e.png',
  'Microsoft Xbox One': 'consolePics/xboxOne.jpg',
  'Neo Geo AES': 'consolePics/neo-geo-aes.jpg',
  'Nintendo 3DS': 'consolePics/nintendo_3ds_xl.jpg',
  'Nintendo 3DS Zelda': 'consolePics/Zelda-3DS.jpg',
  'Nintendo 64 Japanese': 'consolePics/n64.jpg',
  'Nintendo 64': 'consolePics/n64_us.jpg',
  'Nintendo DS': 'consolePics/nintendo_ds_lite.jpg',
  'Nintendo DS Rose': 'consolePics/nintendo-ds-lite-rose (1).jpg',
  'Nintendo Entertainment System (NES)': 'consolePics/nes.jpg',
  'Nintendo Game Boy Advance': 'consolePics/game_boy_advance.jpg',
  'Nintendo Game Boy Advance SP': 'consolePics/game_boy_advance_sp.jpg',
  'Nintendo Game Boy Color': 'consolePics/game_boy_color_.jpg',
  'Nintendo GameCube': 'consolePics/gamecube.jpg',
  'Nintendo GameCube Indigo': 'consolePics/gamecube_indigo.jpg',
  'Nintendo Switch': 'consolePics/nintendo-switch.png',
  'Nintendo Switch 2': 'consolePics/Nintendo_Switch_2.jpg',
  'Nintendo Wii U': 'consolePics/wiiu.png',
  'PC (Microsoft Windows)': 'logos/windows.png',
  PlayStation: 'consolePics/sony_playstation.jpg',
  'PlayStation 2': 'consolePics/sony-ps2.png',
  'PlayStation 2 Slim': 'consolePics/sony_ps2_slim.jpg',
  'PlayStation 3': 'consolePics/ps3.jpg',
  'PlayStation 4': 'consolePics/ps4_pro.jpg',
  'PlayStation Portable': 'consolePics/Sony-PSP-1000.png',
  'Sega 32X': 'consolePics/Sega-Genesis-Model2-32X.jpg',
  'Sega CD': 'consolePics/sega-genesis-2-cd-2-32x.jpg',
  'Sega Game Gear': 'consolePics/Game-gear.png',
  'Sega Master System': 'consolePics/Sega-Master-System.jpg',
  'Sega Mega Drive/Genesis': 'consolePics/sega-genesis-2.png',
  'Sega Saturn': 'consolePics/sega_saturn.png',
  'Sony PlayStation 2': 'consolePics/sony-ps2.png',
  'Sony PlayStation 3': 'consolePics/ps3.jpg',
  'Super Nintendo Entertainment System (SNES)': 'consolePics/SNES_US.jpg',
  'TurboGrafx-16/PC Engine': 'consolePics/turbografx-16.jpg',
  'Turbografx-16/PC Engine CD': 'consolePics/Turbografx_CD.jpg',
  'Virtual Boy': 'consolePics/virtual-boy.jpg',
  Wii: 'consolePics/wii.jpg',
  'Wii U': 'consolePics/wiiu.png',
  Xbox: 'consolePics/xbox.png',
  'Xbox 360': 'consolePics/xbox360e.png',
  'Xbox One': 'consolePics/xboxOne.jpg',
  'Game.com': 'consolePics/Tiger_Game.com.png',
  'PlayStation Vita': 'consolePics/playstation-vita.jpg'
};

// this is stupid, but I was being lazy
export const getConsoleImage = (con: IConsole): string => {
  switch (con.name) {
    case 'Atari Lynx':
      return con.version.id === 189
        ? platformImages['Atari Lynx II']
        : platformImages['Atari Lynx'];
    case 'Nintendo 3DS':
      return con.notes === 'Nintendo 3DS Black Zelda Limited Edition; CIB'
        ? platformImages['Nintendo 3DS Zelda']
        : platformImages['Nintendo 3DS'];
    case 'Nintendo GameCube':
      return con.priceCharting?.name === 'Indigo GameCube System'
        ? platformImages['Nintendo GameCube Indigo']
        : platformImages['Nintendo GameCube'];
    case 'Sony PlayStation 2':
    case 'PlayStation 2':
      return con.version.id === 114
        ? platformImages['PlayStation 2 Slim']
        : platformImages['PlayStation 2'];
    case 'Nintendo 64':
      return con.priceCharting?.name === 'Funtastic Ice Blue Nintendo 64 System'
        ? platformImages['Nintendo 64 Japanese']
        : platformImages['Nintendo 64'];
    case 'Game Boy Advance':
    case 'Nintendo Game Boy Advance':
      return con.version.id === 193
        ? platformImages['Nintendo Game Boy Advance SP']
        : platformImages['Nintendo Game Boy Advance'];
    case 'Nintendo DS':
      return con.notes === "Brandy's"
        ? platformImages['Nintendo DS Rose']
        : platformImages['Nintendo DS'];
    default:
      // @ts-ignore
      return platformImages[con.name];
  }
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
        acc.push({ name: 'Retron 77', img: platformLogos['Retron 77'] });
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
      case 18: // NES
        acc.push({ name: 'RetroUSB AVS', img: platformLogos['RetroUSB AVS'] });
        break;
      case 130: // Nintendo Switch
        acc.push({ name: 'Nintendo Switch 2', img: platformLogos['Nintendo Switch 2']});
        break;
      default:
        break;
    }
    // TODO: add Xbox BC logic
    // my idea here is to make a backend change by adding a property to platforms that indicates that it is bc
    // and for which consoles. The current approach isn't great.
    return acc;
  }, []);
  return _uniqBy([...(returnArr || []), ...(additional || [])], 'img');
};
