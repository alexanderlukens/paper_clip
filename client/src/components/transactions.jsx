import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

class Transactions extends React.Component {
  constructor(props){
    super(props)
    this.state={

    }
  }
  componentDidMount(){
    console.log(this.props.username)
    axios.get('/transactions/open', {
      params: {
        username: this.props.username
      }
    })
    .then((results) => console.log(results.data))
  }

  render(){
    return (<div>
      <div className="link"><Link to={`/home`}>Go Home</Link> <br/> <Link to={`/marketplace`}>Go to the Marketplace</Link> </div>
      Transactions
    </div>)
  }
}

export default Transactions
