import './App.css';

function App() {
  return (
    <div className="App">
      <div className='flex-item'>
        <h1>Conversation Host</h1>
        <div className='container'>
          <iframe src='http://localhost:8080/headless/conversation' title='conversation' />
        </div>
      </div>
      <div className='flex-item'>
        <h1>Conversation Render</h1>
        <div className='container'>
          <iframe src='http://localhost:8080/headless/conversation' title='conversation' />
        </div>
      </div>
    </div>
  );
}

export default App;
