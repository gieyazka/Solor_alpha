import React from 'react';
import { ChevronDown, Zap, GraduationCap, MapPin, Building, Battery } from 'lucide-react';

interface StatCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor?: string;
}

interface CircularProgressProps {
  current: number;
  total: number;
  label: string;
  size?: 'sm' | 'md';
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon, bgColor, textColor = 'text-white' }) => (
  <div className={`${bgColor} ${textColor} p-4 rounded-xl shadow-lg`}>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm opacity-90">{label}</div>
      </div>
      <div className="text-3xl opacity-80">
        {icon}
      </div>
    </div>
  </div>
);

const CircularProgress: React.FC<CircularProgressProps> = ({ current, total, label, size = 'md' }) => {
  const percentage = (current / total) * 100;
  const radius = size === 'sm' ? 30 : 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow-lg">
      <div className="relative">
        <svg width={size === 'sm' ? 80 : 100} height={size === 'sm' ? 80 : 100} className="transform -rotate-90">
          <circle
            cx={size === 'sm' ? 40 : 50}
            cy={size === 'sm' ? 40 : 50}
            r={radius}
            stroke="#f3f4f6"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx={size === 'sm' ? 40 : 50}
            cy={size === 'sm' ? 40 : 50}
            r={radius}
            stroke="#10b981"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-green-600">{current}</span>
          <span className="text-xs text-gray-500">{total}</span>
        </div>
      </div>
      <div className="text-xs text-center text-gray-600 mt-2 max-w-20">{label}</div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {['ค้นหาโดยระบบ', 'เรื่องภายใน', 'เรื่องจังหวัด', 'เรื่องสำคัญ', 'เรื่องมาใหม่', 'เรื่องภายนอก', 'เรื่องการดำเนินการ'].map((item, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                index === 0 ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border'
              }`}
            >
              {item}
              <ChevronDown size={12} />
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          value="159"
          label="ปริมาณการจัดส่ง (MW)"
          icon={<Zap />}
          bgColor="bg-purple-600"
        />
        <StatCard
          value="1,160"
          label="จำนวนโรงเรียน"
          icon={<GraduationCap />}
          bgColor="bg-green-500"
        />
        <StatCard
          value="54"
          label="จำนวนจังหวัด"
          icon={<MapPin />}
          bgColor="bg-orange-500"
        />
        <StatCard
          value="12"
          label="จำนวนสำคัญ"
          icon={<Building />}
          bgColor="bg-green-600"
        />
        <StatCard
          value="8"
          label="จำนวนของไฟฟ้า"
          icon={<Battery />}
          bgColor="bg-cyan-500"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1">
          {/* Secondary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-lg text-center">
              <div className="text-green-500 text-2xl mb-1">✓</div>
              <div className="text-2xl font-bold">1,160</div>
              <div className="text-sm text-gray-600">โรงเรียน สมอ</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg text-center">
              <div className="text-red-500 text-2xl mb-1">✗</div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-gray-600">โรงเรียน ไม่สมอ</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg text-center">
              <div className="text-blue-500 text-2xl mb-1">📊</div>
              <div className="text-2xl font-bold">180</div>
              <div className="text-sm text-gray-600">ติดตามเอกสารกิจกรรมต่าง</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg text-center">
              <div className="text-yellow-500 text-2xl mb-1">👥</div>
              <div className="text-2xl font-bold">20</div>
              <div className="text-sm text-gray-600">รองสมาชิกสัญญา</div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-orange-400 text-4xl mb-2">📈</div>
              <div className="text-3xl font-bold mb-2">250</div>
              <div className="text-sm text-gray-600">โครงการส่วนรวมโครงการส่วนสำคัญชาวบ้าน</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-green-400 text-4xl mb-2">💰</div>
              <div className="text-3xl font-bold mb-2">200</div>
              <div className="text-sm text-gray-600">ตอบรับของส่วนรวมโครงการส่วนสำคัญชาวบ้าน</div>
            </div>
          </div>

          {/* Circular Progress Charts */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'ส่วนผู้ส่วนรวมส่วน', current: 589, total: 1160 },
              { label: 'ตอบรับสิทธิ์ส่วนรวมส่วน', current: 589, total: 1160 },
              { label: 'ปีกสบาย/ช่วงเวลา', current: 589, total: 1160 },
              { label: 'จัดซื้อสำเนาโครงการ', current: 589, total: 1160 },
              { label: 'ปีกสบายสำเนาโครงการ', current: 589, total: 1160 },
              { label: 'สมาชิกสัญญา', current: 589, total: 1160 },
              { label: 'ติดต่อแล้ว', current: 589, total: 1160 }
            ].map((item, index) => (
              <CircularProgress
                key={index}
                current={item.current}
                total={item.total}
                label={item.label}
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="font-bold text-gray-800 mb-4">สำนักงานส่วนกลางรายงาน</h3>
            <div className="space-y-3">
              {[
                { label: 'กรมสง', value: '554', color: 'bg-purple-500' },
                { label: 'คาสเซิล', value: '200', color: 'bg-purple-500' },
                { label: 'การสาธารณสุขมาตรฐาน', value: '100', color: 'bg-purple-500' },
                { label: 'การต่อวิชาชีพ', value: '150', color: 'bg-purple-500' },
                { label: 'การสำรวจ', value: '156', color: 'bg-purple-500' },
                { label: 'การแต่ง', value: '0', color: 'bg-purple-500' }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className={`${item.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600 text-center">จำนวนโรงเรียนยังไม่ได้ลงทะเบียน</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;