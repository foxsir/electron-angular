import {APP_CONFIG} from '@environments/environment';

import defaultLocalAvatar from '../assets/images/default_local_avatar.png';

const AppConfig = {
  titlePrefix: '草莓',
  ossUrl: ["http://", APP_CONFIG.api, ":8808"].join(""),
  defaultCover: defaultLocalAvatar,
  defaultLocalAvatar: defaultLocalAvatar,
};

export {AppConfig};
