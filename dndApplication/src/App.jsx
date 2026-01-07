import { useEffect, useState } from 'react'
import './App.css'

function App() {
  //Setup useStates
  const [selectedRace, setSelectedRace] = useState()
  const [raceData, setRaceData] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [error, setError] = useState(null)

  //Fetch data based on race name given by user
  const fetchRaceData = async (raceName) => {
    if(!raceName) return

    setisLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://www.dnd5eapi.co/api/2014/races/${raceName.toLowerCase()}`)

      if(!response.ok) {
        throw new Error('Race not found')
      }
      const data = await response.json()

      //check if data contains traits
      if(data.traits && data.traits.length > 0) {
        const traitPromises = data.traits.map(trait => 
          //fetch trait information using trait url
          fetch(`https://www.dnd5eapi.co${trait.url}`).then(response => response.json())
        )
      
      //wait for all trait promises to finish
      const traitDetails = await Promise.all(traitPromises)

      data.traits = traitDetails
      }

      setRaceData(data)
    } catch(err) {
      setError(err.message)
      setRaceData(null)
    } finally {
      setisLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchRaceData(selectedRace)
  }

  return (
    <>
      <h1>Get Race Information for Your DND Character</h1>
     
      <form onSubmit={handleSubmit} className="race-selection">
        <label id='search-bar-label'>Start typing to find your race</label>
        <input type='search' list='races' id='search-bar' value={selectedRace} onChange={(e) => setSelectedRace(e.target.value)} autoFocus placeholder='click again to see all options'></input>
        <datalist id='races'>
          <option value='Dragonborn' />
          <option value='Dwarf' />
          <option value='Elf' />
          <option value='Gnome' />
          <option value='Half-Elf' />
          <option value='Half-Orc' />
          <option value='Halfling' />
          <option value='Human' />
          <option value='Tiefling' />
        </datalist>
        <button type='submit' id='search-button'>Search</button>
      </form>
      
      { isLoading && <p>Loading data...</p> }
      { error && <p id='error'>Error: {error} </p>}
      { raceData && (
        <div className='raceInfo'>
          <h2>{raceData.name}</h2>
          <div className='alignment'>
            <h3>Alignment</h3>
            <p>{raceData.alignment}</p>
          </div>
          <div className='size'>
            <h3>Size</h3>
            <p><strong>{raceData.size}</strong>: {raceData.size_description}</p>
          </div>
          <div className='languages'>
            <h3>Languages</h3>
            <p><strong>{raceData.languages.map(language => language.name).join(', ')}</strong> - {raceData.language_desc}</p>
          </div>
          {raceData.traits.length > 0 && (
            <div className='traits'>
              <h3>Traits</h3>
              <div>
                {raceData.traits.map((trait, index) => (
                  <div key={index} className='trait-item'>
                    <p className='trait-name'><strong>{trait.name}</strong>: {trait.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {raceData.subraces && raceData.subraces.length > 0 && (
          <div className='subraces'>
            <h3>Subraces</h3>
              <p>{raceData.subraces.map(subrace => subrace.name).join(', ')}</p>
          </div>
          )}
        <div className='ability-bonus'>
          <h3>Ability Bonuses</h3>
          <p>{raceData.ability_bonuses.map(bonus =>
            `${bonus.ability_score.name}: +${bonus.bonus}`
          ).join(', ')}
          </p>
        </div>
        </div>
      )}
    </>
  )
}

export default App








 {/* <div className='traits'>
            <h3>Traits</h3>
            {raceData.traits.map((trait, index) => (
              <p key={index}>{trait.name}</p>
            ))}
            )))}
          </div> */}
