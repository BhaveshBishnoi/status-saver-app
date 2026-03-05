import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, RefreshControl, View, Text, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useColorScheme } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { StatusFile, scanWhatsAppStatuses } from '../../src/services/statusService';
import { StatusCard } from '../../src/components/StatusCard';
import { StatusPreview } from '../../src/components/StatusPreview';
import { requestStoragePermissions, checkStoragePermissions } from '../../src/utils/permissions';
import { downloadStatus, shareStatus } from '../../src/services/fileService';

export default function StatusesScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const [statuses, setStatuses] = useState<StatusFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<StatusFile | null>(null);
    const [previewVisible, setPreviewVisible] = useState(false);

    const fetchStatuses = useCallback(async () => {
        const granted = await checkStoragePermissions();
        setHasPermission(granted);

        if (granted) {
            setLoading(true);
            const data = await scanWhatsAppStatuses();
            setStatuses(data);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchStatuses();
        setRefreshing(false);
    };

    useEffect(() => {
        const init = async () => {
            const granted = await requestStoragePermissions();
            setHasPermission(granted);
            if (granted) {
                fetchStatuses();
            } else {
                setLoading(false);
            }
        };
        init();
    }, [fetchStatuses]);

    const handleDownload = async (status: StatusFile) => {
        await downloadStatus(status.uri, status.name);
    };

    const handleShare = async (status: StatusFile) => {
        await shareStatus(status.uri);
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

    if (hasPermission === false) {
        return (
            <ScreenContainer style={styles.centered}>
                <Text style={[styles.message, { color: theme.text }]}>Permission required to access statuses.</Text>
            </ScreenContainer>
        );
    }

    if (statuses.length === 0) {
        return (
            <ScreenContainer style={styles.centered} scrollable>
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
                <Text style={[styles.message, { color: theme.text }]}>No WhatsApp statuses found.</Text>
                <Text style={[styles.subMessage, { color: theme.textSecondary }]}>Make sure you have viewed statuses in WhatsApp first.</Text>
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
                        onDownload={() => handleDownload(item)}
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
                onDownload={() => selectedStatus && handleDownload(selectedStatus)}
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
