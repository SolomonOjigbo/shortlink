import cover from "../src/assets/ghibliart2.gif";

const Home = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="font-mono text-center">
        <p>hello world :)</p>
        <img src={cover} alt="Cover" className="my-4 rounded-xl shadom-md" />
        <p> To start using react tailwind typescript starter kit </p>
        <p> and see any changes here, update the Home.tsx file. </p>
     </div>
    </div>
  );
};

export default Home;
