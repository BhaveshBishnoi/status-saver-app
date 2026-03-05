import React from 'react';
import { StyleSheet, View, SafeAreaView, useColorScheme, ViewStyle, ScrollView } from 'react-native';
import { Colors } from '../constants/Colors';

interface ScreenContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
    scrollable?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, style, scrollable = false }) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const Container = scrollable ? ScrollView : View;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <Container style={[styles.container, style]} contentContainerStyle={scrollable ? styles.contentContainer : undefined}>
                {children}
            </Container>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 20,
    },
});
