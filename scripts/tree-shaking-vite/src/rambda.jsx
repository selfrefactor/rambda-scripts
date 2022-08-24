import React from 'react'
import ReactDOM from 'react-dom/client'
import {adjust} from 'rambda'

let a = adjust(0, [0, 0], x => x + 1)

function App() {
  return <div className="App">{a.join(', ')}</div>
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
