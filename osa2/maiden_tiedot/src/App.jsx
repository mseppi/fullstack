import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      find countries <input
        name="filter"
        value={filter}
        onChange={handleFilterChange}
        autoComplete="off"
      />
    </div>
  )
}

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const api_key = import.meta.env.VITE_SOME_KEY
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeather(response.data)
      });
    }, [])

  if (!weather) {
    return null
  }

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>
      <h2>languages:</h2>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt="flag" width="100" />
      <h2>Weather in {country.capital}</h2>
      <div>temperature: {weather.main.temp} Celsius</div>
      <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="weather icon" width="100" />
      <div>wind: {weather.wind.speed} m/s</div>
    </div>
  )
}


const Countries = ({ countries, showCountry }) => {
  if (countries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }
  else if (countries.length === 1) {
    return <Country country={countries[0]} />
  } else {
  return (
    <div>
      {countries.map(country => (
        <div key={country.name.common}>{
        country.name.common}
        <button onClick={() => showCountry(country.name.common)}>show</button>
        </div>
      ))}
    </div>
  );
}
};


const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const showCountry = (name) => {
    setFilter(name)
  }


  const countriesToShow = filter === ''
    ? countries
    : countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))


  return (
    <div>
      <Filter
      filter={filter} 
      handleFilterChange={handleFilterChange}
      />

      <Countries
      countries={countriesToShow}
      showCountry={showCountry}
      />

    </div>
  )
}

export default App