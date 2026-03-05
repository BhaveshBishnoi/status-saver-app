import { StyleSheet, View, Text, TextInput, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Linking } from 'react-native';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useColorScheme } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { MessageCircle, User, Scissors, HardDrive, Send, Download, ExternalLink } from 'lucide-react-native';

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

        Linking.canOpenURL(url).then((supported: boolean) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert('Error', 'WhatsApp is not installed on this device.');
            }
        }).catch(() => {
            Alert.alert('Error', 'Could not open WhatsApp.');
        });
    };

    const handleDownloadDP = () => {
        if (!dpPhone) {
            Alert.alert('Error', 'Please enter a phone number.');
            return;
        }
        Alert.alert('Info', 'Fetching WhatsApp Profile Picture for ' + dpPhone + '. Note: This feature requires external API access.');
    };

    const ToolCard = ({ icon: Icon, title, desc, children }: any) => (
        <View style={[styles.toolCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.toolHeader}>
                <View style={[styles.iconBox, { backgroundColor: theme.primary + '20' }]}>
                    <Icon color={theme.primary} size={24} />
                </View>
                <Text style={[styles.toolTitle, { color: theme.text }]}>{title}</Text>
            </View>
            <Text style={[styles.toolDesc, { color: theme.textSecondary }]}>{desc}</Text>
            {children}
        </View>
    );

    return (
        <ScreenContainer scrollable noPadding>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <View style={styles.content}>
                    <ToolCard
                        icon={MessageCircle}
                        title="Direct Chat"
                        desc="Send messages to any number without saving it in your contacts."
                    >
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                            placeholder="e.g. +91 9876543210"
                            placeholderTextColor={theme.gray}
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                            placeholder="Message (optional)"
                            placeholderTextColor={theme.gray}
                            multiline
                            value={message}
                            onChangeText={setMessage}
                        />
                        <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleDirectChat}>
                            <Send color="white" size={18} style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>Open in WhatsApp</Text>
                        </Pressable>
                    </ToolCard>

                    <ToolCard
                        icon={User}
                        title="DP Downloader"
                        desc="Download high-quality profile pictures by phone number."
                    >
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                            placeholder="Phone Number"
                            placeholderTextColor={theme.gray}
                            keyboardType="phone-pad"
                            value={dpPhone}
                            onChangeText={setDpPhone}
                        />
                        <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleDownloadDP}>
                            <Download color="white" size={18} style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>Fetch & Download</Text>
                        </Pressable>
                    </ToolCard>

                    <View style={styles.minorTools}>
                        <Pressable style={[styles.miniCard, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => Alert.alert('Status Cleaner', 'Scanning for redundant status files...')}>
                            <Scissors color={theme.primary} size={22} />
                            <Text style={[styles.miniLabel, { color: theme.text }]}>Status Cleaner</Text>
                        </Pressable>
                        <Pressable style={[styles.miniCard, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => Alert.alert('Storage', 'Analyzing WhatsApp media storage...')}>
                            <HardDrive color={theme.primary} size={22} />
                            <Text style={[styles.miniLabel, { color: theme.text }]}>Storage Manager</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 16,
    },
    toolCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    toolHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    toolTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    toolDesc: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 20,
    },
    input: {
        height: 52,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        fontSize: 15,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    button: {
        height: 52,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    minorTools: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 40,
    },
    miniCard: {
        width: '48%',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    miniLabel: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
    },
});
