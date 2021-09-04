import { IconType } from "react-icons";
import { GoHome } from "react-icons/go";
import { IoMdLogIn } from "react-icons/io";
import { AiOutlineBook, AiOutlineDashboard } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { BiBasket, BiCoin } from "react-icons/bi";

interface NavItem {
  id: number;
  name: string;
  icon: IconType;
  link: string;
}

export const navItem: Array<NavItem> = [
  {
    id: 1,
    name: "Home",
    icon: GoHome,
    link: "/",
  },
  {
    id: 2,
    name: "Wallet",
    icon: BiCoin,
    link: "/wallet",
  },
  {
    id: 3,
    name: "Buy token",
    icon: BiBasket,
    link: "/buyToken",
  },
];
