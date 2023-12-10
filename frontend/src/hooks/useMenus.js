/**
 * @Category React Hook function
 * Provide single source to manage application static menus items
 * 
**/

import { $t } from 'i18n/index';

export default function useMenus() {
    
    
    return {
	navbarTopRightItems: [],
	navbarTopLeftItems: [],
	navbarSideLeftItems: [
  {
    "to": "/home",
    "label": $t('home'),
    "icon": "pi pi-th-large text-primary",
    "iconcolor": "",
    "target": "",
  },
  {
    "to": "/users",
    "label": $t('users'),
    "icon": "pi pi-th-large text-primary",
    "iconcolor": "",
    "target": "",
  }
],
        exportFormats: {
            print: {
                label: 'Print',
                icon: 'pi pi-print',
                type: 'print',
                ext: '',
            },
            pdf: {
                label: 'Pdf',
                icon: 'pi pi-file-pdf',
                type: 'pdf',
                ext: 'pdf',
            },
            excel: {
                label: 'Excel',
                icon: 'pi pi-file-excel',
                type: 'excel',
                ext: 'xlsx',
            },
            csv: {
                label: 'Csv',
                icon: 'pi pi-table',
                type: 'csv',
                ext: 'csv',
            },
        },
        locales: {
  "fr": "French",
  "ru": "Russian",
  "zh-CN": "Chinese",
  "en-US": "English",
  "it": "Italian",
  "hi": "Hindi",
  "pt": "Portuguese",
  "de": "German",
  "es": "Spanish",
  "ar": "Arabic"
}
    }
}