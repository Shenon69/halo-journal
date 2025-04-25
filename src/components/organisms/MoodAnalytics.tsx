"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import useFetch from "@/hooks/useFetch";
import MoodAnalyticsSkeleton from "@/components/molecules/AnalyticsSkeleton";
import { useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import Link from "next/link";
import { getAnalytics } from "@/actions/analytics";
import { Button } from "@/components/atoms/button";
import { BrainCircuit } from "lucide-react";
import JournalInsightsDialog from "@/components/molecules/JournalInsightsDialog";

const timeOptions = [
  { value: "7d", label: "Last 7 Days" },
  { value: "15d", label: "Last 15 Days" },
  { value: "30d", label: "Last 30 Days" },
];

const MoodAnalytics = () => {
  const [period, setPeriod] = useState("7d");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    loading,
    data: analytics,
    fn: fetchAnalytics,
  } = useFetch(getAnalytics);

  const { isLoaded } = useUser();

  useEffect(() => {
    fetchAnalytics(period);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [period]);

  if (loading || !analytics?.data || !isLoaded) {
    return <MoodAnalyticsSkeleton />;
  }

  if (!analytics) return null;

  const { timeline, stats } = analytics.data;

  const CustomTooltip = ({ active, payload, label }: { active?: any, payload?: any, label?: any }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-medium">
            {format(parseISO(label), "MMM d, yyyy")}
          </p>
          <p className="text-orange-600">Average Mood: {payload[0].value}</p>
          <p className="text-blue-600">Entries: {payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-5xl font-bold gradient-title">Dashboard</h2>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {analytics.data.entries.length === 0 ? (
        <div>
          No Entries Found.{" "}
          <Link href="/journal/write" className="underline text-orange-400">
            Write New
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEntries}</div>
                <p className="text-xs text-muted-foreground">
                  ~{stats.dailyAverage} entries per day
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.averageScore}/10
                </div>
                <p className="text-xs text-muted-foreground">
                  Overall mood score
                </p>
              </CardContent>
            </Card>

            <Card className="lg:row-span-2">
              <CardHeader className="">
                <CardTitle className="text-sm font-medium">
                  Get insights from your journals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <div className="text-lg font-bold flex items-center gap-2 mb-2">
                  {getMoodEmoji(stats.averageScore)}{" "}
                  {getMoodTrend(stats.averageScore)}
                </div> */}
                
                <div className="">
                  {/* <div className="text-sm mb-2">Get insights from your journals</div> */}
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="w-full"
                    variant="outline"
                  >
                    <BrainCircuit className="h-4 w-4 mr-2" />
                    Ask questions about your journal 
                  </Button>
                  
                  <div className="mt-3 text-xs text-muted-foreground">
                    <p>Examples:</p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li>How was my mood last week?</li>
                      <li>What did I write about yesterday?</li>
                      <li>When was I most happy recently?</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mood Timeline Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Mood Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeline}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(parseISO(date), "MMM d")}
                    />
                    <YAxis yAxisId="left" domain={[0, 10]} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      name="No. of Entries"
                      domain={[0, 10]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="averageScore"
                      stroke="#f97316"
                      name="Average Mood"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="entryCount"
                      stroke="#3b82f6"
                      name="Number of Entries"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Journal Insights Dialog */}
      <JournalInsightsDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        analyticsData={analytics.data}
      />
    </>
  );
};

export default MoodAnalytics;
