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
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital[0]}</div>
      <div>population {country.population}</div>
      <h2>languages</h2>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt="flag" width="100" />
    </div>
  )
}

const Countries = ({ countries }) => {
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
        country.name.common}</div>
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
      />

    </div>
  )
}

export default App