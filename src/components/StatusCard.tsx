import React from 'react';
import { StyleSheet, View, Pressable, Dimensions, useColorScheme } from 'react-native';
import { Image } from 'expo-image';
import { Play, Download, Share2 } from 'lucide-react-native';
import { Colors } from '../../src/constants/Colors';
import { StatusFile } from '../../src/services/statusService';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

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
        <View style={[styles.container, { backgroundColor: theme.card }]}>
            <Pressable onPress={onPress} style={styles.imageContainer}>
                <Image
                    source={{ uri: status.uri }}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                />
                {status.type === 'video' && (
                    <View style={styles.playIcon}>
                        <Play color="white" size={24} fill="white" />
                    </View>
                )}
            </Pressable>

            <View style={styles.actions}>
                <Pressable onPress={onDownload} style={styles.actionButton}>
                    <Download color={theme.primary} size={20} />
                </Pressable>
                <Pressable onPress={onShare} style={styles.actionButton}>
                    <Share2 color={theme.primary} size={20} />
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: COLUMN_WIDTH,
        margin: 8,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageContainer: {
        height: COLUMN_WIDTH * 1.3,
        width: '100%',
        position: 'relative',
    },
    image: {
        height: '100%',
        width: '100%',
    },
    playIcon: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 8,
    },
    actionButton: {
        padding: 4,
    },
});
