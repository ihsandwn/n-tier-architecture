# Mobile App Implementation Guide

## ✅ What's Been Implemented

### 1. **Authentication System**
- ✅ AuthContext with login/signup
- ✅ Secure token storage (expo-secure-store)
- ✅ Local user data persistence (AsyncStorage)
- ✅ Auto login on app launch
- ✅ Login and Signup screens

### 2. **API Integration**
- ✅ Axios configured with interceptors
- ✅ Error handling
- ✅ Environment-based API URL configuration
- ✅ Token-based authentication

### 3. **Navigation**
- ✅ Auth stack (login/signup)
- ✅ App stack with tab navigation
- ✅ Protected routes (auto redirects to login if not authenticated)

### 4. **Data Fetching Hooks**
- ✅ useProducts - Fetch product list
- ✅ useProduct - Fetch single product
- ✅ useOrders - Fetch orders with status filtering
- ✅ useOrder - Fetch single order
- ✅ useInventory - Fetch inventory levels
- ✅ useWarehouses - Fetch warehouse list
- ✅ useWarehouse - Fetch single warehouse
- ✅ useDashboard - Fetch analytics metrics

### 5. **Feature Screens**
- ✅ Dashboard - Displays key metrics and statistics
- ✅ Products - Product list with search and filters
- ✅ Orders - Orders list with status tracking
- ✅ More - Profile, settings, and about pages

---

## 📦 New Dependencies Added

```json
{
  "@react-native-async-storage/async-storage": "^1.23.1",
  "axios": "^1.6.0",
  "expo-secure-store": "~14.0.1",
  "jwt-decode": "^4.0.0"
}
```

Install these dependencies:
```bash
cd apps/mobile
npm install
```

---

## 🚀 Getting Started

### 1. Start the Mobile App

```bash
cd apps/mobile
npm run dev
# or
expo start --port 8083
```

### 2. Test Login
Use demo credentials:
- Email: `demo@example.com`
- Password: `password123`

Or create a new account from the signup screen.

### 3. Available API Endpoints

The app will connect to these endpoints on your API server:

| Feature | Endpoint | Method |
|---------|----------|--------|
| **Login** | `/auth/login` | POST |
| **Signup** | `/auth/signup` | POST |
| **Products** | `/products` | GET |
| **Orders** | `/orders` | GET |
| **Create Order** | `/orders` | POST |
| **Inventory** | `/inventory` | GET |
| **Warehouses** | `/warehouses` | GET |
| **Dashboard** | `/analytics/dashboard` | GET |

---

## 🔧 Configuration

### API Base URL

Set via environment variable in `apps/mobile/.env`:
```env
EXPO_PUBLIC_API_URL=http://your-api-url:3000/api/v1
```

Default is: `http://localhost:3000/api/v1`

---

## 📱 Screen Details

### Dashboard
- **Metrics Cards**: Total orders, revenue, products, inventory
- **Monthly Stats**: Orders and revenue this month
- **Top Products**: Best performing products
- **Quick Logout**: Button to logout from profile

### Products
- **Product List**: Grid view with 2 columns
- **Product Card**: Shows name, SKU, price, and stock
- **Add Button**: Ready for "Create Product" feature
- **Real Data**: Fetches from `/products` endpoint

### Orders
- **Order List**: Chronological order with status
- **Status Badges**: Color-coded by order status
- **Order Info**: Number of items and total amount
- **Create Button**: Ready for "Create Order" feature

### Profile (More)
- **User Info**: Displays name, email, and roles
- **Settings Menu**: Account, Notifications, Privacy
- **About Section**: App version and links
- **Logout**: Secure logout with confirmation

---

## 🔐 Authentication Flow

```
┌─────────────────┐
│  Launch App     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Check Token    │
│  (SecureStore)  │
└────────┬────────┘
         │
    ┌────┴─────┐
    │           │
 Valid       Invalid
    │           │
    ▼           ▼
┌────────┐  ┌──────────┐
│  App   │  │ Auth     │
│ Stack  │  │ Stack    │
└────────┘  │ (Login)  │
            └──────────┘
                 │
                 ▼
            ┌──────────┐
            │ Dashboard│
            │ (on auth)│
            └──────────┘
```

---

## 📊 Data Flow Example

```
User Input (Email/Password)
         │
         ▼
Login Screen Component
         │
         ▼
useAuth().login()
         │
         ▼
API POST /auth/login
         │
         ▼
tokenStorage.saveToken()
tokenStorage.saveUser()
         │
         ▼
AuthContext Updated
         │
         ▼
Navigation Switches to App Stack
         │
         ▼
Dashboard Loaded
```

---

## 🎯 Next Steps

### High Priority
1. [ ] **Inventory Screen** - Stock levels and warehouses
2. [ ] **Shipments Tracking** - Real-time tracking
3. [ ] **Notifications Integration** - Connect Socket.io notifications
4. [ ] **Error Handling** - Better error UI and recovery

### Medium Priority
5. [ ] **Product Details** - Detailed product view
6. [ ] **Order Details** - Full order information
7. [ ] **Create Order** - Order creation flow
8. [ ] **Offline Support** - Cache data locally

### Low Priority
9. [ ] **Analytics** - Chart and graph displays
10. [ ] **Reporting** - Export reports
11. [ ] **Multi-tenancy** - Tenant switching
12. [ ] **Image Upload** - Product images

---

## 🐛 Troubleshooting

### App Won't Start
```bash
# Clear cache and rebuild
npm run reset-project
npm install
expo start --clear
```

### API Connection Issues
1. Check API URL in `.env` file
2. Ensure API server is running: `npm run dev` in apps/api
3. Check Network tab in debugger
4. Verify CORS settings on API

### Token Issues
```bash
# Clear all stored tokens
adb shell rm -r /data/data/package.name/shared_prefs/
# or for iOS
xcrun simctl erase all
```

### Login Always Redirects to Auth
- Check token is being saved correctly in SecureStore
- Verify JWT token decode is working
- Check token expiration time

---

## 📚 Architecture

```
apps/mobile/
├── app/
│   ├── auth/
│   │   ├── login.tsx      (Login screen)
│   │   └── signup.tsx     (Signup screen)
│   ├── (tabs)/
│   │   ├── _layout.tsx    (Tab navigation)
│   │   ├── dashboard.tsx  (Home/Dashboard)
│   │   ├── products.tsx   (Products list)
│   │   ├── orders.tsx     (Orders list)
│   │   └── more.tsx       (Profile menu)
│   └── _layout.tsx        (Root navigation)
├── context/
│   ├── auth-context.tsx   (Auth state management)
│   └── notification-context.tsx
├── hooks/
│   ├── use-products.ts    (Product data model)
│   ├── use-orders.ts      (Orders data model)
│   ├── use-inventory.ts   (Inventory data model)
│   └── use-dashboard.ts   (Analytics data model)
├── lib/
│   ├── api.ts             (Axios instance)
│   ├── token-storage.ts   (Secure storage)
│   └── types.ts           (TypeScript types)
└── components/            (Reusable UI components)
```

---

## 📖 Dependencies Used

| Package | Purpose |
|---------|---------|
| `expo-router` | File-based navigation |
| `@react-navigation` | Navigation stacks |
| `axios` | HTTP client |
| `swr` | Data fetching with caching |
| `jwt-decode` | Parse JWT tokens |
| `expo-secure-store` | Secure token storage |
| `@react-native-async-storage/async-storage` | Local storage |
| `react-native-toast-message` | Toast notifications |
| `socket.io-client` | WebSocket notifications |

---

## ✨ Features Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Authentication | ✅ Complete | Login/Signup with secure storage |
| Dashboard | ✅ Complete | Shows key metrics |
| Products | ✅ Complete | List and detail views ready |
| Orders | ✅ Complete | List with status tracking |
| Inventory | ⚠️ Hook Only | Screen coming soon |
| Shipments | ⚠️ Hook Only | Screen coming soon |
| Notifications | ⚠️ Partial | Socket.io connected, needs auth |
| User Profile | ✅ Complete | Settings and about pages |
| Error Handling | ✅ Basic | Toast notifications added |

---

## 🤝 Contributing

When adding new features:
1. Create a hook in `hooks/` for data fetching
2. Add types in `lib/types.ts`
3. Create screen in `app/(tabs)/` or `app/auth/`
4. Use existing components from `components/`
5. Add error handling and loading states
6. Test with mock data first

---

## 📞 Support

For issues or questions:
1. Check API logs: `docker logs api`
2. Check mobile logs: `expo --inspect`
3. Verify network requests in DevTools
4. Check token validity in SecureStore

