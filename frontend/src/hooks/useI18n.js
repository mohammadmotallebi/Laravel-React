

import useLocalStore from './useLocalStore';

export default function useI18n() {
  const localStore = useLocalStore();
  const locale = localStore.getLocale() || process.env.VUE_APP_LOCALE;
  let messages = {};
  try {
    messages = require(`@/i18n/${locale}`).default;
  }
  catch (err) {
    console.error(err);
  }

  const i18n = {
    locale,
    messages,
    t: function (key, args) {
      let value = key.split('.').reduce((p, c) => p?.[c], messages);
      if (value && args) {
        const names = Object.keys(args);
        const vals = Object.values(args);
        return new Function(...names, `return \`${value}\`;`)(...vals);
      }
      return value || key;
    }
  };
  const $t = i18n.t;
  return { i18n, $t }
}


