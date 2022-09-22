"use strict";

document.addEventListener("DOMContentLoaded", start);
const url = "https://petlatkea.dk/2021/hogwarts/students.json";
let allStudents = [];

const Student = {
  firstName: "",
  middleName: "-unknown-",
  nickNames: "-unknown-",
  lastName: "",
  imageSrc: "",
  house: "",
};

function start() {
  console.log("start");
  loadJSON();
}
function loadJSON() {
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((jsonData) => {
      prepareObjects(jsonData);
    });
  console.log(url);
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  console.log(`prepareObjects`, prepareObjects);
  // jsonData.forEach((stud) => {
  //   const student = Object.create(Student);
  //   let studentFullName = student.fullname.trim();
  //   console.log(studentFullName);
  // });
  displayList(jsonData);
}
function displayList(student) {
  // clear the list
  //document.querySelector("#list tbody").innerHTML = "";

  // build a new one
  student.forEach(displayStudent);
}
function displayStudent(student) {
  const template = document.querySelector("#template").content;
  // create clone
  const clone = document.querySelector("#student").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=middleName]").textContent = student.middleName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;
  //append to list
  document.querySelector("#list tbody").appendChild(clone);
}
