import './App.css';
import { useState } from 'react';


const Main = () => {
  const accountName = window.localStorage.getItem('accountName') || 'email-prod';
  const [account, setAccount] = useState(accountName);
  const [rendererList, setRendererList] = useState([]);

  const host = `https://${account}.mytalkdesk.com/atlas/apps/conversation?mode=host`;
  const renderer = `https://${account}.mytalkdesk.com/atlas/headless/conversation?mode=renderer`;

  const changeAccountName = () => {
    const account = document.querySelector('input').value;
    if(!account) {
      alert('Please enter a valid account name');
      return;
    }
    window.localStorage.setItem('accountName', account);
    setAccount(account);
  }

  const openNewRendererPage = () => {
    const newRendererList = [...rendererList, renderer];
    setRendererList(newRendererList);
  }

  const removeIframe = (index) => () => {
    const newRendererList = [...rendererList];
    newRendererList.splice(index, 1);
    setRendererList(newRendererList);
  }

  return (
    <div className="App">
      <div className='input-container' style={{fontSize: '20px', padding: '6px', display: 'flex', justifyContent: 'center'}}>
        <input style={{width: '500px'}} type='text' placeholder='Enter your account name, such as: ccorecn' defaultValue={accountName} />
        <button onClick={changeAccountName}>Go</button>
        <button onClick={openNewRendererPage}>Open a new Renderer Page</button>
        <text>Current Renderer Page count is: {rendererList.length + 1}</text>
      </div>
      <div style={{display: 'flex', width: '100%'}}>
        <div className='flex-item'>
          <div className='container'>
            <h1>Conversation Host</h1>
            <iframe sandbox='allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-to-custom-protocols allow-downloads' allow="microphone;speaker;autoplay;fullscreen;clipboard-write;camera" 
            src={host} title='conversation' />
          </div>
        </div>

        <div className='flex-item'>
          <div className='container'>
            <h1>Conversation Renderer</h1>
            <iframe sandbox='allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-to-custom-protocols allow-downloads' allow="microphone;speaker;autoplay;fullscreen;clipboard-write;camera" 
            src={renderer} title='conversation' />
          </div>
        </div>
      </div>

      <div style={{height: '100px'}}></div>

      <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        {rendererList.map((renderer, index) => {
          return <div className='flex-item' key={index}>
            <div className='container'>
              <button onClick={removeIframe(index)} style={{ background: 'none', padding: '10px', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Remove this Iframe</button>
              <iframe sandbox='allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-to-custom-protocols allow-downloads' allow="microphone;speaker;autoplay;fullscreen;clipboard-write;camera" 
              src={renderer} title='conversation' />
            </div>
          </div>
        })}
      </div>
  </div>
  )
}


function getParameterByName(name, url = window.location.search) {
  const searchParams = new URLSearchParams(url);
  return searchParams.get(name);
}


const Hello = () => {
  return <div>
      <div className='flex-item'>
        <h1 style={{'text-align': 'center'}}>Conversation Render</h1>
        <div className='container'>
          <iframe sandbox='allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-to-custom-protocols allow-downloads' allow="microphone;speaker;autoplay;fullscreen;clipboard-write;camera" src='https://ccorecn.trytalkdesk.com/atlas/apps/conversation?mode=renderer' title='conversation' />
        </div>
      </div>
    </div>
}


function App() {
  const isRenderer = getParameterByName('mode') === 'renderer';
  if(isRenderer) {
    return <Hello />
  }

  return (
    <Main />
  );
}

export default App;
