document.addEventListener('DOMContentLoaded', () => {
    const countries = [
        { name: "United States", CountryCode: "US" },
        { name: "Canada", CountryCode: "CA" },
        { name: "Germany", CountryCode: "DE" },
        { name: "France", CountryCode: "FR" },
        { name: "United Kingdom", CountryCode: "GB" },
        { name: "Australia", CountryCode: "AU" },
        { name: "Japan", CountryCode: "JP" },
        { name: "South Korea", CountryCode: "KR" },
        { name: "Sweden", CountryCode: "SE" },
        { name: "Switzerland", CountryCode: "CH" },
        { name: "Singapore", CountryCode: "SG" },
        { name: "Netherlands", CountryCode: "NL" },
        { name: "Norway", CountryCode: "NO" },
        { name: "New Zealand", CountryCode: "NZ" },
        { name: "Finland", CountryCode: "FI" }
    ];

    const residentSelect = document.getElementById('resident-country');
    const destinationSelect = document.getElementById('destination-country');
    const findCardsBtn = document.getElementById('find-cards');
    const resultsContainer = document.getElementById('card-results');

    const apiEndpoint = "https://dev-22v50f89c7s3guk.api.raw-labs.com/TravelCardFinder"; 

    function populateSelectOptions(selectElement, countries) {
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.CountryCode;
            option.textContent = `${country.name} (${country.CountryCode})`;
            selectElement.appendChild(option);
        });
    }

    populateSelectOptions(residentSelect, countries);
    populateSelectOptions(destinationSelect, countries);

    findCardsBtn.addEventListener('click', () => {
        const residentCode = residentSelect.value;
        const destinationCode = destinationSelect.value;

        if (!residentCode || !destinationCode) {
            alert('Please select both resident and destination countries.');
            return;
        }

        fetch(apiEndpoint)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                const cards = data.countries.filter(card => card.country == residentCode 

                );
                displayCards(cards);
            })
            .catch(error => {
                console.error('Error fetching travel cards:', error);
                resultsContainer.innerHTML = '<p>Failed to fetch travel card data. Please try again later.</p>';
            });
    });

    function displayCards(cards) {
        const filteredTravelCards = cards[0].travelCards.filter(card => 
            card.eligibleCountries.some(country => country.CountryCode === destinationSelect.value)
          );
        resultsContainer.innerHTML = '';
        if (cards.length === 0) {
            resultsContainer.innerHTML = '<p>No travel cards found for the selected criteria.</p>';
            return;
        }
        filteredTravelCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.innerHTML = `
                <h3>${card.cardName}</h3>
                <p><strong>Type:</strong> ${card.cardType}</p>
                <p><strong>Features:</strong> ${card.feeFeatures}</p>
                <p><strong>Supported Currencies:</strong> ${card.supportedCurrencies?.join(', ')}</p>
                <p><a href="${card.applyLinkURL}" target="_blank">Apply Here</a></p>
            `;
            resultsContainer.appendChild(cardElement);
        });
    }
});
