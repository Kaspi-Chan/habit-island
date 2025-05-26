import MainView from "./MainView.jsx";
import Island from "./Island.jsx";

const Home = () => {
  return (
    <div class="mx-auto h-screen relative lg:flex flex-row-reverse items-center lg:items-start lg:overflow-hidden lg:px-4 2xl:px-12 gap-6">
      <Island />
      <MainView />
    </div>
  );
};

export default Home;
