
import QueryInput from './QueryInput';
import QueryHistory from './QueryHistory';
import ResultsDisplay from './ResultsDisplay';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="bg-white py-4 px-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-ai-primary rounded-md flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
          <h1 className="text-xl font-bold">Gen AI Analytics</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden p-6">
        {/* Query Input Area */}
        <div className="mb-6">
          <QueryInput />
        </div>

        {/* Dashboard Content */}
        <div className="flex flex-1 gap-6 overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0 overflow-hidden">
            <QueryHistory />
          </div>

          {/* Main content area */}
          <Card className="flex-1 border border-gray-200 overflow-hidden">
            <ResultsDisplay />
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
