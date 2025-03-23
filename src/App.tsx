import { createSignal, type Component } from 'solid-js';
import styles from './App.module.css';
import Nav from './components/Nav.jsx';
import TasksList from './components/TasksList.jsx';

const App: Component = () => {

  return (
    <div class='container mx-auto h-screen'>
      <Nav />
      <TasksList />
    </div>
  );
};

export default App;
