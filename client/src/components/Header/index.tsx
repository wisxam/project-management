import React from "react";

type Props = {
  name: string;
  buttonComponent?: React.ReactNode;
  isSmallText?: boolean;
  children?: React.ReactNode;
};

const Header = ({
  name,
  buttonComponent,
  isSmallText = false,
  children,
}: Props) => {
  return (
    <div className="mb-5 flex w-full items-center justify-between">
      <h1
        className={`${isSmallText ? "text-lg" : "text-2xl"} text-center font-semibold dark:text-white`}
      >
        {name}
      </h1>
      {buttonComponent}
      {children}
    </div>
  );
};

export default Header;
