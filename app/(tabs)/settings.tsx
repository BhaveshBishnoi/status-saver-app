import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Switch, Alert, Share } from 'react-native';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useColorScheme } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { Moon, ShieldCheck, Star, Info, Share2, Trash2, HelpCircle } from 'lucide-react-native';

export default function SettingsScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const handleShareApp = async () => {
        try {
            await Share.share({
                message: 'Download Status Saver - The best app to save WhatsApp Statuses!',
            });
        } catch (error) {
            console.error(error);
        }
    };

    const clearCache = () => {
        Alert.alert('Clear Cache', 'Are you sure you want to clear app cache?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', onPress: () => Alert.alert('Success', 'Cache cleared successfully.') },
        ]);
    };

    const SettingItem = ({ icon: Icon, label, value, onPress, isSwitch }: any) => (
        <Pressable style={[styles.item, { borderBottomColor: theme.border }]} onPress={onPress}>
            <View style={styles.itemLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.card }]}>
                    <Icon color={theme.primary} size={22} />
                </View>
                <Text style={[styles.itemLabel, { color: theme.text }]}>{label}</Text>
            </View>
            {isSwitch ? (
                <Switch value={value} thumbColor={theme.primary} trackColor={{ false: theme.gray, true: theme.primary + '80' }} />
            ) : (
                <Text style={[styles.itemValue, { color: theme.textSecondary }]}>{value}</Text>
            )}
        </Pressable>
    );

    return (
        <ScreenContainer scrollable>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>General Settings</Text>
            </View>

            <SettingItem
                icon={Moon}
                label="Dark Mode"
                value={colorScheme === 'dark'}
                isSwitch
            />

            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Maintenance</Text>
            </View>

            <SettingItem
                icon={Trash2}
                label="Clear Cache"
                onPress={clearCache}
            />

            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>App</Text>
            </View>

            <SettingItem
                icon={Star}
                label="Rate App"
                onPress={() => Alert.alert('Rate App', 'Redirecting to Play Store...')}
            />

            <SettingItem
                icon={Share2}
                label="Share App"
                onPress={handleShareApp}
            />

            <SettingItem
                icon={ShieldCheck}
                label="Privacy Policy"
                onPress={() => Alert.alert('Privacy Policy', 'Opening Privacy Policy...')}
            />

            <SettingItem
                icon={HelpCircle}
                label="Help & Support"
                onPress={() => Alert.alert('Support', 'Contacting support...')}
            />

            <SettingItem
                icon={Info}
                label="App Version"
                value="1.0.0"
                onPress={() => { }}
            />

            <View style={styles.footer}>
                <Text style={[styles.footerText, { color: theme.textSecondary }]}>Made with ❤️ for WhatsApp Users</Text>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 8,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    itemLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    itemValue: {
        fontSize: 14,
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
        paddingBottom: 40,
    },
    footerText: {
        fontSize: 12,
    },
});
