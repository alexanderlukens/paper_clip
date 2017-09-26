import React from 'react'

const Upload = (props) => {
  return (
    <div>
      <input id="fileUpload" type="file" accept="image/*" onChange={props.handleUpload}/>
    </div>
  )
}

export default Upload
