import * as FileSystem from 'expo-file-system';
import { WHATSAPP_PATHS } from '../constants/Paths';

export interface StatusFile {
    uri: string;
    name: string;
    type: 'image' | 'video';
    modificationTime: number;
}

export const scanWhatsAppStatuses = async (): Promise<StatusFile[]> => {
    const statusFiles: StatusFile[] = [];
    const paths = [
        WHATSAPP_PATHS.ANDROID.WHATSAPP,
        WHATSAPP_PATHS.ANDROID.WHATSAPP_BUSINESS,
        WHATSAPP_PATHS.ANDROID.WHATSAPP_OLD,
    ];

    for (const path of paths) {
        try {
            const exists = await FileSystem.getInfoAsync(path);
            if (exists.exists && exists.isDirectory) {
                const files = await FileSystem.readDirectoryAsync(path);

                for (const file of files) {
                    if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.mp4')) {
                        const fileUri = `${path}/${file}`;
                        const fileInfo = await FileSystem.getInfoAsync(fileUri);

                        if (fileInfo.exists) {
                            statusFiles.push({
                                uri: fileUri,
                                name: file,
                                type: file.endsWith('.mp4') ? 'video' : 'image',
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

    // Sort by modification time (newest first)
    return statusFiles.sort((a, b) => b.modificationTime - a.modificationTime);
};
