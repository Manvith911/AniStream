/* eslint-disable react/prop-types */
import React from 'react'
import { FaClosedCaptioning, FaMicrophone } from 'react-icons/fa'

const SoundsInfo = ({ episodes }) => {
  return (
    <div className="flex items-center gap-2 font-extrabold text-black">
      {episodes.rating && (
        <div className="flex items-center bg-white text-sm px-2 py-1 rounded">
          <span>{episodes.rating}</span>
        </div>
      )}

      <div className="flex items-center gap-1 bg-yellow text-sm px-2 py-1 rounded">
        <FaClosedCaptioning />
        <span>{episodes.sub}</span>
      </div>

      <div className="flex items-center gap-1 bg-purple text-sm px-2 py-1 rounded">
        <FaMicrophone />
        <span>{episodes.dub}</span>
      </div>

      <div className="flex items-center bg-pink text-sm px-2 py-1 rounded">
        <span>{episodes.eps}</span>
      </div>
    </div>
  )
}

export default SoundsInfo
