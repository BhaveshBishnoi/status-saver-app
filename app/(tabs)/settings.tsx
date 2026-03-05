import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useColorScheme } from 'react-native';
import { Colors } from '../../src/constants/Colors';

export default function SettingsScreen() {
    const colorScheme = useColorScheme() || 'light';
    const theme = Colors[colorScheme];

    return (
        <ScreenContainer style={styles.container}>
            <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Configure your app preferences</Text>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
    },
});
