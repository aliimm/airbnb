import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import CreateSpotModal from '../CreateSpotModal'
import './Navigation.css'
import { useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory()
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={openMenu} className='profileButton'>
        {/* <i className="fas fa-user-circle" /> */}
        <i class="fa-solid fa-user"></i>
      </button>
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <p>{user.firstName} {user.lastName}</p>
            <p className="user-email-dropdown">{user.email}</p>
            <p className='logout-button'>

            <OpenModalMenuItem
              itemText="Create A Spot"
              onItemClick={closeMenu}
              modalComponent={<CreateSpotModal />}
            />
            </p>

            <p>
              <button className='logout-button' onClick={() => history.push('/bookings').then({closeMenu})}>Bookings</button>
            </p>

            <p>
              <button className='logout-button' onClick={logout}>Log Out</button>
            </p>
          </>
        ) : (
          <div className="login-profile-menu">
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileButton;
