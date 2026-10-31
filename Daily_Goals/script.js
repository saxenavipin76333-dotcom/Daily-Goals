const goalForm = document.getElementById("goal-form");
const goalInput = document.getElementById("goal-input");
const goalList = document.getElementById("goal-list");
const emptyMessage = document.getElementById("empty-message");
const todayDate = document.getElementById("today-date");
const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const remainingCount = document.getElementById("remaining-count");
const progressLabel = document.getElementById("progress-label");
const progressTrack = document.getElementById("progress-track");
const progressFill = document.getElementById("progress-fill");

let goals = [];
const savedGoals = localStorage.getItem("dailyGoals");

// Restore saved goals so the list survives a page refresh.
if (savedGoals) {
    try {
        goals = JSON.parse(savedGoals);
    } catch (error) {
        console.error("Could not read saved goals:", error);
    }
}

todayDate.textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
});

function saveGoals() {
    localStorage.setItem("dailyGoals", JSON.stringify(goals));
}

function updateProgress() {
    const total = goals.length;
    let completed = 0;

    for (let index = 0; index < goals.length; index += 1) {
        if (goals[index].completed) {
            completed += 1;
        }
    }

    const remaining = total - completed;
    let percentage = 0;

    if (total > 0) {
        percentage = (completed / total) * 100;
    }

    totalCount.textContent = total;
    completedCount.textContent = completed;
    remainingCount.textContent = remaining;
    progressLabel.textContent = completed + " of " + total + " complete";
    progressTrack.setAttribute("aria-valuemax", total);
    progressTrack.setAttribute("aria-valuenow", completed);
    progressFill.style.width = percentage + "%";
}

function renderGoals() {
    goalList.innerHTML = "";

    for (let index = 0; index < goals.length; index += 1) {
        const goal = goals[index];
        const listItem = document.createElement("li");
        const checkbox = document.createElement("input");
        const goalText = document.createElement("span");
        const deleteButton = document.createElement("button");

        listItem.className = "goal-item";
        if (goal.completed) {
            listItem.classList.add("completed");
        }

        checkbox.className = "goal-checkbox";
        checkbox.type = "checkbox";
        checkbox.checked = goal.completed;
        checkbox.setAttribute("aria-label", "Mark " + goal.text + " as complete");

        goalText.className = "goal-text";
        goalText.textContent = goal.text;

        deleteButton.className = "delete-button";
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", "Delete " + goal.text);

        checkbox.addEventListener("change", function () {
            goal.completed = checkbox.checked;
            saveGoals();
            renderGoals();
        });

        deleteButton.addEventListener("click", function () {
            goals.splice(index, 1);
            saveGoals();
            renderGoals();
        });

        listItem.appendChild(checkbox);
        listItem.appendChild(goalText);
        listItem.appendChild(deleteButton);
        goalList.appendChild(listItem);
    }

    emptyMessage.hidden = goals.length > 0;
    updateProgress();
}

goalForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const goalText = goalInput.value.trim();
    if (goalText === "") {
        return;
    }

    goals.push({
        text: goalText,
        completed: false
    });

    saveGoals();
    renderGoals();
    goalInput.value = "";
    goalInput.focus();
});

renderGoals();