'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tables } from '@/types/supabase.ts';
import { useMemo } from 'react';
import { eachHourOfInterval, isSameHour, set } from 'date-fns';

type ChildrenChartProps = {
  appointments: Tables<'appointments'>[] | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
};
type ChartData = {
  date: string;
  play: number;
  babysitting: number;
};

const chartConfig = {
  play: {
    label: 'igranje',
    color: 'hsl(var(--chart-1))',
  },
  babysitting: {
    label: 'čuvanje',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function ChildrenChart({
  appointments,
  startDate = new Date(),
  endDate = new Date(),
}: ChildrenChartProps) {
  const playAppointments = useMemo(
    () => appointments?.filter((appointment) => appointment.type === 'play') || [],
    [appointments],
  );
  const babysittingAppointments = useMemo(
    () => appointments?.filter((appointment) => appointment.type === 'babysitting') || [],
    [appointments],
  );

  const dayChart = useMemo(() => {
    const dates = eachHourOfInterval({
      start: set(startDate, { hours: 15 }),
      end: set(startDate, { hours: 21 }),
    });

    const data: ChartData[] = dates.map((date) => {
      const playAppointmentsOnDate = playAppointments.filter((appointment) =>
        isSameHour(new Date(appointment.start_time), date),
      );

      const babysittingAppointmentsOnDate = babysittingAppointments.filter((appointment) =>
        isSameHour(new Date(appointment.start_time), date),
      );
      return {
        date: date.getHours().toString(),
        play: playAppointmentsOnDate.length,
        babysitting: babysittingAppointmentsOnDate.length,
      };
    });

    return data;
  }, [startDate, babysittingAppointments, playAppointments]);

  const chartData = useMemo(() => {
    if (startDate === endDate) {
      return dayChart;
    }
    // create an array of dates between the start and end date
    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    // create an array of objects with the date and the number of children
    const data: ChartData[] = dates.map((date) => {
      const formattedDate = date.toISOString().split('T')[0];
      const playAppointmentsOnDate = playAppointments.filter(
        (appointment) => appointment.start_time.split('T')[0] === formattedDate,
      );

      const babysittingAppointmentsOnDate = babysittingAppointments.filter(
        (appointment) => appointment.start_time.split('T')[0] === formattedDate,
      );

      return {
        date: date.toISOString().split('T')[0],
        play: playAppointmentsOnDate.length,
        babysitting: babysittingAppointmentsOnDate.length,
      };
    });

    return data;
  }, [dayChart, startDate, endDate, playAppointments, babysittingAppointments]);

  return (
    <Card className="flex flex-col lg:max-w-md">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
        <div>
          <CardDescription>Igranje</CardDescription>
          <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">{playAppointments?.length}</CardTitle>
        </div>
        <div>
          <CardDescription>Čuvanje</CardDescription>
          <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
            {babysittingAppointments?.length}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -20,
              right: 12,
              top: 15,
              bottom: 15,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return value;
              }}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={5} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line dataKey="play" type="monotone" stroke="var(--color-play)" strokeWidth={2} dot={false} />
            <Line dataKey="babysitting" type="monotone" stroke="var(--color-babysitting)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
