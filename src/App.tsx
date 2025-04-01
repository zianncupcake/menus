import './App.css';
import Menu from './components/Menu';
import { useMenuData } from './hooks/useMenuData';

function App() {
  const { data, loading, error } = useMenuData();
  const sections = data?.menu?.sections || [];

  return (
    <>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading Menu...</div>
        </div>
      ) : error ? (
        <div className="error">
          Failed to load menu
        </div>
      ) : (
        <div>
          <Menu sections={sections} />
        </div>
      )}
    </>
  );
}

export default App;