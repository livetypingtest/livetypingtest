import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

// Example data: Replace with your actual data
const users = [
  { username: "user1", createdat: "2024-01-15T12:34:56Z" },
  { username: "user2", createdat: "2024-01-20T08:23:45Z" },
  { username: "user3", createdat: "2024-02-05T10:12:34Z" },
  { username: "user4", createdat: "2024-02-15T14:20:30Z" },
  { username: "user5", createdat: "2024-03-01T09:15:22Z" },
  { username: "user6", createdat: "2024-03-25T11:10:10Z" },
];

const UserAnalytics = () => {
  // Process the data to count users per month
  const processedData = useMemo(() => {
    const monthCounts = {};

    users.forEach((user) => {
      const date = parseISO(user.createdat); // Parse the createdat to a Date object
      const monthYear = format(date, "yyyy-MM"); // Format as "YYYY-MM" (e.g., "2024-01")

      // Increment the count for the monthYear
      monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
    });

    // Convert the counts to an array for the chart
    return Object.entries(monthCounts).map(([monthYear, count]) => ({
      month: monthYear,
      users: count,
    }));
  }, [users]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="users" fill="#8884d8" barSize={50} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UserAnalytics;
