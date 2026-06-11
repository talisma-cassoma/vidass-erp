import { LoginComponent } from "./components/LoginComponent";

const SignInPage = async () => {
  return (
    <div className="h-full w-full  grid-cols-2 gap-24 md:grid">
      <div className="flex flex-col items-center gap-6 py-10">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome to {process.env.NEXT_PUBLIC_APP_NAME}
        </h1>
        <img src="https://our-ngo.vercel.app/logo.png" alt="Vidass logo" className="h-96 w-96 rounded-full" >
        </img>
      </div>
      <div >
        <LoginComponent />
      </div>
    </div>
  );
};

export default SignInPage;
