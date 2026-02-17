import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useOrders } from '@/hooks/use-orders';
import { Ionicons } from '@expo/vector-icons';

const StatusColors: Record<string, string> = {
  PENDING: '#FF9500',
  CONFIRMED: '#007AFF',
  SHIPPED: '#5856D6',
  DELIVERED: '#34C759',
  CANCELLED: '#FF3B30',
};

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const { orders, isLoading, error } = useOrders();

  const renderOrder = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <ThemedText type="defaultSemiBold">{item.orderNumber}</ThemedText>
          <ThemedText style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </ThemedText>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: StatusColors[item.status] + '20' },
          ]}
        >
          <ThemedText
            style={[styles.statusText, { color: StatusColors[item.status] }]}
          >
            {item.status}
          </ThemedText>
        </View>
      </View>
      <View style={styles.orderDetails}>
        <View>
          <ThemedText style={styles.detailLabel}>Items</ThemedText>
          <ThemedText style={styles.detailValue}>{item.items.length}</ThemedText>
        </View>
        <View style={styles.divider} />
        <View>
          <ThemedText style={styles.detailLabel}>Total</ThemedText>
          <ThemedText style={styles.detailValue}>
            ${item.totalAmount.toLocaleString()}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title">Orders</ThemedText>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : error !== undefined && error !== null ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF3B30" />
          <ThemedText style={styles.errorText}>Failed to load orders</ThemedText>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="list-outline" size={48} color="#999" />
              <ThemedText style={styles.emptyText}>No orders found</ThemedText>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  loader: {
    marginTop: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 12,
    color: '#FF3B30',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  emptyText: {
    marginTop: 12,
    opacity: 0.6,
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#F9F9FB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  detailLabel: {
    fontSize: 11,
    opacity: 0.6,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 12,
  },
});
