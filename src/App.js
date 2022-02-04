import './App.css';
import Canvas from './Canvas/Canvas';

function App() {
    return (
        <div className='app'>
            <header>
                Kochsche Schneeflocke
            </header>
            <Canvas width='500' height='400' />
        </div>
    );
}

export default App;
