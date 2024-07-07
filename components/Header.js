import React from "react";
import { Menu, MenuMenu, MenuItem } from "semantic-ui-react";
// import "semantic-ui-css/semantic.min.css";
import Link from "next/link";

const Header = () => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link href={"/"} className="item">
        CrowdCoin
      </Link>

      <MenuMenu position="right">
        <Link href={"/"} className="item">
          Campaigns
        </Link>

        <Link href={"/campaigns/new"} className="item">
          +
        </Link>
      </MenuMenu>
    </Menu>
  );
};

export default Header;
