import React, { useState } from 'react'

const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [index, setIndex] = useState(initialIndex)


  function getXY() {
    const x = (index % 3) + 1
    const y = Math.floor(index / 3) + 1
    return { x, y }
  }

  function getXYMesaj() {
    const { x, y } = getXY()
    return `Koordinatlar (${x}, ${y})`
  }

  function reset() {
    setMessage(initialMessage)
    setEmail(initialEmail)
    setSteps(initialSteps)
    setIndex(initialIndex)
  }

  function sonrakiIndex(yon) {
    let newIndex
    switch (yon) {
      case 'sol':
        newIndex = index - 1
        break
      case 'yukarı':
        newIndex = index - 3
        break
      case 'sağ':
        newIndex = index + 1
        break
      case 'aşağı':
        newIndex = index + 3
        break
      default:
        newIndex = index
    }

    if (newIndex < 0 || newIndex > 8) {
      return index
    }
    return newIndex
  }

  function ilerle(yon) {
    const newIndex = sonrakiIndex(yon)
    setIndex(newIndex)
    setSteps(prevSteps => prevSteps + 1)
    setMessage('')
    
   
  }

  function onChange(evt) {
    setEmail(evt.target.value)
  }

 function onSubmit(evt) {
  evt.preventDefault();
  const { x, y } = getXY();
  
  // API'nin istediği payload formatını oluşturun
  const payload = {
    x: x + 1, // API 1 ile 3 arasında bir değer bekliyor
    y: y + 1, // API 1 ile 3 arasında bir değer bekliyor
    steps: steps, // steps 0'dan büyük olmalı
    email: email // geçerli bir email adresi olmalı
  };

  // Payloadı doğrulayın
  if (
    payload.x >= 1 && payload.x <= 3 &&
    payload.y >= 1 && payload.y <= 3 &&
    payload.steps > 0 &&
    // Basit bir email doğrulama regex'i
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)
  ) {
    // API'ye POST isteği gönderin
    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('İşlenemez Varlık');
      }
      return response.json();
    })
    .then(data => setMessage('Başarılı!'))
    .catch((error) => setMessage('Bir hata oluştu.'));
  } else {
    setMessage('Lütfen tüm alanları doğru doldurduğunuzdan emin olun.');
  }
}


  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => ilerle('sol')}>SOL</button>
        <button id="up" onClick={() => ilerle('yukarı')}>YUKARI</button>
        <button id="right" onClick={() => ilerle('sağ')}>SAĞ</button>
        <button id="down" onClick={() => ilerle('aşağı')}>AŞAĞI</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="email girin" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
