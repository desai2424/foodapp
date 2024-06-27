const APP_ID = '7f5797c0';
const APP_KEY = '9b3e7c56fcea43444d826c079ee76d7c';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('meal-form');
    const foodIdeas = document.getElementById('food-ideas');
    const regenerateButton = document.getElementById('regenerate');
    let currentFrom = 0;
    let currentTo = 10;
    let currentRequirements = {};

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        currentFrom = 0;
        currentTo = 10;
        currentRequirements = {
            calories: document.getElementById('calories').value ? parseInt(document.getElementById('calories').value) : null,
            protein: document.getElementById('protein').value ? parseInt(document.getElementById('protein').value) : null,
            carbs: document.getElementById('carbs').value ? parseInt(document.getElementById('carbs').value) : null,
            fat: document.getElementById('fat').value ? parseInt(document.getElementById('fat').value) : null,
            diet: []
        };
        if (document.getElementById('vegan').checked) currentRequirements.diet.push('vegan');
        if (document.getElementById('vegetarian').checked) currentRequirements.diet.push('vegetarian');
        if (document.getElementById('gluten-free').checked) currentRequirements.diet.push('gluten-free');
        generateFoodIdeas();
    });

    regenerateButton.addEventListener('click', () => {
        currentFrom += 10;
        currentTo += 10;
        generateFoodIdeas();
    });

    async function fetchFoodData() {
        let url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${APP_ID}&app_key=${APP_KEY}&from=${currentFrom}&to=${currentTo}`;
        
        if (currentRequirements.diet.length > 0) {
            url += `&health=${currentRequirements.diet.join('&health=')}`;
        }
        if (currentRequirements.calories) {
            url += `&calories=0-${currentRequirements.calories}`;
        }
        if (currentRequirements.protein) {
            url += `&nutrients[PROCNT]=${currentRequirements.protein}-1000`;
        }
        if (currentRequirements.carbs) {
            url += `&nutrients[CHOCDF]=0-${currentRequirements.carbs}`;
        }
        if (currentRequirements.fat) {
            url += `&nutrients[FAT]=0-${currentRequirements.fat}`;
        }

        console.log('Fetching data with URL:', url);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('API response:', data);
            
            if (data.hits.length === 0) {
                console.log('No results found. Current requirements:', currentRequirements);
            }
            
            return data.hits;
        } catch (error) {
            console.error('Error fetching food data:', error);
            foodIdeas.innerHTML = `<p>Error fetching food data: ${error.message}. Please try again later.</p>`;
            return [];
        }
    }

    async function generateFoodIdeas() {
        foodIdeas.innerHTML = '<p>Loading food ideas...</p>';
        regenerateButton.style.display = 'none';

        try {
            const recipes = await fetchFoodData();
            console.log(`Filtered recipes: ${recipes.length}`);
            displayFoodIdeas(recipes);
            regenerateButton.style.display = recipes.length > 0 ? 'block' : 'none';
        } catch (error) {
            console.error('Error generating food ideas:', error);
            foodIdeas.innerHTML = `<p>Error generating food ideas: ${error.message}. Please try again later.</p>`;
        }
    }

    function displayFoodIdeas(recipes) {
        foodIdeas.innerHTML = '';
        if (recipes.length === 0) {
            foodIdeas.innerHTML = '<p>No food ideas found matching your criteria. Try adjusting your requirements.</p>';
        } else {
            const grid = document.createElement('div');
            grid.className = 'recipe-grid';
            recipes.forEach(({recipe}) => {
                const card = document.createElement('div');
                card.className = 'recipe-card';
                card.innerHTML = `
                    <img src="${recipe.image}" alt="${recipe.label}" class="recipe-image">
                    <h3>${recipe.label}</h3>
                    <p>Calories: ${Math.round(recipe.calories / recipe.yield)} per serving</p>
                    <p>Protein: ${Math.round(recipe.totalNutrients.PROCNT.quantity / recipe.yield)}g per serving</p>
                    <p>Carbs: ${Math.round(recipe.totalNutrients.CHOCDF.quantity / recipe.yield)}g per serving</p>
                    <p>Fat: ${Math.round(recipe.totalNutrients.FAT.quantity / recipe.yield)}g per serving</p>
                    <a href="${recipe.url}" target="_blank" class="recipe-link">View Recipe</a>
                `;
                grid.appendChild(card);
            });
            foodIdeas.appendChild(grid);
        }
    }
});
