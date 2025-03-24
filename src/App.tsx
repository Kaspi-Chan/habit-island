import { createSignal, type Component } from 'solid-js';
import styles from './App.module.css';
import Nav from './components/Nav.jsx';
import TasksList from './components/TasksList.jsx';
import MainView from './components/MainView.jsx';
import Island from './components/Island.jsx';

const App: Component = () => {

  return (
    <div class='container mx-auto h-screen'>
      <Nav />
      <Island />
      <MainView />
    </div>
  );
};

export default App;
