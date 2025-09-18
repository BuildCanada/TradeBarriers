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

  // Calculate adjusted positions for labels to prevent overlap
  const calculateAdjustedPositions = (entries: AgreementHistory[]) => {
    const minSpacing = 5; // Minimum spacing in percentage
    const adjustedPositions: number[] = [];

    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].date_entered);
      const daysFromStart = Math.ceil(
        (entryDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      const originalPosition = (daysFromStart / totalDays) * 100; // Where the label would normally be

      let adjustedPosition = originalPosition; // Where the label will actually be after spacing for readability

      // Check for overlap with previous labels
      if (i > 0) {
        const prevPosition = adjustedPositions[i - 1];
        const minRequiredPosition = prevPosition + minSpacing;

        if (adjustedPosition < minRequiredPosition) {
          // Determine which direction to adjust based on position relative to center (always move towards the center)
          const centerPoint = 50; // 50% is the center of the timeline

          // If before center
          if (originalPosition < centerPoint) {
            // Try to space towards the right first
            adjustedPosition = Math.min(
              minRequiredPosition,
              centerPoint - minSpacing,
            );

            // If not enough space, space towards the left
            if (adjustedPosition < minRequiredPosition) {
              adjustedPosition = Math.max(
                minRequiredPosition,
                centerPoint + minSpacing,
              );
            }
          } else {
            // If after center
            // Try to space towards the left first
            adjustedPosition = Math.max(
              minRequiredPosition,
              centerPoint + minSpacing,
            );

            // If not enough space, space towards the right
            if (adjustedPosition > 98) {
              adjustedPosition = Math.min(
                minRequiredPosition,
                centerPoint - minSpacing,
              );
            }
          }
        }
      }

      // Ensure we don't go beyond timeline bounds
      adjustedPosition = Math.max(2, Math.min(98, adjustedPosition));

      adjustedPositions.push(adjustedPosition);
    }

    return adjustedPositions;
  };

  const adjustedPositions = calculateAdjustedPositions(sortedHistory);

  // Calculate segment positions and widths based on adjusted positions
  const segments = [];

  // Add light grey segment from start to first status
  if (sortedHistory.length > 0) {
    const firstAdjustedPosition = adjustedPositions[0];
    const firstSegmentWidth = firstAdjustedPosition;

    segments.push({
      width: firstSegmentWidth,
      color: "bg-gray-300",
      status: "Initial Period",
      startDate: startDate,
      endDate: new Date(sortedHistory[0].date_entered),
    });
  }

  // Add segments for each status change using adjusted positions
  for (let i = 0; i < sortedHistory.length; i++) {
    const currentEntry = sortedHistory[i];
    const nextEntry = sortedHistory[i + 1];

    const currentAdjustedPosition = adjustedPositions[i];
    const nextAdjustedPosition = nextEntry ? adjustedPositions[i + 1] : 100;

    const segmentWidth = nextAdjustedPosition - currentAdjustedPosition;

    segments.push({
      width: segmentWidth,
      color: getStatusBarColor(currentEntry.status),
      status: currentEntry.status,
      startDate: new Date(currentEntry.date_entered),
      endDate: nextEntry ? new Date(nextEntry.date_entered) : endDate,
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
            const position = adjustedPositions[index];

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
