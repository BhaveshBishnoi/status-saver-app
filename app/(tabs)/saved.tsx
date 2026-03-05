import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, RefreshControl, View, Text, ActivityIndicator, Alert } from 'react-native';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useColorScheme } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { StatusFile } from '../../src/services/statusService';
import { StatusCard } from '../../src/components/StatusCard';
import { StatusPreview } from '../../src/components/StatusPreview';
import { shareStatus, deleteSavedStatus } from '../../src/services/fileService';
import * as FileSystem from 'expo-file-system';
import { SAVE_PATH } from '../../src/constants/Paths';
import { useFocusEffect } from 'expo-router';

export default function SavedScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const [statuses, setStatuses] = useState<StatusFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<StatusFile | null>(null);
    const [previewVisible, setPreviewVisible] = useState(false);

    const fetchSavedStatuses = useCallback(async () => {
        try {
            setLoading(true);
            const dirInfo = await FileSystem.getInfoAsync(SAVE_PATH);
            if (dirInfo.exists && dirInfo.isDirectory) {
                const files = await FileSystem.readDirectoryAsync(SAVE_PATH);
                const mappedFiles: StatusFile[] = [];

                for (const file of files) {
                    const fileUri = `${SAVE_PATH}${file}`;
                    const fileInfo = await FileSystem.getInfoAsync(fileUri);
                    if (fileInfo.exists) {
                        mappedFiles.push({
                            uri: fileUri,
                            name: file,
                            type: file.endsWith('.mp4') ? 'video' : 'image',
                            modificationTime: fileInfo.modificationTime || 0,
                        });
                    }
                }
                setStatuses(mappedFiles.sort((a, b) => b.modificationTime - a.modificationTime));
            } else {
                setStatuses([]);
            }
        } catch (error) {
            console.error('Error fetching saved statuses:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchSavedStatuses();
        }, [fetchSavedStatuses])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchSavedStatuses();
        setRefreshing(false);
    };

    const handleShare = async (status: StatusFile) => {
        await shareStatus(status.uri);
    };

    const handleDelete = (status: StatusFile) => {
        Alert.alert(
            'Delete Status',
            'Are you sure you want to delete this status?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await deleteSavedStatus(status.uri);
                        if (success) {
                            setStatuses(statuses.filter(s => s.uri !== status.uri));
                            if (selectedStatus?.uri === status.uri) {
                                setPreviewVisible(false);
                            }
                        }
                    }
                },
            ]
        );
    };

    const handlePress = (status: StatusFile) => {
        setSelectedStatus(status);
        setPreviewVisible(true);
    };

    if (loading) {
        return (
            <ScreenContainer style={styles.centered}>
                <ActivityIndicator size="large" color={theme.primary} />
            </ScreenContainer>
        );
    }

    if (statuses.length === 0) {
        return (
            <ScreenContainer style={styles.centered} scrollable>
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
                <Text style={[styles.message, { color: theme.text }]}>No saved statuses found.</Text>
                <Text style={[styles.subMessage, { color: theme.textSecondary }]}>Downloaded statuses will appear here.</Text>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <FlatList
                data={statuses}
                renderItem={({ item }) => (
                    <StatusCard
                        status={item}
                        onPress={() => handlePress(item)}
                        onDownload={() => handleDelete(item)} // Reusing download icon slot as delete for saved
                        onShare={() => handleShare(item)}
                    />
                )}
                keyExtractor={(item) => item.uri}
                numColumns={2}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
                }
            />
            <StatusPreview
                status={selectedStatus}
                visible={previewVisible}
                onClose={() => setPreviewVisible(false)}
                onDownload={() => selectedStatus && handleDelete(selectedStatus)}
                onShare={() => selectedStatus && handleShare(selectedStatus)}
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    list: {
        padding: 8,
    },
    message: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    subMessage: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
});
