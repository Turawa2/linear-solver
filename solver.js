document.getElementById('equation-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const equation = document.getElementById('equation-input').value;
    const solutionContainer = document.getElementById('solution-container');
    const solutionSteps = document.getElementById('solution-steps');

    try {
        const steps = solveLinearEquation(equation);
        solutionSteps.innerHTML = steps.join('<br>');
        solutionContainer.hidden = false;
    } catch (error) {
        solutionSteps.innerHTML = "Error: " + error.message;
        solutionContainer.hidden = false;
    }
});

function solveLinearEquation(equation) {
    // Ensure the equation contains an equals sign
    if (!equation.includes('=')) {
        throw new Error('Equation must have an equals sign.');
    }

    // Split the equation into left-hand side (LHS) and right-hand side (RHS)
    const [lhs, rhs] = equation.split('=').map(side => side.trim());
    let steps = [];

    // Detect the variable (e.g., x, y, z) used in the equation
    const variableMatch = lhs.match(/[a-zA-Z]/); // Matches any alphabetic character
    if (!variableMatch) {
        throw new Error('No valid variable found.');
    }
    const variable = variableMatch[0]; // Extract the variable

    // Parse the equation to extract coefficients and constants
    const lhsRegex = new RegExp(`(-?\\d*)${variable}\\s*([+-]?\\s*\\d*)?`); // Match `ax + b`
    const lhsMatch = lhs.match(lhsRegex);

    if (!lhsMatch) {
        throw new Error('Unable to parse the equation.');
    }

    const a = parseFloat(lhsMatch[1].replace(/\s+/g, '') || 1); // Coefficient of variable (default to 1)
    const b = parseFloat(lhsMatch[2]?.replace(/\s+/g, '') || 0); // Constant term (default to 0)
    const c = parseFloat(rhs); // RHS constant

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        throw new Error('Invalid equation format.');
    }

    // Step-by-step solution
    steps.push(`1. Original Equation: ${equation}`);
    steps.push(`2. Rearrange to isolate terms with ${variable}: ${a}${variable} = ${c} - (${b})`);

    const rhsSimplified = c - b;
    steps.push(`3. Simplify the RHS: ${a}${variable} = ${rhsSimplified}`);

    const solution = rhsSimplified / a;
    steps.push(`4. Solve for ${variable}: ${variable} = ${rhsSimplified} / ${a}`);
    steps.push(`5. Final Solution: ${variable} = ${solution}`);

    return steps;
}
