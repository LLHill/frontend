import React from 'react'
import { NavLink } from 'react-router-dom'
import classes from './NavigationItems.css'

const NavigationItem = (props) => {
  return (
    <li className={classes.NavigationItem}>
      <NavLink 
        exact={props.exact}
        to={props.link} 
        activeClassName={classes.active}
      >{props.children}</NavLink>
    </li>
  )
}

const navigationItems = (props) => {
  return (
    <ul className={classes.NavigationItems}>
      <NavigationItem exact link='/'>HOME</NavigationItem>
      <NavigationItem link='/course'>COURSE</NavigationItem>
      <NavigationItem link='/report'>REPORT</NavigationItem>
    </ul>
  )
}

export default navigationItems
