import logo from "@/assets/HolaChat-logo-transparent.png";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 bg-[#13131a] md:flex flex-col justify-center items-center hidden duration-1000 transition-all relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8417ff]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Logo with Drop Shadow and Hover Scale */}
      <img
        src={logo}
        alt="HolaChat logo"
        className="h-[300px] w-auto max-w-[500px] object-contain p-2 drop-shadow-[0_0_40px_rgba(132,23,255,0.15)] hover:scale-105 transition-transform duration-700 ease-in-out cursor-default z-10"
      />

      <div className="text-opacity-90 text-white flex flex-col items-center mt-6 lg:text-4xl text-3xl transition-all duration-300 text-center z-10">
        <h3 className="poppins-medium tracking-tight">
          Hi<span className="text-[#8417ff]">!</span> Welcome to
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8417ff] to-[#9d4edd] font-bold ml-2">
            HolaChat
          </span>
          <span className="text-[#8417ff]">.</span>
        </h3>

        <p className="text-neutral-500 text-base md:text-lg mt-5 font-light tracking-wide">
          Select a conversation or add a contact from the sidebar to get
          started.
        </p>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
