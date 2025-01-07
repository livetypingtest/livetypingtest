import React, { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { format, parseISO, getYear } from 'date-fns';
import { Typography, Select, MenuItem, FormControl } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserAnalytics = ({ user }) => {
  // State for selected year
  const [selectedYear, setSelectedYear] = useState('All');

  // Extract unique years from user data
  const availableYears = useMemo(() => {
    const years = user?.map((u) => getYear(parseISO(u?.createdate)));
    return ['All', ...new Set(years)];
  }, [user]);

  // Process data based on the selected year
  const processedData = useMemo(() => {
    const monthCounts = {};

    user?.forEach((u) => {
      const date = parseISO(u?.createdate);
      const year = getYear(date);

      // Filter by selected year (or include all if 'All' is selected)
      if (selectedYear === 'All' || year === selectedYear) {
        const monthYear = format(date, 'MMM yyyy');
        monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
      }
    });

    const labels = Object.keys(monthCounts);
    const data = Object.values(monthCounts);

    return { labels, data };
  }, [user, selectedYear]);

  // Chart configuration
  const chartData = {
    labels: processedData.labels,
    datasets: [
      {
        label: 'User Registrations',
        data: processedData.data,
        backgroundColor: '#fff',
        borderColor: '#71CAC7',
        borderWidth: 1,
        borderRadius: 5,
        hoverBackgroundColor: '#71CAC7',
        barThickness: 50, // Fixed bar width
        maxBarThickness: 60, // Maximum bar width
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#71CAC7',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#ccc',
        borderWidth: 1,
      },
      title: {
        display: true,
        text: 'Monthly User Registrations',
        color: '#71CAC7',
        font: {
          size: 20,
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#71CAC7',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(211, 211, 211, 0.3)',
        },
      },
      y: {
        ticks: {
          color: '#71CAC7',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(211, 211, 211, 0.3)',
        },
        title: {
          display: true,
          text: 'Users',
          color: '#71CAC7',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
    },
  };

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card bg-theme">
              <div className="card-body">
                {/* Dropdown for Year Selection */}
                <div className="d-flex justify-content-end mb-3">
                  <FormControl
                    sx={{
                      minWidth: 150,
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      '& .MuiInputLabel-root': {
                        color: '#71CAC7',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#71CAC7',
                        },
                        '&:hover fieldset': {
                          borderColor: '#4caf50',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4caf50',
                        },
                      },
                      '& .MuiSelect-select': {
                        padding: '10px',
                      },
                    }}
                  >
                    <Select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      displayEmpty
                      size="small"
                      style={{ backgroundColor: '#71CAC7', color: '#000' }}
                    >
                      {availableYears.map((year) => (
                        <MenuItem key={year} value={year} style={{backgroundColor: '#71CAC7', color: '#000'}}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Chart */}
                <div className="d-flex justify-content-center">
                  <Bar data={chartData} height={100} width={300} options={options} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserAnalytics;
