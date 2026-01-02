import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { useAppSelector } from './store/hooks';
import { selectTheme } from './store/selectors';
import { Layout } from './components/layout';
import { Home, Menu, PizzaDetails, AddPizza, Orders, Cart } from './pages';

/**
 * Theme wrapper component to handle dark mode
 */
const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    // Apply theme class to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
};

/**
 * App routes configuration
 */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="pizza/:id" element={<PizzaDetails />} />
        <Route path="add-pizza" element={<AddPizza />} />
        <Route path="orders" element={<Orders />} />
        <Route path="cart" element={<Cart />} />
      </Route>
    </Routes>
  );
};

/**
 * Main App component
 */
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ThemeWrapper>
            <AppRoutes />
          </ThemeWrapper>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
