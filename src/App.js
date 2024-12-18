import './App.css';


const Main = () => 
  <div className="App">
      <div>
        <a href='/demo'> demo </a>
      </div>
      <div className='flex-item'>
        <h1>Conversation Host</h1>
        <div className='container'>
          <iframe sandbox='allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-to-custom-protocols allow-downloads' allow="microphone;speaker;autoplay;fullscreen;clipboard-write;camera" src='https://ccorecn.trytalkdesk.com/atlas/apps/conversation' title='conversation' />
        </div>
      </div>
    </div>


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
