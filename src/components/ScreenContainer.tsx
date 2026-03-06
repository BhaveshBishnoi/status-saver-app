import React from 'react';
import { StyleSheet, View, SafeAreaView, useColorScheme, ViewStyle, ScrollView, StatusBar } from 'react-native';
import { Colors } from '../constants/Colors';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
    scrollable?: boolean;
    noPadding?: boolean;
}

const ScreenContainerContent: React.FC<ScreenContainerProps> = ({
    children,
    style,
    scrollable = false,
    noPadding = false
}) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const insets = useSafeAreaInsets();

    const Container = scrollable ? ScrollView : View;

    const containerStyle = [styles.flex, !scrollable && style];
    const contentStyle = scrollable
        ? [styles.contentContainer, noPadding && { padding: 0 }, style]
        : undefined;

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: theme.background,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }
        ]}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
            <Container
                style={containerStyle}
                contentContainerStyle={contentStyle}
            >
                {children}
            </Container>
        </View>
    );
};

export const ScreenContainer: React.FC<ScreenContainerProps> = (props) => (
    <SafeAreaProvider>
        <ScreenContainerContent {...props} />
    </SafeAreaProvider>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
});
