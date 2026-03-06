import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system/legacy';
import { WHATSAPP_PATHS } from '../constants/Paths';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface StatusFile {
    uri: string;
    name: string;
    type: 'image' | 'video';
    modificationTime: number;
}

const SAF_URI_KEY = '@whatsapp_saf_uri';

export const getSavedSafUri = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(SAF_URI_KEY);
    } catch (e) {
        return null;
    }
};

export const saveSafUri = async (uri: string) => {
    try {
        await AsyncStorage.setItem(SAF_URI_KEY, uri);
    } catch (e) {
        console.error('Failed to save SAF URI', e);
    }
};

export const requestAndroid11DirectoryPermission = async (): Promise<boolean> => {
    try {
        // We prompt the user to select the WhatsApp folder
        // For Android 11+, WhatsApp Statuses are typically in:
        // Android/media/com.whatsapp/WhatsApp/Media/.Statuses
        // Alternatively, they could be in com.whatsapp.w4b for Business
        const permission = await StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (permission.granted) {
            await saveSafUri(permission.directoryUri);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error requesting SAF permission:', error);
        return false;
    }
};

export const scanWhatsAppStatuses = async (): Promise<StatusFile[]> => {
    const statusFiles: StatusFile[] = [];

    // For Android 11+, try reading via SAF if URI is saved
    const isAndroid11Plus = Platform.OS === 'android' && (Platform.Version as number) >= 30;
    if (isAndroid11Plus) {
        const savedUri = await getSavedSafUri();
        if (savedUri) {
            try {
                console.log('Scanning SAF URI:', savedUri);
                const files = await StorageAccessFramework.readDirectoryAsync(savedUri);
                console.log(`Found ${files.length} files via SAF`);

                for (const fileUri of files) {
                    if (fileUri.endsWith('.nomedia')) continue;

                    if (fileUri.endsWith('.jpg') || fileUri.endsWith('.png') || fileUri.endsWith('.mp4') || fileUri.endsWith('.gif')) {
                        const fileInfo = await FileSystem.getInfoAsync(fileUri);
                        const fileName = fileUri.split('/').pop()?.split('%2F').pop() || 'unknown';

                        if (fileInfo.exists) {
                            statusFiles.push({
                                uri: fileUri,
                                name: fileName,
                                type: (fileUri.endsWith('.mp4') || fileUri.endsWith('.gif')) ? 'video' : 'image',
                                modificationTime: fileInfo.modificationTime || 0,
                            });
                        }
                    }
                }

                if (statusFiles.length > 0) {
                    return statusFiles.sort((a, b) => b.modificationTime - a.modificationTime);
                }
            } catch (error) {
                console.warn('Error scanning SAF URI:', error);
            }
        }
    }

    // Fallback/Legacy paths 
    const paths = [
        WHATSAPP_PATHS.ANDROID.WHATSAPP,
        WHATSAPP_PATHS.ANDROID.WHATSAPP_BUSINESS,
        WHATSAPP_PATHS.ANDROID.WHATSAPP_OLD,
        '/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/.Statuses',
        '/storage/emulated/0/WhatsApp/Media/.Statuses',
        '/storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses',
    ];

    const uniquePaths = Array.from(new Set(paths));

    for (const path of uniquePaths) {
        try {
            console.log(`Scanning path: ${path}`);
            const dirInfo = await FileSystem.getInfoAsync(path);

            if (dirInfo.exists && dirInfo.isDirectory) {
                const files = await FileSystem.readDirectoryAsync(path);
                console.log(`Found ${files.length} files in ${path}`);

                for (const file of files) {
                    if (file.startsWith('.') || file.endsWith('.nomedia')) continue;

                    if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.mp4') || file.endsWith('.gif')) {
                        const fileUri = `${path}/${file}`;
                        const fileInfo = await FileSystem.getInfoAsync(fileUri);

                        if (fileInfo.exists) {
                            statusFiles.push({
                                uri: fileUri,
                                name: file,
                                type: (file.endsWith('.mp4') || file.endsWith('.gif')) ? 'video' : 'image',
                                modificationTime: fileInfo.modificationTime || 0,
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.warn(`Error scanning path ${path}:`, error);
        }
    }

    return statusFiles.sort((a, b) => b.modificationTime - a.modificationTime);
};
