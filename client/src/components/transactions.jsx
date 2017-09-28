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
    this.onReject = this.onReject.bind(this)
    this.onAccept = this.onAccept.bind(this)
  }

    componentWillUnmount() {
      this.props.socket.off('offer');
      this.props.socket.off('reject');
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
    .then(() => {
      //websocket for reject
      this.props.socket.on('reject', (data) => {
        let closedEvent = this.state.initiatedTransactions.filter((transaction) => transaction.tid == data.tid)
        let initiatedTransactions = this.state.initiatedTransactions.filter((transaction) => transaction.tid != data.tid)
        if (closedEvent[0]){
          closedEvent[0].accepted = 'rejected'
          this.state.closedTransactions.push(closedEvent[0])
          this.setState({
            initiatedTransactions: initiatedTransactions,
            closedTransactions: this.state.closedTransactions
          })
        }
      })
      //websocket for new offer
      this.props.socket.on('offer', (data) => {
        let offer = data.offer[0]
        let userHasItem = this.props.usersItems.some((item) => {
          return item[2] === offer.getitemid
        })
        if (userHasItem){
          this.state.receivedTransactions.push(offer)
          this.setState({
            receivedTransactions: this.state.receivedTransactions
          })
        }
      })
    })
  }

  onReject(e){
    axios.put('/transactions/reject', {
      tid: e.target.parentNode.dataset.tid
    })
    .then(() => {
      this.componentDidMount()
    })
    this.props.socket.emit('reject', {
      tid: e.target.parentNode.dataset.tid
    })
  }
  onAccept(e){
    // this.props.socket.emit('accept', {
    //   tid: e.target.parentNode.dataset.tid,
    //   itemid: e.target.parentNode.dataset.itemid
    // })
    axios.put('/transactions/accept', {
      tid: e.target.parentNode.dataset.tid,
      itemid: e.target.parentNode.dataset.itemid
    })
    .then(() => {
      this.componentDidMount()
      setTimeout(this.props.getItems, 2000)
      setTimeout(this.props.getItems.bind(null,true), 2000)
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
          return (<li data-tid={transaction.tid} key={transaction.tid} className="offer">You offer to trade <strong>{transaction.giveitem}</strong> for {transaction.receiver}s <strong>{transaction.getitem}</strong></li>)
        })}
        </ul>
        <h6>Offers Awaiting Your Response</h6>
        <ul>
        {this.state.receivedTransactions.map((transaction) => {
          return (<li data-tid={transaction.tid} data-itemid={[transaction.getitemid,transaction.giveitemid]} key={transaction.tid} className="offer">{transaction.initiator} offers their <strong>{transaction.giveitem}</strong> for your <strong>{transaction.getitem}</strong><button className='accept' onClick={this.onAccept}>Accept</button><button onClick={this.onReject} className='reject'>Reject</button></li>)
        })}
        </ul>
        <h6>Your Closed Transactions</h6>
        <ul>
        {this.state.closedTransactions.map((transaction) => {
          return (<li data-tid={transaction.tid} key={transaction.tid} className="offer">Trade: {transaction.initiator}s <strong>{transaction.giveitem}</strong> for {transaction.receiver}s <strong>{transaction.getitem}</strong>. This was <strong>{transaction.accepted}</strong> by {transaction.receiver}</li>)
        })}
        </ul>
      </div>
    )
  }
}

export default Transactions
