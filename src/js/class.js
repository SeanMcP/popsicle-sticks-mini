const classId = getId();
var heading = document.querySelector("header > h1");
var studentCount = document.getElementById("student-count");
var studentNameInput = document.getElementById("name-input");
var deleteClassButton = document.getElementById("delete-button");
var studentList = document.getElementById("student-list");
var randomLink = document.getElementById("random-link");

const bulkLink = document.getElementById("bulk-link");
bulkLink.href = bulkLink.href + "?id=" + classId;

chrome.storage.sync.get("classes", function (result) {
  heading.textContent = result.classes[classId];
});

function addStudent(event) {
  event.preventDefault();
  if (studentNameInput.value) {
    chrome.storage.sync.get("studentsByClassId", function (result) {
      var studentsByClassId = cloneObj(result.studentsByClassId);

      var studentId = new Date().getTime();
      if (!studentsByClassId[classId]) {
        studentsByClassId[classId] = {};
      }
      studentsByClassId[classId][studentId] = studentNameInput.value;

      chrome.storage.sync.set(
        {
          studentsByClassId: studentsByClassId,
        },
        function () {
          studentNameInput.value = "";
          renderStudents();
        }
      );
    });
  }
}

function deleteStudent(id) {
  chrome.storage.sync.get(["studentsByClassId"], function (result) {
    var studentsByClassId = cloneObj(result.studentsByClassId);
    delete studentsByClassId[classId][id];

    chrome.storage.sync.set(
      {
        studentsByClassId: studentsByClassId,
      },
      function () {
        renderStudents();
      }
    );
  });
}

function deleteClass() {
  chrome.storage.sync.get(["classes", "studentsByClassId"], function (result) {
    var classes = cloneObj(result.classes);
    delete classes[classId];

    var studentsByClassId = cloneObj(result.studentsByClassId);
    delete studentsByClassId[classId];

    chrome.storage.sync.set(
      {
        classes: classes,
        studentsByClassId: studentsByClassId,
      },
      function () {
        document.location = "home.html";
      }
    );
  });
}

function renderStudents() {
  while (studentList.firstChild) {
    studentList.removeChild(studentList.firstChild);
  }
  chrome.storage.sync.get(["classes", "studentsByClassId"], function (result) {
    var students = result.studentsByClassId[classId];
    var count = 0;
    if (students && Object.keys(students).length) {
      Object.keys(students).forEach(function (id) {
        var li = document.createElement("li");
        var span = document.createElement("span");
        span.textContent = students[id];
        li.appendChild(span);

        var button = document.createElement("button");
        button.type = "button";
        button.classList.add("delete");
        button.textContent = "Remove";
        button.addEventListener("click", function () {
          deleteStudent(id);
        });
        li.appendChild(button);

        studentList.appendChild(li);
      });
      count = Object.keys(students).length;
      randomLink.disabled = false;
    } else {
      if (Object.keys(result.classes).length > 1) {
        var a = document.createElement("a");
        a.href = `copy.html?id=${classId}`;
        a.textContent = "Copy another class?";
        studentList.appendChild(a);
      } else {
        var p = document.createElement("p");
        p.textContent = "No students yet!";
        studentList.appendChild(p);
      }
      randomLink.disabled = true;
    }
    studentCount.textContent = `Students (${count})`;
  });
}

document.forms["add-student"].onsubmit = addStudent;
deleteClassButton.addEventListener("click", deleteClass);
randomLink.addEventListener("click", function () {
  document.location = `random.html?id=${classId}`;
});

renderStudents();
