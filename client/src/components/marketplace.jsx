import React from 'react'
import { Link } from 'react-router-dom'
import Items from './items.jsx'
import Popup from './popup.jsx'
import axios from 'axios'

class Marketplace extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showPopup: false,
      selectItemToTradeFor : '',
      selectItemToTradeForID: ''
    }
    this.closePopup = this.closePopup.bind(this)
    this.OnItemClick = this.OnItemClick.bind(this)
    this.OnCancel = this.OnCancel.bind(this)
  }

  closePopup(e){
    axios.post('/transactions', {
      tradingWithID: e.target.id,
      tradingForID: this.state.selectItemToTradeForID
    })
    .then((res) => {
      alert('Transaction Request successful')
      this.setState({
        selectItemToTradeFor: '',
        selectItemToTradeForID: '',
        showPopup: !this.state.showPopup
      })
    })
  }

  OnItemClick(e){
    if (!this.props.usersItems.length){
      alert('You have no items to trade, go to the home page to upload an item and try again!')
      return
    }
    let description = e.target.parentNode.children[1].textContent
    this.setState({
      showPopup: !this.state.showPopup,
      selectItemToTradeFor: description,
      selectItemToTradeForID: e.target.id
    })
  }

  OnCancel(){
    this.setState({
      showPopup: !this.state.showPopup,
      selectItemToTradeFor: '',
      selectItemToTradeForID: ''
    })
  }

  render(){
    return (
      <div>
        <div className="link"><Link to={`/home`}>Go Home</Link><br/><Link to={`/transactions`}>Go to the Transactions</Link></div>
        {this.props.marketplace.map((item, i) => {
          return <Items id={item[2]} key={item[2]} url={item[0]} description={item[1]} onClick={this.OnItemClick} />
        })}
        {this.state.showPopup ?
          <Popup
            closePopup={this.closePopup}
            selectItemToTradeFor={this.state.selectItemToTradeFor}
            usersItems={this.props.usersItems}
            onCancel={this.OnCancel}
          />
          : null
        }
      </div>
    )
  }
}
export default Marketplace
