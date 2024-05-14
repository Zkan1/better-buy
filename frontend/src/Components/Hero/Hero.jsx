import React from 'react'
import './Hero.css'
import hand_icon from '../Assets/hand_icon.png'
import arrow_icon from '../Assets/arrow.png'

const Hero = () => {
  return (
    <div className='hero'>
      <div className="hero-left">
        <h2>Yeni Üyeler İçin </h2>
      </div>
      <div className="div hero right">
        <div className="hand-hand-icon">
            <p>Yeni</p>
            <img src={hand_icon} alt="" />
        </div>
        <p>Koleksiyon</p>
        <p>Herkes için</p>

      </div>
      <div className="hero-latest-btn">
        <div>En Yeni Parçalar</div>
        <img src={arrow_icon} alt="" />
      </div>
    </div>
  )
}

export default Hero
