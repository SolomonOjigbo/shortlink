import CreateUrl from "../components/CreateUrl";

const Home = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div>
      <h1>URL Shortener</h1>
      <CreateUrl />
    </div>
    </div>
  );
};

export default Home;
