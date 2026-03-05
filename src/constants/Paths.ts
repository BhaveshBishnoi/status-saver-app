import { Platform } from 'react-native';

export const WHATSAPP_PATHS = {
    ANDROID: {
        WHATSAPP: '/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/.Statuses',
        WHATSAPP_BUSINESS: '/storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses',
        WHATSAPP_OLD: '/storage/emulated/0/WhatsApp/Media/.Statuses',
    },
};

export const SAVE_PATH = '/storage/emulated/0/StatusSaver/';

export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';
