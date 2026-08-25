"use client";

import { Agreement } from "@/lib/types";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ActiveElement,
  type Chart,
  type ChartEvent,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export interface ChartSelection {
  month: string; // "YYYY-MM"
  label: string; // e.g. "Mar 2025"
  status?: string; // undefined = whole month
}

interface ActivityChartProps {
  agreements: Agreement[];
  selection?: ChartSelection | null;
  onSelectionChange?: (selection: ChartSelection | null) => void;
}

interface MonthlyData {
  month: string;
  year: number;
  monthName: string;
  changes: number;
  statusBreakdown: Record<string, number>;
}

// Faded version of a bar colour, used when another bar is selected
function fade(color: string) {
  return `${color}33`;
}

// Define colors for each status
const STATUS_COLORS: Record<string, string> = {
  "Awaiting Sponsorship": "#f59e0b", // amber-500
  "Under Negotiation": "#3b82f6", // blue-500
  "Agreement Reached": "#10b981", // emerald-500
  "Partially Implemented": "#8b5cf6", // violet-500
  Implemented: "#059669", // emerald-600
  Deferred: "#ef4444", // red-500
};

export default function ActivityChart({
  agreements,
  selection = null,
  onSelectionChange,
}: ActivityChartProps) {
  const [timeRange, setTimeRange] = useState<"12months" | "alltime">(
    "12months",
  );

  // Extract all status changes from agreement history
  const getAllStatusChanges = useMemo(() => {
    const changes: { date: Date; status: string }[] = [];

    agreements.forEach((agreement) => {
      if (agreement.agreement_history) {
        agreement.agreement_history.forEach((history) => {
          changes.push({
            date: new Date(history.date_entered),
            status: history.status,
          });
        });
      }
    });

    return changes;
  }, [agreements]);

  // Find the earliest date in the data (starting point for all time)
  const getEarliestDate = useMemo(() => {
    if (getAllStatusChanges.length === 0) {
      return new Date("2018-01-01"); // fallback to 2018 if no data
    }

    const dates = getAllStatusChanges.map((change) => change.date);
    const earliestDate = new Date(
      Math.min(...dates.map((date) => date.getTime())),
    );

    // Round down to the first day of the month
    earliestDate.setDate(1);
    return earliestDate;
  }, [getAllStatusChanges]);

  // Get filtered changes based on time range
  const getFilteredChanges = useMemo(() => {
    const now = new Date();

    if (timeRange === "12months") {
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(now.getMonth() - 12);
      return getAllStatusChanges.filter(
        (change) => change.date >= twelveMonthsAgo,
      );
    } else {
      // All time from earliest date
      return getAllStatusChanges.filter(
        (change) => change.date >= getEarliestDate,
      );
    }
  }, [getAllStatusChanges, timeRange, getEarliestDate]);

  // Group changes by month and status
  const monthlyData = useMemo((): MonthlyData[] => {
    const monthlyMap = new Map<
      string,
      { total: number; statusBreakdown: Record<string, number> }
    >();

    getFilteredChanges.forEach((change) => {
      const monthKey = `${change.date.getFullYear()}-${String(change.date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { total: 0, statusBreakdown: {} });
      }

      const monthData = monthlyMap.get(monthKey)!;
      monthData.total += 1;
      monthData.statusBreakdown[change.status] =
        (monthData.statusBreakdown[change.status] || 0) + 1;
    });

    // Generate complete month range
    const now = new Date();
    const data: MonthlyData[] = [];

    if (timeRange === "12months") {
      // Show last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(now.getMonth() - i);

        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const monthData = monthlyMap.get(monthKey) || {
          total: 0,
          statusBreakdown: {},
        };

        data.push({
          month: monthKey,
          year: date.getFullYear(),
          monthName: date.toLocaleDateString("en-US", { month: "short" }),
          changes: monthData.total,
          statusBreakdown: monthData.statusBreakdown,
        });
      }
    } else {
      // Show all time from earliest date to now
      const currentDate = new Date();
      const startDate = new Date(getEarliestDate);

      const date = new Date(startDate);
      while (date <= currentDate) {
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const monthData = monthlyMap.get(monthKey) || {
          total: 0,
          statusBreakdown: {},
        };

        data.push({
          month: monthKey,
          year: date.getFullYear(),
          monthName: date.toLocaleDateString("en-US", { month: "short" }),
          changes: monthData.total,
          statusBreakdown: monthData.statusBreakdown,
        });

        // Move to next month
        date.setMonth(date.getMonth() + 1);
      }
    }

    return data;
  }, [getFilteredChanges, timeRange, getEarliestDate]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const labels = monthlyData.map((data) => {
      // Show year for January months or when year changes
      const prevData = monthlyData[monthlyData.indexOf(data) - 1];
      const showYear =
        data.monthName === "Jan" || !prevData || prevData.year !== data.year;
      return showYear ? `${data.monthName} ${data.year}` : data.monthName;
    });

    // Get all unique statuses that appear in the data
    const allStatuses = new Set<string>();
    monthlyData.forEach((data) => {
      Object.keys(data.statusBreakdown).forEach((status) =>
        allStatuses.add(status),
      );
    });

    // Create datasets for each status
    const datasets = Array.from(allStatuses).map((status) => {
      const color = STATUS_COLORS[status] || "#6b7280";
      const isSelectedStatus =
        !selection || !selection.status || selection.status === status;

      const colors = monthlyData.map((data) =>
        !selection || (selection.month === data.month && isSelectedStatus)
          ? color
          : fade(color),
      );

      return {
        label: status,
        data: monthlyData.map((data) => data.statusBreakdown[status] || 0),
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        borderSkipped: false,
      };
    });

    return {
      labels,
      datasets,
    };
  }, [monthlyData, selection]);

  const handleChartClick = (
    event: ChartEvent,
    _elements: ActiveElement[],
    chart: Chart,
  ) => {
    if (!onSelectionChange || !event.native) return;

    // The chart-wide interaction mode is "index", so ask explicitly for the
    // exact segment under the cursor. Falling back to the whole column lets a
    // click on the empty space above the bars still select the month.
    const hit = chart.getElementsAtEventForMode(
      event.native,
      "nearest",
      { intersect: true },
      true,
    );
    const column = hit.length
      ? hit
      : chart.getElementsAtEventForMode(
          event.native,
          "index",
          { intersect: false },
          true,
        );
    if (column.length === 0) return;

    const { datasetIndex, index } = column[0];
    const monthData = monthlyData[index];
    if (!monthData || monthData.changes === 0) return;

    const status = hit.length
      ? chartData.datasets[datasetIndex]?.label
      : undefined;
    const next: ChartSelection = {
      month: monthData.month,
      label: `${monthData.monthName} ${monthData.year}`,
      status,
    };

    // Clicking the same segment again clears the filter
    if (
      selection &&
      selection.month === next.month &&
      selection.status === next.status
    ) {
      onSelectionChange(null);
      return;
    }

    onSelectionChange(next);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handleChartClick,
    onHover: (
      event: { native?: Event | null },
      elements: { index: number }[],
    ) => {
      const target = (event?.native?.target ?? null) as HTMLElement | null;
      if (target) {
        // "index" interaction returns elements for empty months too, but
        // handleChartClick ignores those — don't advertise a dead click.
        const clickable =
          elements.length > 0 &&
          (monthlyData[elements[0].index]?.changes ?? 0) > 0;
        target.style.cursor = clickable ? "pointer" : "default";
      }
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          // backgroundColor is a per-bar array while a selection is active, and
          // Chart.js reads index 0 for the swatch. Draw the base status colour.
          generateLabels: (chart: Chart) =>
            chart.data.datasets.map((dataset, i) => ({
              text: dataset.label ?? "",
              fillStyle: STATUS_COLORS[dataset.label ?? ""] || "#6b7280",
              strokeStyle: STATUS_COLORS[dataset.label ?? ""] || "#6b7280",
              lineWidth: 1,
              hidden: !chart.isDatasetVisible(i),
              datasetIndex: i,
            })),
          font: {
            family:
              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            size: 11,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 0,
        displayColors: true,
        callbacks: {
          title: function (context: { dataIndex: number }[]) {
            const dataIndex = context[0].dataIndex;
            const monthData = monthlyData[dataIndex];
            return `${monthData.monthName} ${monthData.year}`;
          },
          label: function (context: {
            parsed: { y: number };
            dataset: { label?: string };
          }) {
            if (context.parsed.y === 0) return "";
            return `${context.dataset.label || "Unknown"}: ${context.parsed.y} change${context.parsed.y === 1 ? "" : "s"}`;
          },
          footer: function (context: { dataIndex: number }[]) {
            const dataIndex = context[0].dataIndex;
            const monthData = monthlyData[dataIndex];
            const total = monthData.changes;
            return `Total: ${total} change${total === 1 ? "" : "s"}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: function (context: { index: number }) {
            const dataIndex = context.index;
            const monthData = monthlyData[dataIndex];
            const isJanuary = monthData.monthName === "Jan";
            return isJanuary ? "#374151" : "#6b7280"; // Darker color for January
          },
          font: function (context: { index: number }) {
            const dataIndex = context.index;
            const monthData = monthlyData[dataIndex];
            const isJanuary = monthData.monthName === "Jan";

            return {
              family:
                'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              weight: isJanuary ? ("bold" as const) : ("normal" as const),
            };
          },
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "# of changes",
          color: "#6b7280",
          font: {
            family:
              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            size: 12,
            weight: "bold" as const,
          },
        },
        beginAtZero: true,
        grid: {
          color: "#e5e7eb",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            family:
              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            size: 12,
          },
        },
      },
    },
    animation: {
      duration: 750,
      easing: "easeInOutQuart" as const,
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-mono font-semibold uppercase tracking-wide text-foreground">
              Activity Timeline
            </CardTitle>
            <div className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
              {timeRange === "12months"
                ? "Number of status changes over the last 12 months"
                : "Number of status changes since earliest recorded agreement"}
            </div>
            <div className="text-xs text-muted-foreground font-mono uppercase tracking-wide mt-1">
              {selection ? (
                <span className="text-foreground">
                  Filtering: {selection.status ? `${selection.status} · ` : ""}
                  {selection.label}
                  <button
                    onClick={() => onSelectionChange?.(null)}
                    className="ml-2 underline hover:no-underline"
                  >
                    Clear
                  </button>
                </span>
              ) : (
                onSelectionChange && (
                  <span>Click a bar to filter agreements</span>
                )
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={timeRange === "12months" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("12months")}
              className="text-xs font-mono uppercase tracking-wide"
            >
              12 Months
            </Button>
            <Button
              variant={timeRange === "alltime" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("alltime")}
              className="text-xs font-mono uppercase tracking-wide"
            >
              All Time
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
