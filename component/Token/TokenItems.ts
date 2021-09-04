import LoopTokenImg from "../../public/assets/other/favicon.png";

export interface TokenItem {
  id: number;
  Name: string;
  Img: any;
  buyAble: boolean;
}

export const TokenList: Array<TokenItem> = [
  {
    id: 1,
    Name: "Loop Token",
    Img: LoopTokenImg,
    buyAble: true,
  },
];
