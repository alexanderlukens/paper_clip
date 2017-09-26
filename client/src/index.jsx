import React from 'react'
import ReactDom from 'react-dom'
import Home from './components/home.jsx'
import Marketplace from './components/marketplace.jsx'
import { Switch, Route, BrowserRouter, DefaultRoute, Redirect } from 'react-router-dom'
import axios from 'axios'
import $ from 'jquery'

const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset_id';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dzwmoi9aj/image/upload';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      usersItems: [],
      marketplace: [],
      file: '',
      itemDescription: ''
    }
    this.handleUpload = this.handleUpload.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDescription = this.handleDescription.bind(this)
  }

  componentDidMount(){
    if (this.state.username === '') {
      let username = prompt('Please Enter Your Username');
      this.setState({
        username: username
      }, () => {
        this.getItems()
       this.getItems(true)
      })
    } else {
      this.getItems()
      this.getItems(true)
    }
  }

  getItems(marketplace){
    axios.get('/picture', {
      params: {
        username: this.state.username,
        marketplace: marketplace
      }
    })
    .then((result) => {
      if (marketplace){
        this.setState({
          marketplace: result.data
        })
        return
      }
      this.setState({
        usersItems: result.data
      })
    })
  }

  handleSubmit(e){
    e.preventDefault()
    let file = this.state.file
    let description = this.state.itemDescription
    var reader  = new FileReader();
    reader.onloadend = () => {
        axios.post('/picture', {
          'data': reader.result,
          username: this.state.username,
          description: description
        })
        .then((res)=> {
          this.state.usersItems.push([res.data.url, res.data.description])
          let newItemsList = this.state.usersItems
          this.setState({
            usersItems: newItemsList,
            file: '',
            itemDescription: ''
          })
        })
        .catch((err) => {
          console.error(err);
        })
    }

    reader.readAsDataURL(file);
  }

  handleUpload(e){
    let file = e.target.files[0];
    this.setState({
      file: file
    })
  }

  handleDescription(e){
    let description = e.target.value;
    this.setState({
      itemDescription: description
    })
  }


  render(){
    return (
      <div>
        <Switch>
          <Route path="/home" render={() => (
            <Home handleUpload={this.handleUpload} usersItems={this.state.usersItems} handleSubmit={this.handleSubmit} handleDescription={this.handleDescription}/>
          )}/>
          <Route path="/marketplace" render={() => (
            <Marketplace marketplace={this.state.marketplace}/>
          )}/>
          <Route exact path='*' render={() => (
            <Redirect to="/home"/>
          )}/>
        </Switch>
      </div>
    )
  }
}

ReactDom.render(
  (<BrowserRouter basename="/#">
     <App />
   </BrowserRouter>),
  document.getElementById('app'))
