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
    function populateSelectOptions(selectElement, countries, selectType) {
        resultsContainer.innerHTML= '';
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.CountryCode;
            option.textContent = `${country.name} (${country.CountryCode})`;
            selectElement.appendChild(option);
        });
        if (selectType == 'Resident') {
            selectElement.insertAdjacentHTML('afterbegin','<option Selected disabled>Select Resident Country </option>')
        } else  if (selectType == 'Destination') {
            selectElement.insertAdjacentHTML('afterbegin','<option Selected disabled>Select Destination Country </option>')

        }
    }

    populateSelectOptions(residentSelect, countries, 'Resident');
    populateSelectOptions(destinationSelect, countries, 'Destination');

    findCardsBtn.addEventListener('click', () => {
        const residentCode = residentSelect.value;
        const destinationCode = destinationSelect.value;
        const loader = document.getElementById("loader");
          // Remove previous error messages
  const existingErrors = document.querySelectorAll(".error-message");
  existingErrors.forEach((error) => error.remove());

  let valid = true;

  // Validate Resident Country
  if (!residentSelect.options[residentSelect.selectedIndex].hasAttribute("value")) {
    const residentField = document.getElementById("resident-country");
    const error = document.createElement("div");
    error.className = "error-message";
    error.style.color = "red";
    error.style.fontSize = "12px";
    error.textContent = "Please select a Resident Country.";
    residentField.parentElement.appendChild(error);
    valid = false;
  }

  // Validate Destination Country
  if (!destinationSelect.options[destinationSelect.selectedIndex].hasAttribute("value")) {
    const destinationField = document.getElementById("destination-country");
    const error = document.createElement("div");
    error.className = "error-message";
    error.style.color = "red";
    error.style.fontSize = "12px";
    error.textContent = "Please select a Destination Country.";
    destinationField.parentElement.appendChild(error);
    valid = false;
  }

  // Stop if validation fails
  if (!valid) return;
        loader.classList.remove("hidden");
        fetch(apiEndpoint)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                const cards = data[0].countries.filter(card => card.country == residentCode);
                loader.classList.add("hidden");
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
                <div class="Each-card-title"> 
                <h3>${card.cardName}</h3>
                <p><a href="${card.applyLinkURL}" target="_blank" class="travel-card-link">Apply Here</a></p>
                </div>
                
                <p><strong>Features:</strong> ${card.feeFeatures}</p>
                <p><strong>Supported Currencies:</strong> ${card.supportedCurrencies?.join(', ')}</p>
                
            `;
            resultsContainer.appendChild(cardElement);
        });
        // <p><strong>Type:</strong> ${card.cardType}</p>
    }
});
