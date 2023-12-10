
const locale =localStorage.getItem('locale') || process.env.REACT_APP_LOCALE;
let messages = {};
try {
	messages = require(`i18n/locales/${locale}.json`);
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
		
		// eslint-disable-next-line
		return new Function(...names, `return \`${value}\`;`)(...vals);
		}
		return value || key;
	}
};

const $t = i18n.t;
export { i18n, $t }
