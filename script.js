"use strict";

window.addEventListener("DOMContentLoaded", init);
const url = "https://petlatkea.dk/2021/hogwarts/students.json";

let allStudents = [];

let expelledStudents = [];

const Student = {
  firstName: "",
  middleName: "-unknown-",
  nickName: "-unknown-",
  lastName: "",
  imageSrc: "",
  house: "",
  studentStatus: true,
  prefect: false,
};
const settings = { filterBy: "all", sortBy: "firstName", sortDir: "asc" };

function init() {
  console.log("init");
  registerBtn();
  loadJSON();
}
function registerBtn() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => button.addEventListener("click", selectFilter));
  document
    .querySelectorAll("[data-action='sort']")
    .forEach((button) => button.addEventListener("click", selectSort));
}
function loadJSON() {
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((jsonData) => {
      prepareObjects(jsonData);
    });
}
//prepare list
function capitalise(StudentStr) {
  return (StudentStr = StudentStr.charAt(0).toUpperCase() + StudentStr.substring(1).toLowerCase());
}
function prepareObjects(jsonData) {
  // console.log(jsonData);
  jsonData.forEach((jsonData) => {
    const student = Object.create(Student);
    // console.log(student);
    const stdntfn = jsonData.fullname.trim(); //stdntfn = studentFullName
    //console.log(`-${stdntfn}-`);

    // first name seperate and using the capitalise function
    student.firstName = capitalise(stdntfn.substring(0, stdntfn.indexOf(" ")));

    //middle name and using the capitalise function
    student.middleName = capitalise(
      stdntfn.substring(stdntfn.indexOf(" ") + 1, stdntfn.lastIndexOf(" ") + 1)
    );
    if (student.middleName.length < 1) {
      student.middleName = "-";
    } else if (student.middleName.includes(`"`)) {
      student.middleName = "-";
    }
    //last name and using the capitalise function
    student.lastName = capitalise(stdntfn.substring(stdntfn.lastIndexOf(" ") + 1));

    const firstName = student.firstName;
    //console.log(firstName);

    const middleName = student.middleName;
    //console.log(middleName);

    const lastName = student.lastName;
    //console.log(lastName);

    //if there is a nickname
    //nickname
    student.nickName = capitalise(
      stdntfn.substring(stdntfn.indexOf(`"`) + 1, stdntfn.lastIndexOf(`"`))
    );

    if (student.nickName === "") {
      student.nickName = "-";
    }
    const nickName = student.nickName;
    //console.log(nickName);

    // if there is only one name
    if (student.firstName === "") {
      student.firstName = student.lastName;
      student.lastName = "-";
    }
    // house
    const houses = jsonData.house.trim();
    student.house = capitalise(houses);
    const house = student.house;

    // console.log(houses);
    return allStudents.push(student);
  });
  buildList(allStudents);
}

// // filtering
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`filter option ${filter}`);
  setFilter(filter);
}
function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}
function filterList(filteredList) {
  if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
    // az összes számú a házból rakd ide  ugy hogy kijelöl elem és = a filteredlist hossza
    document.querySelector(
      ".hufflepuff"
    ).textContent = `In House Hufflepuff there is ${filteredList.length} students`;
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
    document.querySelector(
      ".slytherin"
    ).textContent = `In House Slytherin there is ${filteredList.length} students`;
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
    document.querySelector(
      ".ravenclaw"
    ).textContent = `In House Ravenclaw there is ${filteredList.length} students`;
  } else if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
    document.querySelector(
      ".gryffindor"
    ).textContent = `In House Gryffindor there is ${filteredList.length} students`;
  } else if (settings.filterBy === "*") {
    document.querySelector(
      "#all"
    ).textContent = `In Hogwarts School of Witchcraft and Wizardry there is ${allStudents.length} students`;
  } else if (settings.filterBy === "expelled") {
    filteredList = expelledStudents;
    document.querySelector(
      "#expelled"
    ).textContent = `There is ${filteredList.length} expelled students`;
  }

  return filteredList;
}
function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}
function isSlytherin(student) {
  return student.house === "Slytherin";
}
function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}
function isGryffindor(student) {
  return student.house === "Gryffindor";
}

// sorting
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  //looks at the direction //data-sort-direction="asc"// in html and then sortby that direction
  const sortDir = event.target.dataset.sortDirection;
  console.log(sortDir);
  // to show how it is activaly sorted
  event.target.classList.add("sortBy");
  // find previous sortby element and remove sortby after
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");

  event.target.classList.add("sortby");

  // toggle sorting diection
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`sort option ${sortBy} ${sortDir}`);
  setSort(sortBy, sortDir);
}
function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}
function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  //to make it generic use only generic param
  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}
//view
function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  displayList(sortedList);
}
function displayList(list) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  list.forEach(displayStudent);
}
function displayStudent(student) {
  // create clone
  const clone = document.querySelector("#student").content.cloneNode(true);
  //set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=middleName]").textContent = student.middleName;
  clone.querySelector("[data-field=nickName]").textContent = student.nickName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;
  // clone.querySelector("#student").addEventListener("click", () => openStudentCard(student));

  // expelling students
  if (student.status === true) {
    //document.querySelector(".hidden").classList.remove("hidden");
    clone.querySelector("[data-field=status]").textContent = "✔";
    console.log(`expelled`);
  } else {
    clone.querySelector("[data-field=status]").textContent = "❌";
    console.log(`true`);
  }
  //clone.querySelector("[data-field=status]").addEventListener("click", popUp);

  clone.querySelector("[data-field=status]").addEventListener("click", expellStudent);

  function expellStudent() {
    if (student.studentStatus === true) {
      student.studentStatus = false;
      expelledStudents.push(allStudents.splice(allStudents.indexOf(student), 1)[0]);
      buildList();
      console.log(`expelling`);
    }
    // else {
    //   student.status = true;
    // }
  }
  //prefects
  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  clone.querySelector("[data-field=prefect]").addEventListener("click", choosePrefects);
  function choosePrefects() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      student.prefect = true;
    }
    buildList();
  }
  // add here the popup

  // searching
  //append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
// function openStudentCard(student) {
//   console.log("popup");
//   const modal = document.querySelector("dialog");
//   modal.querySelector(".modal-first-name").textContent = `First Name: ${student.firstName}`;
//   modal.querySelector(".modal-middle-name").textContent = `Middle Name: ${student.middleName}`;
//   modal.querySelector(".modal-nick-name").textContent = `Nickname: ${student.nickName}`;
//   modal.querySelector(".modal-last-name").textContent = `Last Name: ${student.lastName}`;
//   modal.querySelector(".modal-house").textContent = `House: ${student.house}`;
// }
