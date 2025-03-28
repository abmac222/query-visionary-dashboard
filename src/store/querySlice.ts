
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface QueryResult {
  id: string;
  title: string;
  description: string;
  data: {
    labels: string[];
    values: number[];
  };
  chartType: 'bar' | 'line' | 'pie' | 'area';
  timestamp: string;
}

export interface QueryState {
  queries: {
    text: string;
    id: string;
    timestamp: string;
  }[];
  suggestions: string[];
  isLoading: boolean;
  currentQuery: string;
  results: QueryResult[];
  error: string | null;
}

const initialState: QueryState = {
  queries: [],
  suggestions: [
    "Show me revenue trends for the last 6 months",
    "Analyze user engagement by device type",
    "Compare conversion rates across marketing channels",
    "Visualize customer retention by segment",
    "What is the sentiment analysis of recent user feedback?"
  ],
  isLoading: false,
  currentQuery: '',
  results: [],
  error: null
};

// Mock data for different query results
const mockResultsData = {
  revenue: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [12000, 19000, 15000, 21000, 26000, 30000]
  },
  engagement: {
    labels: ['Desktop', 'Mobile', 'Tablet', 'Smart TV', 'Others'],
    values: [45, 30, 15, 7, 3]
  },
  conversion: {
    labels: ['Organic', 'Paid Search', 'Social', 'Email', 'Referral'],
    values: [3.2, 4.7, 2.9, 5.1, 3.8]
  },
  retention: {
    labels: ['New', 'Monthly', 'Quarterly', 'Annual', 'Enterprise'],
    values: [65, 75, 82, 90, 95]
  },
  sentiment: {
    labels: ['Very Positive', 'Positive', 'Neutral', 'Negative', 'Very Negative'],
    values: [25, 35, 20, 15, 5]
  }
};

// Function to determine chart type based on query content
const determineChartType = (query: string): 'bar' | 'line' | 'pie' | 'area' => {
  const queryLower = query.toLowerCase();
  if (queryLower.includes('pie') || queryLower.includes('segment') || queryLower.includes('distribution')) {
    return 'pie';
  } else if (queryLower.includes('trend') || queryLower.includes('time') || queryLower.includes('over')) {
    return 'line';
  } else if (queryLower.includes('compare') || queryLower.includes('comparison')) {
    return 'bar';
  } else {
    return 'area';
  }
};

// Function to generate mock results based on query
const generateMockResults = (query: string): QueryResult => {
  const queryLower = query.toLowerCase();
  let data;
  let title;
  let description;

  if (queryLower.includes('revenue')) {
    data = mockResultsData.revenue;
    title = 'Revenue Trends Analysis';
    description = 'Monthly revenue trends for the past 6 months show steady growth with a significant increase in May and June.';
  } else if (queryLower.includes('engagement')) {
    data = mockResultsData.engagement;
    title = 'User Engagement by Device';
    description = 'Desktop and mobile devices account for 75% of user engagement, with tablets showing increasing adoption.';
  } else if (queryLower.includes('conversion')) {
    data = mockResultsData.conversion;
    title = 'Conversion Rates by Channel';
    description = 'Email marketing shows the highest conversion rate at 5.1%, followed by paid search campaigns at 4.7%.';
  } else if (queryLower.includes('retention')) {
    data = mockResultsData.retention;
    title = 'Customer Retention by Segment';
    description = 'Enterprise and annual subscribers show the highest retention rates, while new users have the most opportunity for improvement.';
  } else if (queryLower.includes('sentiment')) {
    data = mockResultsData.sentiment;
    title = 'User Feedback Sentiment Analysis';
    description = '60% of user feedback is positive or very positive, with only 20% showing negative sentiment.';
  } else {
    // Default to revenue data if query doesn't match any pattern
    data = mockResultsData.revenue;
    title = 'Custom Analysis Results';
    description = 'Generated insights based on your query parameters.';
  }

  return {
    id: Date.now().toString(),
    title,
    description,
    data,
    chartType: determineChartType(query),
    timestamp: new Date().toISOString()
  };
};

// Async thunk for simulating query processing
export const processQuery = createAsyncThunk(
  'query/process',
  async (query: string, { rejectWithValue }) => {
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Random chance of error for demo purposes
      if (Math.random() < 0.1) {
        throw new Error('Failed to process query. Please try again.');
      }
      
      return generateMockResults(query);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setCurrentQuery: (state, action: PayloadAction<string>) => {
      state.currentQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearResults: (state) => {
      state.results = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(processQuery.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(processQuery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = [action.payload, ...state.results];
        state.queries.unshift({
          text: state.currentQuery,
          id: action.payload.id,
          timestamp: new Date().toISOString()
        });
        state.currentQuery = '';
      })
      .addCase(processQuery.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setCurrentQuery, clearError, clearResults } = querySlice.actions;

export default querySlice.reducer;
