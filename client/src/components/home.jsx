import React from 'react'
import Upload from './upload.jsx'
import Items from './items.jsx'
import { Link } from 'react-router-dom'

const Home = (props) => {
  return (
    <div>
      <div className="link"> <Link to={`/marketplace`}>Go to the Marketplace</Link> </div>
      <Upload handleUpload={props.handleUpload} handleSubmit={props.handleSubmit} handleDescription={props.handleDescription}/>
      {props.usersItems.map((item, i) => {
        return <Items id={item[2]} key={item[2]} url={item[0]} description={item[1]} />
      })}
    </div>
  )
}

export default Home
