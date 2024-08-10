import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with <input
      value={filter}
      onChange={handleFilterChange}
      />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name: <input
        value={props.newName}
        onChange={props.handlePersonChange}
        />
      </div>
      <div>
        number: <input
        value={props.newNumber}
        onChange={props.handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}


const Persons = ({ persons, removePerson }) => {
  return (
    <div>
      {persons.map(person => 
      <p key={person.name}>{person.name} {person.number}
      <button onClick={() => removePerson(person.id)}>delete</button>
      </p>)}
    </div>
  )
}

      
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.find(person => person.name === newName)) 
      {updatePerson(persons.find(person => person.name === newName).id, {name: newName, number: newNumber})
      return
    } 
    const personObject = {
      name: newName,
      number: newNumber
    }
    personService
      .create(personObject)
      .then(response => {
        console.log(response)
        setPersons(persons.concat(personObject))
        setNewName('')
        setNewNumber('')
      })
  }

  const removePerson = (id) => {
    if (window.confirm(`Delete ${persons.find(person => person.id === id).name}?`)) {
    personService
      .remove(id)
      .then(response => {
        console.log(response)
        setPersons(persons.filter(person => person.id !== id))
      })
  }}

  const updatePerson = (id, newObject) => {
    if (window.confirm(`${newObject.name} is already added to phonebook, replace the old number with a new one?`)) {
    personService
      .update(id, newObject)
      .then(response => {
        console.log(response)
        setPersons(persons.map(person => person.id !== id ? person : response))
        setNewName('')
        setNewNumber('')
      })
  }}

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value
    )
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter 
      filter={filter} 
      handleFilterChange={handleFilterChange} 
      />
      
      <h3>Add a new</h3>

      <PersonForm 
      addPerson={addPerson} 
      newName={newName} 
      newNumber={newNumber} 
      handlePersonChange={handlePersonChange} 
      handleNumberChange={handleNumberChange}      
      />

      <h3>Numbers</h3>

      <Persons
      persons={personsToShow}
      removePerson={removePerson}
      />

    </div>
  )

}

export default App