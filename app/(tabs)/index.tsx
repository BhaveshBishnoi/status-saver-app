import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, RefreshControl, View, Text, ActivityIndicator, Pressable, Platform } from 'react-native';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useColorScheme } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { StatusFile, scanWhatsAppStatuses, requestAndroid11DirectoryPermission } from '../../src/services/statusService';
import { StatusCard } from '../../src/components/StatusCard';
import { StatusPreview } from '../../src/components/StatusPreview';
import { requestStoragePermissions, checkStoragePermissions, openAllFilesAccessSettings, requestContactsPermissions } from '../../src/utils/permissions';
import { downloadStatus, shareStatus } from '../../src/services/fileService';
import { ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react-native';

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
            // Also explicitly request Contacts
            await requestContactsPermissions();

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

    const handlePickFolder = async () => {
        const success = await requestAndroid11DirectoryPermission();
        if (success) {
            setLoading(true);
            await fetchStatuses();
        }
    };

    if (loading && !refreshing) {
        return (
            <ScreenContainer style={styles.centered}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Scanning for statuses...</Text>
            </ScreenContainer>
        );
    }

    const isAndroid11Plus = Platform.OS === 'android' && (Platform.Version as number) >= 30;

    if (hasPermission === false && !isAndroid11Plus) {
        return (
            <ScreenContainer style={styles.centered}>
                <ShieldCheck color={theme.gray} size={64} style={styles.icon} />
                <Text style={[styles.message, { color: theme.text }]}>Permission required to access statuses.</Text>
                <Pressable
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={() => requestStoragePermissions()}
                >
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </Pressable>
            </ScreenContainer>
        );
    }

    if (statuses.length === 0) {
        return (
            <ScreenContainer style={styles.centered} scrollable>
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
                <AlertCircle color={theme.gray} size={64} style={styles.icon} />
                <Text style={[styles.message, { color: theme.text }]}>No WhatsApp statuses found.</Text>
                <Text style={[styles.subMessage, { color: theme.textSecondary }]}>
                    1. View statuses in WhatsApp first.{"\n"}
                    2. Ensure WhatsApp is installed.{"\n"}
                    3. Grant "All Files Access" if requested.
                </Text>

                {isAndroid11Plus && (
                    <>
                        <Text style={[styles.subMessage, { color: theme.textSecondary, marginTop: 16 }]}>
                            If granting special access fails, manually select the WhatsApp ".Statuses" folder:
                        </Text>
                        <Pressable
                            style={[styles.button, { backgroundColor: theme.primary, marginBottom: 12 }]}
                            onPress={handlePickFolder}
                        >
                            <ShieldCheck color="white" size={20} style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>Select WhatsApp Folder</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.button, { backgroundColor: theme.secondary, marginTop: 8 }]}
                            onPress={openAllFilesAccessSettings}
                        >
                            <ShieldCheck color="white" size={20} style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>Grant Special Access</Text>
                        </Pressable>
                    </>
                )}

                <Pressable
                    style={[styles.refreshButton, { borderColor: theme.border }]}
                    onPress={onRefresh}
                >
                    <RefreshCw color={theme.primary} size={20} style={{ marginRight: 8 }} />
                    <Text style={[styles.refreshText, { color: theme.primary }]}>Refresh</Text>
                </Pressable>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer noPadding>
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
                columnWrapperStyle={styles.columnWrapper}
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
        padding: 32,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
    },
    list: {
        padding: 12,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    message: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    subMessage: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    icon: {
        marginBottom: 20,
        opacity: 0.5,
    },
    button: {
        flexDirection: 'row',
        height: 52,
        borderRadius: 26,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    refreshButton: {
        flexDirection: 'row',
        marginTop: 16,
        padding: 12,
        alignItems: 'center',
    },
    refreshText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
