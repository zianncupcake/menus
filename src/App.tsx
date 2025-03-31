import './App.css'
import Menu from './components/Menu';
import { useMenuData } from './hooks/useMenuData'

function App() {
  const { data } = useMenuData();
  const sections = data?.menu?.sections || []
  console.log("DATAAA", data)

  return (
    <div>
      <Menu sections={sections} />
    </div>
  )
}

export default App