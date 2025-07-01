interface ExerciseResults {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

const parseBmiArguments = (args: string[]): { target: number, dailyExercises: number[] } => {
    if (args.length < 2) {
        throw new Error('Not enough arguments');
    }
    const target = Number(args[2]);
    if (isNaN(target)) throw new Error(`Provided target was not a number!`);

    const dailyExercises = args.slice(3).map(arg => {
        const num = Number(arg);
        if (isNaN(num)) throw new Error(`Provided value '${arg}' is not a number!`);
        return num;
    });
    return { target, dailyExercises: dailyExercises };
};


export const calculateExercises = (target: number, exercises: number[]): ExerciseResults => {
    const periodLength = exercises.length;
    const trainingDays = exercises.filter(day => day > 0).length;
    const average = exercises.reduce((sum, day) => sum + day, 0) / periodLength;
    const success = average >= target;
    let rating: number;
    let ratingDescription: string;

    if (average < target) {
        rating = 1;
        ratingDescription = 'You need to do more exercises';
    } else if (average >= target && average < target * 1.5) {
        rating = 2;
        ratingDescription = 'You are doing well';
    } else {
        rating = 3;
        ratingDescription = 'Excellent job!';
    }

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
};
if (require.main === module) {
    try {
        const { target, dailyExercises } = parseBmiArguments(process.argv);
        console.log(calculateExercises(target, dailyExercises));
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        console.log(errorMessage);
    }
}