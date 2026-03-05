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

    // Broader search paths including common Android 11+ locations
    const paths = [
        WHATSAPP_PATHS.ANDROID.WHATSAPP,
        WHATSAPP_PATHS.ANDROID.WHATSAPP_BUSINESS,
        WHATSAPP_PATHS.ANDROID.WHATSAPP_OLD,
        // Add variations if needed
        '/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/.Statuses',
        '/storage/emulated/0/WhatsApp/Media/.Statuses',
        '/storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses',
    ];

    // Remove duplicates
    const uniquePaths = Array.from(new Set(paths));

    for (const path of uniquePaths) {
        try {
            console.log(`Scanning path: ${path}`);
            const dirInfo = await FileSystem.getInfoAsync(path);

            if (dirInfo.exists && dirInfo.isDirectory) {
                const files = await FileSystem.readDirectoryAsync(path);
                console.log(`Found ${files.length} files in ${path}`);

                for (const file of files) {
                    // Ignore non-media and temp files
                    if (file.startsWith('.') || file.endsWith('.nomedia')) continue;

                    if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.mp4') || file.endsWith('.gif')) {
                        const fileUri = `${path}/${file}`;
                        // Use getInfoAsync sparingly if many files, but needed for modificationTime
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
            } else {
                console.log(`Path does not exist or is not a directory: ${path}`);
            }
        } catch (error) {
            console.warn(`Error scanning path ${path}:`, error);
        }
    }

    // Sort by modification time (newest first)
    return statusFiles.sort((a, b) => b.modificationTime - a.modificationTime);
};
