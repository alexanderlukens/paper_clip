import React from 'react'
import { Link } from 'react-router-dom'

class Transactions extends React.Component {
  constructor(props){
    super(props)
    this.state={

    }
  }
  render(){
    return (<div>
      <div className="link"><Link to={`/home`}>Go Home</Link> <br/> <Link to={`/marketplace`}>Go to the Marketplace</Link> </div>
      Transactions
    </div>)
  }
}

export default Transactions
