import {APP_CONFIG} from '@environments/environment';

import defaultLocalAvatar from '../assets/images/default_local_avatar.png';

const AppConfig = {
  titlePrefix: '草莓',
  ossUrl: APP_CONFIG.api,
  defaultCover: defaultLocalAvatar,
  defaultLocalAvatar: defaultLocalAvatar,
};

export {AppConfig};
