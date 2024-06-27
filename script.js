// Expanded database of meals
const meals = [
    { name: 'Grilled Chicken Salad', calories: 350, protein: 30, carbs: 10, fat: 20, vegan: false, vegetarian: false, glutenFree: true },
    { name: 'Vegan Buddha Bowl', calories: 400, protein: 15, carbs: 60, fat: 15, vegan: true, vegetarian: true, glutenFree: true },
    { name: 'Salmon with Roasted Vegetables', calories: 450, protein: 35, carbs: 20, fat: 25, vegan: false, vegetarian: false, glutenFree: true },
    { name: 'Vegetarian Pasta', calories: 500, protein: 20, carbs: 70, fat: 15, vegan: false, vegetarian: true, glutenFree: false },
    { name: 'Tofu Stir-Fry', calories: 380, protein: 25, carbs: 40, fat: 18, vegan: true, vegetarian: true, glutenFree: true },
    { name: 'Greek Yogurt with Berries and Granola', calories: 300, protein: 20, carbs: 40, fat: 10, vegan: false, vegetarian: true, glutenFree: true },
    { name: 'Lentil Soup', calories: 250, protein: 15, carbs: 35, fat: 8, vegan: true, vegetarian: true, glutenFree: true },
    { name: 'Grilled Steak with Sweet Potato', calories: 550, protein: 40, carbs: 45, fat: 25, vegan: false, vegetarian: false, glutenFree: true },
    { name: 'Quinoa and Black Bean Burrito Bowl', calories: 420, protein: 18, carbs: 65, fat: 12, vegan: true, vegetarian: true, glutenFree: true },
    { name: 'Tuna Salad Sandwich', calories: 400, protein: 25, carbs: 35, fat: 20, vegan: false, vegetarian: false, glutenFree: false },
    // Add more meals here...
];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('meal-form');
    const mealSuggestions = document.getElementById('meal-suggestions');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const requirements = {
            calories: document.getElementById('calories').value ? parseInt(document.getElementById('calories').value) : null,
            protein: document.getElementById('protein').value ? parseInt(document.getElementById('protein').value) : null,
            carbs: document.getElementById('carbs').value ? parseInt(document.getElementById('carbs').value) : null,
            fat: document.getElementById('fat').value ? parseInt(document.getElementById('fat').value) : null,
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
                (requirements.calories === null || meal.calories <= requirements.calories) &&
                (requirements.protein === null || meal.protein >= requirements.protein) &&
                (requirements.carbs === null || meal.carbs <= requirements.carbs) &&
                (requirements.fat === null || meal.fat <= requirements.fat) &&
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
                li.innerHTML = `
                    <h3>${meal.name}</h3>
                    <p>Calories: ${meal.calories}, Protein: ${meal.protein}g, Carbs: ${meal.carbs}g, Fat: ${meal.fat}g</p>
                    <p>Dietary: ${meal.vegan ? 'Vegan, ' : ''}${meal.vegetarian ? 'Vegetarian, ' : ''}${meal.glutenFree ? 'Gluten-Free' : ''}</p>
                `;
                ul.appendChild(li);
            });
            mealSuggestions.appendChild(ul);
        }
    }
});
