interface Values {
    height: number;
    weight: number;
}

const parseArguments = (args: string[]): Values => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');

    if (isNaN(Number(args[2])) || isNaN(Number(args[3]))) {
        throw new Error('Provided values were not numbers!');
    } else {
        return {
            height: Number(args[2]),
            weight: Number(args[3])
        };
    }
};

export const calculateBmi = (height: number, weight: number) => {
    if (height <= 0 || weight <= 0) {
        throw new Error('Height and weight must be positive numbers');
    }
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    let category: string;
    
    if (bmi < 18.5) {
        category = 'Underweight';
    } else if (bmi < 25) {
        category = 'Normal range';
    } else if (bmi < 30) {
        category = 'Overweight';
    } else {
        category = 'Obese';
    }
    
    return category;
};



if (require.main === module) {
    try {
        const { height, weight } = parseArguments(process.argv);
        console.log(calculateBmi(height, weight));
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        console.log(errorMessage);
    }
}