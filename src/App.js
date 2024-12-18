import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getBroadcastTab } from './broadcastTab/BroadcastTab'
import { useEffect } from 'react';

console.log(getBroadcastTab())

const Main = () => 
  <div className="App">
      <div>
        <a href='/demo'> demo </a>
      </div>
      {/* <div className='flex-item'>
        <h1>Conversation Host</h1>
        <div className='container'>
          <iframe src='https://ccorecn.trytalkdesk.com/atlas/apps/conversation?mode=host' title='conversation' />
        </div>
      </div> */}
    </div>




const Hello = () => {
  if(getParams().mode === 'host') {
    window.top.host = getBroadcastTab()
  }

  if(getParams().mode === 'renderer') {
    window.top.renderer = getBroadcastTab()
  }

  useEffect(() => {
    if(getBroadcastTab.initd) return
    getBroadcastTab().init(getParams().mode)
    // getBroadcastTab().enableDebug()
  }, [])
  return <div>
      <div className='flex-item'>
        <h1 style={{'text-align': 'center'}}>Conversation Render</h1>
        <div className='container'>
          <iframe src='https://ccorecn.trytalkdesk.com/atlas/apps/conversation?mode=renderer' title='conversation' />
        </div>
      </div>
    </div>
}

function getParams(){
  const paramsString = window.location.search.substring(1)
  return paramsString.split('&').reduce((acc, param) => {
    const [key, value] = param.split('=')
    acc[key] = value
    return acc
  }, {})
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/demo" element={<Hello />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
