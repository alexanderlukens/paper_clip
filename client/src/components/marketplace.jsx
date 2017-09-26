import React from 'react'
import { Link } from 'react-router-dom'
import Items from './items.jsx'

const Marketplace = (props) => {
  return (
    <div>
      <div className="link"><Link to={`/home`}>Go Home</Link></div>
      {props.marketplace.map((item, i) => {
        return <Items id={item[2]} key={item[2]} url={item[0]} description={item[1]} onClick={props.onClick} />
      })}
    </div>
  )
}

export default Marketplace
