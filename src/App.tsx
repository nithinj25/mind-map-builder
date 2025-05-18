import { ReactFlowProvider } from 'reactflow';
import { MindMap } from './components/MindMap';

function App() {
  return (
    <div className="w-full h-screen bg-gray-50 dark:bg-gray-900">
      <ReactFlowProvider>
        <MindMap />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
