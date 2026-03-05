import React from 'react';
import { StyleSheet, View, Pressable, Modal, useColorScheme, Dimensions, Text } from 'react-native';
import { Image } from 'expo-image';
import { X, Download, Share2 } from 'lucide-react-native';
import { Colors } from '../../src/constants/Colors';
import { StatusFile } from '../../src/services/statusService';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface StatusPreviewProps {
    status: StatusFile | null;
    visible: boolean;
    onClose: () => void;
    onDownload: () => void;
    onShare: () => void;
}

export const StatusPreview: React.FC<StatusPreviewProps> = ({ status, visible, onClose, onDownload, onShare }) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const insets = useSafeAreaInsets();

    const player = useVideoPlayer(status?.uri || '', (player) => {
        player.loop = true;
        player.play();
    });

    if (!status) return null;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <X color="white" size={28} />
                    </Pressable>
                    <View style={styles.headerActions}>
                        <Pressable onPress={onDownload} style={styles.headerActionButton}>
                            <Download color="white" size={24} />
                        </Pressable>
                        <Pressable onPress={onShare} style={styles.headerActionButton}>
                            <Share2 color="white" size={24} />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.content}>
                    {status.type === 'video' ? (
                        <VideoView
                            player={player}
                            style={styles.fullMedia}
                            contentFit="contain"
                        />
                    ) : (
                        <Image
                            source={{ uri: status.uri }}
                            style={styles.fullMedia}
                            contentFit="contain"
                        />
                    )}
                </View>

                <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                    <Text style={styles.statusName}>{status.name}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    closeButton: {
        padding: 8,
    },
    headerActions: {
        flexDirection: 'row',
    },
    headerActionButton: {
        padding: 8,
        marginLeft: 15,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullMedia: {
        width: width,
        height: height,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 12,
    },
    statusName: {
        color: 'white',
        fontSize: 12,
        opacity: 0.7,
    }
});
