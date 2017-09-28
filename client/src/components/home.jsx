import React from 'react'
import Upload from './upload.jsx'
import Items from './items.jsx'
import { Link } from 'react-router-dom'

class Home extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      usersItems: this.props.usersItems
    }
  }
  componentWillReceiveProps(newProps){
    this.setState({
      usersItems: newProps.usersItems
    })
  }

  render(){
    return (
      <div>
        <div className="link"> <Link to={`/transactions`}>Go to the Transactions</Link> <br/>  <Link to={`/marketplace`}>Go to the Marketplace</Link> </div>
        <Upload handleUpload={this.props.handleUpload} handleSubmit={this.props.handleSubmit} handleDescription={this.props.handleDescription}/>
        {this.state.usersItems.filter(item => item[3] !== 'x').map((item, i) => {
          return <Items id={item[2]} key={item[2]} url={item[0]} description={item[1]} />
        })}
      </div>
    )
  }
}

export default Home
