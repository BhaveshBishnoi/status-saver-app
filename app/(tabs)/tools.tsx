import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Alert, Linking, ScrollView } from 'react-native';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useColorScheme } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { MessageCircle, User, Scissors, HardDrive } from 'lucide-react-native';

export default function ToolsScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [dpPhone, setDpPhone] = useState('');

    const handleDirectChat = () => {
        if (!phone) {
            Alert.alert('Error', 'Please enter a phone number.');
            return;
        }
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        const url = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert('Error', 'WhatsApp is not installed on this device.');
            }
        });
    };

    const handleDownloadDP = () => {
        if (!dpPhone) {
            Alert.alert('Error', 'Please enter a phone number.');
            return;
        }
        // Note: Fetching DP directly from WhatsApp API is not officially supported without business API.
        // This is a placeholder for the UI flow.
        Alert.alert('Info', 'Fetching WhatsApp Profile Picture for ' + dpPhone);
    };

    return (
        <ScreenContainer scrollable>
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MessageCircle color={theme.primary} size={24} />
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Direct Chat</Text>
                </View>
                <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
                    Send a message without saving the contact.
                </Text>

                <TextInput
                    style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                    placeholder="Phone Number (with country code)"
                    placeholderTextColor={theme.gray}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
                <TextInput
                    style={[styles.input, styles.textArea, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                    placeholder="Message (optional)"
                    placeholderTextColor={theme.gray}
                    multiline
                    numberOfLines={3}
                    value={message}
                    onChangeText={setMessage}
                />
                <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleDirectChat}>
                    <Text style={styles.buttonText}>Open WhatsApp Chat</Text>
                </Pressable>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <User color={theme.primary} size={24} />
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>DP Downloader</Text>
                </View>
                <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
                    Download profile pictures of any WhatsApp user.
                </Text>

                <TextInput
                    style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                    placeholder="Phone Number"
                    placeholderTextColor={theme.gray}
                    keyboardType="phone-pad"
                    value={dpPhone}
                    onChangeText={setDpPhone}
                />
                <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleDownloadDP}>
                    <Text style={styles.buttonText}>Fetch DP</Text>
                </Pressable>
            </View>

            <View style={styles.toolsGrid}>
                <Pressable style={[styles.toolCard, { backgroundColor: theme.card }]}>
                    <Scissors color={theme.primary} size={28} />
                    <Text style={[styles.toolLabel, { color: theme.text }]}>Status Cleaner</Text>
                </Pressable>
                <Pressable style={[styles.toolCard, { backgroundColor: theme.card }]}>
                    <HardDrive color={theme.primary} size={28} />
                    <Text style={[styles.toolLabel, { color: theme.text }]}>Storage Manager</Text>
                </Pressable>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    section: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 10,
    },
    sectionDesc: {
        fontSize: 14,
        marginBottom: 16,
    },
    input: {
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    button: {
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    toolsGrid: {
        flexDirection: 'row',
        padding: 8,
        justifyContent: 'space-around',
    },
    toolCard: {
        width: '44%',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    toolLabel: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '600',
    },
});
