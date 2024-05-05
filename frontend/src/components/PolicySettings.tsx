import { Link, Outlet } from "react-router-dom";

const PolicySettings = () => {
  return (
    <div className="policy__settings p-8">
      <nav className="flex mb-4 border-b">
        <Link
          to="location"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          Location
        </Link>
        <Link
          to="business"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          Business
        </Link>
      </nav>
      <Outlet />

      {/* <AddLGA /> */}
    </div>
  );
};

export default PolicySettings;
