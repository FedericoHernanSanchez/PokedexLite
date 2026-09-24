import { Link } from "react-router-dom";



export default function AppHeader() {
  
  

  return (
    <header className="bg-[#2d3748] text-white shadow-md">
      <div className="mx-auto flex  justify-center max-w-7xl flex-wrap items-center  gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/LogoPokedex.png" alt="" className="h-15 lg:h-22 " />
        </Link>


      </div>
    </header>
  );
}
