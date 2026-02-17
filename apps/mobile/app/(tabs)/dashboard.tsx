import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth-context';
import { useDashboard } from '@/hooks/use-dashboard';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { metrics, isLoading } = useDashboard();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.greeting}>Welcome back,</ThemedText>
          <ThemedText type="title" style={styles.name}>
            {user?.name}
          </ThemedText>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : metrics !== null && metrics !== undefined ? (
          <>
            <View style={styles.metricsGrid}>
              <MetricCard
                title="Total Orders"
                value={metrics.totalOrders}
                icon="list"
                color="#007AFF"
              />
              <MetricCard
                title="Total Revenue"
                value={`$${metrics.totalRevenue.toLocaleString()}`}
                icon="cash"
                color="#34C759"
              />
              <MetricCard
                title="Total Products"
                value={metrics.totalProducts}
                icon="cube"
                color="#FF9500"
              />
              <MetricCard
                title="Inventory"
                value={metrics.totalInventory}
                icon="layers"
                color="#A2845E"
              />
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle">This Month</ThemedText>
              <View style={styles.monthlyStats}>
                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ionicons name="trending-up" size={20} color="#34C759" />
                  </View>
                  <View>
                    <ThemedText style={styles.statLabel}>Orders</ThemedText>
                    <ThemedText type="defaultSemiBold">
                      {metrics.ordersThisMonth}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ionicons name="cash" size={20} color="#34C759" />
                  </View>
                  <View>
                    <ThemedText style={styles.statLabel}>Revenue</ThemedText>
                    <ThemedText type="defaultSemiBold">
                      ${metrics.revenueThisMonth.toLocaleString()}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>

            {metrics.topProducts.length > 0 && (
              <View style={styles.section}>
                <ThemedText type="subtitle">Top Products</ThemedText>
                {metrics.topProducts.slice(0, 3).map((product) => (
                  <View key={product.id} style={styles.productItem}>
                    <View>
                      <ThemedText type="defaultSemiBold">{product.name}</ThemedText>
                      <ThemedText style={styles.productSku}>{product.sku}</ThemedText>
                    </View>
                    <ThemedText style={styles.productPrice}>
                      ${product.price}
                    </ThemedText>
                  </View>
                ))}
              </View>
            )}
          </>
        ) : (
          <ThemedText style={styles.error}>Failed to load dashboard</ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  );
}

function MetricCard({
  title,
  value,
  icon,
  color,
}: {
  readonly title: string;
  readonly value: string | number;
  readonly icon: keyof typeof Ionicons.glyphMap;
  readonly color: string;
}) {
  return (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <View style={[styles.metricIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.metricContent}>
        <ThemedText style={styles.metricTitle}>{title}</ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.metricValue}>
          {value}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  greeting: {
    fontSize: 14,
    opacity: 0.7,
  },
  name: {
    fontSize: 24,
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loader: {
    marginTop: 40,
  },
  error: {
    textAlign: 'center',
    marginTop: 20,
    color: '#FF3B30',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    minWidth: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9F9FB',
    borderLeftWidth: 4,
  },
  metricIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metricContent: {
    flex: 1,
  },
  metricTitle: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  monthlyStats: {
    flexDirection: 'row',
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#F9F9FB',
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E5EA',
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productSku: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
  },
});
