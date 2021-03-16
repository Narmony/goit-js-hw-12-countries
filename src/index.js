import './styles.css';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import { notice, error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
const debounce = require('lodash.debounce');
import fetchCountries from './js/fetchCountries';
import countryCardTpl from './templates/country-card.hbs';
import listCountriesTpl from './templates/listOfCountries.hbs';


const refs = {
    cardContainer: document.querySelector('.js-country-container'),
    searchForm: document.querySelector('.js-search-input'),
}

const clear = function () { 
    refs.cardContainer.innerHTML = '';
}

function onSearch(e) {
    e.preventDefault();
    clear();

    const searchValue = e.target.value;
    if (searchValue === '') return true;

    fetchCountries(searchValue)
        .then(countries => {
            clear();
           if (countries.length > 10) {
                error({
                    title: 'Oh !',
                    text: 'Too many matches found. Please enter a more specific query!',
                    delay: 1000,
                })
                return;
            } if (countries.length >= 2 && countries.length <= 10) {
                renderCountryList(countries)
                return;
            }
            renderCountryCard(countries);
        })
        .catch(error => {
            notice({
                title: 'Oh !',
                text: 'Can not find this country in database. Please try again!',
                delay: 1000,
            })
        })     
}


function renderCountryCard(countries) {
    
        const country = countries[0];
        const markup = countryCardTpl(country);
        refs.cardContainer.innerHTML = markup;
}

function renderCountryList(countries) { 
    const markup = listCountriesTpl(countries);
    refs.cardContainer.innerHTML = markup;
}
refs.searchForm.addEventListener('input', debounce(onSearch, 500));


