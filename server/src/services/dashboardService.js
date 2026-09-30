const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

class DashboardService {
  async getDashboardStats() {
    // Counts
    const [totalProducts, totalCustomers, totalOrders] = await Promise.all([
      Product.countDocuments(),
      Customer.countDocuments(),
      Sale.countDocuments(),
    ]);

    // Total Sales Revenue (for Completed sales)
    const revenueResult = await Sale.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalSales = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Order Status Breakdown
    const statusCounts = await Sale.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const orderStatusBreakdown = [
      { name: 'Completed', value: 0, color: '#10b981' },
      { name: 'Pending', value: 0, color: '#f59e0b' },
      { name: 'Cancelled', value: 0, color: '#ef4444' },
    ];

    statusCounts.forEach((item) => {
      const match = orderStatusBreakdown.find((b) => b.name === item._id);
      if (match) match.value = item.count;
    });

    // Sales Over Time (Last 7 Days)
    const salesOverTime = await Sale.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 7 },
    ]);

    const formattedSalesOverTime = salesOverTime.map((item) => ({
      date: item._id,
      sales: item.totalSales,
      orders: item.ordersCount,
    }));

    // Sales By Product Breakdown
    const salesByProduct = await Sale.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          revenue: { $sum: '$items.subtotal' },
          quantitySold: { $sum: '$items.quantity' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    const formattedSalesByProduct = salesByProduct.map((item) => ({
      name: item._id,
      revenue: item.revenue,
      quantity: item.quantitySold,
    }));

    // Recent Sales Feed
    const recentSales = await Sale.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customer', 'name email')
      .select('orderNumber totalAmount status createdAt');

    return {
      kpis: {
        totalSales,
        totalOrders,
        totalCustomers,
        totalProducts,
      },
      orderStatusBreakdown,
      salesOverTime: formattedSalesOverTime,
      salesByProduct: formattedSalesByProduct,
      recentSales,
    };
  }
}

module.exports = new DashboardService();
