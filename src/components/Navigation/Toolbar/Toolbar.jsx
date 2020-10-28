import React from 'react'
import logo from '../../../assets/images/burger-logo.png';
import classes from './Toolbar.css'
import NavigationItems from '../NavigationItems/NavigationItems';

const toolbar = (props) => {
  return (
    <header className={classes.ToolbarHeader}>
      <div className={classes.DrawerToggle} onClick={props.toggleSideDrawer}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <img src={logo} className={classes.ToolbarLogo} alt="logo" />
      <nav className={classes.DesktopOnly}>
        <NavigationItems />
      </nav>
    </header>
  )
}

export default toolbar
