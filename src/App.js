import './App.css';


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
  return <div>
      <div className='flex-item'>
        <h1 style={{'text-align': 'center'}}>Conversation Render</h1>
        <div className='container'>
          <iframe src='https://ccorecn.trytalkdesk.com/atlas/apps/conversation?mode=renderer' title='conversation' />
        </div>
      </div>
    </div>
}


function App() {
  return (
    <Main />
  );
}

export default App;
