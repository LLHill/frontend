import React from 'react'

const AuxWithClass = (WrappedComponent, classes) => {
  return props => (
    <div className={classes}>
      <WrappedComponent />
    </div>
  )
}

export default AuxWithClass
