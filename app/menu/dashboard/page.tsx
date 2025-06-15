"use client"

import { BarChart3 } from "lucide-react";

const FormPage = () => {
  return (
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            {[
              { title: 'Total Revenue', value: '฿124,500', change: '+12%', color: 'text-green-600' },
              { title: 'Active Users', value: '2,547', change: '+5%', color: 'text-blue-600' },
              { title: 'Orders', value: '1,234', change: '-2%', color: 'text-red-600' },
              { title: 'Products', value: '567', change: '+8%', color: 'text-purple-600' }
            ].map((stat, index) => (
              <div key={index} className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1 md:mb-2 truncate">{stat.title}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-lg md:text-2xl font-bold text-gray-900">{stat.value}</span>
                  <span className={`text-xs md:text-sm font-medium ${stat.color} mt-1 sm:mt-0`}>{stat.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Chart Section */}
            <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h2>
              <div className="h-48 md:h-64 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 size={36} className="text-blue-500 mx-auto mb-2" />
                  <p className="text-sm md:text-base text-gray-600">Chart Component</p>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-3 md:space-y-4">
                {[
                  { action: 'New user registered', time: '2 minutes ago', type: 'user' },
                  { action: 'Order #1234 completed', time: '1 hour ago', type: 'order' },
                  { action: 'Database backup completed', time: '3 hours ago', type: 'system' },
                  { action: 'New message received', time: '5 hours ago', type: 'message' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      activity.type === 'user' ? 'bg-green-500' :
                      activity.type === 'order' ? 'bg-blue-500' :
                      activity.type === 'system' ? 'bg-yellow-500' : 'bg-purple-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b border-gray-200">
              <h2 className="text-base md:text-lg font-semibold text-gray-800">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Product</th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { id: '#1234', customer: 'สมชาย ใจดี', product: 'Product A', amount: '฿1,500', status: 'completed' },
                    { id: '#1235', customer: 'สมหญิง สวยงาม', product: 'Product B', amount: '฿2,300', status: 'pending' },
                    { id: '#1236', customer: 'สมศรี มีสุข', product: 'Product C', amount: '฿800', status: 'processing' },
                    { id: '#1237', customer: 'สมพร รวยเงิน', product: 'Product D', amount: '฿3,200', status: 'completed' }
                  ].map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                        <div className="truncate max-w-32 md:max-w-none">{order.customer}</div>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900 hidden sm:table-cell">{order.product}</td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{order.amount}</td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
  )
};

export default FormPage;
