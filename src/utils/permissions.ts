import * as MediaLibrary from 'expo-media-library';
import { Alert, Linking, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Contacts from 'expo-contacts';

export const requestContactsPermissions = async () => {
    try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
            return true;
        }

        Alert.alert(
            'Permission Required',
            'Contacts permission is required to identify status creators. Please enable it in settings.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
        );
        return false;
    } catch (error) {
        console.error('Error requesting contacts permissions:', error);
        return false;
    }
};

export const checkContactsPermissions = async () => {
    try {
        const { status } = await Contacts.getPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        return false;
    }
};

export const requestStoragePermissions = async () => {
    if (Platform.OS !== 'android') return true;

    try {
        // Basic Media Library Permission
        const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();

        // For Android 11+ (API 30+), we need MANAGE_EXTERNAL_STORAGE for hidden folders
        if (Device.osInternalBuildId && parseInt(Device.osInternalBuildId) >= 30 || (Platform.Version as number) >= 30) {
            // Check if we already have it (hard to check directly in Expo without a custom native module, 
            // but we can prompt the user to enable it in settings if statuses aren't showing)
            // For now, we'll provide a clear instruction to the user.
            return mediaStatus === 'granted';
        }

        if (mediaStatus === 'granted') {
            return true;
        }

        Alert.alert(
            'Permission Required',
            'Storage permission is required to view and download statuses. Please enable it in settings.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
        );
        return false;
    } catch (error) {
        console.error('Error requesting permissions:', error);
        return false;
    }
};

export const openAllFilesAccessSettings = () => {
    if (Platform.OS === 'android' && (Platform.Version as number) >= 30) {
        const pkg = 'com.bhavesh.statussaver'; // Should match app.json
        IntentLauncher.startActivityAsync('android.settings.MANAGE_APP_ALL_FILES_ACCESS_PERMISSION', {
            data: `package:${pkg}`,
        });
    } else {
        Linking.openSettings();
    }
};

export const checkStoragePermissions = async () => {
    if (Platform.OS !== 'android') return true;
    const { status } = await MediaLibrary.getPermissionsAsync();
    return status === 'granted';
};
