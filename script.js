// Sample database of meals (In a real application, this would come from a backend API)
const meals = [
    { name: 'Grilled Chicken Salad', calories: 350, protein: 30, carbs: 10, fat: 20, vegan: false, vegetarian: false, glutenFree: true },
    { name: 'Vegan Buddha Bowl', calories: 400, protein: 15, carbs: 60, fat: 15, vegan: true, vegetarian: true, glutenFree: true },
    { name: 'Salmon with Roasted Vegetables', calories: 450, protein: 35, carbs: 20, fat: 25, vegan: false, vegetarian: false, glutenFree: true },
    { name: 'Vegetarian Pasta', calories: 500, protein: 20, carbs: 70, fat: 15, vegan: false, vegetarian: true, glutenFree: false },
    { name: 'Tofu Stir-Fry', calories: 380, protein: 25, carbs: 40, fat: 18, vegan: true, vegetarian: true, glutenFree: true }
];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('meal-form');
    const mealSuggestions = document.getElementById('meal-suggestions');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const requirements = {
            calories: parseInt(document.getElementById('calories').value),
            protein: parseInt(document.getElementById('protein').value),
            carbs: parseInt(document.getElementById('carbs').value),
            fat: parseInt(document.getElementById('fat').value),
            vegan: document.getElementById('vegan').checked,
            vegetarian: document.getElementById('vegetarian').checked,
            glutenFree: document.getElementById('gluten-free').checked
        };

        const suggestions = generateMealSuggestions(requirements);
        displayMealSuggestions(suggestions);
    });

    function generateMealSuggestions(requirements) {
        return meals.filter(meal => {
            return (
                (!requirements.calories || meal.calories <= requirements.calories) &&
                (!requirements.protein || meal.protein >= requirements.protein) &&
                (!requirements.carbs || meal.carbs <= requirements.carbs) &&
                (!requirements.fat || meal.fat <= requirements.fat) &&
                (!requirements.vegan || meal.vegan) &&
                (!requirements.vegetarian || meal.vegetarian) &&
                (!requirements.glutenFree || meal.glutenFree)
            );
        });
    }

    function displayMealSuggestions(suggestions) {
        mealSuggestions.innerHTML = '';
        if (suggestions.length === 0) {
            mealSuggestions.innerHTML = '<p>No meals found matching your criteria. Try adjusting your requirements.</p>';
        } else {
            const ul = document.createElement('ul');
            suggestions.forEach(meal => {
                const li = document.createElement('li');
                li.textContent = `${meal.name} - Calories: ${meal.calories}, Protein: ${meal.protein}g, Carbs: ${meal.carbs}g, Fat: ${meal.fat}g`;
                ul.appendChild(li);
            });
            mealSuggestions.appendChild(ul);
        }
    }
});
