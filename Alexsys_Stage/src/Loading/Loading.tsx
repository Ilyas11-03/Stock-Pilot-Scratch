import React from 'react';

const LoadingScreen: React.FC = () => {
    
  return (
    <div className="flex justify-center items-center min-h-screen min-w-[300px] font-calibri">
      <div className="w-[250px] h-[250px] flex justify-center items-center font-calibri">
        <div className="w-full h-full relative rounded-full animate-loading_animation shadow-[inset_0px_0px_20px_7px_#000000a6,inset_0px_0px_20px_1px_#00000066,inset_0px_0px_0px_30px_#ffffff91]"></div>
        <div className="absolute text-white text-2xl font-italic text-center">
          <div className="text-1rem">Loading...</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
