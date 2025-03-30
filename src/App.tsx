import './App.css'
import { useMenuData } from './hooks/useMenuData'

function App() {
  const { data } = useMenuData();
  console.log("DATAAA", data)
  return (
    <div>
      hello
    </div>
  )
}

export default App
