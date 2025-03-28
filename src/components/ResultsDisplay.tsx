
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, LineChart } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart, Bar, LineChart as ReLineChart, Line, 
  PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, Legend
} from 'recharts';

const chartColors = ['#8B5CF6', '#D946EF', '#F97316', '#10B981', '#3B82F6', '#EC4899'];

const NoResults = () => (
  <div className="h-full flex flex-col items-center justify-center text-center p-8">
    <LineChart className="text-gray-300 mb-4" size={48} />
    <h3 className="text-xl font-medium text-gray-700 mb-2">No Analysis Results Yet</h3>
    <p className="text-gray-500 max-w-md">
      Enter a query above to generate AI-powered analysis and visualizations of your data.
    </p>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <Alert variant="destructive" className="my-4">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

const LoadingState = () => (
  <div className="h-full flex flex-col items-center justify-center p-8">
    <div className="relative w-16 h-16 mb-6">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-ai-primary rounded-full animate-spin border-t-transparent"></div>
    </div>
    <h3 className="text-xl font-medium text-gray-700 mb-2">Processing Your Query</h3>
    <p className="text-gray-500 max-w-md text-center">
      Our AI is analyzing your request and generating insights...
    </p>
  </div>
);

const ResultChart = ({ result }: { result: any }) => {
  const { data, chartType } = result;
  
  // Format data for recharts
  const chartData = data.labels.map((label: string, index: number) => ({
    name: label,
    value: data.values[index]
  }));

  switch (chartType) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <ReLineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8B5CF6" activeDot={{ r: 8 }} />
          </ReLineChart>
        </ResponsiveContainer>
      );
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    case 'area':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      );
    default:
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      );
  }
};

const ResultsDisplay = () => {
  const { results, isLoading, error } = useSelector((state: RootState) => state.query);

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (results.length === 0) {
    return <NoResults />;
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {results.map((result) => (
          <Card key={result.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{result.title}</CardTitle>
              <CardDescription>{result.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResultChart result={result} />
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ResultsDisplay;
