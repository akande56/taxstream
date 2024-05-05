import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {" "}
      <Button>
        <Link to={"/login"}>Login </Link>
      </Button>
    </div>
  );
};

export default Home;
