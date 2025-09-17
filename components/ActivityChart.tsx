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

interface ActivityChartProps {
  agreements: Agreement[];
}

interface MonthlyData {
  month: string;
  year: number;
  monthName: string;
  changes: number;
}

export default function ActivityChart({ agreements }: ActivityChartProps) {
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

  // Group changes by month
  const monthlyData = useMemo((): MonthlyData[] => {
    const monthlyMap = new Map<string, number>();

    getFilteredChanges.forEach((change) => {
      const monthKey = `${change.date.getFullYear()}-${String(change.date.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);
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
        const changes = monthlyMap.get(monthKey) || 0;

        data.push({
          month: monthKey,
          year: date.getFullYear(),
          monthName: date.toLocaleDateString("en-US", { month: "short" }),
          changes,
        });
      }
    } else {
      // Show all time from earliest date to now
      const currentDate = new Date();
      const startDate = new Date(getEarliestDate);

      const date = new Date(startDate);
      while (date <= currentDate) {
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const changes = monthlyMap.get(monthKey) || 0;

        data.push({
          month: monthKey,
          year: date.getFullYear(),
          monthName: date.toLocaleDateString("en-US", { month: "short" }),
          changes,
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

    return {
      labels,
      datasets: [
        {
          label: "Status Changes",
          data: monthlyData.map((data) => data.changes),
          backgroundColor: "#3b82f6",
          borderColor: "#2563eb",
          borderWidth: 1,
          borderSkipped: false,
        },
      ],
    };
  }, [monthlyData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
        displayColors: false,
        callbacks: {
          title: function (context: { dataIndex: number }[]) {
            const dataIndex = context[0].dataIndex;
            const monthData = monthlyData[dataIndex];
            return `${monthData.monthName} ${monthData.year}`;
          },
          label: function (context: { parsed: { y: number } }) {
            return `${context.parsed.y} status change${context.parsed.y === 1 ? "" : "s"}`;
          },
        },
      },
    },
    scales: {
      x: {
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
