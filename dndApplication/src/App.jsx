import { useState } from 'react'
import './App.css'

function App() {
  const [selectedRace, setSelectedRace] = useState('')
  const [raceData, setRaceData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Function to fetch race data from the API
  const fetchRaceData = async (raceName) => {
    if (!raceName) return

    setLoading(true)
    setError(null)

    try {
      // D&D 5e API endpoint
      const response = await fetch(`https://www.dnd5eapi.co/api/races/${raceName.toLowerCase()}`)
      
      if (!response.ok) {
        throw new Error('Race not found')
      }

      const data = await response.json()
      setRaceData(data)
    } catch (err) {
      setError(err.message)
      setRaceData(null)
    } finally {
      setLoading(false)
    }
  }

  // Handle race selection
  const handleRaceChange = (e) => {
    const race = e.target.value
    setSelectedRace(race)
    fetchRaceData(race)
  }

  return (
    <>
      <h1>Get Race Information for Your DND Character</h1>
      
      <div className="race-selection">
        <label>Start typing to find your race</label>
        <input 
          type='search' 
          list='races' 
          id='search-bar'
          value={selectedRace}
          onChange={handleRaceChange}
        />
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
      </div>

      {/* Loading state */}
      {loading && <p>Loading race data...</p>}

      {/* Error state */}
      {error && <p className="error">Error: {error}</p>}

      {/* Display race data */}
      {raceData && (
        <div className="race-info">
          <h2>{raceData.name}</h2>
          
          <div className="info-section">
            <h3>Speed</h3>
            <p>{raceData.speed} feet</p>
          </div>

          <div className="info-section">
            <h3>Size</h3>
            <p>{raceData.size}</p>
          </div>

          <div className="info-section">
            <h3>Ability Bonuses</h3>
            <ul>
              {raceData.ability_bonuses.map((bonus, index) => (
                <li key={index}>
                  {bonus.ability_score.name}: +{bonus.bonus}
                </li>
              ))}
            </ul>
          </div>

          <div className="info-section">
            <h3>Languages</h3>
            <ul>
              {raceData.languages.map((language, index) => (
                <li key={index}>{language.name}</li>
              ))}
            </ul>
          </div>

          {raceData.traits.length > 0 && (
            <div className="info-section">
              <h3>Traits</h3>
              <ul>
                {raceData.traits.map((trait, index) => (
                  <li key={index}>{trait.name}</li>
                ))}
              </ul>
            </div>
          )}

          {raceData.subraces.length > 0 && (
            <div className="info-section">
              <h3>Subraces</h3>
              <ul>
                {raceData.subraces.map((subrace, index) => (
                  <li key={index}>{subrace.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default App