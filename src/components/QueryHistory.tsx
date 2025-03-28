
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const QueryHistory = () => {
  const { queries } = useSelector((state: RootState) => state.query);

  if (queries.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center p-4 bg-gray-50">
        <div className="text-gray-400 text-center">
          <Clock className="mx-auto mb-2 opacity-50" size={24} />
          <p className="text-sm">Your query history will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-medium">Recent Queries</h3>
      </div>
      <ScrollArea className="h-[calc(100%-40px)]">
        <div className="px-2 py-1">
          {queries.map((query) => (
            <div 
              key={query.id} 
              className="px-2 py-3 hover:bg-gray-50 rounded-md mb-1 cursor-pointer"
            >
              <p className="text-sm line-clamp-2 font-medium">{query.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(query.timestamp), { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default QueryHistory;
