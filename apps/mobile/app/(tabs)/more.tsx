import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth-context';
import { Ionicons } from '@expo/vector-icons';

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel' },
      {
        text: 'Logout',
        onPress: () => {
          logout().catch(console.error);
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title">Profile</ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#007AFF" />
          </View>
          <View style={styles.userInfo}>
            <ThemedText type="defaultSemiBold" style={styles.userName}>
              {user?.name}
            </ThemedText>
            <ThemedText style={styles.userEmail}>{user?.email}</ThemedText>
            {user?.roles && (
              <View style={styles.rolesBadges}>
                {user.roles.map((role) => (
                  <View key={role} style={styles.roleBadge}>
                    <ThemedText style={styles.roleText}>{role}</ThemedText>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Settings
          </ThemedText>

          <MenuItem
            icon="settings-outline"
            title="Account Settings"
            subtitle="Manage your account"
            onPress={() => Alert.alert('Coming Soon', 'Account settings feature coming soon')}
          />

          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Notification preferences"
            onPress={() => Alert.alert('Coming Soon', 'Notifications settings coming soon')}
          />

          <MenuItem
            icon="lock-closed-outline"
            title="Privacy & Security"
            subtitle="Secure your account"
            onPress={() => Alert.alert('Coming Soon', 'Privacy settings coming soon')}
          />
        </View>

        {/* About */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            About
          </ThemedText>

          <MenuItem
            icon="information-circle-outline"
            title="About App"
            subtitle="Version 1.0.0"
            onPress={() => Alert.alert('About', 'OmniLogistics v1.0.0\n\nEnterprise Resource Planning System')}
          />

          <MenuItem
            icon="document-text-outline"
            title="Terms & Conditions"
            subtitle="Read our terms"
            onPress={() => Alert.alert('Coming Soon', 'Terms & conditions document coming soon')}
          />

          <MenuItem
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            subtitle="Read our policy"
            onPress={() => Alert.alert('Coming Soon', 'Privacy policy document coming soon')}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
}: {
  readonly icon: keyof typeof Ionicons.glyphMap;
  readonly title: string;
  readonly subtitle: string;
  readonly onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={20} color="#007AFF" />
      </View>
      <View style={styles.menuContent}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <ThemedText style={styles.menuSubtitle}>{subtitle}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9FB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E9F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
  },
  userEmail: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 4,
  },
  rolesBadges: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 6,
  },
  roleBadge: {
    backgroundColor: '#007AFF20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  roleText: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.7,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#F9F9FB',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E5E9F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuSubtitle: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
