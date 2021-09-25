import { IconType } from "react-icons";
import { GoHome } from "react-icons/go";
import { BiCoin } from "react-icons/bi";
import { RiDashboardLine } from "react-icons/ri";
import { IoIosBasket } from "react-icons/io";
import { GiWallet } from "react-icons/gi";
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
    icon: GiWallet,
    link: "/wallet",
  },
  {
    id: 3,
    name: "Buy token",
    icon: BiCoin,
    link: "/buyToken",
  },
  {
    id: 4,
    name: "Dashboard",
    icon: RiDashboardLine,
    link: "/Dashboard",
  },
  {
    id: 5,
    name: "Buy Product",
    icon: IoIosBasket,
    link: "/buyProduct",
  },
];
