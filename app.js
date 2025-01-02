document.addEventListener('DOMContentLoaded', function() {
    let numPeople;
    let peopleNames = [];
    let items = [];

    // Toogle Screens with "Back" and "Next" buttons
    function toggleScreens(screenToHide, screenToShow) {
        document.getElementById(screenToHide).style.display = 'none';
        document.getElementById(screenToShow).style.display = 'block';
    }

    function handleScreenNavigation(buttonId) {
        const buttonParts = buttonId.match(/(next|back)Button(\d+)/);
        const buttonAction = buttonParts[1]; // "next" or "back"
        const screenId = parseInt(buttonParts[2], 10); // Screen number as integer

        const screenToHide = "screen" + screenId
        let screenToShow;
        if (buttonAction == 'next'){
            screenToShow = "screen" + (screenId + 1)
        }
        else{
            screenToShow = "screen" + (screenId - 1)
        }
        toggleScreens(screenToHide, screenToShow);
    }

    // ============================
    // Screen 0
    // ============================

    // When the "Start" button is clicked on Screen 0
    document.getElementById('startButton').addEventListener('click', function() {
        toggleScreens('screen0', 'screen1');
    });

    // ============================
    // Screen 1 (Number of Ppl Screen)
    // ============================

    // When the "Next" button is clicked on Screen 1
    document.getElementById('nextButton1').addEventListener('click', function() {
        numPeople = document.getElementById('numPeople').value; 
        
        if (!numPeople || numPeople < 1 || numPeople > 16) {
            alert("Please enter a valid number of people (1-16).");
            return;
        }

        // Edge Case: Person went back and reduced the number of ppl
        if(peopleNames.length > numPeople){ 
            peopleNames = peopleNames.slice(0, numPeople);
            updateNamesList();
        }
        handleScreenNavigation('nextButton1');
    });

    // When the "Back" button is clicked on Screen 1
    document.getElementById('backButton1').addEventListener('click', function() {
        handleScreenNavigation('backButton1')
    });

    // ============================
    // Screen 2 (Add Names Screen)
    // ============================

    // When the "Add Name" button is clicked
    document.getElementById('addNameButton').addEventListener('click', function() {
        const nameInput = document.getElementById('nameInput').value; // Get input name and remove extra spaces

        if (nameInput === "") {
            alert("Please enter a name.");
            return;
        }

        if (peopleNames.length >= numPeople) {
            alert("You have already added all the names.");
            return;
        }

        // Add name to the list
        peopleNames.push(nameInput);
        updateNamesList(); // Update the displayed list of names

        // Clear the input field after adding the name
        document.getElementById('nameInput').value = '';
    });

    // Function to update the list of names displayed on the screen
    function updateNamesList() {
        const namesList = document.getElementById('namesList');
        namesList.innerHTML = ''; // Clear the list before updating it

        // Create list items for each name and append them
        peopleNames.forEach((name, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = name;

            // Add a remove button for each name
            const removeButton = document.createElement('button');
            removeButton.textContent = "Remove";
            removeButton.addEventListener('click', function() {
                // Remove name from the array and update the list
                peopleNames.splice(index, 1);
                updateNamesList(); // Re-render the list
            });

            listItem.appendChild(removeButton);
            namesList.appendChild(listItem);
        });
    }

    // When the "Back" button is clicked on Screen 2
    document.getElementById('backButton2').addEventListener('click', function() {
        handleScreenNavigation('backButton2');
    });

    // When the "Next" button is clicked on Screen 2
    document.getElementById('nextButton2').addEventListener('click', function() {
        if (peopleNames.length != numPeople) {
            const remainingNames = numPeople - peopleNames.length;
            alert(`You haven't added all the names. Please add ${remainingNames} more name(s).`);
            return;
        }
        

        // Proceed to the next screen (screen3)
        handleScreenNavigation('nextButton2');
    });

    // ============================
    // Screen 3 (Filler For now)
    // ============================

    document.getElementById('backButton3').addEventListener('click', function() {
        handleScreenNavigation('backButton3');
    });
    document.getElementById('nextButton3').addEventListener('click', function() {
        handleScreenNavigation('nextButton3');
    });
    
    // ============================
    // Screen 4 (Add Items Manually Screen)
    // ============================

    let selectedNames = []; // Person who paid for item
    let isEditing = false;
    let editRow = null; 
    
    function resetModalState() {
        isEditing = false; // Reset to add mode
        editRow = null; // Clear the row reference
        document.getElementById('itemModal').style.display = 'none';
        document.getElementById('itemName').value = '';
        document.getElementById('numItems').value = '';
        document.getElementById('itemPrice').value = '';
        selectedNames = []; // Reset selected names
    }

    function editItem(row) {
        isEditing = true; // Set to edit mode
        editRow = row; // Save reference to the row being edited
    
        // Populate modal fields with existing row data
        document.getElementById('itemName').value = row.cells[0].textContent;
        document.getElementById('numItems').value = row.cells[1].textContent;
        document.getElementById('itemPrice').value = row.cells[2].textContent;
    
        // Reselect names
        selectedNames = row.cells[3].textContent.split(', ');
        document.querySelectorAll('.name-pill').forEach(pill => {
            pill.classList.toggle('selected', selectedNames.includes(pill.textContent));
        });
    
        // Show the modal (user will trigger saveItem after editing)
        document.getElementById('itemModal').style.display = 'block';
    }

    
    function deleteItem(row) {
        if (confirm("Are you sure you want to delete this item?")) {
            row.remove(); // Remove the row from the table
            // Optional: If using an array to store data, remove the item from the array
            // Example: items.splice(items.indexOf(item), 1);
        }
    }

    function saveItem() { // We are either editing a row or creating a new one
        const itemName = document.getElementById('itemName').value;
        const numItems = document.getElementById('numItems').value;
        const itemPrice = document.getElementById('itemPrice').value;

        // Validation to check if all fields are filled and if at least one name is selected
        if (!itemName || !numItems || !itemPrice || selectedNames.length === 0) {
            alert("Please fill out all fields and select at least one person.");
            return; // Stop execution if validation fails
        }
        

        if (isEditing) {
            // Update the existing row
            editRow.cells[0].textContent = itemName;
            editRow.cells[1].textContent = numItems;
            editRow.cells[2].textContent = itemPrice;
            editRow.cells[3].textContent = selectedNames.join(', ');
        } else {
            // Add new row to the table
            const table = document.getElementById('itemsList');
            const row = table.insertRow();
            row.innerHTML = `
                <td>${itemName}</td>
                <td>${numItems}</td>
                <td>${itemPrice}</td>
                <td>${selectedNames.join(', ')}</td>
                <td style="text-align:center;">
                    <button class="editBtn">Edit</button>
                    <button class="deleteBtn">Delete</button>
                </td>
            `;

            // Add event listeners for Edit and Delete buttons
            const editButton = row.querySelector('.editBtn');
            const deleteButton = row.querySelector('.deleteBtn');

            editButton.addEventListener('click', () => editItem(row));
            deleteButton.addEventListener('click', () => deleteItem(row));
        }
    
        resetModalState();
    }
    

    // Function to populate the name selection in the modal
    function populateNames() {
        const nameContainer = document.getElementById('namesSelection');
        nameContainer.innerHTML = ''; // Clear any existing names

        peopleNames.forEach(name => {
            const namePill = document.createElement('div');
            namePill.classList.add('name-pill');
            namePill.textContent = name;
            namePill.setAttribute('data-name', name);

            // Add click event to toggle selection
            namePill.addEventListener('click', () => {
                namePill.classList.toggle('selected');
                const name = namePill.getAttribute('data-name');
                if (namePill.classList.contains('selected')) {
                    selectedNames.push(name);
                } else {
                    selectedNames = selectedNames.filter(selected => selected !== name);
                }
            });

            nameContainer.appendChild(namePill);
        });
    }

    // Show the modal and populate names when adding a new item
    document.getElementById('addItemButton').addEventListener('click', function() {
        document.getElementById('itemModal').style.display = 'block';
        populateNames(); // Populate the names when the modal opens
    });

    // Cancel button to close the modal without saving
    document.getElementById('cancelItemButton').addEventListener('click', function() {
        document.getElementById('itemModal').style.display = 'none';
    });

    // Save button to add the item and close the modal
    document.getElementById('saveItemButton').addEventListener('click', saveItem)

   

    
    
});
