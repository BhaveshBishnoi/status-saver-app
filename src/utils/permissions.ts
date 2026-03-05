import * as MediaLibrary from 'expo-media-library';
import { Alert, Linking, Platform } from 'react-native';

export const requestStoragePermissions = async () => {
    if (Platform.OS !== 'android') return true;

    try {
        const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();

        if (status === 'granted') {
            return true;
        }

        if (!canAskAgain) {
            Alert.alert(
                'Permission Required',
                'Storage permission is required to view and download statuses. Please enable it in settings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]
            );
            return false;
        }

        return false;
    } catch (error) {
        console.error('Error requesting permissions:', error);
        return false;
    }
};

export const checkStoragePermissions = async () => {
    if (Platform.OS !== 'android') return true;
    const { status } = await MediaLibrary.getPermissionsAsync();
    return status === 'granted';
};
