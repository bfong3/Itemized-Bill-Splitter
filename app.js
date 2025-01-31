document.addEventListener('DOMContentLoaded', function() {
    let numPeople; // Number of ppl
    let peopleNames = []; // Names of ppl
    let amountSpent = {}; // How much each person spent
    let totalCost = 0; // Cost of Bill

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

    const numPeopleSelect = document.getElementById('numPeople');

    for (let i = 1; i <= 16; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        numPeopleSelect.appendChild(option);
    }

    // When the "Next" button is clicked on Screen 1
    document.getElementById('nextButton1').addEventListener('click', function() {
        numPeople = parseInt(document.getElementById('numPeople').value);
        console.log(`This is the new numPeople ${numPeople}`);
        handleScreenNavigation('nextButton1');
    });

    // When the "Back" button is clicked on Screen 1
    document.getElementById('backButton1').addEventListener('click', function() {
        handleScreenNavigation('backButton1');
    });

    // ============================
    // Screen 2 (Add Names Screen)
    // ============================   

    function openNameModal() {
        if (peopleNames.length == numPeople) {
            alert(`You've already added ${numPeople} names. Press "Next" to proceed or go back to change the number of people.`);
            return;
        }
        console.log(`The name modal is open`);
        const modal = document.getElementById('nameModal');
        const container = document.getElementById('nameRowsContainer');
        container.innerHTML = ''; // Clear previous rows if the modal was opened before
    
        // Create the specified number of rows for name input
        for (let i = 1; i <= numPeople - peopleNames.length; i++) {
            const row = document.createElement('div');
            row.classList.add('name-row');
            
            row.innerHTML = `
                <label for="name${i}">Name ${i}:</label>
                <input type="text" id="name${i}" name="name${i}" placeholder="Enter name">
            `;
            
            container.appendChild(row);
        }
    
        modal.style.display = 'block';  // Show the modal
        console.log(`The name modal should be showing`);
    }

    function closeNameModal() {
        nameModal.style.display = 'none'; // Hide the modal
    }

     // Function to update the list of names displayed on the screen
     function saveNames() {
        const nameInputs = document.querySelectorAll('#nameRowsContainer input');

        // Add all new names to peopleNames array
        nameInputs.forEach(input => {
            const name = input.value.trim();
            if (name) {
                peopleNames.push(name);  // Add non-empty names to the array
            }
        });

        // Update the sidebar to reflect the new list
        updateNameSidebar();

        closeNameModal();
    }

    function updateNameSidebar() {
        const nameList = document.getElementById('namesList');
        nameList.innerHTML = '';  // Clear the list before updating
    
        peopleNames.forEach((name, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${name}`;
    
            // Add remove button for each name
            const removeButton = document.createElement('span');
            removeButton.textContent = '❌';  // The red "X" symbol
            removeButton.classList.add('remove-btn'); 
            removeButton.style.color = 'red';  // Set color to red
            removeButton.style.cursor = 'pointer';  // Makes it look clickable

            removeButton.addEventListener('click', function() {
                // Remove the name from the array
                peopleNames.splice(index, 1);
                updateNameSidebar();  // Re-render the updated list
            });
    
            listItem.appendChild(removeButton);
            nameList.appendChild(listItem);
        });
    }

    // When the "Add Name" button is clicked
    document.getElementById('addNameButton').addEventListener('click', openNameModal);

    document.getElementById('saveNamesButton').addEventListener('click', saveNames);

    document.getElementById('closeModalButton').addEventListener('click', closeNameModal);

    // When the "Back" button is clicked on Screen 2
    document.getElementById('backButton2').addEventListener('click', function() {
        handleScreenNavigation('backButton2');
    });

    // When the "Next" button is clicked on Screen 2
    document.getElementById('nextButton2').addEventListener('click', function() {
        if (peopleNames.length != numPeople) {
            const remainingNames = numPeople - peopleNames.length;
            const keyword = (remainingNames > 0) ?  "add" : "remove" 
            alert(`Invalid number of names inputted. Please ${keyword} ${Math.abs(remainingNames)} name(s).`);
            return;
        }
        
        // Initialize spending tracker
        amountSpent = {}
        peopleNames.forEach(name => {
            amountSpent[name] = 0; // Set each person's spending to 0
        });

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
        document.getElementById('numItems').value = 1;
        document.getElementById('itemName').value = '';
        document.getElementById('itemPrice').value = '';
        selectedNames = []; // Reset selected names
    }
    
    function repopulateModalFields(row){
        // Populate modal fields with existing row data
        document.getElementById('numItems').value = row.cells[0].textContent;
        document.getElementById('itemName').value = row.cells[1].textContent;
        document.getElementById('itemPrice').value = row.cells[2].textContent;
    
        // Reselect names
        selectedNames = row.cells[3].textContent.split(', ');
        document.querySelectorAll('.name-pill').forEach(pill => {
            pill.classList.toggle('selected', selectedNames.includes(pill.textContent));
        });
    } 

    function editItem(row) {
        isEditing = true; // Set to edit mode
        editRow = row; // Save reference to the row being edited
        
        repopulateModalFields(row);
        updateAmountSpent(row, "subtract");
        // Show the modal (user will trigger saveItem after editing)
        document.getElementById('itemModal').style.display = 'block';
    }

    function deleteItem(row) {
        if (confirm("Are you sure you want to delete this item?")) {
            row.remove(); // Remove the row from the table
            updateAmountSpent(row, "subtract");
            console.log("Amount Spent by Each Person:");
            console.table(amountSpent);
        }
    }

    function saveItem() { // We are either editing a row or creating a new one
        const numItems = document.getElementById('numItems').value;
        const itemName = document.getElementById('itemName').value;
        const itemPrice = document.getElementById('itemPrice').value;

        // Validation to check if all fields are filled and if at least one name is selected
        if (!itemName || !numItems || !itemPrice || selectedNames.length === 0) {
            alert("Please fill out all fields and select at least one person.");
            return; // Stop execution if validation fails
        }
        

        if (isEditing) {
            // Update the existing row
            editRow.cells[0].textContent = numItems;
            editRow.cells[1].textContent = itemName;
            editRow.cells[2].textContent = itemPrice;
            editRow.cells[3].textContent = selectedNames.join(', ');
            updateAmountSpent(editRow, "add");
        } else {
            // Add new row to the table
            const table = document.getElementById('itemsList');
            const row = table.insertRow();
            row.innerHTML = `
                <td>${numItems}</td>
                <td>${itemName}</td>
                <td>${itemPrice}</td>
                <td>${selectedNames.join(', ')}</td>
                <td style="text-align:center;">
                    <button class="editBtn">✏️</button>
                    <button class="deleteBtn">❌</button>
                </td>
            `;

            // Add event listeners for Edit and Delete buttons
            const editButton = row.querySelector('.editBtn');
            const deleteButton = row.querySelector('.deleteBtn');

            editButton.addEventListener('click', () => editItem(row));
            deleteButton.addEventListener('click', () => deleteItem(row));
            updateAmountSpent(row, "add");
        }
    
        resetModalState();
        console.table(amountSpent);
    }
    
    // Function to populate the name selection in the modal
    function populateNames() {
        const nameContainer = document.getElementById('namesSelection');
        nameContainer.innerHTML = ''; // Clear any existing names
        
        // Create Select All and Deselect All pills
        const selectAllPill = document.createElement('div');
        selectAllPill.classList.add('name-pill', 'control-pill');
        selectAllPill.textContent = 'Select All';
        selectAllPill.setAttribute('id', 'selectAllPill');
    
        const deselectAllPill = document.createElement('div');
        deselectAllPill.classList.add('name-pill', 'control-pill');
        deselectAllPill.textContent = 'Deselect All';
        deselectAllPill.setAttribute('id', 'deselectAllPill');
        
        // Create container for the two control pills
        const controlContainer = document.createElement('div');
        controlContainer.classList.add('control-pill-container');
        
        // Append both pills to the control container
        controlContainer.appendChild(deselectAllPill);
        controlContainer.appendChild(selectAllPill);
    
        // Add event listeners to Select All and Deselect All pills
        selectAllPill.addEventListener('click', () => {
            const namePills = document.querySelectorAll('.name-pill');
            const isAllSelected = Array.from(namePills).every(pill => pill.classList.contains('selected'));
            
            if (!isAllSelected) {
                // If not all are selected, select them
                namePills.forEach(pill => pill.classList.add('selected'));
                selectedNames = [...peopleNames]; // Add all names to selected names array
            }
            // If all are selected, do nothing (i.e., don't unselect them)
        });
    
        deselectAllPill.addEventListener('click', () => {
            const namePills = document.querySelectorAll('.name-pill');
            namePills.forEach(pill => pill.classList.remove('selected'));
            selectedNames = []; // Clear selected names array
        });
        
        // Create a container for the name pills
        const pillContainer = document.createElement('div');
        pillContainer.classList.add('pill-grid');
        
        // Create the name pills dynamically
        peopleNames.forEach(name => {
            const namePill = document.createElement('div');
            namePill.classList.add('name-pill');
            namePill.textContent = name;
            namePill.setAttribute('data-name', name);
            
            // Add click event to toggle selection of individual name pills
            namePill.addEventListener('click', () => {
                namePill.classList.toggle('selected');
                const name = namePill.getAttribute('data-name');
                if (namePill.classList.contains('selected')) {
                    selectedNames.push(name);
                } else {
                    selectedNames = selectedNames.filter(selected => selected !== name);
                }
            });
    
            pillContainer.appendChild(namePill);
        });
        
        // Append everything to the main container
        nameContainer.appendChild(pillContainer);
        nameContainer.appendChild(controlContainer);  // Add the control buttons (Select All, Deselect All)
    }
    
    function updateAmountSpent(row, operation){
        const costOfItem = parseFloat(row.cells[2].textContent);
        const boughtItem = row.cells[3].textContent.split(', ');
        const costPerPerson = costOfItem / boughtItem.length;

        if (operation == "add"){
            boughtItem.forEach((name) => {
                amountSpent[name] += costPerPerson;
            });
            totalCost += costOfItem;
        }
        else{
            boughtItem.forEach((name) => {
                amountSpent[name] -= costPerPerson;
            });
            totalCost -= costOfItem; 
        }
    }

    function applyTaxAndTip(add = true){
        const taxAmount = parseFloat(document.getElementById('taxAmount').value) || 0;
        const tipAmount = parseFloat(document.getElementById('tipAmount').value) || 0;
        const taxAndTip = taxAmount + tipAmount;

        // Get the selected division method (either "evenly" or "proportional")
        const isEvenly = document.getElementById('evenlyRadio').checked;
        const isProportional = document.getElementById('proportionalRadio').checked

        if (taxAmount < 0 || tipAmount < 0) {
            alert("Tax and Tip amounts must be 0 or greater.");
            return; // Stop execution if validation fails
        }

        // If tax or tip is entered, check if a division method is selected
        if ((taxAmount > 0 || tipAmount > 0) && !isProportional && !isEvenly) {
            alert("Please select how you want to divide the tax and tip (evenly or proportionally).");
            return;
        }
    
        // Proceed with the tax and tip logic (divide them based on selected method)
        if (isProportional) {
            Object.keys(amountSpent).forEach(key => {
                const personPercentage = amountSpent[key] / totalCost;
                console.log(`${key} has ${personPercentage * 100}% of the total cost.`);
                const addedAmount = personPercentage * taxAndTip;
                console.log(`${key} has gained ${addedAmount} of the ${taxAndTip} tax and tip.`);
                amountSpent[key] += add ? addedAmount : -addedAmount;
                
            });
            console.log('Applying proportional division...');
        } 
        else {
            const splitAmount = taxAndTip / numPeople;
            Object.keys(amountSpent).forEach(key => {
                amountSpent[key] += add ? splitAmount : -splitAmount;
            });
            console.log('Applying even division...');
        }
        totalCost += add ? taxAndTip : -taxAndTip;;
    }

    function deleteTable(){
        if (confirm("Are you sure you want to do back? All items will be removed.")) {
            const tableBody = document.getElementById('itemsList');
            tableBody.innerHTML = ''; // Removes all rows in the table

            // Reset dictionary values to 0
            Object.keys(amountSpent).forEach(key => {
                amountSpent[key] = 0;
            });
            totalCost = 0;
        }
    }

    // Show the modal and populate names when adding a new item
    document.getElementById('addItemButton').addEventListener('click', function() {
        document.getElementById('itemModal').style.display = 'block';
        populateNames(); // Populate the names when the modal opens
    });

    // Cancel button to close the modal without saving
    document.getElementById('cancelItemButton').addEventListener('click', function() {
        resetModalState();
        document.getElementById('itemModal').style.display = 'none';
    });

    // Save button to add the item and close the modal
    document.getElementById('saveItemButton').addEventListener('click', saveItem)

    document.getElementById('applyTaxTipButton').addEventListener('click', function() {
        applyTaxAndTip(true);
        // After applying the tax and tip, close the modal and reset inputs
        document.getElementById('taxTipModal').style.display = 'none';
        document.querySelector('.modal-container').style.display = 'none'; 
        populateAmountOwedTable();
        handleScreenNavigation('nextButton4');
    });   

    document.getElementById('cancelTaxTipButton').addEventListener('click', function() {
        document.getElementById('taxTipModal').style.display = 'none';
    });

    document.getElementById('backButton4').addEventListener('click', function() {
        deleteTable();
        handleScreenNavigation('backButton4');
    });

    document.getElementById('nextButton4').addEventListener('click', function() {
        console.log(`This is the total cost: ${totalCost}`);
        document.getElementById('taxTipModal').style.display = 'block';
        document.querySelector('.modal-container').style.display = 'block'; 
    });
    
    // ============================
    // Screen 5 (Show Table)
    // ============================

    function populateAmountOwedTable() {
        const amountOwedTable = document.getElementById('amountOwedList');
        amountOwedTable.innerHTML = ''; // Clear any existing content
    
        // Iterate over the amountSpent dictionary and add a row for each person
        Object.keys(amountSpent).forEach(person => {
            const row = document.createElement('tr');
            
            // Add Name column
            const nameCell = document.createElement('td');
            nameCell.textContent = person;
            row.appendChild(nameCell);
    
            // Add Amount Owed column (rounded to 2 decimal places)
            const amountCell = document.createElement('td');
            amountCell.textContent = `$${parseFloat(amountSpent[person]).toFixed(2)}`;
            row.appendChild(amountCell);
    
            // Append the row to the table
            amountOwedTable.appendChild(row);
        });
    }
    
    document.getElementById('backButton5').addEventListener('click', function() {
        // Navigate back to screen 4
        applyTaxAndTip(false);
        handleScreenNavigation('backButton5', 'screen4');
    });
    
    document.getElementById('homeButton').addEventListener('click', function() {
        location.reload();
    });

});
