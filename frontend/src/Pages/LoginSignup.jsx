import React, { useState } from 'react'
import './CSS/LoginSignup.css'
const LoginSignup = () => {


  const [state,setState]=useState("Login");
  const[formData,setFromData]= useState({
    username:"",
    password:"",
    email:""
  })

  const changeHandler=(e)=>{
    setFromData({...formData,[e.target.name]:e.target.value})
  }

  const login = async()=>{
    console.log("login çalışıyor",formData);
    let responseData;
    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        Accept:'application/form-data',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((resp) => resp.json())
      .then((data) => {responseData=data});
      console.log(responseData);
      if (responseData.success) {
        localStorage.setItem('auth-token',responseData.token);
        window.location.replace("/");
      }
      else
      {
        alert(responseData.errors)
      }
  }
  const signup = async() => {
    // Kullanıcının kaydolma işlemi başladığını konsola yazdırır.
    console.log("signup çalışıyor", formData);
    
    // Sunucudan dönen yanıtı depolamak için bir değişken tanımlar.
    let responseData;
    
    // Sunucuya POST isteği gönderir.
    await fetch('http://localhost:4000/signup', {
        method: 'POST', // İsteğin HTTP metodunu belirtir (POST).
        headers: {
            Accept: 'application/form-data', // Sunucunun kabul etmesini beklediğimiz yanıt türünü belirtir (düzeltilecek).
            'Content-Type': 'application/json', // Gönderilen verinin türünü belirtir (JSON formatında).
        },
        body: JSON.stringify(formData), // formData nesnesini JSON formatına dönüştürerek isteğin gövdesine ekler.
    })
    // Yanıtı JSON formatına dönüştürür ve responseData değişkenine atar.
    .then((response) => response.json())
    .then((data) => responseData = data);

    // Eğer yanıtın success (başarı) durumu true ise,
    if (responseData.success) {
        // Yanıt içerisindeki token değerini localStorage'a kaydeder.
        localStorage.setItem('auth-token', responseData.token);
        // Kullanıcıyı anasayfaya yönlendirir.
        window.location.replace("/");
    }
    // Eğer yanıtın success durumu false ise,
    else {
        // Kullanıcıya hata mesajlarını bir uyarı penceresinde gösterir.
        alert(responseData.errors);
    }
}


  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
         {state==="Sign Up"?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' />:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}}>Contiune</button>
        {state==="Sign Up"? <p className="loginsignup-login">Already have an account? <span onClick={()=>{setState("Login")}}>Login Here</span></p>:
        <p className="loginsignup-login">Create an account <span onClick={()=>{setState("Sign Up")}}>Click Here</span></p>}
       
        
        <div className="loginsignup-agree">
          <input type="checkbox" name='' id='' />
          <p>By Continuing, i agree to the terms of use & privacy policy</p>
        </div>
      </div>
      
    </div>
  )
}

export default LoginSignup
