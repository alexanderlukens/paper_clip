import React from 'react'
import { Link } from 'react-router-dom'
import Items from './items.jsx'

const Marketplace = (props) => {
  return (
    <div>
      <div className="link"><Link to={`/home`}>Go Home</Link></div>
      {props.marketplace.map((item, i) => {
        return <Items key={i} url={item[0]} description={item[1]} />
      })}
    </div>
  )
}

export default Marketplace
