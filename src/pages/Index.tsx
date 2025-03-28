
import Dashboard from '@/components/Dashboard';
import { store } from '@/store';
import { Provider } from 'react-redux';

const Index = () => {
  return (
    <Provider store={store}>
      <Dashboard />
    </Provider>
  );
};

export default Index;
