import React from "react";
import LoadingImage from "../../public/assets/other/Loading.svg";
import Image from "next/image";
const SmallLoading = () => {
  return (
    <div>
      <Image src={LoadingImage} alt="Small Loading" />
    </div>
  );
};

export default SmallLoading;
