import dayjs from '@/utils/dayjs';

export default function RootPage() {
  return (
    <div className="p-4">
      {dayjs(`2025-06-12 06:00:00+00`).format("DD MMMM YYYY เวลา HH:mm")}
    </div>
  );
}
