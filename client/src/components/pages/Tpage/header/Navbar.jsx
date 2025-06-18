import React, { useState } from "react";
import { Flex, Box, TabNav, Text, DropdownMenu, Button } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { LuShoppingCart } from "react-icons/lu";
import { useAuth } from "../../../AuthContext";
import axios from "axios";
import "./navbar.css";
import { Link } from 'react-router-dom'

function Navbar() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [responseData, setResponseData] = useState(null);
  const navigate = useNavigate();

  const handleChange = (param) => {
    setActiveTab(param);
    navigate(`/${param}`);
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh-token");
      const accessToken = localStorage.getItem("access-token");

      if (!refreshToken || !accessToken) {
        console.error("No refresh or access token found!");
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/logout/",
        { refresh_token: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.clear()
      setResponseData(response.data);
      console.log("Logout successful:", response.data);

      // ✅ Clear tokens after logout
    

      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      setResponseData(error.response?.data || error.message);
    }
  };

  return (
    <Flex className="navbar">
      {/* Logo */}
      <Box className="log" width="100%" style={{ paddingTop: "1vh" }}>
        <Text as="div" size="8" weight="bold">
        <Link to="/">
          A r t i c H u b
          </Link>
        </Text>
      </Box>

      {/* Navigation Links */}
      <Box className="nav">
        <TabNav.Root>
          <TabNav.Link active={activeTab === "home"} onClick={() => handleChange(" ")}>
            HOME
          </TabNav.Link>

          {/* Safe null check before accessing user.role */}
          {user?.role === "CUSTOMER" && (
            <TabNav.Link active={activeTab === "about"} onClick={() => handleChange("about")}>
              <LuShoppingCart />
            </TabNav.Link>
          )}

          {/* Correct DropdownMenu structure */}
          {user ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="soft">{user?.username}</Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content>
                <DropdownMenu.Item onClick={() => handleChange("accounts/settings")}>
                  Profile
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={handleLogout}>
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ) : (
            <TabNav.Link active={activeTab === "login"} onClick={() => handleChange("login")}>
              LOGIN
            </TabNav.Link>
          )}
        </TabNav.Root>
      </Box>
    </Flex>
  );
}

export default Navbar;
