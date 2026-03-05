import React from 'react';
import { StyleSheet, View, Pressable, Modal, useColorScheme, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { X, Download, Share2 } from 'lucide-react-native';
import { Colors } from '../../src/constants/Colors';
import { StatusFile } from '../../src/services/statusService';
import { VideoView, useVideoPlayer } from 'expo-video';

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

    const player = useVideoPlayer(status?.uri || '', (player) => {
        player.loop = true;
        player.play();
    });

    if (!status) return null;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.header}>
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
        padding: 20,
        paddingTop: 50,
        zIndex: 10,
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
        height: height * 0.8,
    },
});
