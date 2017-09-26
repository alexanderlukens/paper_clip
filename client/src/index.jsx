import React from 'react'
import ReactDom from 'react-dom'
import Upload from './components/upload.jsx'
import axios from 'axios'
import $ from 'jquery'

const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset_id';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dzwmoi9aj/image/upload';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      file:'',
      imagePreviewUrl: ''
    }
    this.handleUpload = this.handleUpload.bind(this)
  }

  handleUpload(e){
    let file = e.target.files[0];
    let newImage = new FormData();
    // newImage.append('newImage', file)
    var reader  = new FileReader();

    reader.onloadend = function () {
        axios.post('/picture', {'data': reader.result})
        .then((res)=> {console.log(res.data, 'aexl')})
    }

    reader.readAsDataURL(file); //reads the data as a URL
  }

  render(){
    return (
      <div>
        <div>Hello World {this.state.imagePreviewUrl}</div>
        <Upload handleUpload={this.handleUpload}/>
      </div>
    )
  }
}

ReactDom.render(<App />, document.getElementById('app'))
