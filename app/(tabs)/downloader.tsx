import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useColorScheme } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { Link2, Download } from 'lucide-react-native';

export default function DownloaderScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDownload = () => {
        if (!url) {
            Alert.alert('Error', 'Please paste a status link.');
            return;
        }
        setLoading(true);
        // Placeholder for actual link detection logic
        setTimeout(() => {
            setLoading(false);
            Alert.alert('Info', 'Detecting media from link...');
        }, 1500);
    };

    return (
        <ScreenContainer style={styles.container}>
            <View style={styles.iconContainer}>
                <Link2 color={theme.primary} size={64} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Link Downloader</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Paste the link of the WhatsApp status you want to download.
            </Text>

            <TextInput
                style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                placeholder="Paste Status Link here..."
                placeholderTextColor={theme.gray}
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
            />

            <Pressable
                style={[styles.button, { backgroundColor: theme.primary }, loading && { opacity: 0.7 }]}
                onPress={handleDownload}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <>
                        <Download color="white" size={20} />
                        <Text style={styles.buttonText}>Download Media</Text>
                    </>
                )}
            </Pressable>

            <View style={[styles.infoBox, { backgroundColor: theme.card }]}>
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                    Supports image and video status links from various WhatsApp mods and web versions.
                </Text>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    input: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 20,
        borderWidth: 1,
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 10,
    },
    infoBox: {
        marginTop: 40,
        padding: 16,
        borderRadius: 12,
        width: '100%',
    },
    infoText: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
});
