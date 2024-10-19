const numCourseCredit = document.getElementById('num_course_credit');
        const checkboxes = document.querySelectorAll('#days_container input[type="checkbox"]');
        let maxSelectableDays = 0;

        // Function to limit the number of checkboxes selected
        function handleCheckboxLimit() {
            const selectedCheckboxes = document.querySelectorAll('#days_container input[type="checkbox"]:checked').length;
            checkboxes.forEach((checkbox) => {
                if (!checkbox.checked) {
                    checkbox.disabled = selectedCheckboxes >= maxSelectableDays;  // Disable unselected boxes if limit reached
                }
            });
        }

        // Event listener for when the number of credits changes
        numCourseCredit.addEventListener('input', function() {
            const credit = parseInt(this.value);

            if (!isNaN(credit) && credit >= 1 && credit <= 5) {
                maxSelectableDays = credit;  // Set the number of selectable days to the number of credits
            } else {
                maxSelectableDays = 0;  // Reset if invalid input
            }

            checkboxes.forEach((checkbox) => {
                checkbox.checked = false;  // Uncheck all boxes when credits change
                checkbox.disabled = false;  // Enable all checkboxes initially
            });
            handleCheckboxLimit();  // Update the UI based on the new credit value
        });

        // Event listener for when checkboxes are clicked
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', handleCheckboxLimit);
        });