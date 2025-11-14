import { useState } from 'react'
import Login from './views/login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App
