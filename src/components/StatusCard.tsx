import React from 'react';
import { StyleSheet, View, Pressable, Dimensions, useColorScheme, Text } from 'react-native';
import { Image } from 'expo-image';
import { Play, Download, Share2, CornerUpRight } from 'lucide-react-native';
import { Colors } from '../../src/constants/Colors';
import { StatusFile } from '../../src/services/statusService';

const { width } = Dimensions.get('window');
// Dynamic width calculation for grid
const COLUMN_WIDTH = (width - 36) / 2;

interface StatusCardProps {
    status: StatusFile;
    onPress: () => void;
    onDownload: () => void;
    onShare: () => void;
}

export const StatusCard: React.FC<StatusCardProps> = ({ status, onPress, onDownload, onShare }) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    return (
        <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Pressable onPress={onPress} style={styles.imageContainer}>
                <Image
                    source={{ uri: status.uri }}
                    style={styles.image}
                    contentFit="cover"
                    transition={300}
                    cachePolicy="memory-disk"
                />
                {status.type === 'video' && (
                    <View style={styles.videoIndicator}>
                        <View style={styles.playBadge}>
                            <Play color="white" size={14} fill="white" />
                        </View>
                    </View>
                )}

                <View style={styles.overlay}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{status.type === 'video' ? 'VIDEO' : 'IMAGE'}</Text>
                    </View>
                </View>
            </Pressable>

            <View style={styles.actions}>
                <Pressable
                    onPress={onDownload}
                    style={({ pressed }) => [
                        styles.actionButton,
                        { backgroundColor: pressed ? theme.primary + '20' : 'transparent' }
                    ]}
                >
                    <Download color={theme.primary} size={20} />
                </Pressable>
                <Pressable
                    onPress={onShare}
                    style={({ pressed }) => [
                        styles.actionButton,
                        { backgroundColor: pressed ? theme.primary + '20' : 'transparent' }
                    ]}
                >
                    <CornerUpRight color={theme.primary} size={20} />
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: COLUMN_WIDTH,
        marginVertical: 8,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1.5,
    },
    imageContainer: {
        height: COLUMN_WIDTH * 1.4,
        width: '100%',
        position: 'relative',
        backgroundColor: '#000',
    },
    image: {
        height: '100%',
        width: '100%',
    },
    videoIndicator: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    playBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    overlay: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    badge: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 9,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        alignItems: 'center',
    },
    actionButton: {
        padding: 8,
        borderRadius: 20,
    },
});
