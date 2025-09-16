import { AgreementHistory } from "@/lib/types";
import { getStatusColor, formatDate } from "@/lib/utils";

interface TimelineProps {
  history: AgreementHistory[];
}

export default function Timeline({ history }: TimelineProps) {
  if (!history || history.length === 0) return null;

  const sortedHistory = history.sort(
    (a, b) =>
      new Date(a.date_entered).getTime() - new Date(b.date_entered).getTime(),
  );

  const startDate = new Date("2018-01-01");
  const endDate = new Date();
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Timeline</h3>
      <div className="relative w-full h-40 bg-gray-50 rounded-lg p-4">
        {/* Timeline line */}
        <div className="absolute top-8 left-4 right-4 h-0.5 bg-gray-300"></div>

        {/* Start marker */}
        <div className="absolute top-6 left-4 w-2 h-2 bg-gray-400 rounded-full"></div>
        <div className="absolute top-10 left-2 text-xs text-gray-500 font-medium">
          2015
        </div>

        {/* End marker */}
        <div className="absolute top-6 right-4 w-2 h-2 bg-gray-400 rounded-full"></div>
        <div className="absolute top-10 right-2 text-xs text-gray-500 font-medium">
          {new Date().getFullYear()}
        </div>

        {/* History entries */}
        {sortedHistory.map((entry, index) => {
          const entryDate = new Date(entry.date_entered);
          const daysFromStart = Math.ceil(
            (entryDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
          );
          // Calculate position with padding to ensure it fits in single view
          const padding = 5; // 5% padding on each side
          const availableWidth = 100 - padding * 2; // 90% available width
          const position =
            padding + (daysFromStart / totalDays) * availableWidth;

          return (
            <div
              key={index}
              className="absolute top-6 flex flex-col items-center"
              style={{ left: `calc(${position}% - 1rem)` }}
            >
              {/* Status dot */}
              <div
                className={`w-4 h-4 rounded-full ${getStatusColor(entry.status).replace("text-", "bg-").replace("border-", "bg-")} border-2 border-white shadow-sm`}
                title={`${entry.status} - ${formatDate(entry.date_entered)}`}
              ></div>

              {/* Vertical text below dot */}
              <div className="mt-2 flex flex-col items-center relative">
                <div
                  className={`text-xs font-medium ${getStatusColor(entry.status)} transform rotate-90 whitespace-nowrap top-14 absolute`}
                >
                  {entry.status}
                </div>
                <div className="text-xs text-gray-500 transform rotate-90 whitespace-nowrap mt-1 absolute -right-5 top-14">
                  {formatDate(entry.date_entered)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
