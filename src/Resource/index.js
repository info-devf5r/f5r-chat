import USER from './Svg/user.svg';
import PASSWORD from './Svg/password.svg';
import PASSWORD2 from './Svg/password2.svg';
import EMAIL from './Svg/email.svg';
import ATTACHMENT from './Svg/attachment.svg';
import PHONE from './Svg/phone.svg';
import AUTHUP from './Blobs/up.svg';
import AUTHDOWN from './Blobs/down.svg';
import SEARCH2 from './Svg/search2.svg';
import CONTENT from './Svg/content.svg';
import SEND from './Svg/send.svg';
import EMOJI from './Svg/emoji.svg';
import EYEOPEN from './Svg/eye-open.svg';
import PLUS from './Svg/plus.svg';
import CROSS from './Svg/cross.svg';
import CROSSWHITE from './Svg/cross-white.svg';
import SUN from './Svg/sun.svg';
import MOON from './Svg/moon.svg';
import DOT from './Svg/dot.svg';
import BELL from './Svg/bell.svg';
import GOOGLE from './images/google.png';
import FACEBOOK from './images/facebook.png';
import LOADER from './gif/loader.gif';
import RECORDER from './gif/voice-recorder.gif';
import BTN_LOADER from './gif/btn-loader.svg';
import BTN_BLACK_LOADER from './gif/btn-loader-black.svg';

class Resource {
  static Svg = {
    USER,
    PHONE,
    PASSWORD,
    PASSWORD2,
    EMAIL,
    ATTACHMENT,
    SUN,
    MOON,
    DOT,
    BELL,
    SEARCH2,
    SEND,
    CONTENT,
    EMOJI,
    EYEOPEN,
    PLUS,
    CROSS,
    CROSSWHITE,
  };

  static Gifs = {
    LOADER,
    RECORDER,
    BTN_BLACK_LOADER,
    BTN_LOADER,
  };

  static Images = {
    GOOGLE,
    FACEBOOK,
  };

  static Blob = {
    AUTHUP,
    AUTHDOWN,
  };

  static Routes = {
    HOME: '/',
    AUTH: '/auth',
  };
}

export default Resource;
