var classId = location.hash.slice(1);
var heading = document.querySelector("header > h1");
var studentCount = document.getElementById("student-count");
var studentNameInput = document.getElementById("name-input");
var addStudentButton = document.getElementById("add-button");
var deleteClassButton = document.getElementById("delete-button");
var studentList = document.getElementById("student-list");

chrome.storage.sync.get("classes", function(result) {
    heading.textContent = result.classes[classId];
});

function addStudent() {
    while (studentList.firstChild) {
        studentList.removeChild(studentList.firstChild);
    }
    chrome.storage.sync.get("studentsByClassId", function(result) {
        var studentsByClassId = cloneObj(result.studentsByClassId);

        var studentId = new Date().getTime();
        if (!studentsByClassId[classId]) {
            studentsByClassId[classId] = {};
        }
        studentsByClassId[classId][studentId] = studentNameInput.value;

        chrome.storage.sync.set(
            {
                studentsByClassId: studentsByClassId
            },
            function() {
                studentNameInput.value = "";
                renderStudents();
            }
        );
    });
}

function deleteStudent(id) {
    chrome.storage.sync.get(["studentsByClassId"], function(result) {
        var studentsByClassId = cloneObj(result.studentsByClassId);
        delete studentsByClassId[classId][id];

        chrome.storage.sync.set(
            {
                studentsByClassId: studentsByClassId
            },
            function() {
                renderStudents();
            }
        );
    });
}

function deleteClass() {
    chrome.storage.sync.get(["classes", "studentsByClassId"], function(result) {
        var classes = cloneObj(result.classes);
        delete classes[classId];

        var studentsByClassId = cloneObj(result.studentsByClassId);
        delete studentsByClassId[classId];

        chrome.storage.sync.set(
            {
                classes: classes,
                studentsByClassId: studentsByClassId
            },
            function() {
                document.location = "home.html";
            }
        );
    });
}

function renderStudents() {
    while (studentList.firstChild) {
        studentList.removeChild(studentList.firstChild);
    }
    chrome.storage.sync.get("studentsByClassId", function(result) {
        var students = result.studentsByClassId[classId];
        var count = 0;
        if (students) {
            Object.keys(students).forEach(function(id) {
                var li = document.createElement("li");
                var span = document.createElement("span");
                span.textContent = students[id];
                li.appendChild(span);

                var button = document.createElement("button");
                button.type = "button";
                button.textContent = "Delete - " + id.slice(-3);
                button.addEventListener("click", function() {
                    deleteStudent(id);
                });
                li.appendChild(button);

                studentList.appendChild(li);
            });
            count = Object.keys(students).length;
        } else {
            studentList.appendChild(buildNoneFoundElement("li"));
        }
        studentCount.textContent = `Students (${count})`;
    });
}

addStudentButton.addEventListener("click", addStudent);
deleteClassButton.addEventListener("click", deleteClass);

renderStudents();
