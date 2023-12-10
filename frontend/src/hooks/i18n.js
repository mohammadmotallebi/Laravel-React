
import { useLocalStore } from 'hooks/useLocalStore';
function useTranslate() {
  const localStore = useLocalStore();
  const locale = localStore.getLocale() || process.env.REACT_APP_LOCALE;
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
  return i18n;
}
const i18n = useTranslate()
const $t = i18n.t;

export { i18n, $t }
