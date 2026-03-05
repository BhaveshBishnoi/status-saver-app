import React from 'react';
import { StyleSheet, View, Text, Pressable, Switch, Alert, ScrollView } from 'react-native';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useColorScheme } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { Shield, Bell, Trash2, HelpCircle, Info, Star, Share2, Globe, Heart } from 'lucide-react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const SettingItem = ({ icon: Icon, title, desc, value, onToggle }: any) => (
    <Pressable style={[styles.settingItem, { borderColor: theme.border }]}>
      <View style={[styles.iconBox, { backgroundColor: theme.primary + '15' }]}>
        <Icon color={theme.primary} size={22} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
        {desc && <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>{desc}</Text>}
      </View>
      {onToggle !== undefined ? (
        <Switch 
          value={value} 
          onValueChange={onToggle}
          trackColor={{ false: theme.gray + '40', true: theme.primary + '80' }}
          thumbColor={value ? theme.primary : theme.gray}
        />
      ) : (
        <View style={styles.arrowIcon} />
      )}
    </Pressable>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={[styles.sectionHeader, { color: theme.primary }]}>{title}</Text>
  );

  return (
    <ScreenContainer scrollable noPadding>
      <ScrollView contentContainerStyle={styles.container}>
        <SectionHeader title="PREFERENCES" />
        <SettingItem 
          icon={Bell} 
          title="Status Notifications" 
          desc="Get notified when new statuses are available"
          value={true}
          onToggle={() => {}}
        />
        <SettingItem 
          icon={Shield} 
          title="Privacy Lock" 
          desc="Secure your saved statuses with a passcode"
          value={false}
          onToggle={() => {}}
        />
        <SettingItem 
          icon={Globe} 
          title="Download Quality" 
          desc="High (Original)"
        />

        <SectionHeader title="STORAGE & DATA" />
        <SettingItem 
          icon={Trash2} 
          title="Auto-Clean Expired" 
          desc="Automatically delete statuses after 24 hours"
          value={true}
          onToggle={() => {}}
        />
        <SettingItem 
          icon={Heart} 
          title="Clear Saved Statuses" 
        />

        <SectionHeader title="SUPPORT & ABOUT" />
        <SettingItem 
          icon={Star} 
          title="Rate & Review" 
        />
        <SettingItem 
          icon={Share2} 
          title="Share Application" 
        />
        <SettingItem 
          icon={HelpCircle} 
          title="Help & FAQ" 
        />
        <SettingItem 
          icon={Info} 
          title="Version Information" 
          desc="1.0.0 (Production Build)"
        />
        
        <View style={styles.footer}>
           <Text style={[styles.footerText, { color: theme.textSecondary }]}>Status Saver App</Text>
           <Text style={[styles.footerSubText, { color: theme.textSecondary }]}>Made with ❤️ for WhatsApp Users</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 12,
    letterSpacing: 1.2,
    paddingHorizontal: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingDesc: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  arrowIcon: {
    // Custom arrow implementation if needed
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '700',
  },
  footerSubText: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.6,
  },
});
