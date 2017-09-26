import React from 'react'
import ReactDom from 'react-dom'
import Upload from './components/upload.jsx'
import Items from './components/items.jsx'
import axios from 'axios'
import $ from 'jquery'

const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset_id';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dzwmoi9aj/image/upload';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      usersItems: [],
      userId: 1
    }
    this.handleUpload = this.handleUpload.bind(this)
  }

  componentDidMount(){
    axios.get('/picture')
  }

  handleUpload(e){
    let file = e.target.files[0];
    var reader  = new FileReader();

    reader.onloadend = () => {
        axios.post('/picture', {
          'data': reader.result
        })
        .then((res)=> {
          this.state.usersItems.push(res.data)
          let newItemsList = this.state.usersItems
          this.setState({
            usersItems: newItemsList
          })
        })
        .catch((err) => {
          console.error(err);
        })
    }

    reader.readAsDataURL(file); //reads the data as a URL
  }

  render(){
    return (
      <div>
        <Upload handleUpload={this.handleUpload}/>
        {this.state.usersItems.map((itemUrl) => {
          return <Items url={itemUrl} />
        })}
      </div>
    )
  }
}

ReactDom.render(<App />, document.getElementById('app'))
