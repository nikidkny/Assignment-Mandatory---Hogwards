"use strict";

window.addEventListener("DOMContentLoaded", init);
const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const urlBlood = "https://petlatkea.dk/2021/hogwarts/families.json";
/*-------------------arrays-------------------*/
let allStudents = [];
let expelledStudents = [];
let halfBlood = [];
let pureBlood = [];
let isHacking = false;
const Student = {
  firstName: "",
  middleName: "-unknown-",
  nickName: "-unknown-",
  lastName: "",
  imageSrc: "",
  house: "",
  bloodStatus: "muggle",
  prefect: false,
  inquisitorialSquad: false,
  studentStatus: true,
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
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}
async function loadJSON() {
  const response = await fetch(url);
  const jsonData = await response.json();
  const familyData = await loadJSONFamily(); //this line make the the call back for prepareObjects wait until familiesData is upload
  prepareObjects(jsonData, familyData);
}
async function loadJSONFamily() {
  //loading blood type json
  const response = await fetch(urlBlood);
  const familyData = await response.json();
  return familyData;
}
// function loadJSON() {
//   fetch(url)
//     .then((response) => {
//       return response.json();
//     })
//     .then((jsonData) => {
//       prepareObjects(jsonData);
//     });
// }
//prepare list
function capitalise(StudentStr) {
  return (StudentStr = StudentStr.charAt(0).toUpperCase() + StudentStr.substring(1).toLowerCase());
}
function prepareObjects(jsonData, familyData) {
  // console.log(jsonData);
  //---- BLOOD data push
  familyData.half.forEach((lastName) => {
    halfBlood.push(lastName);
  });
  familyData.pure.forEach((lastName) => {
    pureBlood.push(lastName);
  });
  jsonData.forEach((jsonData) => {
    const student = Object.create(Student);
    // console.log(student);
    const stdntfn = jsonData.fullname.trim(); //stdntfn = studentFullName
    //console.log(`-${stdntfn}-`);

    // first name seperate and using the capitalise function
    student.firstName = capitalise(stdntfn.substring(0, stdntfn.indexOf(" ")));

    //middle name and using the capitalise function
    student.middleName = capitalise(stdntfn.substring(stdntfn.indexOf(" ") + 1, stdntfn.lastIndexOf(" ") + 1));
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
    student.nickName = capitalise(stdntfn.substring(stdntfn.indexOf(`"`) + 1, stdntfn.lastIndexOf(`"`)));

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

    // blood status

    if (halfBlood.includes(student.lastName)) {
      student.bloodStatus = "half-blood";
    } else if (pureBlood.includes(student.lastName)) {
      student.bloodStatus = "pure-blood";
    } else if (!halfBlood.includes(student.lastName) && !pureBlood.includes(student.lastName)) {
      student.bloodStatus = "muggle-born";
    }

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
    document.querySelector(".hufflepuff").textContent = `In House Hufflepuff there is ${filteredList.length} students`;
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
    document.querySelector(".slytherin").textContent = `In House Slytherin there is ${filteredList.length} students`;
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
    document.querySelector(".ravenclaw").textContent = `In House Ravenclaw there is ${filteredList.length} students`;
  } else if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
    document.querySelector(".gryffindor").textContent = `In House Gryffindor there is ${filteredList.length} students`;
  } else if (settings.filterBy === "*") {
    document.querySelector(
      "#all"
    ).textContent = `In Hogwarts School of Witchcraft and Wizardry there is ${allStudents.length} students`;
  } else if (settings.filterBy === "expelled") {
    filteredList = expelledStudents;
    document.querySelector("#expelled").textContent = `There is ${filteredList.length} expelled students`;
  } else if (settings.filterBy === "inquisitorialquad") {
    filteredList = allStudents.filter(isSquad);
    document.querySelector("#squad").textContent = `There is ${filteredList.length} Inquisitorial Squad members`;
  } else if (settings.filterBy === "prefect") {
    filteredList = allStudents.filter(isPrefect);
    document.querySelector("#prefect").textContent = `There is ${filteredList.length} prefect students`;
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
function isSquad(student) {
  return student.inquisitorialSquad === true;
}
function isPrefect(student) {
  return student.prefect === true;
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
  hackTheSystem();
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
  clone.querySelector("[data-field=bloodStatus]").textContent = student.bloodStatus;
  // clone.querySelector("[data-field=inquisitorialSquad]").textContent = student.inquisitorialSquad;
  // clone.querySelector("#student").addEventListener("click", () => openStudentCard(student));

  //-------EXPELLING STUDENTS
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

  //-------PREFECTS
  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  clone.querySelector("[data-field=prefect]").addEventListener("click", choosePrefects);
  function choosePrefects() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      findPrefects(student);
    }
    buildList();
  }
  //-------INQUISITORIAL SQUAD
  clone.querySelector("[data-field=inquisitorialSquad]").dataset.inquisitorialSquad = student.inquisitorialSquad;
  clone.querySelector("[data-field=inquisitorialSquad]").addEventListener("click", chooseSquad);
  function chooseSquad() {
    if (student.house === "Slytherin" || student.bloodStatus === "pure-blood") {
      student.inquisitorialSquad = true;
    }

    // else {
    //   console.log(false);
    //   clone.querySelector("[data-field=inquisitorialSquad]").textContent = ``;
    // }
    buildList();
  }
  //-------add here the popup
  clone.querySelector("[data-field=firstName]").addEventListener("click", popupStudent);
  function popupStudent() {
    console.log(`popup`);
    // open popup
    document.querySelector("#pop_up").classList.remove("hidden");
    // close popup
    // document.querySelector("#pop_up").removeEventListener("");
    //populate data on document
    document.querySelector(".modal-student-img").src = `./media/${student.lastName.toLowerCase()}_${student.firstName
      .charAt(0)
      .toLowerCase()}.png`;
    document.querySelector(".modal-student-img").alt = `${student.lastName.toLowerCase()}_${student.firstName
      .charAt(0)
      .toLowerCase()}`;

    document.querySelector(".modal-first-name").textContent = `${student.firstName}`;
    document.querySelector(".modal-middle-name").textContent = `${student.middleName}`;
    document.querySelector(".modal-nick-name").textContent = `${student.nickName}`;
    document.querySelector(".modal-last-name").textContent = `${student.lastName}`;
    document.querySelector(".modal-house").textContent = `${student.house}`;
    //media\ravenclaw.svg
    document.querySelector(".modal-house-img").src = `./media/${student.house.toLowerCase()}.svg`;
    document.querySelector(".modal-house-img").alt = `${student.house.toLowerCase()}`;
    document.querySelector(".modal-blood-status").textContent = `${student.bloodStatus}`;
    document.querySelector(".modal-prefect").src = `${student.prefect}`;
    document.querySelector(".modal-inquisitorial-squad").textContent = `${student.inquisitorialSquad}`;
  }
  //-------searching
  //append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
// function openStudentCard(student) {
//   console.log("popup");
//   const modal = document.querySelector("dialog");
//   modal.querySelector(".modal-first-name").textContent = `First Name: ${student.firstName}`;
// }
function findPrefects(selectedStudents) {
  const prefects = allStudents.filter((student) => student.prefect);
  const allPerfectsPerHouse = prefects.filter((student) => student.house === selectedStudents.house);

  const numberOfPrefects = allPerfectsPerHouse.length;

  if (numberOfPrefects === 2) {
    removeAorB(allPerfectsPerHouse[0], allPerfectsPerHouse[1]);
  } else {
    appointPrefect(selectedStudents);
  }
  //if ( length of the perfects per house  === 2 ){
  //removeAorB( array of perfects per house [0] object, array of perfects per house [1] object )
  // else{
  //  appointPrefect()
  //}
  function removeAorB(prefectA, prefectB) {
    // ignore or remove A or B
    // if ignore nothing
    //if removeA
    removePrefect(prefectA);
    appointPrefect(selectedStudents);
    // ele if removeB
    removePrefect(prefectB);
    appointPrefect(selectedStudents);
  }
  function removePrefect(prefectStudents) {
    prefectStudents.prefect = false;
  }
  function appointPrefect(student) {
    student.prefect = true;
  }
}
document.addEventListener("keydown", (event) => {
  if (event.key === "1") {
    hackTheSystem();
    console.log(`work pls`);
  }
});
function hackTheSystem(student) {
  let isHacking = true;

  // adding my name to array
  const myName = { firstName: `Nikolett`, nickName: `Niki`, lastName: ` Dékány`, house: `` };
  return allStudents.unshift(myName);
  // console.log(allStudents);
  // randomise pure-bloods
  //muggle and half-blood become pure-blood
  // function randomBlood() {
  //   return Math.floor(Math.random() * 3);
  // }
  // console.log(randomBlood(allStudents.bloodStatus));
  // if (student.bloodStatus === "pure-blood") {
  //   // randomBlood();
  //   console.log(allStudents);
  // }
}
