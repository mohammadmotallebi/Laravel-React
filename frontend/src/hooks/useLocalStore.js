/**
 * @Category React hook function
 * Helper functions to help manage user data such as login data and locale
 * Current implementation uses sessionStorage or localStorage
 * 
**/

// a unique key that identifies app storage values
const myAppStoreKey = process.env.REACT_APP_STORAGE_KEY || "APP";

// key for user access token
const TOKEN_KEY = myAppStoreKey + '_TOKEN';

// key to remember user locale
const LOCALE_KEY = myAppStoreKey + '_LOCALE';

export default function useLocalStore() {
    return {
        setLocale(locale) {
            localStorage.setItem(LOCALE_KEY, locale);
        },
        getLocale() {
            return localStorage.getItem(LOCALE_KEY);
        },
        getToken() {
            return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
        },
        saveLoginData(loginData, remember) {
            let token = loginData.token;
            if (remember) {
                localStorage.setItem(TOKEN_KEY, token);
            }
            else {
                sessionStorage.setItem(TOKEN_KEY, token);
            }
        },
        removeLoginData() {
            sessionStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(TOKEN_KEY);
        },
    }
}