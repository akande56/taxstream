import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <section className="home__section flex flex-col space-y-6 items-center justify-center h-screen w-screen bg-gradient-to-b from-green-400 from-90 to-green-300 ">
        <img src="jigawa.png" alt="" className="w-96 px-12" />
        <h1 className=" font-bold text-green-950 px-4 text-2xl">
          Welcome to JIGAWA INTERNAL REVENUE SERVICES
        </h1>
        <Link
          to={"/login"}
          className="bg-slate-100 px-3 py-1 font-semibold mt-4 w-fit rounded text-center mx-6"
        >
          Proceed to Login
        </Link>
      </section>
    </>
  );
};

export default Home;
