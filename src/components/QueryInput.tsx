
import { useState, KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { processQuery, setCurrentQuery } from '@/store/querySlice';
import { RootState } from '@/store';
import { AppDispatch } from '@/store';
import { toast } from 'sonner';

const QueryInput = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentQuery, suggestions, isLoading } = useSelector((state: RootState) => state.query);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCurrentQuery(e.target.value));
    if (e.target.value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentQuery.trim()) {
      submitQuery();
    }
  };

  const submitQuery = () => {
    if (currentQuery.trim()) {
      dispatch(processQuery(currentQuery.trim()))
        .then(() => {
          toast.success('Query processed successfully');
        })
        .catch((error) => {
          toast.error(`Error: ${error.message}`);
        });
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    dispatch(setCurrentQuery(suggestion));
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Ask anything about your data..."
            value={currentQuery}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            onFocus={() => currentQuery.length > 0 && setShowSuggestions(true)}
            className="pr-10 h-12 text-base focus-visible:ring-ai-primary"
            disabled={isLoading}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <Button 
          onClick={submitQuery} 
          disabled={!currentQuery.trim() || isLoading}
          className="h-12 px-6 bg-ai-primary hover:bg-ai-primary/90"
        >
          {isLoading ? 'Processing...' : 'Analyze'}
        </Button>
      </div>

      {showSuggestions && (
        <Card className="absolute z-10 w-full mt-1 p-2 shadow-lg bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="text-xs font-medium text-gray-500 mb-2 px-2">Suggested Queries</div>
          <ul>
            {suggestions
              .filter(suggestion => 
                suggestion.toLowerCase().includes(currentQuery.toLowerCase())
              )
              .map((suggestion, index) => (
                <li 
                  key={index}
                  className="px-2 py-1.5 text-sm rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default QueryInput;
