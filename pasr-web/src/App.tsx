
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PSARPage from './pages/PSARPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PSARPage />}/>
        {/* <Route path='/about' element={<About />}/>
        <Route path='/contact' element={<Contact />}/> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
