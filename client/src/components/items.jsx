import React from 'react'

const Images = (props) => {
  return (
    <div>
      <figure>
        <img className="item-image" src={props.url} alt="Item was unable to load" height="42" width="42"/>
        <figcaption>{props.description}</figcaption>
      </figure>
    </div>
  )
}

export default Images
