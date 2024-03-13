// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyCI7vG7AgENVJTvTCIat536tVHxMgDYHfY",
  authDomain: "javatofirebase-2a038.firebaseapp.com",
  databaseURL: "https://javatofirebase-2a038-default-rtdb.firebaseio.com",
  projectId: "javatofirebase-2a038",
  storageBucket: "javatofirebase-2a038.appspot.com",
  messagingSenderId: "849207682175",
  appId: "1:849207682175:web:29a9c4f15b9b862b564b4a"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

function createInput(type, placeholder, className) {
  var input = document.createElement("input");
  input.type = type;
  input.placeholder = placeholder;
  input.className = className;  // Set the provided class
  return input;
}

function createContainerEntry(parentClassName, inputType1, inputPlaceholder1, inputType2, inputPlaceholder2) {
  var entry = document.createElement('div');
  entry.className = parentClassName;

  var inputGroup1 = document.createElement('div');
  inputGroup1.className = 'input-group';
  var input1 = createInput(inputType1, inputPlaceholder1, parentClassName);
  inputGroup1.appendChild(input1);

  var inputGroup2 = document.createElement('div');
  inputGroup2.className = 'input-group';
  var input2 = createInput(inputType2, inputPlaceholder2, parentClassName);
  inputGroup2.appendChild(input2);

  entry.appendChild(inputGroup1);
  entry.appendChild(inputGroup2);

  return entry;
}

function removeContainerEntries(container) {
  var dynamicEntries = container.querySelectorAll("." + container.className + " > div:not(:first-child)");
  dynamicEntries.forEach(function (entry) {
    container.removeChild(entry);
  });
}

// Function to get structured values from the container
function getStructuredValuesFromContainer(container, containerType) {
  var values = [];
  var inputs = container.querySelectorAll(".input-group input");

  console.log("inputs.length", inputs.length)

  /* for (var i = 0; i < inputs.length; i += 2) {
    var degree = inputs[i].value.trim();
    var year = inputs[i + 1] ? inputs[i + 1].value.trim() : '';

    if (degree !== "" && year !== "") {
      values.push({
        degree: degree,
        year: year
      });
    }
  } */

  for (var i = 0; i < inputs.length; i += 2) {
    var input1 = inputs[i].value.trim();
    var input2 = inputs[i + 1] ? inputs[i + 1].value.trim() : '';



    if (input1 !== "" && input2 !== "") {
      if (containerType == 1) {
        values.push({
          qualification: input1,
          qualificationYear: input2
        });
      }
      else if (containerType == 2) {
        values.push({
          experienc: input1,
          experiencYear: input2
        });
      }

    }


  }








  return values;
}

document.addEventListener("DOMContentLoaded", function () {
  var userName; // Declare userName at a higher scope
  var userEmail; // Declare userEmail at a higher scope
  var userForm = document.getElementById("userForm");
  var nameInput = document.getElementById("nameInput");
  var ageInput = document.getElementById("ageInput");
  var mobileInput = document.getElementById("mobileInput");
  var emailInput = document.getElementById("emailInput")
  var qualificationContainer = document.getElementById("qualifications-container");
  var experienceContainer = document.getElementById("experiences-container");
  var addQualificationButton = document.getElementById("addQualificationButton");
  var addExperienceButton = document.getElementById("addExperienceButton");

  addQualificationButton.addEventListener("click", function () {
    var qualificationEntry = createContainerEntry('qualification-entry', 'text', 'المؤهل مثال ثانوية عامة او بكالوريوس', 'text', 'سنة الحصول على المؤهل مثال 2009');
    qualificationContainer.appendChild(qualificationEntry);
    updateAddButtonVisibility(addQualificationButton, qualificationContainer);

    // Set focus on the newly added input
    var qualificationInputs = qualificationEntry.querySelectorAll(".input-group input");
    qualificationInputs[0].focus();

  });

  addExperienceButton.addEventListener("click", function () {
    var experienceEntry = createContainerEntry('experience-entry', 'text', 'جهة العمل مثال محلات ... او شركة ...', 'text', 'عدد سنوات أو شهور الخبرة');
    experienceContainer.appendChild(experienceEntry);
    updateAddButtonVisibility(addExperienceButton, experienceContainer);

    // Set focus on the newly added input
    var experienceInputs = experienceEntry.querySelectorAll(".input-group input");
    experienceInputs[0].focus();
  });

  qualificationContainer.addEventListener("input", function () {
    updateAddButtonVisibility(addQualificationButton, qualificationContainer);
  });

  experienceContainer.addEventListener("input", function () {
    updateAddButtonVisibility(addExperienceButton, experienceContainer);
  });

  // Submit event listener
  userForm.addEventListener("submit", function (event) {
    event.preventDefault();
    userName = nameInput.value;
    userEmail = emailInput.value;
    var userMobile = mobileInput;
    /* userName = nameInput.value; */
    var userAge = ageInput.value;
    var qualifications = getStructuredValuesFromContainer(qualificationContainer, 1);
    var experiences = getStructuredValuesFromContainer(experienceContainer, 2);


    var userData = {
      name: userName,
      age: userAge,
      mobile: userMobile,
      email:userEmail,
      qualifications: qualifications,
      experiences: experiences,

    };

    var newUserDataRef = database.ref("candidateForJob").push();
    newUserDataRef.set(userData)
      .then(function () {
        console.log("Data saved successfully");
        sendEmail(userName,userEmail)
        console.log("after saving data")
        userForm.reset();
        removeContainerEntries(experienceContainer);
        removeContainerEntries(qualificationContainer);
      })
      .catch(function (error) {
        console.error("Error saving data: ", error);
      });

    
  });

  

  function updateAddButtonVisibility(addButton, container) {
    addButton.style.display = container.querySelectorAll(".input-group input").length < 5 ? "block" : "none";
  }
});


function sendEmail(lcl_userName,lcl_userEmail) {
  // Make an AJAX request to your Node.js server endpoint for sending emails
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3000/send-email?userName=" + lcl_userName + "&userEmail=" + lcl_userEmail , true);
  xhr.send();
}
