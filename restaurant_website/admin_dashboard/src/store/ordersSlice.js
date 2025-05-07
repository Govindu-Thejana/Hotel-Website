import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allOrders: [],
  notifications: JSON.parse(localStorage.getItem('notifications')) || [],
  overviewData: {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    scheduledOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalItems: 0,
    recentOrders: [],
    filterStatus: 'All',
  },
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      const { orders, totalItems } = action.payload;
      state.allOrders = orders;
      state.overviewData = calculateOverviewData(orders, state.overviewData.filterStatus, totalItems);
    },
    setFilterStatus: (state, action) => {
      state.overviewData.filterStatus = action.payload;
      state.overviewData.recentOrders = updateRecentOrders(state.allOrders, action.payload);
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now().toString(),
        message: action.payload.message,
        type: action.payload.type,
        timestamp: new Date().toISOString(),
      };
      state.notifications = [notification, ...state.notifications];
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },
    websocketOrderUpdate: (state, action) => {
      const { operation, order, orderId } = action.payload;
      if (operation === 'insert' || operation === 'update') {
        if (!order?._id || !order?.status) {
          console.error('Invalid order data:', action.payload);
          state.notifications = [
            {
              id: Date.now().toString(),
              message: 'Received invalid order data',
              type: 'error',
              timestamp: new Date().toISOString(),
            },
            ...state.notifications,
          ];
          localStorage.setItem('notifications', JSON.stringify(state.notifications));
          return;
        }
      }
      let newOrders = [...state.allOrders];

      const itemDetails = order.items?.map(
        (item) => `${item.name} (x${item.quantity})`
      ).join(", ") || "No items";

      switch (operation) {
        case 'insert':
          newOrders = [order, ...newOrders];
          state.notifications = [
            {
              id: Date.now().toString(),
              message: `New order received ${order._id || 'Unknown'} from ${order.name || 'Unknown'} : items - ${itemDetails}`,
              type: 'success',
              timestamp: new Date().toISOString(),
            },
            ...state.notifications,
          ];
          break;
        case 'update':
          const index = newOrders.findIndex((o) => o._id === order._id);
          if (index >= 0) {
            newOrders[index] = order;
            state.notifications = [
              {
                id: Date.now().toString(),
                message: `Order ${order._id.slice(-6)} updated to status: ${order.status}`,
                type: 'info',
                timestamp: new Date().toISOString(),
              },
              ...state.notifications,
            ];
          }
          break;
        case 'delete':
          newOrders = newOrders.filter((o) => o._id !== orderId);
          state.notifications = [
            {
              id: Date.now().toString(),
              message: `Order ${orderId.slice(-6)} was deleted`,
              type: 'warn',
              timestamp: new Date().toISOString(),
            },
            ...state.notifications,
          ];
          break;
        default:
          return;
      }

      state.allOrders = newOrders;
      state.overviewData = calculateOverviewData(newOrders, state.overviewData.filterStatus, state.overviewData.totalItems);
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },
  },
});

const calculateOverviewData = (orders, filterStatus, totalItems) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => order.status === 'Pending').length;
  const completedOrders = orders.filter((order) => order.status === 'Delivered').length;
  const scheduledOrders = orders.filter((order) => order.orderType === 'Scheduled').length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const recentOrders = updateRecentOrders(orders, filterStatus);

  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    scheduledOrders,
    totalRevenue,
    averageOrderValue,
    recentOrders,
    filterStatus: filterStatus || 'All',
    totalItems: totalItems || 0,
  };
};

const updateRecentOrders = (orders, status) => {
  let filteredOrders = orders;
  if (status !== 'All') {
    filteredOrders = orders.filter((order) => order.status === status);
  }
  return filteredOrders.slice();
};

export const { setOrders, setFilterStatus, addNotification, removeNotification, websocketOrderUpdate } = ordersSlice.actions;
export default ordersSlice.reducer;