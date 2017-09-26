import React from 'react'

const Images = (props) => {
  return (
    <div>
      <img src={props.url} alt="Item was unable to load" height="42" width="42"/>
    </div>
  )
}

export default Images
