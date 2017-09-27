import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

class Transactions extends React.Component {
  constructor(props){
    super(props)
    this.state={
      closedTransactions: [],
      initiatedTransactions: [],
      receivedTransactions: []
    }
  }
  componentDidMount(){
    axios.get('/transactions', {
      params: {
        username: this.props.username
      }
    })
    .then((results) => {
      results = results.data
      let closedTransactions = results.filter((transaction) => transaction.open === 'false' && (transaction.initiator === this.props.username || transaction.receiver === this.props.username))
      let initiatedTransactions = results.filter((transaction) => transaction.initiator === this.props.username && transaction.open === 'true')
      let receivedTransactions = results.filter((transaction) => transaction.receiver === this.props.username && transaction.open === 'true')
      this.setState({
        closedTransactions,
        initiatedTransactions,
        receivedTransactions
      })
    })

  }

  render(){
    return (
      <div>
        <span className="link"><Link to={`/home`}>Go Home</Link> <br/> <Link to={`/marketplace`}>Go to the Marketplace</Link> </span>
        <h3>Transactions</h3>
        <h6>Your Open Offers</h6>
        <ul>
        {this.state.initiatedTransactions.map((transaction) => {
          return (<li key={transaction.tid} className="offer">You offer to trade <strong>{transaction.giveitem}</strong> for {transaction.receiver}s <strong>{transaction.getitem}</strong></li>)
        })}
        </ul>
        <h6>Offers Awaiting Your Response</h6>
        <ul>
        {this.state.receivedTransactions.map((transaction) => {
          return (<li key={transaction.tid} className="offer">{transaction.initiator} offers their <strong>{transaction.giveitem}</strong> for your <strong>{transaction.getitem}</strong><button className='accept'>Accept</button><button className='reject'>Reject</button></li>)
        })}
        </ul>
        <h6>Your Closed Transactions</h6>
        <ul>
        {this.state.closedTransactions.map((transaction) => {
          return (<li key={transaction.tid} className="offer">Trade: {transaction.initiator}s <strong>{transaction.giveitem}</strong> for {transaction.receiver}s <strong>{transaction.getitem}</strong>. This was <strong>{transaction.accepted}</strong> by {transaction.receiver}</li>)
        })}
        </ul>
      </div>
    )
  }
}

export default Transactions
