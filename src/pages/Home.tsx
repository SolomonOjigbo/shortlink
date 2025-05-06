import CreateUrl from "../components/CreateUrl";
import RootLayout from "../components/RootLayout";

const Home = () => {
  return (
    <RootLayout >
      <div className="card flex flex-col justify-center items-center my-24 w-full rounded-lg bg-slate-100 shadow-md">
      <CreateUrl />
    </div>
    </RootLayout>
  );
};

export default Home;
