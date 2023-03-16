import React, { useState, useRef, useEffect } from "react";
import "../../style/Header.css";

// Navigation
import { NavLink, Link, useNavigate } from "react-router-dom";

// Icons or Images
import RoseGLogo from "../../assets/images/roseGLogoName.png";
import userIcon from "../../assets/images/user.png";
import settingIcon from "../../assets/images/setting.png";
import logoutIcon from "../../assets/images/logout.png";

// Firebase
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { collection, where, getDocs, query } from "firebase/firestore";

// Redux
import { bagUiActions } from "../../store/MyBag/bagUiSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  userLogInState,
  userLogOutState,
  selectUser,
} from "../../store/UserSlice/userSlice";

// Main Menu Navigation Links
const nav__links = [
  {
    display: "Home",
    path: "/home",
  },
  {
    display: "Menu",
    path: "/menu",
  },
  {
    display: "Orders",
    path: "/orders",
  },
  // {
  //   display: "Login",
  //   path: "/login",
  // },
  // {
  //   display: "Sign up",
  //   path: "/registration",
  // },
];

const Header = () => {
  const menuRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  //------------------ Navigation ------------------//
  const navigate = useNavigate();

  //------------------ User Profile Drop Down ------------------//
  const [open, setOpen] = useState(false);
  const toggleProfileMenu = () => {
    setOpen(!open);
  };

  //------------------ Retrieve User Data ------------------//
  const [userLoggedUid, setUserLoggedUid] = useState(null);
  const [userData, setUserData] = useState(null);

  const getUserData = () => {
    const userDataRef = collection(db, "UserData"); // getting the UserData collection
    const queryData = query(userDataRef, where("uid", "==", userLoggedUid));

    getDocs(queryData).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setUserData(doc.data());
        });
      } else {
        //navigation.navigate("Login");
        console.log("Empty user document");
      }
    });
  };
  useEffect(() => {
    getUserData();
  }, [userLoggedUid]);

  //------------------ User Bag ------------------//
  const totalQuantity = useSelector((state) => state.bag.totalQuantity);
  const dispatch = useDispatch();
  const toggleBag = () => {
    dispatch(bagUiActions.toggle());
  };

  //------------------ Redux ------------------//
  const user = useSelector(selectUser);

  console.log(user && user.isAnonymous);
  // onAuthChanged
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser && authUser.emailVerified === true) {
        // Logged In Action
        dispatch(
          userLogInState({
            email: authUser.email,
            lastSignIn: authUser.metadata.lastSignInTime,
            emailVerified: authUser.emailVerified.toString(),
          })
        );
        setUserLoggedUid(authUser.uid);
      } else {
        // Logged Out action
        dispatch(userLogOutState());
        setUserLoggedUid(null);
      }
    });
  }, []);
  // Only show login and sign up links when user is not logged in
  const authLinks = user ? null : (
    <>
      <NavLink to="/login" activeClassName="active__menu">
        Login
      </NavLink>
      <NavLink to="/registration" activeClassName="active__menu">
        Sign up
      </NavLink>
    </>
  );

  //------------------ Sign Out Function------------------//
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        alert("Logged out successfully");
        navigate("/login");
      })
      .catch((error) => alert(error));
  };

  // User Profile Drop Down Links
  const userProfile__links = [
    {
      display: "Profile",
      path: "/userProfile",
      icon: userIcon,
    },
    {
      display: "Settings",
      path: "/settings",
      icon: settingIcon,
    },
    {
      display: "Logout",
      icon: logoutIcon,
      onClick: handleSignOut,
    },
  ];

  return (
    <header className="header">
      <div className="nav_wrapper d-flex align-items-center">
        <div className="nav__left d-flex align-items-center me-auto">
          <div className="logo">
            <Link to="/home">
              <img src={RoseGLogo} alt="rose-g-logo" />
              {/* <span>Rose G</span> */}
            </Link>
          </div>
        </div>

        {/* ===== MENU =====*/}
        <div
          className={isMobile ? "menu-mobile" : "navigation"}
          ref={menuRef}
          onClick={() => setIsMobile(false)}
        >
          <div className="menu d-flex align-items-center gap-4">
            {nav__links.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className={(navClass) =>
                  navClass.isActive ? "active__menu" : ""
                }
              >
                {item.display}
              </NavLink>
            ))}
            {authLinks}
          </div>
        </div>

        {/* BAG */}
        <div className="nav__icons d-flex align-items-center gap-4">
          <span className="bag__icon" onClick={toggleBag}>
            <i class="ri-shopping-bag-2-line"></i>
            <span className="bag__badge">{totalQuantity}</span>
          </span>

          {user && (
            <>
              {/* USER PROFILE DROPDOWN */}
              <div className="dropdown">
                <button
                  className="dropdown__button"
                  onClick={toggleProfileMenu}
                >
                  <img
                    className="profile__icon"
                    src={userIcon}
                    alt="user-icon"
                  />

                  <span>
                    {user && user.isAnonymous
                      ? "Guest"
                      : userData?.firstName || "User"}
                  </span>
                </button>
                {open && (
                  <div className="dropdown__menu">
                    {userProfile__links.map((item, index) => (
                      <>
                        {/* item.onClick is use to not overlap the onClick function from the NavLink */}
                        {item.onClick ? (
                          // Log out Link
                          <a
                            className="dropdown__menu__item"
                            onClick={item.onClick}
                          >
                            <img src={item.icon} alt={item.display} />
                            {item.display}
                          </a>
                        ) : (
                          // Profile & Settings Link
                          <NavLink
                            to={item.path}
                            key={index}
                            className="dropdown__menu__item"
                            onClick={toggleProfileMenu}
                          >
                            <img src={item.icon} alt={item.display} />
                            {item.display}
                          </NavLink>
                        )}
                      </>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          <span className="mobile__menu" onClick={() => setIsMobile(!isMobile)}>
            {isMobile ? (
              <i class="ri-close-line"></i>
            ) : (
              <i class="ri-menu-line"></i>
            )}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
