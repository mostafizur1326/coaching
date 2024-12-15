const admissionTab = document.getElementById("admissionTab");
const addStudentTab = document.getElementById("addStudentTab");
const removeStudentTab = document.getElementById("removeStudentTab");
const addersTab = document.getElementById("addersTab");

const admissionTabContent = document.getElementById("admissionTabContent");
const addStudentTabContent = document.getElementById("addStudentTabContent");
const removeStudentTabContent = document.getElementById("removeStudentTabContent");
const addersTabContent = document.getElementById("addersTabContent");

// Admission Sub Tabs
const pendingTab = document.getElementById("pendingTab");
const confirmedTab = document.getElementById("confirmedTab");
const rejectedTab = document.getElementById("rejectedTab");

const pendingContent = document.getElementById("pendingContent");
const confirmedContent = document.getElementById("confirmedContent");
const rejectedContent = document.getElementById("rejectedContent");

// Handle switching between main tabs
admissionTab.addEventListener("click", () => {
  admissionTabContent.classList.remove("hidden");
  addStudentTabContent.classList.add("hidden");
  removeStudentTabContent.classList.add("hidden");
  addersTabContent.classList.add("hidden");

  // Update active tab styles
  setActiveTab(admissionTab);
  resetActiveTab([addStudentTab, removeStudentTab, addersTab]);
});

addStudentTab.addEventListener("click", () => {
  admissionTabContent.classList.add("hidden");
  addStudentTabContent.classList.remove("hidden");
  removeStudentTabContent.classList.add("hidden");
  addersTabContent.classList.add("hidden");

  // Update active tab styles
  setActiveTab(addStudentTab);
  resetActiveTab([admissionTab, removeStudentTab, addersTab]);
});

removeStudentTab.addEventListener("click", () => {
  admissionTabContent.classList.add("hidden");
  addStudentTabContent.classList.add("hidden");
  removeStudentTabContent.classList.remove("hidden");
  addersTabContent.classList.add("hidden");

  // Update active tab styles
  setActiveTab(removeStudentTab);
  resetActiveTab([admissionTab, addStudentTab, addersTab]);
});

addersTab.addEventListener("click", () => {
  admissionTabContent.classList.add("hidden");
  addStudentTabContent.classList.add("hidden");
  removeStudentTabContent.classList.add("hidden");
  addersTabContent.classList.remove("hidden");

  // Update active tab styles
  setActiveTab(addersTab);
  resetActiveTab([admissionTab, addStudentTab, removeStudentTab]);
});

// Handle switching between Admission sub-tabs
pendingTab.addEventListener("click", () => {
  pendingContent.classList.remove("hidden");
  confirmedContent.classList.add("hidden");
  rejectedContent.classList.add("hidden");

  setActiveTab(pendingTab);
  resetActiveTab([confirmedTab, rejectedTab]);
});

confirmedTab.addEventListener("click", () => {
  confirmedContent.classList.remove("hidden");
  pendingContent.classList.add("hidden");
  rejectedContent.classList.add("hidden");

  setActiveTab(confirmedTab);
  resetActiveTab([pendingTab, rejectedTab]);
});

rejectedTab.addEventListener("click", () => {
  rejectedContent.classList.remove("hidden");
  pendingContent.classList.add("hidden");
  confirmedContent.classList.add("hidden");

  setActiveTab(rejectedTab);
  resetActiveTab([pendingTab, confirmedTab]);
});

// Default active tab
admissionTab.click();
pendingTab.click();


// Helper functions to manage active tabs
function setActiveTab(tab) {
  tab.classList.add("border-blue-600", "text-blue-600");
}

function resetActiveTab(tabs) {
  tabs.forEach(tab => {
    tab.classList.remove("border-blue-600", "text-blue-600");
    tab.classList.add("border-transparent", "text-gray-700");
  });
}