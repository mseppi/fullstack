const Course = (props) => {
    return (
      <div>
        <Header course={props.course.name} />
        <Content parts={props.course.parts}/>
        <Total parts={props.course.parts}/>
      </div>
    )
  }
  
const Header = (props) => {
    return (
      <h1>{props.course}</h1>
    )
  }
  
const Content = (props) => {
    return (
      <div>
        {props.parts.map(part => <Part key={part.id} part={part.name} exercises={part.exercises} />)}
      </div>
    )
  }
  
const Total = (props) => {
    return (
      <b>Number of exercises {props.parts.reduce((s, p) => s + p.exercises, 0)}</b>
    )
  }
  
const Part = (props) => {
    return (
      <p>{props.part} {props.exercises}</p>
    )
  }

export default Course
