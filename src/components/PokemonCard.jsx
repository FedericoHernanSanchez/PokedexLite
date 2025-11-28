import React from 'react'
import { typesIcons } from "../data/typesIcons"
import { typesColors } from "../data/typesColors"
import '../index.css';

const PokemonCard = React.memo(({ id, name, img, types }) => {
    return (
        <div className='cursor-pointer flex flex-col  m-3 bg-white rounded-xl'>
            <img src={img} alt="imagen-pokemon" className=' bg-gray-100 rounded-lg w-50 h-50' />
            <span className='text-gray-400 font-noto text-sm pt-1.5 text-center'>N.º #{id}</span>
            <p className='text-2xl mb-2 font-noto text-gray-700 font-medium text-center'>{name.charAt(0).toUpperCase() + name.slice(1)}</p>
            <div className='flex gap-1.5 pb-2'>
                {
                    types.map((type, index) => (
                        <div key={index} className={`${typesColors[type]?.span} flex items-center rounded-sm`}>
                            <div className="clip-diagonal-right ">
                                <img src={typesIcons[type]} alt="tipo-pokemon" className={`w-6 p-1.5  ${typesColors[type]?.img}`} />
                            </div>
                            <span className="px-1.5 text-sm text-white font-medium ">{type}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
})

export default PokemonCard