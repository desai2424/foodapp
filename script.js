const APP_ID = 'YOUR_APP_ID';
const APP_KEY = 'YOUR_APP_KEY';

document.addEventListener('DOMContentLoaded', () => {
    // ... (previous code remains the same)

    async function fetchFoodData() {
        let url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${APP_ID}&app_key=${APP_KEY}&from=${currentFrom}&to=${currentTo}`;
        
        if (currentRequirements.diet.length > 0) {
            url += `&health=${currentRequirements.diet.join('&health=')}`;
        }
        if (currentRequirements.calories) url += `&calories=0-${currentRequirements.calories}`;
        if (currentRequirements.protein) url += `&nutrients[PROCNT]=${currentRequirements.protein}%2B`;
        if (currentRequirements.carbs) url += `&nutrients[CHOCDF]=0-${currentRequirements.carbs}`;
        if (currentRequirements.fat) url += `&nutrients[FAT]=0-${currentRequirements.fat}`;

        // ... (rest of the function remains the same)
    }

    // ... (rest of the code remains the same)
});
