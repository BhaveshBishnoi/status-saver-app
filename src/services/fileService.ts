import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { SAVE_PATH } from '../constants/Paths';
import { Alert } from 'react-native';

export const downloadStatus = async (uri: string, name: string) => {
    try {
        // Ensure directory exists
        const dirInfo = await FileSystem.getInfoAsync(SAVE_PATH);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(SAVE_PATH, { intermediates: true });
        }

        const destination = `${SAVE_PATH}${name}`;
        await FileSystem.copyAsync({
            from: uri,
            to: destination,
        });

        // Also save to Media Library (Gallery)
        const asset = await MediaLibrary.createAssetAsync(destination);
        await MediaLibrary.createAlbumAsync('StatusSaver', asset, false);

        Alert.alert('Success', 'Status saved to gallery and StatusSaver folder!');
        return true;
    } catch (error) {
        console.error('Download error:', error);
        Alert.alert('Error', 'Failed to save status.');
        return false;
    }
};

export const shareStatus = async (uri: string) => {
    try {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
            await Sharing.shareAsync(uri);
        } else {
            Alert.alert('Error', 'Sharing is not available on this device.');
        }
    } catch (error) {
        console.error('Sharing error:', error);
    }
};

export const deleteSavedStatus = async (uri: string) => {
    try {
        await FileSystem.deleteAsync(uri);
        return true;
    } catch (error) {
        console.error('Delete error:', error);
        return false;
    }
};
