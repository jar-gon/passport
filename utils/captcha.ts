import { NoCaptcha as OriginNoCaptcha } from '@billypon/react-utils/captcha/aliyun'

import { publicRuntimeConfig } from './config'

export class NoCaptcha extends OriginNoCaptcha {
  constructor(appkey = publicRuntimeConfig.PUBLIC_CAPTCHA, renderTo = '#noCaptchaCode', language = 'cn') {
    super({
      appkey,
      token: [ appkey, (new Date()).getTime(), Math.random() ].join(':'),
      renderTo,
      scene: 'nc_login',
      customWidth: 330,
      trans: { key1: 'code0' },
      elementID: [ 'usernameID' ],
      is_Opt: 0,
      language,
      isEnabled: true,
      timeout: 3000,
      times: 5,
    })
    if (language === 'cn') {
      this.upLang(language, {
        _startTEXT: '请按住滑块，拖动到最右边',
        _yesTEXT: '验证通过',
        _error300: '哎呀，出错了，点击<a href="javascript:__nc.reset()">刷新</a>再来一次',
        _errorNetwork: '网络不给力，请<a href="javascript:__nc.reset()">点击刷新</a>',
      })
    }
  }
}
