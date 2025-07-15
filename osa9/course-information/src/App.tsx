const App = () => {
  const courseName = "Half Stack application development";
  
  interface CoursePartBase {
  name: string;
  exerciseCount: number;
  }

  interface CoursePartDescription extends CoursePartBase {
    description: string;
  }

  interface CoursePartBasic extends CoursePartDescription {
    kind: "basic"
  }

  interface CoursePartGroup extends CoursePartBase {
    groupProjectCount: number;
    kind: "group"
  }

  interface CoursePartBackground extends CoursePartDescription {
    backgroundMaterial: string;
    kind: "background"
  }

  interface CoursePartSpecial extends CoursePartDescription {
    requirements: string[];
    kind: "special"
  }


  type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  const Part = ({ part }: { part: CoursePart }) => {
    switch (part.kind) {
      case "basic":
        return (
          <p>
            <b>{part.name} {part.exerciseCount}</b>
          <br />
            <i>{part.description}</i>
          </p>
        );
      case "group":
        return (
          <p>
            <b>{part.name} {part.exerciseCount}</b>
          <br />
            Group project count: {part.groupProjectCount}
          </p>
        );  
      case "background":
        return (
          <p>
            <b>{part.name} {part.exerciseCount}</b>
          <br />
            <i>{part.description}</i>
          <br />
            Background material: {part.backgroundMaterial}
          </p>
        );
      case "special":
        return (
          <p>
            <b>{part.name} {part.exerciseCount}</b>
          <br />
            <i>{part.description}</i>
          <br />
            Requirements: {part.requirements.join(", ")}
          </p>
        );
      default:
        return assertNever(part);
    }
  };

  const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  )};

  const Header = ({ name }: { name: string }) => {
    return <h1>{name}</h1>;
  };

  const Content = ({ parts }: { parts: CoursePart[] }) => {
    return (
      <div>
        {parts.map((part, index) => (
          <Part key={index} part={part} />
        ))}
      </div>
    );
  };


  const Total = ({ parts }: { parts: CoursePart[] }) => {
    const totalExercises = parts.reduce((sum, part) => sum + part.exerciseCount, 0);
    return <p>Number of exercises {totalExercises}</p>;
  };

  return (
    <div>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <Total parts={courseParts} />
    </div>
  );
};

export default App;