const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");

const questionTypes = {
  QCM: "qcm",
  Numeric: "numeric",
  Date: "date",
};

function getSurveyDetails() {
  $.ajax({
    url: `./assets/api/${code}.json`,
    type: "GET",
    dataType: "JSON",
    success: function (response) {
      $.each(response, function (index, answer) {
        getCustomerAnswers(answer.id, index);
      });
    },
    statusCode: {
      404: function () {
        $("#questions-container").html(/*html*/ `
            <div class="col-12 text-center fs-1">
                <b class="text-danger">Survey not found</b>
            </div>
        `);
      },
    },
  });
}

function getCustomerAnswers(id, answerNumber) {
  $.ajax({
    url: `./assets/data/${id}.json`,
    type: "GET",
    dataType: "JSON",
    success: function (response) {
      const { questions } = response;

      let HTML = /*html*/ `
        <b class="text-primary fs-4">Answer Number: ${answerNumber + 1}</b>
      `;

      $.each(questions, function (index, question) {
        const { type, label, options, answer } = question;

        switch (type) {
          case questionTypes.QCM: {
            HTML += /*html*/ `
                <div class="col-12 mb-4">
                    <div><small class="text-secondary">Question number: <span class="fw-bold">${
                      index + 1
                    }</span></small></div>
                    <label class="fw-bold mb-2">${label}</label>
            `;

            $.each(options, function (index, option) {
              HTML += drawQCMOptions(option, answer[index]);
            });

            HTML += /*html*/ `
                </div>
            `;
            break;
          }
          case questionTypes.Numeric: {
            HTML += /*html*/ `
                <div class="col-12 mb-4">
                    <div><small class="text-secondary">Question number: <span class="fw-bold">${
                      index + 1
                    }</span></small></div>
                    <label for="question-${answerNumber}-${index}" class="fw-bold mb-2">${label}</label>
                    <input type="number" id="question-${answerNumber}-${index}" class="form-control" value="${answer}" />
                </div>
            `;
            break;
          }
          case questionTypes.Date: {
            HTML += /*html*/ `
                <div class="col-12 mb-4">
                    <div><small class="text-secondary">Question number: <span class="fw-bold">${
                      index + 1
                    }</span></small></div>
                    <label for="question-${answerNumber}-${index}" class="fw-bold mb-2">${label}</label>
                    <input type="date" id="question-${answerNumber}-${index}" class="form-control" value="${answer}" />
                </div>
            `;
            break;
          }
          default: {
            HTML += /*html*/ `
                <div class="col-12 mb-4">
                    <div><small class="text-secondary">Question number: <span class="fw-bold">${
                      index + 1
                    }</span></small></div>
                    <label for="question-${answerNumber}-${index}" class="fw-bold mb-2">${label}</label>
                    <b class="text-danger">Question type is not supported</b>
                </div>
            `;
          }
        }
      });

      HTML += /*html*/ `
        <hr class="border border-primary opacity-75 my-4">
      `;

      $("#questions-container").append(HTML);
    },
  });
}

function drawQCMOptions(option, answer) {
  return /*html*/ `
    <div>
        <input type="checkbox" ${
          answer ? "checked" : ""
        } class="form-check-input" /> ${option}
    </div>
  `;
}

$(document).ready(function () {
  getSurveyDetails();
});
