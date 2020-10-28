import React from 'react'
import logo from '../../../assets/images/burger-logo.png'
import NavigationItems from '../NavigationItems/NavigationItems'
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary'
import Backdrop from '../../UI/Backdrop/Backdrop'
import classes from './SideDrawer.css'

const sideDrawer = (props) => {
  const assignedClasses = [classes.SideDrawer, props.open ? classes.Open : classes.Close].join(' ')
  return (
    <Auxiliary>
      <Backdrop show={props.open} onClick={props.onClose}/>
      <div className={assignedClasses}>
        <img src={logo} className={classes.DrawerLogo} alt="logo" />
        <nav>
          <NavigationItems />
        </nav>
      </div>
    </Auxiliary>
  )
}

export default sideDrawer
