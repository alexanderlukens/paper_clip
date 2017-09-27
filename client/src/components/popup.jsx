import React from 'react'

const Popup = (props) => {

  return (
    <div className='popup'>
      <div className='popup_inner'>
        <div>Please select one of your items to trade for <strong>{props.selectItemToTradeFor}</strong></div>
        {props.usersItems.map(item => {
          return(<span key={item[2]}><img id={item[2]} className="item-image" src={item[0]} alt="Item was unable to load" onClick={props.closePopup}/></span>)
        })}
        <br/>
        <button onClick={props.onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default Popup
