import { AgreementHistory } from "@/lib/types";
import { formatDate } from "@/lib/utils";

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

  // Get status color for progress bar segments
  const getStatusBarColor = (status: string) => {
    switch (status) {
      case "Under Negotiation":
        return "bg-yellow-400";
      case "Agreement Reached":
        return "bg-orange-400";
      case "Partially Implemented":
        return "bg-green-400";
      case "Implemented":
        return "bg-green-600";
      case "Deferred":
        return "bg-red-400";
      case "Awaiting Sponsorship":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  // Calculate segment positions and widths
  const segments = [];

  // Add light grey segment from start to first status
  if (sortedHistory.length > 0) {
    const firstEntryDate = new Date(sortedHistory[0].date_entered);
    const daysToFirstStatus = Math.ceil(
      (firstEntryDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const firstSegmentWidth = (daysToFirstStatus / totalDays) * 100;

    segments.push({
      width: firstSegmentWidth,
      color: "bg-gray-300",
      status: "Initial Period",
      startDate: startDate,
      endDate: firstEntryDate,
    });
  }

  // Add segments for each status change
  for (let i = 0; i < sortedHistory.length; i++) {
    const currentEntry = sortedHistory[i];
    const nextEntry = sortedHistory[i + 1];

    const currentEntryDate = new Date(currentEntry.date_entered);
    const nextEntryDate = nextEntry
      ? new Date(nextEntry.date_entered)
      : endDate;

    const segmentStartDays = Math.ceil(
      (currentEntryDate.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const segmentEndDays = Math.ceil(
      (nextEntryDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const segmentWidth =
      ((segmentEndDays - segmentStartDays) / totalDays) * 100;

    segments.push({
      width: segmentWidth,
      color: getStatusBarColor(currentEntry.status),
      status: currentEntry.status,
      startDate: currentEntryDate,
      endDate: nextEntryDate,
    });
  }

  return (
    <div>
      {/* Progress Bar with Demarcations */}
      <div className="relative w-full">
        {/* Progress Bar */}
        <div className="w-full h-4 bg-gray-100 rounded-lg overflow-hidden flex">
          {segments.map((segment, index) => (
            <div
              key={index}
              className={`h-full ${segment.color} transition-all duration-300`}
              style={{ width: `${segment.width}%` }}
              title={`${segment.status} - ${formatDate(segment.startDate.toISOString())} to ${formatDate(segment.endDate.toISOString())}`}
            />
          ))}
        </div>

        {/* Demarcations with Date + Status */}
        <div className="relative w-full h-[8rem] mb-8">
          {/* Start demarcation */}
          <div className="absolute left-0 flex flex-col">
            <div className="w-[1px] h-4 bg-gray-400 mb-2 self-start"></div>
            <div className="text-xs text-gray-500 font-medium whitespace-nowrap transform rotate-90 origin-left">
              {startDate.getFullYear()}
            </div>
          </div>

          {/* Status change demarcations */}
          {sortedHistory.map((entry, index) => {
            const entryDate = new Date(entry.date_entered);
            const daysFromStart = Math.ceil(
              (entryDate.getTime() - startDate.getTime()) /
                (1000 * 60 * 60 * 24),
            );
            const position = (daysFromStart / totalDays) * 100;

            return (
              <div
                key={index}
                className="absolute flex flex-col items-center"
                style={{ left: `${position}%`, transform: "translateX(-50%)" }}
              >
                <div className="w-[1px] h-4 bg-gray-400 mb-2"></div>
                <div className="flex flex-col items-left transform rotate-90 mt-10">
                  <div className="text-xs text-gray-500 font-medium whitespace-nowrap">
                    {formatDate(entry.date_entered)}
                  </div>
                  <div className="text-xs text-gray-600 whitespace-nowrap">
                    {entry.status}
                  </div>
                </div>
              </div>
            );
          })}

          {/* End demarcation */}
          <div className="absolute right-0 flex flex-col">
            <div className="w-[1px] h-4 bg-gray-400 mb-2 self-end"></div>
            <div className="text-xs text-gray-500 font-medium whitespace-nowrap transform rotate-90 origin-right mt-8">
              {endDate.getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
