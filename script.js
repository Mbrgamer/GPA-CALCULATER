let courseCount = 1;

document.getElementById("add-course").addEventListener("click", function () {
    courseCount++;
    const coursesContainer = document.getElementById("courses-container");

    const newCourse = document.createElement("div");
    newCourse.classList.add("course");

    newCourse.innerHTML = `
        <div class="course-info">
            <label for="course-credit-${courseCount}">Credit Hours (Course ${courseCount}):</label>
            <input type="number" id="course-credit-${courseCount}" placeholder="e.g., 3" required>

            <label for="course-grade-${courseCount}">Grade (Course ${courseCount}):</label>
            <input type="text" id="course-grade-${courseCount}" placeholder="A, B+, etc." required>
        </div>

        <label for="course-repeated-${courseCount}">Is this course repeated?</label>
        <input type="checkbox" id="course-repeated-${courseCount}">

        <div class="previous-grade" id="previous-grade-${courseCount}" style="display: none;">
            <label for="previous-grade-input-${courseCount}">Previous Grade:</label>
            <input type="text" id="previous-grade-input-${courseCount}" placeholder="A, B+, etc.">
        </div>
    `;
    
    coursesContainer.appendChild(newCourse);

    const repeatedCheckbox = document.getElementById(`course-repeated-${courseCount}`);
    const previousGradeContainer = document.getElementById(`previous-grade-${courseCount}`);

    repeatedCheckbox.addEventListener("change", function () {
        previousGradeContainer.style.display = this.checked ? "block" : "none";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const repeatedCheckboxCourse1 = document.getElementById("course-repeated-1");
    const previousGradeContainerCourse1 = document.getElementById("previous-grade-1");
    
    if (repeatedCheckboxCourse1.checked) {
        previousGradeContainerCourse1.style.display = "block";
    } else {
        previousGradeContainerCourse1.style.display = "none";
    }

    repeatedCheckboxCourse1.addEventListener("change", function () {
        previousGradeContainerCourse1.style.display = this.checked ? "block" : "none";
    });
});

// Recalculate GPA when the button is clicked
document.getElementById("gpa-form").addEventListener("submit", function (e) {
    e.preventDefault();

    document.getElementById("gpa-result").textContent = "";

    const currentGPA = parseFloat(document.getElementById("current-gpa").value);
    const completedCredits = parseFloat(document.getElementById("completed-credits").value);

    let totalPoints = currentGPA * completedCredits;
    let totalCreditHours = completedCredits; // Do NOT add credits for repeated courses

    let valid = true;

    // Grade point mappings
    const gradePoints = {
        "A": 4.00,
        "A-": 3.67,
        "B+": 3.33,
        "B": 3.00,
        "B-": 2.67,
        "C+": 2.33,
        "C": 2.00,
        "C-": 1.67,
        "D+": 1.33,
        "D": 1.00,
        "D-": 0.67,
        "F": 0.00
    };

    for (let i = 1; i <= courseCount; i++) {
        const grade = document.getElementById(`course-grade-${i}`).value.trim();
        const creditHours = parseFloat(document.getElementById(`course-credit-${i}`).value);
        const isRepeated = document.getElementById(`course-repeated-${i}`).checked;
        const previousGrade = document.getElementById(`previous-grade-input-${i}`).value.trim();

        // Check if grade and credit hour are valid
        if (gradePoints[grade] && creditHours > 0) {
            let points = gradePoints[grade] * creditHours;

            if (isRepeated && previousGrade && gradePoints[previousGrade] !== undefined) {
                // Subtract points for previous grade and add new grade points
                points -= gradePoints[previousGrade] * creditHours; // Subtract old grade
            }

            totalPoints += points;
        } else {
            valid = false;
            break;
        }
    }

    if (valid && totalCreditHours > 0) {
        const gpa = (totalPoints / totalCreditHours).toFixed(3);
        document.getElementById("gpa-result").textContent = `Your GPA is: ${gpa}`;
    } else {
        document.getElementById("gpa-result").textContent = "Invalid input";
    }
});
