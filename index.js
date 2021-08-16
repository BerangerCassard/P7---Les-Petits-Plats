import {Recipe} from "./src/domain/model.class.js";
/**
 * Fetch Json data
 * */
const recipesData = './src/assets/data/recipes.json';
fetch(recipesData)
    .then(res => res.json())
    .then(data => {
    const recipesContainer = document.getElementById('recipesContainer');
    const ingredientsSuggestionsContainer = document.getElementById('ingredientsSuggestions');
    const ingredientsSearchBar = document.getElementById('searchIngredient');
    const appliancesSuggestionsContainer = document.getElementById('appareilsSuggestions');
    const appliancesSearchBar = document.getElementById('searchAppareil');
    const ingredients = document.getElementsByClassName("ingredientTag");
    const ingredientSelected = document.getElementById('ingredientTag');
    const applianceSelected = document.getElementById('applianceTag');
    const utensilSelected = document.getElementById('utensilTag');
    const searchBars = document.getElementsByClassName('search__tagsLists__frame__input');
    const utensilsSuggestionsContainer = document.getElementById('utensilsSuggestions');
    const utensilsSearchBar = document.getElementById('searchUstensile');
    const ingredientsSearchBarAndSuggestionsContainer = document.getElementById('ingredientsContainer');
    const appliancesSearchBarAndSuggestionsContainer = document.getElementById('appliancesContainer');
    const utensilsSearchBarAndSuggestionsContainer = document.getElementById('utensilsContainer');
    const appliances = document.getElementsByClassName('applianceTag');
    const utensils = document.getElementsByClassName('utensilTag');
    const ingredientSelectedBox = document.getElementById('ingredientSelectTag');
    const ingredientCross = document.getElementById('ingredientCross');
    const applianceSelectedBox = document.getElementById('applianceSelectTag');
    const applianceCross = document.getElementById('applianceCross');
    const utensilSelectedBox = document.getElementById('utensilSelectedTag');
    const utensilCross = document.getElementById('utensilCross');
    const mainSearchBar = document.getElementById('searchBar');

    let allRecipes = [];
    data.forEach(recipe => {
        const recipeInstance = new Recipe(recipe.id, recipe.name, recipe.servings, recipe.ingredients, recipe.time, recipe.description, recipe.appliance, recipe.ustensils);
        allRecipes.push(recipeInstance);
    });

    let allActiveRecipes = allRecipes.filter( recipe => recipe.active === true)

    /**
     * Deactivate all tags
     * */
    function deactivateTags(recipes){
        recipes.forEach(recipe => {
            recipe.activeTag.ingredientTag = false;
            recipe.activeTag.applianceTag = false;
            recipe.activeTag.utensilTag = false;
        });
    }
    deactivateTags(allRecipes)

    /**
     * Manage active recipes
     * */
    // count how many true value in array
    let trueCounterInActiveTag = []
    function maxTrueInAnyRecipe (tags) {
        trueCounterInActiveTag = []
        const keys = Object.values(tags)
        keys.forEach( value => {
            if(value === true) {
                trueCounterInActiveTag.push(value)
            }
        })
        return trueCounterInActiveTag
    }

    function activateAndDeactivateRecipes(recipes) {
        const areAllTagsFalse = recipes.every( recipe => maxTrueInAnyRecipe(recipe.activeTag).length === 0); // OKAY
        //console.log('areAllTagsFalse', areAllTagsFalse)
        const isOneTagTrue = recipes.some( recipe => maxTrueInAnyRecipe(recipe.activeTag).length === 1); // OKAY
        //console.log('isOneTagTrue', isOneTagTrue)
        const areTwoTagsTrue = recipes.some( recipe => maxTrueInAnyRecipe(recipe.activeTag).length === 2);
        //console.log('areTwoTagsTrue', areTwoTagsTrue)
        const areThreeTagsTrue = recipes.some( recipe => maxTrueInAnyRecipe(recipe.activeTag).length === 3)
        //console.log('areThreeTagsTrue', areThreeTagsTrue)

        if(areAllTagsFalse) {
            //console.log("all are false, trueCounterInActiveTag", trueCounterInActiveTag);
            recipes.forEach(recipe => recipe.active = true)
        } else if(areThreeTagsTrue) {
            //console.log('three tag is true, trueCounterInActiveTag', trueCounterInActiveTag);
            recipes.forEach(recipe => {
                if(maxTrueInAnyRecipe(recipe.activeTag).length < 3) {
                    recipe.active = false
                }
            })
        } else if(areTwoTagsTrue) {
            //console.log('two tag is true, trueCounterInActiveTag', trueCounterInActiveTag);
            recipes.forEach(recipe => {
                if(maxTrueInAnyRecipe(recipe.activeTag).length < 2) {
                    recipe.active = false
                }
            })
        } else if(isOneTagTrue) {
            //console.log('found at least 1 recipe with 1 True in activeTag, true count', trueCounterInActiveTag);
            recipes.forEach(recipe => {
                if(maxTrueInAnyRecipe(recipe.activeTag).length === 0) {
                    recipe.active = false
                }
            } )
        } else {
            console.log('no condition found, maximum True found : ', trueCounterInActiveTag)
        }
        return recipes
    }
    activateAndDeactivateRecipes(allRecipes);

    /**
     * Get lis of all Ingredients and keep uniq values
     * */
    let activeIngredients;
    function updateIngredientsUniqList(recipes) {
        let allIngredientsWithDoubles = [];
        // for each instance...
        recipes.forEach(recipe => {
            // loop through ingredients
            let t;
            for (t = 0; t < recipe.ingredients.length; t++) {
                // merge every ingredient to array
                allIngredientsWithDoubles = allIngredientsWithDoubles.concat(recipe.ingredients[t].ingredient.toLocaleLowerCase());
            }
        });
        // make this ingredients uniq through Set
        const allIngredientsUniqSet = new Set(allIngredientsWithDoubles);
        // save uniq ingredients list in variable
        activeIngredients = Array.from(allIngredientsUniqSet);
    }
    updateIngredientsUniqList(allRecipes);

    /**
     * Get list of all appliances and keep uniq values
     * */
    let activeAppliances;
    function updateAppliancesUniqList(recipes) {
        // map recipes to get appliances list
        const appliancesWithDoubles = recipes.map(recipe => recipe.appliance.toLowerCase());
        // make this appliances uniq through Set
        const appliancesUniqSet = new Set(appliancesWithDoubles);
        // save uniq appliances list in variable
        activeAppliances = Array.from(appliancesUniqSet);
    }
    updateAppliancesUniqList(allRecipes);
    /**
     * Get list of all Utensils and keep uniq values
     * */
    let allActiveUtensils;
    function updateUtensilsUniqList(recipes) {
        let allUtensilsWithDoubles = [];
        let i;
        // for each instance merge utensils into array
        for (i = 0; i < recipes.length; i++) {
            allUtensilsWithDoubles = allUtensilsWithDoubles.concat(recipes[i].ustensils);
        }
        // make this appliances uniq through Set
        const allUtensilsUniqSet = new Set(allUtensilsWithDoubles);
        // save uniq utensils list in variable
        allActiveUtensils = Array.from(allUtensilsUniqSet).map(utensil => utensil.toLocaleLowerCase());
    }
    updateUtensilsUniqList(allRecipes);

    function updateAllLists(recipes) {
        updateIngredientsUniqList(recipes);
        updateAppliancesUniqList(recipes);
        updateUtensilsUniqList(recipes)
    }

    /**
     * Principal Search Bar
     * */
    mainSearchBar.addEventListener( "keyup", ()=>  {
        if (mainSearchBar.value.match(/(.*[a-z]){3}/i)) {
            console.log('split', mainSearchBar.value.split(/[ ,]+/));
            const resultsArray = mainSearchBar.value.split(/[ ,]+/)
            resultsArray.forEach( result => {
                console.log('recipe', result)
                if(/^(?!\s*$).+/.test(result)) {
                    console.log('not empty')
                    allRecipes.forEach(recipe => {
                        if (recipe.name.match(result) || recipe.description.match(result) || recipe.appliance.match(result)) {
                            recipe.active = true;
                            console.log('plat qui correspond', recipe.name)
                        } else {
                            recipe.active = false
                        }
                        recipesContainer.innerHTML = '';
                        displayActiveCards(allRecipes);
                        removeClickForAllSuggestions()
                        updateAllLists(allRecipes.filter( recipe => recipe.active === true))
                        clickForAllSuggestions()
                    });
                } else {
                    console.log('empty')
                }
            })

        } else if (mainSearchBar.value.match(/(.*[a-z]){2}/i) || mainSearchBar.value.match(/(.*[a-z]){1}/i)) {
            recipesContainer.innerHTML = '';
        } else {
            allRecipes.forEach(recipe => {
                recipe.active = true;
                recipesContainer.innerHTML = '';
                displayActiveCards(allRecipes)
            })
            updateAllLists(allRecipes.filter( recipe => recipe.active === true))
        }
    })

        /**
     * Display all recipes cards
     * */
    function displayActiveCards(recipes) {
        recipes.forEach(recipe => {
            if(recipe.active === true) {
                recipesContainer.innerHTML += `${recipe.cardHTML()}`
            }
        })
    }
    displayActiveCards(allRecipes);

    /**
     * Key up on search bar to suggest lists of ingredients
     * */
    function keyUpGenerateSuggestions(searchBar, elements, container, classAtt) {
        // key up in search bar...
        searchBar.addEventListener("keyup", (event) => {
            // catch search bar value
            const elementInputValue = searchBar.value;
            // filter elements which include value
            const elementsMatchingResults = elements.filter(element => element.includes(elementInputValue));
            let suggestion = '';
            // if value not empty
            if (elementInputValue != '') {
                // add html to string Suggestion for each element
                elementsMatchingResults.forEach(result => suggestion += `<div class="suggestion ${classAtt} sketch">${result}</div>`);
                // inject Suggestion string/html in container
                container.innerHTML = suggestion;
            }
            else {
                // if value empty, clear container
                container.innerHTML = '';
            }
        });
    }
    keyUpGenerateSuggestions(ingredientsSearchBar, activeIngredients, ingredientsSuggestionsContainer, 'ingredientTag');
    keyUpGenerateSuggestions(appliancesSearchBar, activeAppliances, appliancesSuggestionsContainer, 'applianceTag');
    keyUpGenerateSuggestions(utensilsSearchBar, allActiveUtensils, utensilsSuggestionsContainer, 'utensilTag');
    /**
     * Double Click to display Suggestion
     * */
    function saveElementOnClick(elements, selection, box) {
        // for each element
        Array.from(elements).forEach(element => {
            element.addEventListener('click', (event) => {
                // selection text equal to element clicked
                selection.innerHTML = `${element.innerHTML}`;
                // set title attribute equal to text
                selection.setAttribute('title', selection.innerHTML);
                // display the box grid
                box.style.display = "grid";
            });
        });
    }


    function injectIngredientHTML() {
        // for each element
        activeIngredients.forEach(element => {
            // inject HTML
            ingredientsSuggestionsContainer.innerHTML += `<div class="suggestion ingredientTag sketch">${element}</div>`;
        });
        saveElementOnClick(ingredients, ingredientSelected, ingredientSelectedBox);
    }

    function clickForIngredientSuggestion() {
        const InputValue = ingredientsSearchBar.value;

        // if no input value in search bar
        if (!InputValue) {
            // clicking...
            ingredientsSearchBar.addEventListener('click',injectIngredientHTML);
        }
    }

    function removeClickForIngredientSuggestion() {
        const InputValue = ingredientsSearchBar.value;

        // if no input value in search bar
        if (!InputValue) {
            // clicking...
            ingredientsSearchBar.removeEventListener('click',injectIngredientHTML);
        }
    }

    function injectApplianceHTML() {
        // for each element
        activeAppliances.forEach(element => {
            // inject HTML
            appliancesSuggestionsContainer.innerHTML += `<div class="suggestion applianceTag sketch">${element}</div>`;
        });
        saveElementOnClick(appliances, applianceSelected, applianceSelectedBox);
    }

    function clickForApplianceSuggestion() {
        const InputValue = appliancesSearchBar.value;

        // if no input value in search bar
        if (!InputValue) {
            // clicking...
            appliancesSearchBar.addEventListener('click',injectApplianceHTML);
        }
    }

    function removeClickForApplianceSuggestion() {
        const InputValue = appliancesSearchBar.value;

        // if no input value in search bar
        if (!InputValue) {
            // clicking...
            appliancesSearchBar.removeEventListener('click',injectApplianceHTML);
        }
    }

    function injectUtensilHTML() {
        // for each element
        allActiveUtensils.forEach(element => {
            // inject HTML
            utensilsSuggestionsContainer.innerHTML += `<div class="suggestion utensilTag sketch">${element}</div>`;
        });
        saveElementOnClick(utensils, utensilSelected, utensilSelectedBox);
    }

    function clickForUtensilSuggestion() {
        const InputValue = utensilsSearchBar.value;

        // if no input value in search bar
        if (!InputValue) {
            // clicking...
            utensilsSearchBar.addEventListener('click',injectUtensilHTML);
        }
    }

    function removeClickForUtensilSuggestion() {
        const InputValue = utensilsSearchBar.value;

        // if no input value in search bar
        if (!InputValue) {
            // clicking...
            utensilsSearchBar.removeEventListener('click',injectUtensilHTML);
        }
    }

    function clickForAllSuggestions() {
        clickForIngredientSuggestion();
        clickForApplianceSuggestion();
        clickForUtensilSuggestion()
    }

    clickForAllSuggestions()

    function removeClickForAllSuggestions() {
        removeClickForIngredientSuggestion();
        removeClickForApplianceSuggestion();
        removeClickForUtensilSuggestion()
    }


    /**
     * Click on an ingredient to display it on the top
     * */
    function clickOnSuggestionSaveAsTag(searchBar, elements, selection, box) {
        // when keyup in search bars
        searchBar.addEventListener('keyup', () => {
            saveElementOnClick(elements, selection, box);
        });
    }
    clickOnSuggestionSaveAsTag(ingredientsSearchBar, ingredients, ingredientSelected, ingredientSelectedBox);
    clickOnSuggestionSaveAsTag(appliancesSearchBar, appliances, applianceSelected, applianceSelectedBox);
    clickOnSuggestionSaveAsTag(utensilsSearchBar, utensils, utensilSelected, utensilSelectedBox);

    /**
     * Click on Cross element effects
     * */
    function closeSelection(crossElement, selectionElement, selectionBox, tag) {
        // Click on Cross Element
        crossElement.addEventListener('click', (event) => {
            allRecipes.forEach( recipe => {
                recipe.activeTag[tag] = false
            })
            console.log('active tag', allRecipes.map(recipe => recipe.activeTag))
            // clear Element Text
            selectionElement.innerHTML = '';
            // display none Box
            selectionBox.style.display = 'none';
            recipesContainer.innerHTML = '';

            function activateAndDeactivateRecipesWhenClosing(recipes) {
                const areAllTagsFalse = recipes.every( recipe => maxTrueInAnyRecipe(recipe.activeTag).length === 0); // OKAY
                console.log('areAllTagsFalse', areAllTagsFalse)
                const isOneTagTrue = recipes.some( recipe => maxTrueInAnyRecipe(recipe.activeTag).length === 1); // OKAY
                console.log('isOneTagTrue', isOneTagTrue)
                const areTwoTagsTrue = recipes.some( recipe => maxTrueInAnyRecipe(recipe.activeTag).length === 2);
                console.log('areTwoTagsTrue', areTwoTagsTrue)
                const areThreeTagsTrue = recipes.some( recipe => maxTrueInAnyRecipe(recipe.activeTag).length === 3)
                console.log('areThreeTagsTrue', areThreeTagsTrue)

                if(areAllTagsFalse) {
                    console.log("all are false, trueCounterInActiveTag", trueCounterInActiveTag);
                    recipes.forEach(recipe => recipe.active = true)
                }
                else if(areTwoTagsTrue) {
                    console.log('two tag is true, trueCounterInActiveTag', trueCounterInActiveTag);
                    recipes.forEach(recipe => {
                        if(maxTrueInAnyRecipe(recipe.activeTag).length === 2) {
                            recipe.active = true
                        }
                    })
                }
                else if(isOneTagTrue) {
                    console.log('found at least 1 recipe with 1 True in activeTag, true count', trueCounterInActiveTag);
                    recipes.forEach(recipe => {
                        if(maxTrueInAnyRecipe(recipe.activeTag).length === 1 ) {
                            recipe.active = true
                        }
                    } )
                }
                else {
                    console.log('no condition found, maximum True found : ', trueCounterInActiveTag)
                }

                return recipes
            }

            activateAndDeactivateRecipesWhenClosing(allRecipes)

            displayActiveCards(allRecipes);
        });
    }
    closeSelection(ingredientCross, ingredientSelected, ingredientSelectedBox, "ingredientTag");
    closeSelection(applianceCross, applianceSelected, applianceSelectedBox, "applianceTag");
    closeSelection(utensilCross, utensilSelected, utensilSelectedBox, "utensilTag");
    /**
     * Focus on search bars effect
     * */
    Array.from(searchBars).forEach(searchBar => {
        // if focus on search bars
        searchBar.addEventListener('focus', () => {
            // increase size of search bar
            searchBar.style.width = "400px";
        });
    });
    /**
     * Click outside the search bar effects
     * */
    function resetSearchBarWithOutsideClick(container, suggestions, searchBar) {
        document.addEventListener('click', (event) => {
            // if i click outside container
            if (!container.contains(event.target)) {
                // clear container
                suggestions.innerHTML = '';
                // clear search bar value
                searchBar.value = '';
                // reset sear bar size to initial
                searchBar.style.width = '93px';
            }
        });
    }
    resetSearchBarWithOutsideClick(ingredientsSearchBarAndSuggestionsContainer, ingredientsSuggestionsContainer, ingredientsSearchBar);
    resetSearchBarWithOutsideClick(appliancesSearchBarAndSuggestionsContainer, appliancesSuggestionsContainer, appliancesSearchBar);
    resetSearchBarWithOutsideClick(utensilsSearchBarAndSuggestionsContainer, utensilsSuggestionsContainer, utensilsSearchBar);

    /**
     * Filter recipes per Ingredient Tag
     * */
    const ingredientMutations = new MutationObserver((mutations) => {
        // for each mutation
        mutations.forEach(mutation => {
            // if target affected
            if (mutation.target) {
                // reset active ingredients
                allRecipes.forEach(recipe => recipe.ingredientTag = false);
                // get attribute of target
                const modifiedTitle = mutation.target.getAttribute('title');
                function TagRecipesWithIngredient(recipes) {
                    recipes.forEach( recipe => {
                        if(recipe.ingredients.some( element => element.ingredient.toLowerCase() === modifiedTitle)) {
                            recipe.activeTag.ingredientTag = true;
                            console.log('recipe with ingredient :', recipe)
                        }
                    })
                    return recipes
                }
               allRecipes =  TagRecipesWithIngredient(allRecipes);
               allRecipes = activateAndDeactivateRecipes(allRecipes);
                // clear container HTML
                recipesContainer.innerHTML = '';
                // for each recipe inject HTML in container
                displayActiveCards(allRecipes);

            }
        });
    });
    // observe mutations on ingredient tag element
    ingredientMutations.observe(ingredientSelected, {
        attributes: true
    });
    /**
     * Filter recipes per Appliance tag
     * */
    const applianceMutations = new MutationObserver((mutations) => {
        // for each mutation
        mutations.forEach(mutation => {
            // if target affected
            if (mutation.target) {
                // reset active appliances
                allRecipes.forEach(recipe => recipe.applianceTag = false);
                // get attribute of target
                const modifiedTitle = mutation.target.getAttribute('title');
                function TagRecipesWithAppliance(recipes) {
                    recipes.forEach( recipe => {
                        if(recipe.appliance.toLowerCase() === modifiedTitle) {
                            recipe.activeTag.applianceTag = true;
                            console.log('recipe with appliance :', recipe)
                        }
                    })
                    return recipes
                }
                allRecipes =  TagRecipesWithAppliance(allRecipes);
                allRecipes = activateAndDeactivateRecipes(allRecipes);
                // clear container HTML
                recipesContainer.innerHTML = '';
                // for each recipe inject HTML in container
                displayActiveCards(allRecipes);
            }
        });
    });
    // observe mutations on appliance tag element
    applianceMutations.observe(applianceSelected, {
        attributes: true
    });
    /**
     * Filter recipes per Utensil tag
     * */
    const utensilMutations = new MutationObserver((mutations) => {
        // for each mutation
        mutations.forEach(mutation => {
            // if target affected
            if (mutation.target) {
                // reset active appliances
                allRecipes.forEach(recipe => recipe.utensilTag = false);
                // get attribute of target
                const modifiedTitle = mutation.target.getAttribute('title');
                function TagRecipesWithUtensil(recipes) {
                    recipes.forEach( recipe => {
                        if(recipe.ustensils.includes(modifiedTitle)) {
                            recipe.activeTag.utensilTag = true;
                            console.log('recipe with utensil', recipe)
                        }
                    })
                    return recipes
                }
                allRecipes =  TagRecipesWithUtensil(allRecipes);
                allRecipes = activateAndDeactivateRecipes(allRecipes);
                // clear container HTML
                recipesContainer.innerHTML = '';
                // for each recipe inject HTML in container
                displayActiveCards(allRecipes);
            }
        });
    });
    // observe mutations on utensil tag element
    utensilMutations.observe(utensilSelected, {
        attributes: true
    });
});
