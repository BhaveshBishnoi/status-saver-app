import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { Download, HardDriveDownload, History, Settings, Wrench } from 'lucide-react-native';

export default function TabLayout() {
    const colorScheme = useColorScheme() || 'light';
    const theme = Colors[colorScheme];

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.gray,
                tabBarStyle: {
                    backgroundColor: theme.background,
                    borderTopColor: theme.border,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                headerStyle: {
                    backgroundColor: theme.secondary,
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Statuses',
                    tabBarIcon: ({ color, size }) => <HardDriveDownload color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="saved"
                options={{
                    title: 'Saved',
                    tabBarIcon: ({ color, size }) => <History color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="downloader"
                options={{
                    title: 'Downloader',
                    tabBarIcon: ({ color, size }) => <Download color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="tools"
                options={{
                    title: 'Tools',
                    tabBarIcon: ({ color, size }) => <Wrench color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}
