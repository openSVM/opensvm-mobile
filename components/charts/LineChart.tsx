import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { ValidatorMetric } from '@/hooks/use-validator-metrics';
import { Skeleton } from '@/components/LoadingSkeleton';

interface LineChartProps {
  data: ValidatorMetric[];
  height?: number;
  width?: number;
  color?: string;
  title?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  isLoading?: boolean;
  showLabels?: boolean;
  lineWidth?: number;
}

export function LineChart({
  data,
  height = 200,
  width = Dimensions.get('window').width - 40,
  color = colors.primary,
  title,
  yAxisLabel,
  xAxisLabel,
  isLoading = false,
  showLabels = true,
  lineWidth = 2,
}: LineChartProps) {
  if (isLoading) {
    return (
      <View style={[styles.container, { height, width }]}>
        {title && <Text style={styles.title}>{title}</Text>}
        <Skeleton height={height - (title ? 30 : 0)} width={width} />
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height, width }]}>
        {title && <Text style={styles.title}>{title}</Text>}
        <View style={[styles.noDataContainer, { height: height - (title ? 30 : 0) }]}>
          <Text style={styles.noDataText}>No data available</Text>
        </View>
      </View>
    );
  }

  // Find min and max values for scaling
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  
  // Padding to avoid drawing at the very edges
  const paddingTop = 10;
  const paddingBottom = 20;
  const paddingLeft = 40;
  const paddingRight = 10;
  
  const chartHeight = height - (title ? 30 : 0) - paddingTop - paddingBottom;
  const chartWidth = width - paddingLeft - paddingRight;
  
  // Generate path for the line
  const points = data.map((d, i) => {
    // If we have x values, use those instead of evenly spacing points
    const x = paddingLeft + (d.x !== undefined 
      ? ((d.x - data[0].x) / (data[data.length - 1].x - data[0].x)) * chartWidth
      : (i / (data.length - 1)) * chartWidth);
    
    const normalizedValue = range === 0 ? 0.5 : (d.value - minValue) / range;
    const y = height - paddingBottom - (normalizedValue * chartHeight);
    return `${x},${y}`;
  }).join(' ');

  // Format timestamps for x-axis labels
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format values for y-axis labels
  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(1);
  };

  // Generate y-axis labels
  const yAxisLabels = [0, 0.25, 0.5, 0.75, 1].map(fraction => {
    const value = minValue + range * fraction;
    return {
      value,
      y: height - paddingBottom - (fraction * chartHeight),
    };
  });

  // Generate x-axis labels (show only a few for clarity)
  const xAxisLabels = [0, 0.25, 0.5, 0.75, 1].map(fraction => {
    const index = Math.floor(fraction * (data.length - 1));
    const label = data[index].x !== undefined 
      ? data[index].x.toString() 
      : formatTime(data[index].timestamp);
    
    const x = paddingLeft + (data[index].x !== undefined 
      ? ((data[index].x - data[0].x) / (data[data.length - 1].x - data[0].x)) * chartWidth
      : (index / (data.length - 1)) * chartWidth);
    
    return { label, x };
  });

  // For web, we can use SVG
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { height, width }]}>
        {title && <Text style={styles.title}>{title}</Text>}
        <svg width={width} height={height - (title ? 30 : 0)}>
          {/* Y-axis grid lines */}
          {showLabels && yAxisLabels.map((label, i) => (
            <React.Fragment key={`grid-y-${i}`}>
              <line
                x1={paddingLeft}
                y1={label.y}
                x2={width - paddingRight}
                y2={label.y}
                stroke={colors.border}
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <text
                x={paddingLeft - 5}
                y={label.y + 4}
                textAnchor="end"
                fontSize="10"
                fill={colors.textSecondary}
              >
                {formatValue(label.value)}
              </text>
            </React.Fragment>
          ))}
          
          {/* X-axis grid lines and labels */}
          {showLabels && xAxisLabels.map((label, i) => (
            <React.Fragment key={`grid-x-${i}`}>
              <line
                x1={label.x}
                y1={paddingTop}
                x2={label.x}
                y2={height - paddingBottom}
                stroke={colors.border}
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <text
                x={label.x}
                y={height - 5}
                textAnchor="middle"
                fontSize="10"
                fill={colors.textSecondary}
              >
                {label.label}
              </text>
            </React.Fragment>
          ))}
          
          {/* The line chart */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={lineWidth}
          />
          
          {/* Y-axis label */}
          {yAxisLabel && (
            <text
              x={10}
              y={height / 2}
              textAnchor="middle"
              fontSize="10"
              fill={colors.textSecondary}
              transform={`rotate(-90, 10, ${height / 2})`}
            >
              {yAxisLabel}
            </text>
          )}
          
          {/* X-axis label */}
          {xAxisLabel && (
            <text
              x={width / 2}
              y={height - 5}
              textAnchor="middle"
              fontSize="10"
              fill={colors.textSecondary}
            >
              {xAxisLabel}
            </text>
          )}
        </svg>
      </View>
    );
  }

  // For native, we'll return a simplified version
  // In a real app, you'd use a library like react-native-svg or a charting library
  return (
    <View style={[styles.container, { height, width }]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.chartPlaceholder}>
        <Text style={styles.chartPlaceholderText}>
          Chart: {title || 'Line Chart'} - {data.length} data points
        </Text>
        <Text style={styles.chartPlaceholderText}>
          Latest: {formatValue(data[data.length - 1].value)} {yAxisLabel}
        </Text>
        <Text style={styles.chartPlaceholderText}>
          Min: {formatValue(minValue)}, Max: {formatValue(maxValue)}
        </Text>
        {xAxisLabel && (
          <Text style={styles.chartPlaceholderText}>
            X-Axis: {xAxisLabel}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  chartPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
  },
  chartPlaceholderText: {
    color: colors.text,
    fontSize: 12,
    marginVertical: 2,
  },
});