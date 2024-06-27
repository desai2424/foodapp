document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('meal-form');
    const foodIdeas = document.getElementById('food-ideas');
    const regenerateButton = document.getElementById('regenerate');
    let currentPage = 1;
    let currentRequirements = {};

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        currentPage = 1;
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
        currentPage++;
        generateFoodIdeas();
    });

    async function fetchFoodData() {
        let url = `https://world.openfoodfacts.org/cgi/search.pl?action=process&json=1&page=${currentPage}&page_size=50`;
        
        if (currentRequirements.vegan) url += '&tagtype_0=categories&tag_contains_0=contains&tag_0=vegan';
        if (currentRequirements.vegetarian) url += '&tagtype_0=categories&tag_contains_0=contains&tag_0=vegetarian';
        if (currentRequirements.glutenFree) url += '&tagtype_1=allergens&tag_contains_1=does_not_contain&tag_1=gluten';

        // Add nutrient filters
        if (currentRequirements.calories) url += `&nutriment_0=energy-kcal_100g&nutriment_compare_0=lte&nutriment_value_0=${currentRequirements.calories}`;
        if (currentRequirements.protein) url += `&nutriment_1=proteins_100g&nutriment_compare_1=gte&nutriment_value_1=${currentRequirements.protein}`;
        if (currentRequirements.carbs) url += `&nutriment_2=carbohydrates_100g&nutriment_compare_2=lte&nutriment_value_2=${currentRequirements.carbs}`;
        if (currentRequirements.fat) url += `&nutriment_3=fat_100g&nutriment_compare_3=lte&nutriment_value_3=${currentRequirements.fat}`;

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

    async function generateFoodIdeas() {
        foodIdeas.innerHTML = '<p>Loading food ideas...</p>';
        regenerateButton.style.display = 'none';

        try {
            const foods = await fetchFoodData();
            console.log(`Filtered foods: ${foods.length}`);
            displayFoodIdeas(foods.slice(0, 10));  // Display only 10 ideas
            regenerateButton.style.display = foods.length > 0 ? 'block' : 'none';
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
