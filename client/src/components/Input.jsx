/* eslint-disable */
import React from 'react'
function Input(props) {
  return (
    <div>
        <input name={props.name} 
        value={props.value} onChange={props.onChange} 
         placeholder={props.placeHolder} 
         style={{padding:"0.25rem", margin:"0.25rem", color:"white", outline:"none"}}
         />
    </div>
  )
}

export default Input;