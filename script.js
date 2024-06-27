document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('meal-form');
    const foodIdeas = document.getElementById('food-ideas');
    const regenerateButton = document.getElementById('regenerate');
    let allFoods = [];
    let currentRequirements = {};

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        currentRequirements = {
            calories: document.getElementById('calories').value ? parseInt(document.getElementById('calories').value) : null,
            protein: document.getElementById('protein').value ? parseInt(document.getElementById('protein').value) : null,
            carbs: document.getElementById('carbs').value ? parseInt(document.getElementById('carbs').value) : null,
            fat: document.getElementById('fat').value ? parseInt(document.getElementById('fat').value) : null,
            vegan: document.getElementById('vegan').checked,
            vegetarian: document.getElementById('vegetarian').checked,
            glutenFree: document.getElementById('gluten-free').checked
        };
        generateFoodIdeas();
    });

    regenerateButton.addEventListener('click', () => {
        generateFoodIdeas(true);
    });

    async function fetchFoodData(page = 1) {
        const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=&json=1&page=${page}&page_size=100`;
        try {
            console.log(`Fetching data from: ${url}`);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(`Received ${data.products.length} products from API`);
            return data.products;
        } catch (error) {
            console.error('Error fetching food data:', error);
            foodIdeas.innerHTML = `<p>Error fetching food data: ${error.message}. Please try again later.</p>`;
            return [];
        }
    }

    async function generateFoodIdeas(regenerate = false) {
        foodIdeas.innerHTML = '<p>Loading food ideas...</p>';
        regenerateButton.style.display = 'none';

        try {
            if (allFoods.length === 0 || regenerate) {
                allFoods = [];
                for (let i = 1; i <= 5; i++) {  // Fetch 5 pages of data
                    const foods = await fetchFoodData(i);
                    allFoods = allFoods.concat(foods);
                }
                console.log(`Total foods fetched: ${allFoods.length}`);
            }

            const ideas = allFoods.filter(food => {
                const nutrients = food.nutriments;
                return (
                    (currentRequirements.calories === null || (nutrients['energy-kcal_100g'] && nutrients['energy-kcal_100g'] <= currentRequirements.calories)) &&
                    (currentRequirements.protein === null || (nutrients.proteins_100g && nutrients.proteins_100g >= currentRequirements.protein)) &&
                    (currentRequirements.carbs === null || (nutrients.carbohydrates_100g && nutrients.carbohydrates_100g <= currentRequirements.carbs)) &&
                    (currentRequirements.fat === null || (nutrients.fat_100g && nutrients.fat_100g <= currentRequirements.fat)) &&
                    (!currentRequirements.vegan || food.ingredients_analysis_tags?.includes('en:vegan')) &&
                    (!currentRequirements.vegetarian || food.ingredients_analysis_tags?.includes('en:vegetarian')) &&
                    (!currentRequirements.glutenFree || !food.allergens_tags?.includes('en:gluten'))
                );
            });

            console.log(`Filtered ideas: ${ideas.length}`);
            displayFoodIdeas(ideas.slice(0, 10));  // Display only 10 ideas
            regenerateButton.style.display = ideas.length > 10 ? 'block' : 'none';
        } catch (error) {
            console.error('Error generating food ideas:', error);
            foodIdeas.innerHTML = `<p>Error generating food ideas: ${error.message}. Please try again later.</p>`;
        }
    }

    function displayFoodIdeas(ideas) {
        foodIdeas.innerHTML = '';
        if (ideas.length === 0) {
            foodIdeas.innerHTML = '<p>No food ideas found matching your criteria. Try adjusting your requirements.</p>';
        } else {
            const ul = document.createElement('ul');
            ideas.forEach(food => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <h3>${food.product_name || 'Unknown Product'}</h3>
                    <p>Calories: ${food.nutriments['energy-kcal_100g'] || 'N/A'} kcal/100g</p>
                    <p>Protein: ${food.nutriments.proteins_100g || 'N/A'} g/100g</p>
                    <p>Carbs: ${food.nutriments.carbohydrates_100g || 'N/A'} g/100g</p>
                    <p>Fat: ${food.nutriments.fat_100g || 'N/A'} g/100g</p>
                    <p>Dietary: ${food.ingredients_analysis_tags?.includes('en:vegan') ? 'Vegan, ' : ''}
                                ${food.ingredients_analysis_tags?.includes('en:vegetarian') ? 'Vegetarian, ' : ''}
                                ${!food.allergens_tags?.includes('en:gluten') ? 'Gluten-Free' : ''}</p>
                `;
                ul.appendChild(li);
            });
            foodIdeas.appendChild(ul);
        }
    }
});
