import React from 'react'

const Upload = (props) => {
  return (
    <div>
      <form id="form1">
        <input id="fileUpload" type="file" accept="image/*" onChange={props.handleUpload}/><br/>
        <input id="description" type='text' onChange={props.handleDescription}/>
      </form>
      <button type="submit" form="form1" value="Submit" onClick={props.handleSubmit}>Submit</button>
    </div>
  )
}

export default Upload
